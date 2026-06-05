# Mock API

## Концепция

Реальный backend не используется. Все данные хранятся in-memory в массивах модулей `mock-data.ts`. Запросы симулируются через `mockRequest<T>()`.

## mockRequest

```ts
// src/shared/api/mock-request.ts
await mockRequest(data, { mode: 'success', delay: 400 })
// mode: 'success' | 'empty' | 'error' | 'slow'
// delay: задержка в мс (по умолчанию 300–600)
```

Вспомогательные функции:
- `mockList<T>(data, options)` — возвращает массив
- `mockItem<T>(data, options)` — возвращает один элемент

## Сущности

| Сущность | Файл mock-data | API |
|----------|---------------|-----|
| User | `entities/user/model/mock-data.ts` | `entities/user/api/user.api.ts` |
| Analytics | `entities/analytics/model/mock-data.ts` | `entities/analytics/api/analytics.api.ts` |
| Project | `entities/project/model/mock-data.ts` | `entities/project/api/project.api.ts` |

## TanStack Query hooks

Каждая сущность имеет query-файл:

```ts
// Список
const { data, isLoading, isError } = useUsers()

// Один элемент
const { data } = useUser(id)

// Мутации
const createUser = useCreateUser()
await createUser.mutateAsync({ name, email, role, team, status })

const deleteUser = useDeleteUser()
await deleteUser.mutateAsync(userId) // optimistic update
```

## Axios instance

`src/shared/api/axios-instance.ts` — настроен с:
- `baseURL: '/api'` для будущей замены на реальный backend
- Request interceptor: автоматически добавляет `Authorization: Bearer <token>` из сессии
- Response interceptor: маппит HTTP-коды на русские сообщения об ошибках

## Замена на реальный API

Для перехода на реальный backend достаточно:
1. Заменить реализации в `*/api/*.api.ts` (убрать `mockRequest`, использовать `axiosInstance`)
2. Удалить `*/model/mock-data.ts`
3. При необходимости — добавить env переменные `VITE_API_URL`
