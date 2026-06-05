# PWA и Storybook

## PWA (Progressive Web App)

### Что это даёт

- Приложение устанавливается на телефон/компьютер как нативное
- Работает офлайн (основные страницы закешированы)
- При новой версии пользователю показывается toast «Доступно обновление»

### Конфигурация

Файл: `vite.config.ts`

```ts
VitePWA({
  registerType: 'prompt',   // пользователь сам решает когда обновлять
  manifest: {
    name: 'Frontend Starter Kit',
    short_name: 'StarterKit',
    description: 'Стартовый шаблон для хакатона',
    theme_color: '#3b82f6',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    // Прекешировать все JS/CSS/HTML
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    // API запросы — NetworkFirst (сначала сеть, при ошибке — кеш)
    runtimeCaching: [
      {
        urlPattern: /^https?:\/\/.*\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 }, // 1 час
        },
      },
    ],
  },
})
```

### Toast обновления

Файл: `src/features/pwa/ui/pwa-update-prompt.tsx`

```tsx
import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from 'sonner'

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered: (r) => {
      // Проверять обновления каждый час
      r && setInterval(() => r.update(), 60 * 60 * 1000)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      toast('Доступно обновление приложения', {
        action: {
          label: 'Обновить',
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity,
      })
    }
  }, [needRefresh, updateServiceWorker])

  return null
}
```

Компонент встроен в `AppProvider` и не требует ручного подключения.

### Offline-состояние

```tsx
import { OfflineState } from '@/shared/ui/states/offline-state'

// Тонкая полоска вверху страницы:
<OfflineState variant="banner" />

// Полноэкранное сообщение:
<OfflineState variant="full" />
```

### Иконки PWA

Нужно добавить в `public/`:
- `pwa-192x192.png` — иконка 192×192 пикселей
- `pwa-512x512.png` — иконка 512×512 пикселей

Быстрый способ: использовать любой сервис конвертации PNG (например, [favicon.io](https://favicon.io)).

### Проверка PWA

1. `npm run build && npm run preview`
2. Открыть http://localhost:4173
3. F12 → Application → Service Workers — должен быть зарегистрирован
4. Application → Manifest — проверить метаданные
5. В адресной строке Chrome должна появиться иконка установки

---

## Storybook

### Что это

Изолированная витрина компонентов. Можно посмотреть как выглядит компонент в разных состояниях без запуска всего приложения.

### Запуск

```bash
npm run storybook       # → http://localhost:6006
npm run build-storybook # → папка storybook-static/
```

### Конфигурация

**`.storybook/main.ts`** — где искать stories и как собирать:

```ts
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (config) => {
    // Alias @ → src/
    config.resolve!.alias = {
      ...config.resolve!.alias,
      '@': path.resolve(__dirname, '../src'),
    }
    return config
  },
}
```

**`.storybook/preview.ts`** — глобальные декораторы и настройки:

```ts
import '../src/app/styles/globals.css'  // подключить Tailwind

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      // При выборе тёмного фона — добавить класс dark на html
      const isDark = context.globals.backgrounds?.value === '#0a0a0a'
      document.documentElement.classList.toggle('dark', isDark)
      return Story()
    },
  ],
}
```

### Список готовых stories

Расположены рядом с компонентами (`*.stories.tsx`):

| Story | Файл |
|-------|------|
| Button | `src/shared/ui/button.stories.tsx` |
| Badge | `src/shared/ui/badge.stories.tsx` |
| Input | `src/shared/ui/input.stories.tsx` |
| StatusBadge | `src/shared/ui/status-badge.stories.tsx` |
| MetricCard | `src/shared/ui/metric-card.stories.tsx` |
| PageHeader | `src/shared/ui/page-header.stories.tsx` |
| SearchInput | `src/shared/ui/search-input.stories.tsx` |
| ConfirmDialog | `src/shared/ui/confirm-dialog.stories.tsx` |
| FormSection | `src/shared/ui/form-section.stories.tsx` |
| DataTable | `src/shared/ui/data-table/DataTable.stories.tsx` |
| EmptyState | `src/shared/ui/states/EmptyState.stories.tsx` |
| ErrorState | `src/shared/ui/states/ErrorState.stories.tsx` |
| OfflineState | `src/shared/ui/states/OfflineState.stories.tsx` |

### Написать новую story

```tsx
// src/shared/ui/status-badge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from './status-badge'

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],  // автоматическая документация из JSDoc
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
  },
}
export default meta
type Story = StoryObj<typeof StatusBadge>

// Дефолтный вариант
export const Default: Story = {
  args: { label: 'Активен', variant: 'success' },
}

// Все варианты
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge label="Успех" variant="success" />
      <StatusBadge label="Предупреждение" variant="warning" />
      <StatusBadge label="Ошибка" variant="error" />
      <StatusBadge label="Информация" variant="info" />
      <StatusBadge label="Нейтральный" variant="neutral" />
    </div>
  ),
}
```

### Story для компонента с данными

```tsx
// src/shared/ui/data-table/DataTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './data-table'

interface User { id: string; name: string; email: string }

const MOCK: User[] = [
  { id: '1', name: 'Иван Иванов', email: 'ivan@example.com' },
  { id: '2', name: 'Мария Петрова', email: 'maria@example.com' },
]

const meta: Meta<typeof DataTable<User>> = {
  title: 'UI/DataTable',
  component: DataTable,
}
export default meta

export const Default: StoryObj = {
  render: () => (
    <DataTable
      data={MOCK}
      keyField="id"
      columns={[
        { key: 'name', header: 'Имя', sortable: true },
        { key: 'email', header: 'Email', sortable: true },
      ]}
    />
  ),
}

export const Loading: StoryObj = {
  render: () => (
    <DataTable data={[]} keyField="id" columns={[]} isLoading />
  ),
}

export const Empty: StoryObj = {
  render: () => (
    <DataTable data={[]} keyField="id" columns={[
      { key: 'name', header: 'Имя' },
    ]} />
  ),
}
```

### Тёмная тема в Storybook

В панели инструментов вверху выбери Background → dark. Декоратор в `preview.ts` автоматически добавит класс `.dark` на `<html>` — все Tailwind dark:-классы активируются.
