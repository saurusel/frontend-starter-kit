# WORK_PLAN — план реализации `frontend-starter-kit`

> Рабочий план для исполнителя (Sonnet). Проект пока состоит только из спецификаций
> (`00`–`11`). Кода нет. Цель — построить с нуля frontend-стартер по FSD.
>
> Источники истины (читать перед каждым этапом):
> - [00_CLAUDE_START_HERE.md](00_CLAUDE_START_HERE.md) — роль, стек, принцип работы
> - [01_PRODUCT_REQUIREMENTS.md](01_PRODUCT_REQUIREMENTS.md) — страницы и UI-паттерны
> - [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) — порядок этапов
> - [03_ARCHITECTURE_FSD.md](03_ARCHITECTURE_FSD.md) — структура и правила импортов
> - [04_UI_KIT_REQUIREMENTS.md](04_UI_KIT_REQUIREMENTS.md) — список компонентов
> - [05_AUTH_ROLES_PERMISSIONS.md](05_AUTH_ROLES_PERMISSIONS.md) — роли, права, матрица
> - [06_PWA_REQUIREMENTS.md](06_PWA_REQUIREMENTS.md) — PWA
> - [07_STORYBOOK_REQUIREMENTS.md](07_STORYBOOK_REQUIREMENTS.md) — Storybook
> - [08_MOCK_DATA_AND_API.md](08_MOCK_DATA_AND_API.md) — типы, API, query hooks
> - [09_CODING_RULES.md](09_CODING_RULES.md) — правила кода
> - [10_ACCEPTANCE_CHECKLIST.md](10_ACCEPTANCE_CHECKLIST.md) — финальная проверка
> - [11_DOCS_STRUCTURE_FOR_FINAL_PROJECT.md](11_DOCS_STRUCTURE_FOR_FINAL_PROJECT.md) — папка `docs/`

## Ключевые правила (соблюдать на каждом этапе)

- **Итеративность**: один этап = рабочий инкремент. Не писать весь код одним полотном.
- **Язык**: UI — русский; код/файлы/переменные — английский.
- **Имена файлов**: `kebab-case.ts(x)`, компоненты — `PascalCase`, хуки — `useSomething`.
- **Импорты**: только через alias `@/...`; направление импортов строго по FSD
  (`app → pages → widgets → features → entities → shared`, см. [03_ARCHITECTURE_FSD.md](03_ARCHITECTURE_FSD.md)).
- **Состояние**: серверное — TanStack Query; клиентское — Zustand. Запросы не в страницах.
- **Async UI**: всегда loading / error / empty / content. Никаких голых `Loading...`/`Error`.
- **Формы**: всегда zod + React Hook Form + server error + loading submit.
- После каждого этапа: запустить проверку, свериться с критериями готовности.

---

## Этап 0. Бутстрап и санитарная проверка

**Цель**: убедиться, что окружение готово, и зафиксировать стартовую точку.

- Проверить Node (LTS ≥ 18), npm.
- Спеки (`00`–`11`) оставить в корне как справочник (или перенести в `_specs/` — на усмотрение, но не удалять).

**Done when**: `node -v`, `npm -v` работают; есть понимание целевой структуры.

---

## Этап 1. Инициализация проекта
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 1, [03_ARCHITECTURE_FSD.md](03_ARCHITECTURE_FSD.md)

- Создать Vite + React + TS проект (`npm create vite@latest . -- --template react-ts`).
- Очистить дефолтные файлы (`App.css`, демо-логотипы, содержимое `App.tsx`).
- TypeScript strict в `tsconfig.json`; alias `@/*` → `src/*` (в `tsconfig.json` и `vite.config.ts` через `resolve.alias`).
- ESLint + Prettier (`.eslintrc`/`eslint.config.js`, `.prettierrc`).
- Создать FSD-скелет пустых папок: `src/{app,pages,widgets,features,entities,shared}` с подпапками из [03_ARCHITECTURE_FSD.md](03_ARCHITECTURE_FSD.md) §2.
- Базовый `README.md`.

**Файлы**: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `eslint.config.js`, `.prettierrc`, `README.md`, дерево `src/`.

**Done when**: `npm run dev` стартует, `npm run build` проходит, alias `@/` резолвится.

---

## Этап 2. Tailwind + shadcn/ui + тема
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 2, [04_UI_KIT_REQUIREMENTS.md](04_UI_KIT_REQUIREMENTS.md)

- Установить и настроить Tailwind (`tailwind.config.ts`, `postcss.config.js`).
- Инициализировать shadcn/ui (`components.json`), задать стиль/нейтральную палитру.
- `cn` utility → `src/shared/lib/cn.ts`.
- CSS-переменные и light/dark токены → `src/app/styles/globals.css` (`:root` + `.dark`).
- Добавить первые shadcn-компоненты в `src/shared/ui/`: Button, Input, Card, Dialog, Badge, Skeleton.

**Файлы**: `tailwind.config.ts`, `postcss.config.js`, `components.json`,
`src/shared/lib/cn.ts`, `src/app/styles/globals.css`, `src/shared/ui/{button,input,card,dialog,badge,skeleton}.tsx`.

**Done when**: shadcn-компоненты рендерятся, классы Tailwind применяются, `.dark` переключает палитру.

---

## Этап 3. App Providers
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 3

- `ThemeProvider` (light/dark/system + persist) → `src/app/providers/theme-provider.tsx`.
- `QueryProvider` (QueryClient) → `src/app/providers/query-provider.tsx`.
- `RouterProvider` → `src/app/providers/router-provider.tsx` (наполняется на этапе 4).
- Корневой `AppProvider` композирует всё → `src/app/providers/app-provider.tsx`.
- Session init (восстановление сессии при старте) → подключить в провайдерах.
- Подключить Sonner toaster → `src/shared/ui/sonner.tsx` + в провайдерах.
- Упростить `src/app/main.tsx` (только `createRoot` + `<AppProvider/>`).

**Файлы**: `src/app/providers/*.tsx`, `src/app/providers/index.ts`, `src/app/main.tsx`, `index.html`.

**Done when**: `main.tsx` минимален, провайдеры подключены без дублирования инициализации.

---

## Этап 4. Роутинг
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 4, маршруты из [00](00_CLAUDE_START_HERE.md)/[01](01_PRODUCT_REQUIREMENTS.md)

- `src/shared/config/route-paths.ts` — константы путей.
- `src/app/routes/router.tsx` — конфиг роутера (`createBrowserRouter`).
- Public route: `/login`. Protected: `/dashboard /tables /charts /forms /panels /ui-kit /settings`.
- `/access-denied` и `/*` (404).
- Заглушки страниц в `src/pages/*` (наполняются позже).
- Guards-обёртки (полноценно на этапе 5): `RequireAuth`, `RequirePermission`, `RequireRole`.

**Файлы**: `src/shared/config/route-paths.ts`, `src/app/routes/router.tsx`,
`src/pages/{auth/login,dashboard,tables,charts,forms,panels,ui-kit,settings,access-denied,not-found}/index.tsx`.

**Done when**: все маршруты открываются, неизвестный путь → 404.

---

## Этап 5. Mock Auth + Session + Роли
Спека: [05_AUTH_ROLES_PERMISSIONS.md](05_AUTH_ROLES_PERMISSIONS.md), [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 5

- Типы: `UserRole` (Admin/Manager/User/Guest), `Permission`, `Session` → `src/entities/session/model/types.ts`.
- Permissions-список и матрица прав ролей → `src/entities/session/model/permissions.ts`
  (точно по таблице из [05](05_AUTH_ROLES_PERMISSIONS.md) §6–§7).
- Mock users + демо-пароль `demo` → `src/entities/session/model/mock-users.ts`.
- Session store на Zustand (persist в localStorage) → `src/entities/session/model/session-store.ts`.
- Хелперы прав (`hasPermission`, `hasRole`) → `src/entities/session/lib/`.
- Guards: `src/app/routes/guards/{require-auth,require-permission,require-role}.tsx`.
- Login form (feature) → `src/features/auth/login/` (zod schema + RHF + быстрые кнопки входа).
- Logout (feature) → `src/features/auth/logout/`.
- Redirect после login/logout.

**Done when**: вход под разными ролями, logout, session сохраняется/восстанавливается,
закрытые страницы защищены, нет permission → `/access-denied`.

---

## Этап 6. AppShell (layout)
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 6, [01_PRODUCT_REQUIREMENTS.md](01_PRODUCT_REQUIREMENTS.md) §5

- `AppShell` → `src/widgets/app-shell/ui/app-shell.tsx`.
- `AppSidebar` (active route, пункты по правам, mobile sidebar через Sheet) → `src/widgets/app-shell/ui/app-sidebar.tsx`.
- `AppHeader` → `src/widgets/app-shell/ui/app-header.tsx`.
- User menu (DropdownMenu + logout) → `src/widgets/app-shell/ui/user-menu.tsx`.
- Theme toggle (feature) → `src/features/theme/ui/theme-toggle.tsx`.
- Конфиг навигации с привязкой к permissions → `src/widgets/app-shell/config/nav-items.ts`.

**Done when**: общий layout работает, sidebar реагирует на права и активный маршрут, mobile-версия открывается.

---

## Этап 7. Mock API Layer
Спека: [08_MOCK_DATA_AND_API.md](08_MOCK_DATA_AND_API.md), [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 9

> Делается до страниц с данными, т.к. таблицы/графики/формы зависят от API.

- Axios instance → `src/shared/api/axios-instance.ts` (baseURL, timeout, interceptors, mock token).
- QueryClient → `src/shared/api/query-client.ts` (retry, staleTime, refetchOnWindowFocus).
- API error model → `src/shared/api/api-error.ts` (русские сообщения, маппинг 400/401/403/404/500).
- `mockRequest<T>` + режимы success/empty/error/slow → `src/shared/api/mock-request.ts`.
- Mock mode store (Zustand) → `src/shared/model/mock-mode-store.ts`.
- Типы сущностей → `src/entities/{user,project,request,task,team,analytics,notification}/model/types.ts`
  (User/Project/RequestItem/Task строго по [08](08_MOCK_DATA_AND_API.md) §6–§9).
- Mock-данные → `src/entities/*/model/mock-data.ts`.
- API-функции → `src/entities/{user,project,request,task,analytics}/api/*.api.ts`.

**Done when**: API-функции возвращают данные через `mockRequest`; работают режимы ошибок; UI к ним ещё не подключён.

---

## Этап 8. TanStack Query examples
Спека: [08_MOCK_DATA_AND_API.md](08_MOCK_DATA_AND_API.md) §11–§12, [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 10

- Query keys → `src/entities/*/model/*.keys.ts` (или общий `query-keys`).
- Query hooks → `src/entities/{user,project,request,task,analytics}/model/*.queries.ts`.
- Mutations (feature-level) → `src/features/user/{create-user,edit-user,delete-user}/api/*.mutation.ts`.
- Invalidation в мутациях; один пример optimistic update (например, toggle status / settings).

**Done when**: списки/детали тянутся через хуки, мутации инвалидируют кэш, есть 1 optimistic update.

---

## Этап 9. UI-kit: кастомные компоненты и состояния
Спека: [04_UI_KIT_REQUIREMENTS.md](04_UI_KIT_REQUIREMENTS.md) §3–§9

- Добрать недостающие shadcn-компоненты в `src/shared/ui/` (Textarea, Select, Checkbox, RadioGroup,
  Switch, Slider, Calendar/DatePicker, Avatar, Separator, Tabs, Tooltip, Popover, DropdownMenu,
  Command, AlertDialog, Sheet, Drawer, Table, Breadcrumb, Pagination, Sonner).
- Состояния → `src/shared/ui/states/`: `EmptyState`, `ErrorState`, `LoadingState`, `PageLoader`,
  `PageError`, `AccessDeniedState`, `OfflineState`, `SkeletonBlock`.
- Кастомные → `src/shared/ui/`: `AppLogo`, `PageHeader`, `SectionCard`, `MetricCard`, `StatusBadge`,
  `SearchInput`, `FilterButton`, `ColumnVisibilityButton`, `ConfirmDialog`, `DataToolbar`,
  `FormSection`, `FormActions`, `FormFieldWrapper`, `ResponsiveContainer`.
- `entities/user/ui/UserStatusBadge` и подобные доменные бейджи.

**Done when**: компоненты переиспользуемы, корректны в light/dark, нет голых текстов состояний.

---

## Этап 10. DataTable (таблицы)
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 11, [01](01_PRODUCT_REQUIREMENTS.md) `/tables`, [04](04_UI_KIT_REQUIREMENTS.md) §5

- `DataTable` (на TanStack Table или собственный) → `src/shared/ui/data-table/`.
- Возможности: поиск, фильтры, сортировка, пагинация, selection, row actions, bulk actions,
  column visibility, открытие правой панели по клику, ограничения действий по ролям.
- Виджет таблицы пользователей → `src/widgets/users-table/`.
- Страница `/tables` → `src/pages/tables/` (loading/error/empty states).
- `table` feature (состояние выбора/фильтров) → `src/features/table/`.

**Done when**: вся таблица работает по чеклисту [10](10_ACCEPTANCE_CHECKLIST.md) §Таблицы, клик по строке открывает панель.

---

## Этап 11. DetailsPanel (правая панель)
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 12, [04](04_UI_KIT_REQUIREMENTS.md) §9

- `DetailsPanel` → `src/widgets/details-panel/` (open/close, pin/unpin, size, title/description/content/footer).
- View mode / edit mode; loading/error/empty; unsaved changes guard; смена выбранного элемента без закрытия; step flow.
- Panel state (Zustand) → `src/features/panel/model/panel-store.ts`.
- Страница `/panels` с демо-сценариями → `src/pages/panels/`.

**Done when**: все пункты чеклиста [10](10_ACCEPTANCE_CHECKLIST.md) §Правая панель выполнены.

---

## Этап 12. Формы
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 13, [04](04_UI_KIT_REQUIREMENTS.md) §6, [09](09_CODING_RULES.md) §4

- Form wrappers (поверх RHF + FormSection/FormActions) — уже в shared/ui.
- Create/Edit user forms → `src/features/user/{create-user,edit-user}/ui/` (+ `model/schema.ts` zod).
- Settings form → `src/features/settings/`.
- Форма в Dialog и форма в Side Panel (демо).
- Серверные ошибки, dirty state, unsaved changes warning, reset, loading submit.
- Страница `/forms` → `src/pages/forms/`.

**Done when**: все пункты чеклиста [10](10_ACCEPTANCE_CHECKLIST.md) §Формы выполнены.

---

## Этап 13. Графики
Спека: [02_IMPLEMENTATION_ROADMAP.md](02_IMPLEMENTATION_ROADMAP.md) §Этап 14, [04](04_UI_KIT_REQUIREMENTS.md) §8

- Установить Recharts.
- `ChartCard`, `PeriodToggle`, `EmptyChartState`, `ChartSkeleton` → `src/shared/ui/charts/`.
- Line / Bar / Area / Pie(Donut) графики, темо-совместимые цвета (через CSS-переменные).
- Analytics query hooks подключить к графикам.
- Страница `/charts` → `src/pages/charts/`.

**Done when**: 4 типа графиков, period switcher, loading/empty состояния, корректны в dark mode.

---

## Этап 14. Dashboard
Спека: [01_PRODUCT_REQUIREMENTS.md](01_PRODUCT_REQUIREMENTS.md) `/dashboard`

- `dashboard-grid` виджет → `src/widgets/dashboard-grid/`.
- KPI-карточки (MetricCard), графики, последние события, быстрые действия, переключение периода.
- loading/error/empty states.
- Страница `/dashboard` → `src/pages/dashboard/`.

**Done when**: дашборд собран из готовых компонентов, состояния корректны.

---

## Этап 15. Страница /ui-kit и /settings
Спека: [04_UI_KIT_REQUIREMENTS.md](04_UI_KIT_REQUIREMENTS.md) §10, [01](01_PRODUCT_REQUIREMENTS.md) `/settings`

- `/ui-kit` → `src/pages/ui-kit/`: разделы (Основные, Формы, Таблицы, Карточки/метрики, Состояния,
  Модалки/панели, Навигация, Графики, Layout). Для каждого компонента: название, описание, варианты,
  пример, когда применять, ограничения.
- `/settings` → `src/pages/settings/`: тема, профиль, уведомления, форма сохранения, optimistic update, toast.

**Done when**: `/ui-kit` показывает все группы компонентов; `/settings` сохраняет с optimistic update + toast.

---

## Этап 16. Storybook
Спека: [07_STORYBOOK_REQUIREMENTS.md](07_STORYBOOK_REQUIREMENTS.md)

- Установить Storybook для React+Vite; настроить Tailwind, alias `@/*`, global styles, dark/light backgrounds, decorators.
- Scripts `storybook` / `build-storybook` в `package.json`.
- Stories (минимум по списку из [07](07_STORYBOOK_REQUIREMENTS.md) §5): Button, Input, Textarea, Select,
  Card, Badge, Avatar, Tabs, Dialog, ConfirmDialog, Sheet, EmptyState, ErrorState, LoadingState,
  PageHeader, MetricCard, StatusBadge, SearchInput, DataTable, DetailsPanel, FormSection, OfflineState.

**Done when**: `npm run storybook` открывается без ошибок, Tailwind/alias работают, есть light/dark варианты.

---

## Этап 17. PWA
Спека: [06_PWA_REQUIREMENTS.md](06_PWA_REQUIREMENTS.md)

- Установить `vite-plugin-pwa`, настроить в `vite.config.ts` (manifest по [06](06_PWA_REQUIREMENTS.md) §3, autoUpdate).
- Иконки в `public/`: `pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`, `favicon.ico`
  (при отсутствии — простые placeholder-иконки).
- Offline state: глобальный индикатор в AppShell + fallback screen + toast при потере соединения
  (хук `useOnlineStatus` → `src/shared/hooks/`).
- Update prompt («Доступна новая версия» / Обновить / Позже) → `src/features/pwa/update-prompt/`.

**Done when**: `npm run build && npm run preview`; manifest валиден, SW регистрируется, offline fallback и update prompt работают.

---

## Этап 18. Документация
Спека: [11_DOCS_STRUCTURE_FOR_FINAL_PROJECT.md](11_DOCS_STRUCTURE_FOR_FINAL_PROJECT.md), [02](02_IMPLEMENTATION_ROADMAP.md) §Этап 16

- Папка `docs/` с файлами: `architecture.md`, `fsd-rules.md`, `ui-kit.md`, `forms.md`, `api.md`,
  `auth-and-roles.md`, `pwa.md`, `storybook.md`, `development-guide.md`, `contribution-guide.md`
  (содержание по [11](11_DOCS_STRUCTURE_FOR_FINAL_PROJECT.md)).
- Обновить корневой `README.md` (быстрый старт, скрипты, ссылки на docs).

**Done when**: все 10 doc-файлов созданы и осмысленны; README актуален.

---

## Этап 19. Финальная проверка
Спека: [10_ACCEPTANCE_CHECKLIST.md](10_ACCEPTANCE_CHECKLIST.md), [02](02_IMPLEMENTATION_ROADMAP.md) §Этап 17

Прогнать и убедиться, что проходят:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run storybook
npm run build-storybook
npm run lint
```

- Пройти весь чеклист [10_ACCEPTANCE_CHECKLIST.md](10_ACCEPTANCE_CHECKLIST.md) по разделам.
- Проверить направление импортов по FSD (нет `shared → entities` и т.п.).
- Проверить, что серверного состояния нет в Zustand, запросы не в страницах.

**Done when**: все команды зелёные, чеклист закрыт.

---

## Карта зависимостей этапов (порядок обязателен)

```
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19
                         └ API (7,8) обязателен до таблиц/форм/графиков (10,12,13)
                         └ UI-kit (9) обязателен до 10–15
```

## Примечания для исполнителя

- На каждом этапе сначала перечислять файлы, затем код, затем команды проверки, затем критерии — по [00_CLAUDE_START_HERE.md](00_CLAUDE_START_HERE.md) §«Принцип работы».
- Не раздувать в продуктовый кейс: сущности (users/projects/requests/...) — только демо UI-паттернов.
- Не переходить к следующему этапу, пока текущий не завершён логически.
</content>
</invoke>
