# DetailsPanel

`src/widgets/details-panel/` — боковая панель для просмотра и редактирования сущности.

## Использование

```tsx
import { DetailsPanel } from '@/widgets/details-panel/ui/details-panel'

<DetailsPanel
  open={isOpen}
  onClose={() => setOpen(false)}
  title="Пользователь"
  description="Детали записи"
  size="lg"              // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  isPinned={isPinned}
  onPinChange={setIsPinned}
  footer={<Button>Сохранить</Button>}
>
  {/* контент */}
</DetailsPanel>
```

## Props

| Prop | Тип | Описание |
|------|-----|----------|
| `open` | `boolean` | Открыта ли панель |
| `onClose` | `() => void` | Callback закрытия |
| `title` | `string` | Заголовок |
| `description` | `string?` | Подзаголовок |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Ширина панели |
| `isPinned` | `boolean?` | Закреплена ли панель (не закрывается кликом вне) |
| `onPinChange` | `(pinned: boolean) => void` | Callback изменения pin |
| `isLoading` | `boolean?` | Показывает spinner |
| `error` | `string?` | Показывает ErrorState |
| `footer` | `ReactNode?` | Контент footer |
| `onPrev` / `onNext` | `() => void` | Навигация предыдущий/следующий |

## Zustand panel-store

```ts
const { isOpen, isPinned, selectedId, open, close, togglePin, setSelectedId } = usePanelStore()
```

Хранит глобальное состояние открытой панели. Полезно, когда панель управляется из нескольких компонентов (таблица + header).
