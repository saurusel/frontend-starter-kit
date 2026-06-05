# Mock API и подключение к бэкенду

## Концепция

Все данные в mock-режиме хранятся прямо в памяти JavaScript — в массивах внутри модулей `mock-data.ts`. Никаких баз данных, никаких сетевых запросов.

`mockRequest()` симулирует задержку (~300–600 мс) и возвращает данные как если бы они пришли от сервера. Это позволяет строить UI и логику запросов точно так же, как при работе с реальным API — просто заменив одну строчку в `api.ts`.

---

## Функции mockRequest

Файл: `src/shared/api/mock-request.ts`

```ts
// Вернуть массив данных
await mockList<User[]>(MOCK_USERS)
// → { data: User[], meta: { total: 50 } }

// Вернуть один объект
await mockItem<User>(MOCK_USERS[0])
// → User | null

// Расширенное управление
await mockRequest<User[]>(MOCK_USERS, {
  mode: 'success',  // 'success' | 'error' | 'empty' | 'slow'
  delay: 800,       // задержка в мс
})
```

### Режимы симуляции

| Mode | Что происходит | Когда использовать |
|------|---------------|-------------------|
| `success` | Возвращает данные с задержкой | Обычная разработка |
| `error` | Выбрасывает ошибку | Тестировать состояние ошибки |
| `empty` | Возвращает пустой массив | Тестировать EmptyState |
| `slow` | Задержка 2–4 секунды | Тестировать LoadingState |

```ts
// Проверить как выглядит ошибка
export const requestApi = {
  getAll: () => mockRequest(MOCK_REQUESTS, { mode: 'error' }),
}

// Проверить пустой список
export const requestApi = {
  getAll: () => mockRequest([], { mode: 'empty' }),
}
```

---

## Структура API-файла

Пример `src/entities/user/api/user.api.ts`:

```ts
import { mockList, mockItem } from '@/shared/api/mock-request'
import { MOCK_USERS } from '../model/mock-data'
import type { User, CreateUserPayload } from '../model/types'

// Локальная копия — мутируется при create/update/delete
const users = [...MOCK_USERS]

export const userApi = {
  getAll: () => mockList(users),

  getById: (id: string) =>
    mockItem(users.find(u => u.id === id) ?? null),

  create: async (payload: CreateUserPayload) => {
    const user: User = {
      ...payload,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    return mockItem(user)
  },

  update: async (id: string, patch: Partial<User>) => {
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) throw new Error('Not found')
    users[idx] = { ...users[idx], ...patch }
    return mockItem(users[idx])
  },

  delete: async (id: string) => {
    const idx = users.findIndex(u => u.id === id)
    if (idx !== -1) users.splice(idx, 1)
    return id
  },
}
```

---

## TanStack Query хуки

Хуки оборачивают API-вызовы и дают компонентам удобный интерфейс с кешированием.

### useQuery — получение данных

```ts
// Список
const { data = [], isLoading, isError, refetch } = useUsers()

// Один элемент
const { data: user, isLoading } = useUser(userId)
```

### useMutation — изменение данных

```ts
const createUser = useCreateUser()

// Вызов:
await createUser.mutateAsync({ name: 'Иван', email: 'ivan@example.com', role: 'user', team: 'Frontend', status: 'active' })

// Состояния:
createUser.isPending    // true пока запрос выполняется
createUser.isError      // true если ошибка
createUser.isSuccess    // true после успеха
```

### Оптимистичное удаление

Строка удаляется из таблицы **мгновенно**, без ожидания ответа сервера. Если сервер вернул ошибку — строка возвращается обратно.

```ts
export function useDeleteUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: userApi.delete,

    // 1. ДО запроса: убрать из кеша
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: userKeys.all })
      const prev = qc.getQueryData(userKeys.lists())
      qc.setQueryData(userKeys.lists(), (old: User[]) =>
        old.filter(u => u.id !== id)
      )
      return { prev }  // сохраняем для отката
    },

    // 2. Ошибка: восстановить старые данные
    onError: (_err, _id, ctx) => {
      qc.setQueryData(userKeys.lists(), ctx?.prev)
    },

    // 3. В любом случае: обновить кеш с сервера
    onSettled: () => {
      qc.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
```

---

## Axios Instance

Файл: `src/shared/api/axios-instance.ts`

Настроен один раз, используется везде при подключении к реальному API.

```ts
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})
```

### Request interceptor (Bearer token)

```ts
axiosInstance.interceptors.request.use((config) => {
  const token = useSessionStore.getState().session?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### Response interceptor (русские ошибки)

```ts
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const messages: Record<number, string> = {
      400: 'Неверный запрос',
      401: 'Необходима авторизация',
      403: 'Доступ запрещён',
      404: 'Запись не найдена',
      409: 'Конфликт данных',
      422: 'Ошибка валидации',
      500: 'Ошибка сервера',
    }
    error.message = messages[status] ?? `Ошибка ${status ?? 'сети'}`
    if (status === 401) {
      useSessionStore.getState().clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## Переключение с mock на реальный API

### Метод 1: Заменить функции напрямую (быстро для хакатона)

Открой `src/entities/user/api/user.api.ts` и замени каждую функцию:

```ts
// БЫЛО:
import { mockList } from '@/shared/api/mock-request'
export const userApi = {
  getAll: () => mockList(MOCK_USERS),
  ...
}

// СТАЛО:
import { axiosInstance } from '@/shared/api/axios-instance'
export const userApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<User[]>('/users')
    return data
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<User>(`/users/${id}`)
    return data
  },
  create: async (payload: CreateUserPayload) => {
    const { data } = await axiosInstance.post<User>('/users', payload)
    return data
  },
  update: async (id: string, patch: Partial<User>) => {
    const { data } = await axiosInstance.patch<User>(`/users/${id}`, patch)
    return data
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/users/${id}`)
    return id
  },
}
```

Всё остальное (хуки, компоненты, таблицы) работает **без изменений**.

### Метод 2: Через env-переменную (для переключения)

```ts
// src/entities/user/api/user.api.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const userApi = {
  getAll: USE_MOCK
    ? () => mockList(MOCK_USERS)
    : async () => { const { data } = await axiosInstance.get<User[]>('/users'); return data },
}
```

В `.env.local`:
```
VITE_USE_MOCK=false
```

---

## Настройка baseURL и CORS

### Вариант 1: Прямой URL (бэкенд доступен с фронта)

```ts
// src/shared/api/axios-instance.ts
baseURL: 'http://192.168.1.50:8080/api'
```

Или через `.env.local`:
```
VITE_API_URL=http://192.168.1.50:8080/api
```

### Вариант 2: Прокси через Vite (решает CORS при разработке)

В `vite.config.ts`:
```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.50:8080',
        changeOrigin: true,
        // Если бэкенд ожидает /users, а не /api/users:
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

Тогда `axiosInstance` с `baseURL: '/api'` будет работать без изменений — Vite проксирует все `/api/*` запросы на бэкенд.

---

## Если бэкенд возвращает другую структуру

### Обёртка в формате `{ data: [...], total: 100 }`

```ts
// В хуке useUsers:
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const result = await userApi.getAll()
      // Если result = { data: User[], total: number }
      return result.data  // берём только массив
    },
  })
}
```

### snake_case от бэкенда

```ts
// Добавить в axios-instance.ts response interceptor:
response.data = snakeToCamel(response.data)
```

Или просто поменять интерфейс типов:
```ts
export interface User {
  id: string
  name: string
  created_at: string  // было createdAt
}
```
