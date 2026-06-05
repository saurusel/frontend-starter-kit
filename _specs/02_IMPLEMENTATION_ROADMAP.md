# Implementation Roadmap

## Общий принцип

Проект реализуется поэтапно. Каждый этап должен давать рабочий инкремент.

## Этап 1. Инициализация проекта

### Цель

Создать чистый Vite + React + TypeScript проект.

### Действия

1. Создать Vite React TypeScript проект.
2. Очистить стартовые файлы.
3. Настроить TypeScript strict.
4. Настроить alias `@/*`.
5. Настроить ESLint.
6. Настроить Prettier.
7. Создать базовую FSD-структуру.
8. Добавить базовый `README.md`.

### Критерии готовности

- проект запускается;
- сборка проходит;
- alias работает;
- структура создана.

---

## Этап 2. Tailwind + shadcn/ui + базовая тема

### Действия

1. Установить Tailwind.
2. Настроить Tailwind для Vite.
3. Установить shadcn/ui.
4. Настроить `components.json`.
5. Создать `cn` utility.
6. Добавить CSS variables.
7. Добавить light/dark theme tokens.
8. Добавить Button, Input, Card, Dialog, Badge, Skeleton.

### Критерии готовности

- shadcn-компоненты добавляются;
- стили применяются;
- light/dark классы работают.

---

## Этап 3. App Providers

### Действия

1. Создать `AppProvider`.
2. Создать `RouterProvider`.
3. Создать `QueryProvider`.
4. Создать `ThemeProvider`.
5. Создать session init.
6. Подключить toaster/sonner.
7. Убрать лишнюю логику из `main.tsx`.

### Критерии готовности

- `main.tsx` простой;
- все провайдеры подключены;
- нет дублирования глобальной инициализации.

---

## Этап 4. Роутинг

### Действия

1. Подключить React Router DOM.
2. Создать `route-paths.ts`.
3. Создать router config.
4. Создать public routes.
5. Создать protected routes.
6. Создать access denied route.
7. Создать not found route.

### Маршруты

```txt
/login
/dashboard
/tables
/charts
/forms
/panels
/ui-kit
/settings
/access-denied
/*
```

---

## Этап 5. Mock Auth + Session

### Действия

1. Создать entity `session`.
2. Создать типы ролей.
3. Создать permissions.
4. Создать mock users.
5. Создать session store на Zustand.
6. Создать login form.
7. Создать logout.
8. Реализовать сохранение session.
9. Реализовать восстановление session.
10. Реализовать redirect после login/logout.

### Роли

```txt
Admin
Manager
User
Guest
```

---

## Этап 6. AppShell

### Действия

1. Создать `AppShell`.
2. Создать `AppSidebar`.
3. Создать `AppHeader`.
4. Создать user menu.
5. Создать theme toggle.
6. Создать mobile sidebar.
7. Добавить active route.
8. Скрывать пункты меню по правам.

---

## Этап 7. UI-kit Page

### Действия

1. Создать разделы UI-kit.
2. Вывести базовые компоненты.
3. Вывести составные компоненты.
4. Вывести состояния.
5. Добавить краткие описания.
6. Добавить примеры использования.

### Разделы

```txt
Buttons
Inputs
Forms
Cards
Tables
Feedback
Overlays
Navigation
Data Display
Layout
```

---

## Этап 8. Storybook

### Действия

1. Установить Storybook для React + Vite.
2. Настроить Tailwind в Storybook.
3. Настроить aliases.
4. Подключить decorators.
5. Добавить stories для shared/ui.
6. Добавить stories для составных компонентов.
7. Добавить stories для состояний.

---

## Этап 9. API Layer + Mock API

### Действия

1. Создать Axios instance.
2. Создать QueryClient.
3. Создать API error model.
4. Создать mock request helper.
5. Создать mock delay.
6. Создать mock modes: success, empty, error, slow.
7. Создать API для users, projects, requests, tasks, teams, analytics, notifications.

---

## Этап 10. TanStack Query examples

### Действия

1. Создать query keys.
2. Создать query hooks.
3. Создать mutation examples.
4. Добавить invalidation.
5. Добавить optimistic update на одном примере.

---

## Этап 11. Таблицы

### Действия

1. Создать `DataTable`.
2. Добавить columns.
3. Добавить search.
4. Добавить filters.
5. Добавить sorting.
6. Добавить pagination.
7. Добавить row actions.
8. Добавить bulk actions.
9. Добавить column visibility.
10. Добавить selection.
11. Добавить opening details panel on row click.
12. Добавить role-based actions.

---

## Этап 12. Right Details Panel

### Действия

1. Создать `DetailsPanel`.
2. Добавить open/close.
3. Добавить pin/unpin.
4. Добавить view mode.
5. Добавить edit mode.
6. Добавить loading/error/empty.
7. Добавить unsaved changes guard.
8. Добавить переключение выбранного элемента.
9. Добавить панель со step flow.

---

## Этап 13. Формы

### Действия

1. Создать form wrappers.
2. Создать login form.
3. Создать create/edit user forms.
4. Создать settings form.
5. Создать form in dialog.
6. Создать form in side panel.
7. Добавить validation.
8. Добавить server error.
9. Добавить dirty state.
10. Добавить reset.

---

## Этап 14. Графики

### Действия

1. Установить Recharts.
2. Создать `ChartCard`.
3. Создать line chart.
4. Создать bar chart.
5. Создать area chart.
6. Создать pie/donut chart.
7. Добавить period switcher.
8. Проверить dark mode.

---

## Этап 15. PWA

### Действия

1. Установить `vite-plugin-pwa`.
2. Настроить manifest.
3. Добавить app icons.
4. Настроить service worker.
5. Добавить offline screen.
6. Добавить update prompt.
7. Проверить production build.

---

## Этап 16. Документация

### Действия

1. Обновить README.
2. Написать docs по архитектуре, FSD, UI-kit, forms, API, auth/roles, PWA, Storybook и development guide.

---

## Этап 17. Финальная проверка

Проверить:

```bash
npm run dev
npm run build
npm run preview
npm run storybook
npm run build-storybook
```
