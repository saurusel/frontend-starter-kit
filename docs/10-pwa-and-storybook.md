# PWA и Storybook

## PWA

Реализован через `vite-plugin-pwa` с Workbox.

### Конфигурация

`vite.config.ts` → `VitePWA({ ... })`:
- `registerType: 'prompt'` — пользователь получает toast с предложением обновиться
- `manifest` — имя приложения, иконки, display: standalone
- `workbox.globPatterns` — прекеш JS/CSS/HTML/шрифтов
- `workbox.runtimeCaching` — NetworkFirst для `/api/*` с таймаутом 5с

### Update prompt

`src/features/pwa/ui/pwa-update-prompt.tsx` — хук `useRegisterSW` отслеживает новый SW и показывает Sonner toast с кнопкой «Обновить».

### Офлайн-состояние

`src/shared/ui/states/offline-state.tsx` — два варианта:
- `variant="banner"` — тонкая полоса вверху страницы
- `variant="full"` — полноэкранное сообщение

### Иконки PWA

Добавьте в `public/`:
- `pwa-192x192.png`
- `pwa-512x512.png`

---

## Storybook

### Запуск

```bash
npm run storybook        # dev на порту 6006
npm run build-storybook  # сборка в storybook-static/
```

### Конфигурация

`.storybook/main.ts` — подключает `@storybook/react-vite`, настраивает alias `@/*`.

`.storybook/preview.ts` — импортирует глобальные стили Tailwind, переключает dark mode через decorator.

### Dark mode в Storybook

В панели Backgrounds выберите `dark` — декоратор автоматически добавит класс `.dark` на `<html>`, что активирует тёмные CSS-переменные Tailwind.

### Stories

Stories расположены рядом с компонентами: `*.stories.tsx`.

Список:
- `Button.stories.tsx`
- `Badge.stories.tsx`
- `Input.stories.tsx`
- `StatusBadge.stories.tsx`
- `MetricCard.stories.tsx`
- `PageHeader.stories.tsx`
- `SearchInput.stories.tsx`
- `ConfirmDialog.stories.tsx`
- `FormSection.stories.tsx`
- `data-table/DataTable.stories.tsx`
- `states/EmptyState.stories.tsx`
- `states/ErrorState.stories.tsx`
- `states/OfflineState.stories.tsx`
