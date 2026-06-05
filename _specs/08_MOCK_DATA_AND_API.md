# Mock Data and API Layer

## 1. Цель

Показать правильный подход к API даже без backend.

Слой:

```txt
Axios → API functions → TanStack Query hooks → UI
```

## 2. Axios instance

Файл:

```txt
src/shared/api/axios-instance.ts
```

Содержит:

- baseURL;
- timeout;
- request interceptor;
- response interceptor;
- подстановку mock token;
- обработку ошибок.

## 3. QueryClient

Файл:

```txt
src/shared/api/query-client.ts
```

Настроить:

- retry;
- staleTime;
- refetchOnWindowFocus;
- обработку ошибок по умолчанию.

## 4. Mock request helper

Файл:

```txt
src/shared/api/mock-request.ts
```

Helper:

```ts
mockRequest<T>(data: T, options?: MockRequestOptions): Promise<T>
```

Режимы:

```txt
success
empty
error
slow
```

## 5. Mock entities

Создать данные для:

```txt
users
projects
requests
tasks
teams
analytics
notifications
activity
```

## 6. User

```ts
type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive' | 'invited'
  team: string
  createdAt: string
}
```

## 7. Project

```ts
type Project = {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  ownerId: string
  teamId: string
  progress: number
  createdAt: string
  updatedAt: string
}
```

## 8. Request

```ts
type RequestItem = {
  id: string
  title: string
  description: string
  status: 'new' | 'in_progress' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  authorId: string
  assigneeId?: string
  createdAt: string
}
```

## 9. Task

```ts
type Task = {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assigneeId?: string
  dueDate?: string
}
```

## 10. API files

```txt
entities/user/api/user.api.ts
entities/project/api/project.api.ts
entities/request/api/request.api.ts
entities/task/api/task.api.ts
entities/analytics/api/analytics.api.ts
```

## 11. Query hooks

```txt
entities/user/model/user.queries.ts
entities/project/model/project.queries.ts
entities/request/model/request.queries.ts
entities/task/model/task.queries.ts
entities/analytics/model/analytics.queries.ts
```

## 12. Mutations

Feature-level mutations:

```txt
features/user/create-user/api/create-user.mutation.ts
features/user/edit-user/api/edit-user.mutation.ts
features/user/delete-user/api/delete-user.mutation.ts
```

## 13. Ошибки

Показать:

- 400 validation error;
- 401 unauthorized;
- 403 forbidden;
- 404 not found;
- 500 server error.

## 14. Критерии готовности

- UI не вызывает mock data напрямую;
- UI ходит через query hooks;
- mutations инвалидируют кэш;
- есть loading/error/empty states;
- есть mock error mode;
- можно быстро заменить mock API на real API.
