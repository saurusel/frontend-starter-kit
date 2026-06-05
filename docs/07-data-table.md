# DataTable

`src/shared/ui/data-table/data-table.tsx` — универсальная таблица с богатым функционалом.

## Базовое использование

```tsx
import { DataTable } from '@/shared/ui/data-table/data-table'
import type { Column } from '@/shared/ui/data-table/types'

const columns: Column<User>[] = [
  { key: 'name', header: 'Имя', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  {
    key: 'status',
    header: 'Статус',
    cell: (row) => <StatusBadge label={row.status} variant="success" />,
  },
]

<DataTable
  data={users}
  columns={columns}
  keyField="id"
  isLoading={isLoading}
  error={error ? 'Ошибка загрузки' : null}
/>
```

## Props

| Prop | Тип | Описание |
|------|-----|----------|
| `data` | `T[]` | Данные для отображения |
| `columns` | `Column<T>[]` | Определение колонок |
| `keyField` | `keyof T` | Уникальный ключ строки (обычно `"id"`) |
| `isLoading` | `boolean` | Показывает skeleton-строки |
| `error` | `string \| null` | Показывает ErrorState с сообщением |
| `searchValue` | `string` | Внешнее управление поиском |
| `onSearchChange` | `(v: string) => void` | Callback изменения поиска |
| `selectedIds` | `Set<string>` | Выбранные строки (внешнее состояние) |
| `onSelectionChange` | `(ids: Set<string>) => void` | Callback выбора |
| `rowActions` | `(row: T) => ReactNode` | Действия для строки (рендерится в последней колонке) |
| `bulkActions` | `ReactNode` | Действия для выбранных строк (появляются в toolbar) |
| `pageSize` | `number` | Размер страницы (по умолчанию 10) |

## Функции

- **Поиск** — по всем колонкам, поддерживает внутреннее и внешнее состояние
- **Сортировка** — клик по заголовку: asc → desc → сброс
- **Пагинация** — кнопки «Назад/Вперёд», счётчик строк
- **Выбор строк** — checkbox в каждой строке + «выбрать все на странице»
- **Bulk actions** — панель появляется при выборе строк
- **Loading state** — skeleton-строки вместо данных
- **Empty/Error state** — встроенные состояния

## Оптимистичное удаление

```ts
// Пример из entities/user/model/user.queries.ts
export function useDeleteUser() {
  return useMutation({
    mutationFn: userApi.deleteUser,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: userKeys.all })
      const prev = queryClient.getQueryData(userKeys.lists())
      queryClient.setQueryData(userKeys.lists(), (old: User[]) =>
        old.filter((u) => u.id !== id)
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(userKeys.lists(), ctx?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
```
