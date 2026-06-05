# Архитектура проекта

## Feature-Sliced Design (FSD)

Проект следует методологии [Feature-Sliced Design](https://feature-sliced.design/) — способу организовывать код так, чтобы было понятно, где что лежит и что с чем связано.

### Главное правило FSD

Код делится на **слои** (layers). Каждый слой может импортировать только из слоёв ниже себя:

```
app → pages → widgets → features → entities → shared
```

Это значит:
- `shared` не знает ничего о `entities`
- `entities` не знает ничего о `features`
- `pages` может использовать всё, что ниже неё

Если нужно нарушить это правило — значит нужно пересмотреть архитектуру.

---

## Слои и их назначение

### `app/` — инициализация приложения

Здесь только то, что запускается один раз при старте:

```
src/app/
├── providers/           # React Context-провайдеры
│   ├── app-provider.tsx     # Корневой провайдер (объединяет все)
│   ├── query-provider.tsx   # TanStack Query
│   └── theme-provider.tsx   # Тема (light/dark/system)
├── routes/              # Роутинг
│   ├── router.tsx           # createBrowserRouter
│   └── guards/              # Компоненты-защитники маршрутов
│       ├── require-auth.tsx
│       ├── require-permission.tsx
│       └── require-role.tsx
└── styles/
    └── globals.css      # CSS-переменные, Tailwind directives
```

**Не добавляй сюда бизнес-логику** — только инфраструктуру.

---

### `pages/` — страницы-маршруты

Каждая папка = один маршрут URL:

```
src/pages/
├── login/index.tsx       # /login
├── dashboard/index.tsx   # /dashboard
├── tables/index.tsx      # /tables
├── charts/index.tsx      # /charts
├── forms/index.tsx       # /forms
├── panels/index.tsx      # /panels
├── ui-kit/index.tsx      # /ui-kit
└── settings/index.tsx    # /settings
```

Страница — это «режиссёр»: она импортирует виджеты, фичи и сущности, соединяет их вместе. Сама страница не содержит бизнес-логику.

**Пример минимальной страницы:**
```tsx
// src/pages/products/index.tsx
import { PageHeader } from '@/shared/ui/page-header'
import { ProductsTable } from '@/widgets/products-table'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Продукты" />
      <ProductsTable />
    </div>
  )
}
```

---

### `widgets/` — крупные самостоятельные блоки

Переиспользуемые блоки интерфейса, которые содержат несколько компонентов:

```
src/widgets/
├── app-shell/           # Основной layout: sidebar + header + outlet
│   ├── ui/
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   └── config/
│       └── nav-items.ts  # Пункты меню — РЕДАКТИРУЙ ЭТО
└── details-panel/       # Боковая панель с деталями
    ├── ui/details-panel.tsx
    └── model/panel-store.ts
```

---

### `features/` — действия пользователя

Фичи — это то, **что пользователь делает**: авторизоваться, создать запись, переключить тему.

```
src/features/
├── auth/
│   └── login/
│       ├── model/
│       │   └── schema.ts        # Zod схема формы
│       └── ui/
│           └── login-form.tsx   # Форма входа
├── theme/
│   └── ui/theme-toggle.tsx      # Кнопка переключения темы
├── pwa/
│   └── ui/pwa-update-prompt.tsx # Toast обновления PWA
└── user/
    ├── create-user/
    │   └── ui/create-user-form.tsx
    └── delete-user/
        └── ui/delete-user-button.tsx
```

---

### `entities/` — бизнес-сущности

Здесь описываются данные, с которыми работает приложение:

```
src/entities/
├── session/             # Текущая сессия пользователя
│   └── model/
│       ├── session-store.ts     # Zustand store
│       ├── permissions.ts       # ROLE_PERMISSIONS матрица
│       └── types.ts             # UserRole, Permission, Session
├── user/               # Сущность «Пользователь»
│   ├── api/
│   │   └── user.api.ts          # CRUD-запросы
│   ├── model/
│   │   ├── types.ts             # Интерфейс User
│   │   ├── mock-data.ts         # Тестовые данные
│   │   └── user.queries.ts      # TanStack Query хуки
│   └── ui/
│       ├── user-avatar.tsx
│       └── user-status-badge.tsx
├── analytics/          # Аналитика и графики
└── project/            # Проекты (пример дополнительной сущности)
```

---

### `shared/` — общее без бизнес-логики

```
src/shared/
├── api/
│   ├── axios-instance.ts  # Настроенный Axios
│   └── mock-request.ts    # Симулятор запросов
├── config/
│   └── route-paths.ts     # Константы URL-маршрутов
├── lib/
│   └── cn.ts              # Утилита объединения Tailwind-классов
└── ui/                    # Все UI-компоненты
    ├── button.tsx
    ├── data-table/
    ├── charts/
    └── states/
```

---

## Как добавить новую сущность (пошагово)

Пример: добавляем сущность «Заявка» (Request).

### Шаг 1. Тип данных

```ts
// src/entities/request/model/types.ts
export type RequestStatus = 'new' | 'in_progress' | 'done' | 'cancelled'

export interface Request {
  id: string
  title: string
  description: string
  status: RequestStatus
  authorId: string
  createdAt: string
}

export interface CreateRequestPayload {
  title: string
  description: string
}
```

### Шаг 2. Mock-данные

```ts
// src/entities/request/model/mock-data.ts
import type { Request } from './types'

export const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    title: 'Добавить авторизацию через Google',
    description: 'Нужен OAuth2 вход через Google аккаунт',
    status: 'new',
    authorId: 'user-1',
    createdAt: '2025-06-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Исправить ошибку в форме регистрации',
    description: 'При вводе спецсимволов форма не отправляется',
    status: 'in_progress',
    authorId: 'user-2',
    createdAt: '2025-06-02T12:00:00Z',
  },
]
```

### Шаг 3. API-файл

```ts
// src/entities/request/api/request.api.ts
import { mockList, mockItem } from '@/shared/api/mock-request'
import { MOCK_REQUESTS } from '../model/mock-data'
import type { Request, CreateRequestPayload } from '../model/types'

const data = [...MOCK_REQUESTS]

export const requestApi = {
  getAll: () => mockList(data),
  getById: (id: string) => mockItem(data.find(r => r.id === id)),
  create: (payload: CreateRequestPayload) => {
    const item: Request = { ...payload, id: crypto.randomUUID(), status: 'new', authorId: '', createdAt: new Date().toISOString() }
    data.push(item)
    return mockItem(item)
  },
  delete: async (id: string) => {
    const idx = data.findIndex(r => r.id === id)
    if (idx !== -1) data.splice(idx, 1)
    return id
  },
}
```

### Шаг 4. TanStack Query хуки

```ts
// src/entities/request/model/request.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestApi } from '../api/request.api'

const keys = {
  all: ['requests'] as const,
  lists: () => [...keys.all, 'list'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function useRequests() {
  return useQuery({ queryKey: keys.lists(), queryFn: requestApi.getAll })
}

export function useRequest(id: string) {
  return useQuery({ queryKey: keys.detail(id), queryFn: () => requestApi.getById(id) })
}

export function useCreateRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: requestApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDeleteRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: requestApi.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: keys.all })
      const prev = qc.getQueryData(keys.lists())
      qc.setQueryData(keys.lists(), (old: Request[]) => old?.filter(r => r.id !== id))
      return { prev }
    },
    onError: (_err, _id, ctx) => qc.setQueryData(keys.lists(), ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}
```

### Шаг 5. Barrel-export

```ts
// src/entities/request/index.ts
export * from './model/types'
export * from './model/request.queries'
export { requestApi } from './api/request.api'
```

---

## Именование файлов

| Что | Конвенция | Пример |
|-----|-----------|--------|
| Компоненты | kebab-case | `create-user-form.tsx` |
| Хуки | kebab-case | `user.queries.ts` |
| Типы | kebab-case | `types.ts` |
| Константы | kebab-case | `mock-data.ts` |
| CSS | kebab-case | `globals.css` |

---

## Запрещённые импорты

```ts
// ❌ entities не может импортировать из features
// src/entities/user/model/user.queries.ts
import { CreateUserForm } from '@/features/user/create-user/ui/...'  // НЕЛЬЗЯ

// ❌ shared не может импортировать из entities
// src/shared/ui/button.tsx
import { useSessionStore } from '@/entities/session/...'  // НЕЛЬЗЯ

// ✅ pages может импортировать откуда угодно ниже
// src/pages/tables/index.tsx
import { useUsers } from '@/entities/user/model/user.queries'       // ОК
import { useDeleteUser } from '@/entities/user/model/user.queries'  // ОК
import { CreateUserForm } from '@/features/user/create-user/ui/...' // ОК
```
