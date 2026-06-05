# UI-kit Requirements

## 1. Назначение

UI-kit должен быть набором компонентов и паттернов, которые команда сможет быстро использовать на хакатоне.

Где живёт:

- код компонентов — `src/shared/ui`;
- витрина компонентов — `/ui-kit`;
- изолированная разработка — Storybook.

## 2. Стиль

- современный SaaS;
- нейтральный;
- аккуратный;
- без визуального шума;
- поддержка light/dark;
- русские тексты в UI.

## 3. Базовые компоненты

Добавить через shadcn/ui и адаптировать:

```txt
Button
Input
Textarea
Select
Checkbox
RadioGroup
Switch
Slider
DatePicker
Calendar
Badge
Avatar
Card
Separator
Tabs
Tooltip
Popover
DropdownMenu
Command
Dialog
AlertDialog
Sheet
Drawer
Table
Skeleton
Toast/Sonner
Breadcrumb
Pagination
```

## 4. Кастомные компоненты

Создать:

```txt
AppLogo
PageHeader
SectionCard
MetricCard
StatusBadge
SearchInput
FilterButton
ColumnVisibilityButton
ConfirmDialog
DataTable
DataToolbar
EmptyState
ErrorState
LoadingState
PageLoader
PageError
AccessDeniedState
OfflineState
DetailsPanel
FormSection
FormActions
FormFieldWrapper
ResponsiveContainer
```

## 5. Таблицы

Функции DataTable:

- поиск;
- фильтры;
- сортировка;
- пагинация;
- выбор строк;
- действия над строкой;
- массовые действия;
- открытие правой панели;
- скрытие колонок;
- ограничения по ролям;
- loading/error/empty states.

## 6. Формы

Сценарии:

- простая форма;
- форма с несколькими секциями;
- форма в dialog;
- форма в side panel;
- server error;
- dirty state;
- disabled state;
- loading submit;
- reset;
- validation через zod.

## 7. Состояния

Обязательные состояния:

```txt
EmptyState
ErrorState
LoadingState
PageLoader
PageError
AccessDeniedState
OfflineState
SkeletonBlock
```

Нельзя оставлять голые тексты `Loading...`, `Error`, `No data`.

## 8. Графики

Графики не писать с нуля.

Использовать Recharts.

Компоненты:

```txt
ChartCard
MetricCard
PeriodToggle
EmptyChartState
ChartSkeleton
```

## 9. Правая панель

`DetailsPanel` должен поддерживать:

- open/close;
- title;
- description;
- content;
- footer;
- size;
- pinned state;
- loading/error/empty;
- view mode;
- edit mode;
- unsaved changes confirmation;
- смену выбранного элемента без закрытия.

## 10. `/ui-kit`

Разделы:

```txt
Основные компоненты
Формы
Таблицы
Карточки и метрики
Состояния
Модальные окна и панели
Навигация
Графики
Layout-компоненты
```

Для каждого компонента:

- название;
- краткое описание;
- варианты;
- пример использования;
- когда применять;
- ограничения.

## 11. Storybook stories

Минимум:

```txt
Button
Input
Card
Badge
EmptyState
ErrorState
LoadingState
ConfirmDialog
DataTable
DetailsPanel
MetricCard
PageHeader
FormSection
OfflineState
```
