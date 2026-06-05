# UI-компоненты

Все компоненты находятся в `src/shared/ui/` и построены на [Radix UI](https://radix-ui.com) primitives + Tailwind CSS.

## Базовые компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| Button | `button.tsx` | 6 вариантов × 4 размера |
| Badge | `badge.tsx` | default / secondary / destructive / outline |
| Input | `input.tsx` | Текстовое поле |
| Textarea | `textarea.tsx` | Многострочный ввод |
| Select | `select.tsx` | Выпадающий список (Radix) |
| Checkbox | `checkbox.tsx` | Флажок (Radix) |
| Switch | `switch.tsx` | Переключатель (Radix) |
| Label | `label.tsx` | Метка поля |
| Avatar | `avatar.tsx` | Аватар с фоллбеком |
| Separator | `separator.tsx` | Горизонтальный/вертикальный разделитель |
| Skeleton | `skeleton.tsx` | Плейсхолдер загрузки |

## Составные компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| Card | `card.tsx` | Базовая карточка |
| Dialog | `dialog.tsx` | Модальный диалог |
| Sheet | `sheet.tsx` | Боковая панель (slide-in) |
| DropdownMenu | `dropdown-menu.tsx` | Контекстное меню |
| Tooltip | `tooltip.tsx` | Всплывающая подсказка |
| Tabs | `tabs.tsx` | Вкладки |
| AlertDialog | `alert-dialog.tsx` | Диалог подтверждения (Radix) |

## Бизнес-компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| StatusBadge | `status-badge.tsx` | success / warning / error / info / neutral |
| MetricCard | `metric-card.tsx` | KPI с трендом ± % |
| SearchInput | `search-input.tsx` | Input с иконкой поиска и кнопкой сброса |
| PageHeader | `page-header.tsx` | Заголовок страницы со слотом actions |
| SectionCard | `section-card.tsx` | Card-обёртка с title / description / actions |
| ConfirmDialog | `confirm-dialog.tsx` | Диалог подтверждения с isLoading и variant |
| FormSection | `form-section.tsx` | FormSection + FormFieldWrapper + FormActions |
| DataTable | `data-table/data-table.tsx` | Таблица с поиском, сортировкой, пагинацией, выбором строк |

## Состояния

| Компонент | Путь |
|-----------|------|
| EmptyState | `states/empty-state.tsx` |
| ErrorState | `states/error-state.tsx` |
| LoadingState | `states/loading-state.tsx` |
| PageLoader | `states/page-loader.tsx` |
| PageError | `states/page-error.tsx` |
| OfflineState | `states/offline-state.tsx` |
| AccessDeniedState | `states/access-denied-state.tsx` |

## Графики (src/shared/ui/charts/)

| Компонент | Описание |
|-----------|----------|
| ChartCard | Обёртка с loading/empty состояниями |
| PeriodToggle | Переключатель периода: 7d / 30d / 90d |
| LineChart | Линейный график (Recharts) |
| BarChart | Столбчатый, поддерживает stacked |
| AreaChart | Area, поддерживает stacked |
| DonutChart | Пончик с легендой и процентами |

Все графики используют CSS-переменные `--chart-1..5` для совместимости с dark mode.
