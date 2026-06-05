# Storybook Requirements

## 1. Цель

Storybook нужен как отдельная изолированная витрина компонентов.

`/ui-kit` показывает компоненты внутри приложения, а Storybook показывает компоненты изолированно.

## 2. Технология

Storybook для React + Vite.

## 3. Настройка

Настроить:

- React + Vite;
- TypeScript;
- Tailwind;
- aliases `@/*`;
- global styles;
- dark/light background;
- decorators при необходимости.

## 4. Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## 5. Stories

Минимальный набор:

```txt
Button.stories.tsx
Input.stories.tsx
Textarea.stories.tsx
Select.stories.tsx
Card.stories.tsx
Badge.stories.tsx
Avatar.stories.tsx
Tabs.stories.tsx
Dialog.stories.tsx
ConfirmDialog.stories.tsx
Sheet.stories.tsx
EmptyState.stories.tsx
ErrorState.stories.tsx
LoadingState.stories.tsx
PageHeader.stories.tsx
MetricCard.stories.tsx
StatusBadge.stories.tsx
SearchInput.stories.tsx
DataTable.stories.tsx
DetailsPanel.stories.tsx
FormSection.stories.tsx
OfflineState.stories.tsx
```

## 6. Формат stories

Для каждого компонента показывать:

- Default;
- variants;
- disabled/loading/error states;
- dark mode, если возможно;
- responsive example для layout-компонентов.

## 7. Критерии готовности

- `npm run storybook` открывается без ошибок;
- Tailwind работает;
- alias работает;
- главные компоненты имеют stories;
- можно посмотреть light/dark варианты.
