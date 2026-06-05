# Аутентификация и роли

## Как работает сейчас (mock-режим)

Аутентификация полностью mock — реального сервера нет. При нажатии «Войти»:
1. Пароль сравнивается с `"demo"` в `MOCK_USERS`
2. Найденный пользователь записывается в Zustand-хранилище
3. Токен генерируется как `mock-token-<userId>`
4. Состояние сохраняется в `localStorage` через `persist`
5. Роутер пускает пользователя дальше

Данные сессии живут пока браузер не очищен или пользователь не нажал «Выйти».

---

## Роли и матрица разрешений

### Роли

| Роль | Константа | Кто это |
|------|-----------|---------|
| Администратор | `'admin'` | Полный доступ, управление системой |
| Менеджер | `'manager'` | Работа с данными, нет системных операций |
| Пользователь | `'user'` | Только чтение |
| Гость | `'guest'` | Дашборд и графики |

### Разрешения (полная матрица)

Файл: `src/entities/session/model/permissions.ts`

```ts
type Permission =
  | 'dashboard:read'
  | 'users:read'   | 'users:create'   | 'users:update'   | 'users:delete'
  | 'tables:read'  | 'tables:create'  | 'tables:update'  | 'tables:delete'
  | 'charts:read'
  | 'forms:read'   | 'forms:submit'
  | 'panels:read'  | 'panels:edit'
  | 'settings:read'| 'settings:write'
  | 'reports:read' | 'reports:export'
```

| Разрешение | admin | manager | user | guest |
|-----------|-------|---------|------|-------|
| dashboard:read | ✅ | ✅ | ✅ | ✅ |
| users:read | ✅ | ✅ | ✅ | ❌ |
| users:create | ✅ | ✅ | ❌ | ❌ |
| users:update | ✅ | ✅ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ | ❌ |
| tables:read | ✅ | ✅ | ✅ | ❌ |
| charts:read | ✅ | ✅ | ✅ | ✅ |
| forms:submit | ✅ | ✅ | ❌ | ❌ |
| panels:edit | ✅ | ✅ | ❌ | ❌ |
| settings:write | ✅ | ✅ | ✅ | ✅ |
| reports:export | ✅ | ✅ | ❌ | ❌ |

---

## Гарды маршрутов

Защитные компоненты находятся в `src/app/routes/guards/`.

### RequireAuth — только для авторизованных

```tsx
// Если пользователь не авторизован → редиректит на /login
<RequireAuth>
  <ProtectedPage />
</RequireAuth>
```

В роутере все страницы кроме `/login` уже обёрнуты в `RequireAuth` через layout `AppShell`.

### RequirePermission — по разрешению

```tsx
// Если нет разрешения → рендерит /access-denied
<RequirePermission permission="users:delete">
  <DeleteButton />
</RequirePermission>
```

### RequireRole — по роли

```tsx
// Только для admin и manager
<RequireRole role={['admin', 'manager']}>
  <AdminPanel />
</RequireRole>
```

---

## useSessionStore — хук для доступа к сессии

```ts
import { useSessionStore } from '@/entities/session/model/session-store'

const {
  session,           // { user: User, token: string, permissions: Permission[] } | null
  isAuthenticated,   // boolean
  hasPermission,     // (permission: Permission) => boolean
  hasRole,           // (roles: UserRole | UserRole[]) => boolean
  setSession,        // (session) => void — сохранить сессию (после логина)
  clearSession,      // () => void — очистить (при логауте)
} = useSessionStore()
```

### Примеры использования

```tsx
// Скрыть кнопку удаления если нет прав
const { hasPermission } = useSessionStore()

{hasPermission('users:delete') && (
  <Button variant="destructive" onClick={handleDelete}>
    Удалить
  </Button>
)}
```

```tsx
// Показать имя текущего пользователя
const { session } = useSessionStore()

<span>{session?.user.name ?? 'Гость'}</span>
```

```tsx
// Проверить роль
const { hasRole } = useSessionStore()

{hasRole('admin') && <AdminBadge />}
{hasRole(['admin', 'manager']) && <ManageButton />}
```

---

## Подключение реального бэкенда: авторизация

### Шаг 1. Изменить onSubmit в форме входа

Файл: `src/features/auth/login/ui/login-form.tsx`

Найди функцию `onSubmit` и замени mock-логику:

```tsx
// БЫЛО (mock):
const mockUser = MOCK_USERS.find(u => u.email === data.email && data.password === 'demo')
if (!mockUser) {
  setError('root', { message: 'Неверный email или пароль' })
  return
}
setSession({ user: mockUser, token: `mock-token-${mockUser.id}`, permissions: ROLE_PERMISSIONS[mockUser.role] })
navigate(ROUTES.DASHBOARD)

// СТАЛО (реальный API):
try {
  const response = await axiosInstance.post('/auth/login', {
    email: data.email,
    password: data.password,
  })
  const { user, token } = response.data
  setSession({
    user,
    token,
    permissions: ROLE_PERMISSIONS[user.role as UserRole] ?? [],
  })
  navigate(ROUTES.DASHBOARD)
} catch (err) {
  setError('root', { message: 'Неверный email или пароль' })
}
```

### Шаг 2. Токен автоматически подставляется

В `src/shared/api/axios-instance.ts` уже настроен interceptor:

```ts
axiosInstance.interceptors.request.use((config) => {
  const token = useSessionStore.getState().session?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

Все последующие запросы автоматически будут содержать `Authorization: Bearer <твой-токен>`.

### Шаг 3. Обработка истечения токена (401)

В `axios-instance.ts` в response interceptor уже есть обработка 401:

```ts
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSessionStore.getState().clearSession()
      window.location.href = '/login'
    }
    // ... остальная обработка
    return Promise.reject(error)
  }
)
```

Если токен истёк или невалиден — пользователь автоматически перенаправляется на логин.

---

## Добавить новое разрешение

1. Добавить строку в тип `Permission` в `permissions.ts`
2. Добавить разрешение нужным ролям в `ROLE_PERMISSIONS`
3. Использовать через `hasPermission('new:permission')` или `<RequirePermission permission="new:permission">`

```ts
// src/entities/session/model/permissions.ts

// 1. Добавить тип
type Permission = 
  | ... // существующие
  | 'requests:read'
  | 'requests:create'

// 2. Добавить ролям
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    ...все существующие...
    'requests:read',
    'requests:create',
  ],
  manager: [
    ...
    'requests:read',
    'requests:create',
  ],
  user: [
    ...
    'requests:read',  // только чтение
  ],
  guest: [],
}
```

---

## Логаут

Кнопка «Выйти» находится в выпадающем меню аватара в header. Она вызывает:

```ts
const { clearSession } = useSessionStore()
clearSession()  // очищает localStorage, сессия = null
navigate(ROUTES.LOGIN)
```

После clearSession() все guard-компоненты заметят что `isAuthenticated = false` и перенаправят на логин.

---

## Часто задаваемые вопросы

**Как войти автоматически при разработке, не нажимая кнопку каждый раз?**

Добавить в `src/app/providers/app-provider.tsx`:
```tsx
// Только для dev-режима
if (import.meta.env.DEV && !useSessionStore.getState().isAuthenticated) {
  const adminUser = MOCK_USERS.find(u => u.role === 'admin')!
  useSessionStore.getState().setSession({
    user: adminUser,
    token: 'dev-token',
    permissions: ROLE_PERMISSIONS.admin,
  })
}
```

**Как тестировать разные роли?**

На странице `/login` есть 3 кнопки быстрого входа. Или добавь в header кнопку смены роли через `setSession`.
