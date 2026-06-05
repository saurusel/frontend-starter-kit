# Auth, Roles and Permissions

## 1. Общий принцип

Авторизация моковая. Реального backend нет.

Нужно имитировать:

- вход;
- выход;
- сохранение сессии;
- восстановление сессии;
- роли;
- permissions;
- protected routes;
- отображение интерфейса в зависимости от прав.

## 2. Роли

```txt
Admin
Manager
User
Guest
```

## 3. Экран логина

На `/login` должно быть:

- поле email;
- поле password;
- выбор роли;
- быстрые кнопки:
  - “Войти как администратор”;
  - “Войти как менеджер”;
  - “Войти как пользователь”;
- validation;
- error state;
- redirect после входа.

Демо-пароль:

```txt
demo
```

## 4. Session object

```ts
type Session = {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  accessToken: string
  permissions: Permission[]
}
```

## 5. Где хранить session

Хранить в Zustand.

Файл:

```txt
entities/session/model/session-store.ts
```

Можно сохранять в `localStorage`.

## 6. Permissions

```txt
dashboard:view

users:view
users:create
users:update
users:delete

projects:view
projects:create
projects:update
projects:delete

requests:view
requests:create
requests:update
requests:delete

analytics:view

settings:view
settings:update

ui-kit:view
```

## 7. Матрица прав

| Действие | Admin | Manager | User | Guest |
|---|---:|---:|---:|---:|
| Dashboard view | да | да | да | нет |
| UI-kit view | да | да | да | да |
| Tables view | да | да | да | нет |
| Charts view | да | да | да | нет |
| Forms view | да | да | да | нет |
| Panels view | да | да | да | нет |
| Users view | да | да | да | нет |
| Users create | да | да | нет | нет |
| Users update | да | да | нет | нет |
| Users delete | да | нет | нет | нет |
| Settings view | да | да | да | нет |
| Settings update | да | да | нет | нет |

## 8. Protected routes

Реализовать:

```txt
RequireAuth
RequirePermission
RequireRole
```

Логика:

```txt
нет session → /login
есть session, но нет permission → /access-denied
есть permission → show page
```

## 9. UI по правам

Примеры:

- кнопка `Создать` видна только при `users:create`;
- кнопка `Редактировать` видна только при `users:update`;
- кнопка `Удалить` видна только при `users:delete`;
- bulk delete доступен только Admin.

## 10. Критерии готовности

- можно войти под разными ролями;
- можно выйти;
- session сохраняется;
- session восстанавливается;
- закрытые страницы защищены;
- кнопки скрываются по правам;
- sidebar зависит от прав;
- `/access-denied` работает.
