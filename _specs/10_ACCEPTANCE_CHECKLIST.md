# Acceptance Checklist

## Общая проверка

- [ ] Проект называется `frontend-starter-kit`.
- [ ] Интерфейс на русском.
- [ ] Стиль нейтральный SaaS.
- [ ] Используется React.
- [ ] Используется TypeScript.
- [ ] Используется Vite.
- [ ] Используется FSD.
- [ ] Используется React Router DOM.
- [ ] Используется Zustand.
- [ ] Используется Axios.
- [ ] Используется TanStack Query.
- [ ] Используется shadcn/ui.
- [ ] Используется Tailwind.
- [ ] Используется Lucide.
- [ ] Используется React Hook Form.
- [ ] Используется zod.
- [ ] Используется PWA.
- [ ] Используется Storybook.
- [ ] Графики сделаны через готовую библиотеку.

## Команды

- [ ] `npm install` проходит.
- [ ] `npm run dev` запускает проект.
- [ ] `npm run build` проходит.
- [ ] `npm run preview` работает.
- [ ] `npm run storybook` работает.
- [ ] `npm run build-storybook` работает.

## Архитектура

- [ ] Есть `app`.
- [ ] Есть `pages`.
- [ ] Есть `widgets`.
- [ ] Есть `features`.
- [ ] Есть `entities`.
- [ ] Есть `shared`.
- [ ] Нет бизнес-логики в `shared`.
- [ ] Нет API-запросов напрямую в страницах.
- [ ] Нет серверного состояния в Zustand.
- [ ] Импорты идут по разрешённым слоям.

## Роутинг

- [ ] `/login` работает.
- [ ] `/dashboard` работает.
- [ ] `/tables` работает.
- [ ] `/charts` работает.
- [ ] `/forms` работает.
- [ ] `/panels` работает.
- [ ] `/ui-kit` работает.
- [ ] `/settings` работает.
- [ ] `/access-denied` работает.
- [ ] неизвестный маршрут ведёт на 404.

## Авторизация

- [ ] Есть mock login.
- [ ] Есть login as Admin.
- [ ] Есть login as Manager.
- [ ] Есть login as User.
- [ ] Есть logout.
- [ ] Session сохраняется.
- [ ] Session восстанавливается.
- [ ] Protected routes работают.
- [ ] Access denied работает.

## Роли и права

- [ ] Admin видит все действия.
- [ ] Manager не видит опасные admin-действия.
- [ ] User видит ограниченный набор действий.
- [ ] Guest не попадает в закрытые разделы.
- [ ] Sidebar зависит от прав.
- [ ] Кнопки зависят от прав.
- [ ] Bulk actions зависят от прав.

## Theme system

- [ ] Есть light theme.
- [ ] Есть dark theme.
- [ ] Есть system theme.
- [ ] Theme toggle работает.
- [ ] Выбранная тема сохраняется.
- [ ] После reload тема восстанавливается.
- [ ] Все основные компоненты выглядят нормально в dark mode.

## UI-kit

- [ ] Есть `/ui-kit`.
- [ ] Есть базовые компоненты.
- [ ] Есть составные компоненты.
- [ ] Есть состояния.
- [ ] Есть таблицы.
- [ ] Есть формы.
- [ ] Есть панели.
- [ ] Есть графики.
- [ ] Есть описания компонентов.
- [ ] Компоненты можно переиспользовать.

## Storybook

- [ ] Storybook запускается.
- [ ] Tailwind работает в Storybook.
- [ ] Alias работает в Storybook.
- [ ] Есть stories для базовых компонентов.
- [ ] Есть stories для составных компонентов.
- [ ] Есть stories для состояний.
- [ ] Есть stories для DataTable.
- [ ] Есть stories для DetailsPanel.
- [ ] Есть stories для форм.

## Таблицы

- [ ] Есть DataTable.
- [ ] Есть поиск.
- [ ] Есть фильтры.
- [ ] Есть сортировка.
- [ ] Есть пагинация.
- [ ] Есть выбор строк.
- [ ] Есть row actions.
- [ ] Есть bulk actions.
- [ ] Есть column visibility.
- [ ] Есть loading state.
- [ ] Есть error state.
- [ ] Есть empty state.
- [ ] По клику открывается details panel.

## Правая панель

- [ ] Панель открывается.
- [ ] Панель закрывается.
- [ ] Панель закрепляется.
- [ ] Панель снимается с закрепления.
- [ ] Есть view mode.
- [ ] Есть edit mode.
- [ ] Есть loading state.
- [ ] Есть error state.
- [ ] Есть empty state.
- [ ] Есть unsaved changes warning.
- [ ] Содержимое панели меняется при выборе другого элемента.

## Формы

- [ ] Формы используют React Hook Form.
- [ ] Формы используют zod.
- [ ] Есть client validation.
- [ ] Есть server error state.
- [ ] Есть loading submit.
- [ ] Есть dirty state.
- [ ] Есть reset.
- [ ] Есть форма в dialog.
- [ ] Есть форма в side panel.

## Графики

- [ ] Используется готовая библиотека.
- [ ] Есть line chart.
- [ ] Есть bar chart.
- [ ] Есть area chart.
- [ ] Есть pie/donut chart.
- [ ] Есть ChartCard.
- [ ] Есть PeriodToggle.
- [ ] Есть chart loading state.
- [ ] Есть chart empty state.
- [ ] Графики нормально выглядят в dark mode.

## API и mock data

- [ ] Есть Axios instance.
- [ ] Есть QueryClient.
- [ ] Есть mock API.
- [ ] Есть users API.
- [ ] Есть projects API.
- [ ] Есть requests API.
- [ ] Есть tasks API.
- [ ] Есть analytics API.
- [ ] Есть query hooks.
- [ ] Есть mutations.
- [ ] Есть invalidation.
- [ ] Есть optimistic update.
- [ ] Есть mock error modes.

## PWA

- [ ] vite-plugin-pwa установлен.
- [ ] Manifest настроен.
- [ ] Иконки есть.
- [ ] Service worker регистрируется.
- [ ] Offline state есть.
- [ ] Update prompt есть.
- [ ] Production build работает.
- [ ] Preview работает.
- [ ] Приложение можно установить.

## Документация

- [ ] README написан.
- [ ] Есть docs/architecture.md.
- [ ] Есть docs/fsd-rules.md.
- [ ] Есть docs/ui-kit.md.
- [ ] Есть docs/forms.md.
- [ ] Есть docs/api.md.
- [ ] Есть docs/auth-and-roles.md.
- [ ] Есть docs/pwa.md.
- [ ] Есть docs/development-guide.md.

## Финальная готовность

- [ ] можно использовать как стартовый шаблон;
- [ ] можно использовать как UI-kit;
- [ ] можно использовать как showcase;
- [ ] можно использовать как учебный пример;
- [ ] команда понимает правила разработки;
- [ ] проект можно быстро адаптировать под хакатон.
