# DataTable — подробное руководство

`src/shared/ui/data-table/data-table.tsx` — универсальная таблица с поиском, сортировкой, пагинацией, выбором строк и действиями.

---

## Минимальный рабочий пример

```tsx
import { DataTable } from '@/shared/ui/data-table/data-table'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

const products: Product[] = [
  { id: '1', name: 'Товар А', price: 1500, category: 'Электроника' },
  { id: '2', name: 'Товар Б', price: 800, category: 'Одежда' },
]

<DataTable
  data={products}
  columns={[
    { key: 'name', header: 'Название', sortable: true },
    { key: 'price', header: 'Цена', sortable: true },
    { key: 'category', header: 'Категория', sortable: true },
  ]}
  keyField="id"
/>
```

---

## Все Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `data` | `T[]` | — | Данные для отображения |
| `columns` | `Column<T>[]` | — | Определение колонок |
| `keyField` | `keyof T` | — | Поле с уникальным ID (обычно `"id"`) |
| `isLoading` | `boolean` | `false` | Показать skeleton-строки |
| `error` | `string \| null` | `null` | Показать ErrorState |
| `searchValue` | `string` | — | Внешнее значение поиска |
| `onSearchChange` | `(v: string) => void` | — | Callback изменения поиска |
| `selectedIds` | `Set<string>` | — | Выбранные строки (внешнее состояние) |
| `onSelectionChange` | `(ids: Set<string>) => void` | — | Callback изменения выборки |
| `rowActions` | `(row: T) => ReactNode` | — | Меню действий для каждой строки |
| `bulkActions` | `ReactNode` | — | Кнопки для выбранных строк (toolbar) |
| `pageSize` | `number` | `10` | Строк на странице |
| `onRowClick` | `(row: T) => void` | — | Клик по строке |
| `className` | `string` | — | Кастомный CSS |

---

## Определение колонок (Column)

```ts
interface Column<T> {
  key: keyof T | string  // поле объекта или произвольный ключ
  header: string         // заголовок колонки
  sortable?: boolean     // разрешить сортировку по этой колонке
  cell?: (row: T) => ReactNode  // кастомный рендер ячейки
  className?: string     // CSS для этой колонки
}
```

### Примеры разных типов колонок

```tsx
import { DataTable } from '@/shared/ui/data-table/data-table'
import { StatusBadge } from '@/shared/ui/status-badge'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'

const columns: Column<User>[] = [
  // 1. Обычный текст
  { key: 'name', header: 'Имя', sortable: true },

  // 2. Число с форматированием
  {
    key: 'salary',
    header: 'Зарплата',
    sortable: true,
    cell: (row) => `${row.salary.toLocaleString('ru-RU')} ₽`,
  },

  // 3. Дата
  {
    key: 'createdAt',
    header: 'Дата создания',
    sortable: true,
    cell: (row) => new Date(row.createdAt).toLocaleDateString('ru-RU'),
  },

  // 4. Цветной статус
  {
    key: 'status',
    header: 'Статус',
    cell: (row) => (
      <StatusBadge
        label={row.status === 'active' ? 'Активен' : 'Неактивен'}
        variant={row.status === 'active' ? 'success' : 'neutral'}
      />
    ),
  },

  // 5. Аватар + имя в одной ячейке
  {
    key: 'user',
    header: 'Пользователь',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">
            {row.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },

  // 6. Тег / Badge
  {
    key: 'team',
    header: 'Команда',
    cell: (row) => <Badge variant="secondary">{row.team}</Badge>,
  },

  // 7. Ссылка
  {
    key: 'website',
    header: 'Сайт',
    cell: (row) => (
      <a href={row.website} className="text-primary hover:underline text-sm">
        {row.website}
      </a>
    ),
  },
]
```

---

## Действия в строке (rowActions)

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from '@/shared/ui/dropdown-menu'
import { Button } from '@/shared/ui/button'
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'

<DataTable
  data={users}
  columns={columns}
  keyField="id"
  rowActions={(row) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Действия</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleView(row)}>
          <Eye className="mr-2 h-4 w-4" /> Просмотр
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEdit(row)}>
          <Pencil className="mr-2 h-4 w-4" /> Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => setDeleteTarget(row.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
/>
```

---

## Массовые действия (bulkActions)

```tsx
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
const deleteUser = useDeleteUser()

<DataTable
  data={users}
  columns={columns}
  keyField="id"
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  bulkActions={
    selectedIds.size > 0 ? (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Выбрано: {selectedIds.size}
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            selectedIds.forEach(id => deleteUser.mutate(id))
            setSelectedIds(new Set())
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Удалить выбранные
        </Button>
      </div>
    ) : null
  }
/>
```

---

## Поиск

### Внутренний поиск (автоматический)

По умолчанию DataTable сам управляет состоянием поиска. Поле поиска рендерится автоматически.

### Внешнее управление поиском

Если нужно управлять поиском из родительского компонента:

```tsx
const [search, setSearch] = useState('')

<DataTable
  data={users}
  columns={columns}
  keyField="id"
  searchValue={search}
  onSearchChange={setSearch}
/>

// Поиск можно сбросить извне:
<Button onClick={() => setSearch('')}>Сбросить фильтры</Button>
```

---

## Открытие панели при клике на строку

```tsx
const { open: openPanel, setSelectedId } = usePanelStore()

<DataTable
  data={users}
  columns={columns}
  keyField="id"
  onRowClick={(row) => {
    setSelectedId(row.id)
    openPanel()
  }}
/>
```

---

## Полный пример страницы с DataTable

```tsx
// src/pages/users/index.tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

import { PageHeader } from '@/shared/ui/page-header'
import { SectionCard } from '@/shared/ui/section-card'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { StatusBadge } from '@/shared/ui/status-badge'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { PageLoader } from '@/shared/ui/states/page-loader'
import { PageError } from '@/shared/ui/states/page-error'

import { useUsers, useDeleteUser } from '@/entities/user/model/user.queries'
import { CreateUserForm } from '@/features/user/create-user/ui/create-user-form'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/shared/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 as TrashIcon } from 'lucide-react'

export default function UsersPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const { data: users = [], isLoading, isError, refetch } = useUsers()
  const deleteUser = useDeleteUser()

  if (isLoading) return <PageLoader />
  if (isError) return <PageError onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Пользователи"
        description={`${users.length} записей`}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Добавить</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Новый пользователь</DialogTitle></DialogHeader>
              <CreateUserForm onSuccess={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <SectionCard>
        <DataTable
          data={users}
          keyField="id"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          columns={[
            { key: 'name', header: 'Имя', sortable: true },
            { key: 'email', header: 'Email', sortable: true },
            { key: 'team', header: 'Команда', sortable: true },
            {
              key: 'status',
              header: 'Статус',
              cell: (row) => (
                <StatusBadge
                  label={row.status === 'active' ? 'Активен' : 'Неактивен'}
                  variant={row.status === 'active' ? 'success' : 'neutral'}
                />
              ),
            },
          ]}
          rowActions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteTarget(row.id)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          bulkActions={
            selectedIds.size > 0 ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  selectedIds.forEach(id => deleteUser.mutate(id))
                  setSelectedIds(new Set())
                  toast.success(`Удалено ${selectedIds.size} записей`)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить ({selectedIds.size})
              </Button>
            ) : null
          }
        />
      </SectionCard>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить пользователя?"
        description="Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        isLoading={deleteUser.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteUser.mutate(deleteTarget, {
            onSuccess: () => {
              setDeleteTarget(null)
              toast.success('Пользователь удалён')
            },
          })
        }}
      />
    </div>
  )
}
```
