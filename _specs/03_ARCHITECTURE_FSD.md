# Architecture — Feature-Sliced Design

## 1. Общий принцип

Проект строится на Feature-Sliced Design.

Слои:

- `app` — инициализация приложения;
- `pages` — страницы;
- `widgets` — крупные блоки интерфейса;
- `features` — пользовательские действия;
- `entities` — бизнес-сущности;
- `shared` — переиспользуемая инфраструктура и UI.

## 2. Итоговая структура

```txt
src/
  app/
    main.tsx
    providers/
    routes/
    styles/
    config/

  pages/
    auth/login/
    dashboard/
    tables/
    charts/
    forms/
    panels/
    ui-kit/
    settings/
    access-denied/
    not-found/

  widgets/
    app-shell/
    page-layout/
    page-header/
    details-panel/
    dashboard-grid/

  features/
    auth/
    theme/
    table/
    panel/
    user/
    project/

  entities/
    session/
    user/
    project/
    request/
    task/
    team/
    analytics/
    notification/

  shared/
    api/
    config/
    lib/
    model/
    ui/
    hooks/
```

## 3. Правила зависимостей

Разрешённое направление импортов:

```txt
app      → pages, widgets, features, entities, shared
pages    → widgets, features, entities, shared
widgets  → features, entities, shared
features → entities, shared
entities → shared
shared   → ничего выше себя
```

Запрещено:

```txt
shared → entities
shared → features
shared → widgets
shared → pages

entities → features
features → widgets
widgets → pages
```

## 4. Правило размещения

Если есть сомнение, куда положить код:

1. Это инициализация приложения? → `app`
2. Это страница? → `pages`
3. Это крупный блок страницы? → `widgets`
4. Это действие пользователя? → `features`
5. Это предметная сущность? → `entities`
6. Это универсальная утилита или UI? → `shared`

## 5. Примеры

```txt
Button → shared/ui
UserStatusBadge → entities/user/ui
CreateUserForm → features/user/create-user
UsersTable → widgets/users-table
UsersPage → pages/users
axiosInstance → shared/api
sessionStore → entities/session/model
```

## 6. Именование

Файлы:

```txt
kebab-case.tsx
kebab-case.ts
```

Компоненты:

```txt
PascalCase
```

Хуки:

```txt
useSomething
```
