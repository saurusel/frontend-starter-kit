# Аутентификация и роли

## Механизм

Аутентификация — mock-only (без реального backend). Состояние сессии хранится в Zustand с `persist` в localStorage.

## Роли и разрешения

| Роль | Описание |
|------|----------|
| `admin` | Полный доступ ко всем разделам и действиям |
| `manager` | Доступ к таблицам, формам, панелям; нет управления системой |
| `user` | Чтение данных, просмотр дашборда и графиков |
| `guest` | Только дашборд и графики, нет редактирования |

### Матрица разрешений — `src/entities/session/model/permissions.ts`

Каждому разрешению соответствует строка вида `resource:action`, например:
- `users:read` — просмотр списка пользователей
- `users:create` — создание пользователя
- `users:update` — редактирование
- `users:delete` — удаление

## Гарды маршрутов

```tsx
// Только авторизованные
<RequireAuth>
  <ProtectedPage />
</RequireAuth>

// Только с конкретным разрешением
<RequirePermission permission="users:create">
  <CreateUserPage />
</RequirePermission>

// Только с конкретной ролью
<RequireRole role={['admin', 'manager']}>
  <AdminPanel />
</RequireRole>
```

Источники: [src/app/routes/guards/](../src/app/routes/guards/)

## Смена роли в рантайме

На странице логина доступны кнопки быстрого входа под каждой ролью. После нажатия сессия обновляется и интерфейс перестраивается мгновенно (пункты меню, кнопки действий).

## useSessionStore

```ts
const { session, isAuthenticated, hasPermission, hasRole } = useSessionStore()
// Проверка разрешения:
if (hasPermission('users:delete')) { ... }
// Проверка роли:
if (hasRole(['admin', 'manager'])) { ... }
```
