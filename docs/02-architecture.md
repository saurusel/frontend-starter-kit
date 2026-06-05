# Архитектура

## Feature-Sliced Design (FSD)

Проект использует методологию [FSD](https://feature-sliced.design/).

```
src/
├── app/            # Инициализация: провайдеры, роутер, глобальные стили
│   ├── providers/
│   ├── routes/
│   └── styles/
├── pages/          # Страницы приложения (route-level components)
│   ├── dashboard/
│   ├── tables/
│   ├── charts/
│   └── ...
├── widgets/        # Составные блоки интерфейса
│   ├── app-shell/  # Layout: sidebar + header + outlet
│   └── details-panel/
├── features/       # Действия пользователя (auth, theme, CRUD-формы)
│   ├── auth/
│   ├── theme/
│   ├── pwa/
│   └── user/
├── entities/       # Бизнес-сущности (данные + api + queries + ui)
│   ├── session/
│   ├── user/
│   ├── analytics/
│   ├── project/
│   └── task/
└── shared/         # Переиспользуемые утилиты и компоненты без бизнес-логики
    ├── api/
    ├── config/
    ├── lib/
    └── ui/
```

## Правило импортов

Слои могут импортировать только из слоёв **ниже** по иерархии:

```
app → pages → widgets → features → entities → shared
```

`shared` не импортирует из других слоёв.

## Стек

| Область | Технология |
|---------|-----------|
| Фреймворк | React 18 + TypeScript (strict) |
| Сборка | Vite 5 |
| Стили | Tailwind CSS v3 + CSS-переменные |
| Компоненты | shadcn/ui (Radix UI primitives) |
| Роутинг | React Router DOM v6 |
| Состояние (клиент) | Zustand 5 (persist) |
| Состояние (сервер) | TanStack Query v5 |
| Формы | React Hook Form + zod |
| Графики | Recharts |
| Уведомления | Sonner |
| PWA | vite-plugin-pwa + workbox |
| Витрина компонентов | Storybook 8 |
