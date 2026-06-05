# DetailsPanel — боковая панель с деталями

`src/widgets/details-panel/` — скользящая панель справа для просмотра и редактирования сущности. Типичное использование: клик на строку в таблице → открывается панель с полными данными.

---

## Быстрый пример

```tsx
import { useState } from 'react'
import { DetailsPanel } from '@/widgets/details-panel/ui/details-panel'
import { Button } from '@/shared/ui/button'

function UsersPage() {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <>
      <DataTable
        data={users}
        onRowClick={(row) => {
          setSelectedUser(row)
          setOpen(true)
        }}
      />

      <DetailsPanel
        open={open}
        onClose={() => setOpen(false)}
        title={selectedUser?.name ?? 'Пользователь'}
        description={selectedUser?.email}
      >
        {selectedUser && (
          <div className="space-y-4 p-4">
            <p>Роль: {selectedUser.role}</p>
            <p>Команда: {selectedUser.team}</p>
            <p>Статус: {selectedUser.status}</p>
          </div>
        )}
      </DetailsPanel>
    </>
  )
}
```

---

## Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `open` | `boolean` | — | Открыта ли панель |
| `onClose` | `() => void` | — | Вызывается при закрытии |
| `title` | `string` | — | Заголовок панели |
| `description` | `string?` | — | Подзаголовок |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Ширина панели |
| `isPinned` | `boolean?` | `false` | Закреплена (не закрывается кликом вне) |
| `onPinChange` | `(pinned: boolean) => void?` | — | Callback изменения pin |
| `isLoading` | `boolean?` | `false` | Spinner внутри панели |
| `error` | `string?` | — | ErrorState внутри панели |
| `footer` | `ReactNode?` | — | Содержимое подвала панели |
| `onPrev` | `() => void?` | — | Кнопка «Предыдущий» |
| `onNext` | `() => void?` | — | Кнопка «Следующий» |
| `children` | `ReactNode` | — | Контент панели |

### Размеры

| Size | Ширина |
|------|--------|
| `sm` | 320px |
| `md` | 480px (дефолт) |
| `lg` | 640px |
| `xl` | 800px |
| `full` | 100% экрана |

---

## Навигация между записями (Prev/Next)

```tsx
const [currentIndex, setCurrentIndex] = useState(0)
const currentUser = users[currentIndex]

<DetailsPanel
  open={open}
  onClose={() => setOpen(false)}
  title={currentUser.name}
  onPrev={currentIndex > 0 ? () => setCurrentIndex(i => i - 1) : undefined}
  onNext={currentIndex < users.length - 1 ? () => setCurrentIndex(i => i + 1) : undefined}
>
  {/* контент */}
</DetailsPanel>
```

Когда `onPrev`/`onNext` не переданы (undefined) — кнопки скрываются автоматически.

---

## Режим Pin (закрепить)

Обычно панель закрывается кликом на оверлей снаружи. При isPinned = true — остаётся открытой:

```tsx
const [isPinned, setIsPinned] = useState(false)

<DetailsPanel
  open={open}
  onClose={() => setOpen(false)}
  title="Детали"
  isPinned={isPinned}
  onPinChange={setIsPinned}
>
  ...
</DetailsPanel>
```

Кнопка булавки рендерится в заголовке панели автоматически когда передан `onPinChange`.

---

## Footer с кнопками действий

```tsx
<DetailsPanel
  open={open}
  onClose={() => setOpen(false)}
  title="Редактирование"
  footer={
    <div className="flex gap-2">
      <Button
        onClick={handleSave}
        disabled={!isDirty || isSaving}
      >
        {isSaving ? 'Сохранение...' : 'Сохранить'}
      </Button>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Отмена
      </Button>
    </div>
  }
>
  {/* форма */}
</DetailsPanel>
```

---

## Предупреждение о несохранённых изменениях

```tsx
const [open, setOpen] = useState(false)
const [confirmClose, setConfirmClose] = useState(false)
const [isDirty, setIsDirty] = useState(false)

function handleClose() {
  if (isDirty) {
    setConfirmClose(true)  // показать диалог
  } else {
    setOpen(false)
  }
}

<>
  <DetailsPanel
    open={open}
    onClose={handleClose}
    title="Редактирование"
    footer={
      <Button onClick={handleSave}>Сохранить</Button>
    }
  >
    <UserEditForm
      user={selectedUser}
      onChange={() => setIsDirty(true)}
      onSaved={() => { setIsDirty(false); setOpen(false) }}
    />
  </DetailsPanel>

  <ConfirmDialog
    open={confirmClose}
    onOpenChange={setConfirmClose}
    title="Закрыть без сохранения?"
    description="Все несохранённые изменения будут потеряны."
    confirmLabel="Закрыть"
    cancelLabel="Продолжить редактирование"
    onConfirm={() => {
      setIsDirty(false)
      setConfirmClose(false)
      setOpen(false)
    }}
  />
</>
```

---

## usePanelStore — глобальное состояние панели

Если нужно управлять панелью из разных компонентов (например, открывать из таблицы и из другой кнопки):

```ts
import { usePanelStore } from '@/widgets/details-panel/model/panel-store'

const {
  isOpen,         // boolean
  isPinned,       // boolean
  selectedId,     // string | null
  open,           // () => void
  close,          // () => void
  togglePin,      // () => void
  setSelectedId,  // (id: string | null) => void
} = usePanelStore()
```

### Пример: открыть панель из таблицы

```tsx
// В таблице:
const { open: openPanel, setSelectedId } = usePanelStore()

<DataTable
  onRowClick={(row) => {
    setSelectedId(row.id)
    openPanel()
  }}
/>

// Отдельный компонент панели:
function UserDetailsPanel() {
  const { isOpen, isPinned, selectedId, close, togglePin } = usePanelStore()
  const { data: user } = useUser(selectedId ?? '')

  return (
    <DetailsPanel
      open={isOpen}
      onClose={close}
      title={user?.name ?? '...'}
      isPinned={isPinned}
      onPinChange={togglePin}
      isLoading={!user && isOpen}
    >
      {user && <UserDetails user={user} />}
    </DetailsPanel>
  )
}
```

---

## Полный пример: просмотр + редактирование

```tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { DetailsPanel } from '@/widgets/details-panel/ui/details-panel'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { FormFieldWrapper } from '@/shared/ui/form-section'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

const editSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
})
type EditValues = z.infer<typeof editSchema>

function UserDetailPanel({ userId, open, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  const { data: user } = useUser(userId)
  const updateUser = useUpdateUser()

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    values: user ? { name: user.name, email: user.email } : undefined,
  })

  const onSubmit = async (data: EditValues) => {
    try {
      await updateUser.mutateAsync({ id: userId, ...data })
      toast.success('Изменения сохранены')
      setIsEditing(false)
      reset(data)
    } catch {
      toast.error('Не удалось сохранить')
    }
  }

  function handleClose() {
    if (isDirty) { setConfirmClose(true); return }
    setIsEditing(false)
    onClose()
  }

  return (
    <>
      <DetailsPanel
        open={open}
        onClose={handleClose}
        title={user?.name ?? 'Пользователь'}
        description={user?.email}
        size="lg"
        footer={
          isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || updateUser.isPending}
              >
                Сохранить
              </Button>
              <Button
                variant="outline"
                onClick={() => { reset(); setIsEditing(false) }}
              >
                Отмена
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
          )
        }
      >
        {user && (
          <div className="space-y-4 p-4">
            {isEditing ? (
              <>
                <FormFieldWrapper label="Имя" error={errors.name?.message} required>
                  <Input {...register('name')} />
                </FormFieldWrapper>
                <FormFieldWrapper label="Email" error={errors.email?.message} required>
                  <Input {...register('email')} type="email" />
                </FormFieldWrapper>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Имя</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Роль</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </>
            )}
          </div>
        )}
      </DetailsPanel>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        title="Закрыть без сохранения?"
        description="Несохранённые изменения будут потеряны."
        confirmLabel="Закрыть"
        onConfirm={() => { reset(); setIsEditing(false); setConfirmClose(false); onClose() }}
      />
    </>
  )
}
```
