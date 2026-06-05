# UI-компоненты — полный справочник

Все компоненты в `src/shared/ui/`. Построены на Radix UI + Tailwind. Не нужно устанавливать дополнительные пакеты — всё уже есть.

---

## Button

```tsx
import { Button } from '@/shared/ui/button'

// Варианты (variant):
<Button variant="default">Основная</Button>
<Button variant="secondary">Вторичная</Button>
<Button variant="outline">Контур</Button>
<Button variant="ghost">Призрак</Button>
<Button variant="destructive">Удалить</Button>
<Button variant="link">Ссылка</Button>

// Размеры (size):
<Button size="sm">Маленькая</Button>
<Button size="default">Стандарт</Button>
<Button size="lg">Большая</Button>
<Button size="icon">⚙</Button>  {/* квадратная для иконок */}

// Состояния:
<Button disabled>Заблокирована</Button>
<Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Загрузка</Button>

// С иконкой:
<Button><Plus className="mr-2 h-4 w-4" /> Добавить</Button>
<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Экспорт</Button>
```

---

## Input / Textarea

```tsx
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

<Input placeholder="Введите email" type="email" />
<Input disabled value="Только чтение" />
<Input className="border-red-500" />  {/* кастомный цвет при ошибке */}

<Textarea placeholder="Описание..." rows={4} />
```

---

## Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

<Select onValueChange={(value) => setValue('role', value)}>
  <SelectTrigger>
    <SelectValue placeholder="Выберите роль" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Администратор</SelectItem>
    <SelectItem value="manager">Менеджер</SelectItem>
    <SelectItem value="user">Пользователь</SelectItem>
  </SelectContent>
</Select>
```

---

## Checkbox / Switch / Label

```tsx
import { Checkbox } from '@/shared/ui/checkbox'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'

{/* Checkbox */}
<div className="flex items-center gap-2">
  <Checkbox id="agree" checked={agreed} onCheckedChange={setAgreed} />
  <Label htmlFor="agree">Согласен с условиями</Label>
</div>

{/* Switch */}
<div className="flex items-center gap-2">
  <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
  <Label htmlFor="notifications">Уведомления</Label>
</div>
```

---

## Badge

```tsx
import { Badge } from '@/shared/ui/badge'

<Badge>По умолчанию</Badge>
<Badge variant="secondary">Вторичный</Badge>
<Badge variant="destructive">Ошибка</Badge>
<Badge variant="outline">Контур</Badge>
```

---

## StatusBadge — цветные статусы

Специальный компонент для бизнес-статусов, использует `label` (не `children`):

```tsx
import { StatusBadge } from '@/shared/ui/status-badge'

<StatusBadge label="Активен" variant="success" />     // зелёный
<StatusBadge label="Предупреждение" variant="warning" /> // жёлтый
<StatusBadge label="Ошибка" variant="error" />        // красный
<StatusBadge label="Информация" variant="info" />     // синий
<StatusBadge label="Неактивен" variant="neutral" />   // серый

// Пример в таблице:
{
  key: 'status',
  header: 'Статус',
  cell: (row) => {
    const map: Record<UserStatus, { label: string; variant: StatusBadgeVariant }> = {
      active: { label: 'Активен', variant: 'success' },
      inactive: { label: 'Неактивен', variant: 'neutral' },
      blocked: { label: 'Заблокирован', variant: 'error' },
    }
    return <StatusBadge {...map[row.status]} />
  }
}
```

---

## MetricCard — KPI-карточка

```tsx
import { MetricCard } from '@/shared/ui/metric-card'
import { Users } from 'lucide-react'

<MetricCard
  title="Пользователей"
  value="1 284"
  description="Всего в системе"
  trend={{ value: 12, direction: 'up' }}  // +12% вверх (зелёный)
  icon={<Users className="h-5 w-5" />}
/>

// Тренд вниз:
trend={{ value: 5, direction: 'down' }}   // -5% вниз (красный)

// Без тренда:
<MetricCard title="Версия" value="2.1.4" description="Текущая версия API" />
```

---

## PageHeader — заголовок страницы

```tsx
import { PageHeader } from '@/shared/ui/page-header'

// Простой
<PageHeader title="Пользователи" />

// С описанием
<PageHeader title="Пользователи" description="Управление учётными записями" />

// С кнопками (справа)
<PageHeader
  title="Заявки"
  description="Список обращений"
  actions={
    <div className="flex gap-2">
      <Button variant="outline"><Download className="mr-2 h-4 w-4" />Экспорт</Button>
      <Button><Plus className="mr-2 h-4 w-4" />Новая заявка</Button>
    </div>
  }
/>
```

---

## SectionCard — карточка-секция

Используется как контейнер для блоков на странице:

```tsx
import { SectionCard } from '@/shared/ui/section-card'

// Просто обёртка
<SectionCard>
  <p>Любой контент</p>
</SectionCard>

// С заголовком
<SectionCard title="Последние события">
  ...
</SectionCard>

// С заголовком, описанием и кнопкой в заголовке
<SectionCard
  title="Пользователи"
  description="Недавно добавленные"
  headerAction={<Button variant="ghost" size="sm">Все →</Button>}
>
  ...
</SectionCard>
```

---

## SearchInput — поле поиска

```tsx
import { SearchInput } from '@/shared/ui/search-input'

const [search, setSearch] = useState('')

<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="Поиск по имени..."
/>

// Кнопка × автоматически появляется когда есть текст
// и вызывает onChange('') при нажатии
```

---

## Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'

<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>
    {user.name.slice(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

---

## Dialog — модальное окно

```tsx
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
  DialogTrigger
} from '@/shared/ui/dialog'

// Вариант 1: управляемый через open/onOpenChange (рекомендуется)
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Открыть</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Заголовок диалога</DialogTitle>
      <DialogDescription>Описание под заголовком</DialogDescription>
    </DialogHeader>

    {/* Тело диалога */}
    <p>Контент</p>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
      <Button onClick={handleSave}>Сохранить</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## ConfirmDialog — диалог подтверждения

```tsx
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

<ConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Удалить пользователя?"
  description="Это действие нельзя отменить. Пользователь будет удалён навсегда."
  confirmLabel="Удалить"
  cancelLabel="Отмена"
  variant="destructive"    // красная кнопка подтверждения
  isLoading={deleteUser.isPending}
  onConfirm={() => {
    deleteUser.mutate(targetId, {
      onSuccess: () => { setConfirmOpen(false); toast.success('Удалено') }
    })
  }}
/>
```

---

## DropdownMenu

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator
} from '@/shared/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleEdit(row)}>
      <Pencil className="mr-2 h-4 w-4" /> Редактировать
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-destructive"
      onClick={() => handleDelete(row.id)}
    >
      <Trash2 className="mr-2 h-4 w-4" /> Удалить
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon">
      <Info className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Подсказка с объяснением</p>
  </TooltipContent>
</Tooltip>
```

---

## Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">Основное</TabsTrigger>
    <TabsTrigger value="security">Безопасность</TabsTrigger>
    <TabsTrigger value="notifications">Уведомления</TabsTrigger>
  </TabsList>

  <TabsContent value="general">
    <p>Содержимое вкладки «Основное»</p>
  </TabsContent>
  <TabsContent value="security">
    <p>Содержимое вкладки «Безопасность»</p>
  </TabsContent>
</Tabs>
```

---

## Состояния (States)

```tsx
import { EmptyState } from '@/shared/ui/states/empty-state'
import { ErrorState } from '@/shared/ui/states/error-state'
import { PageLoader } from '@/shared/ui/states/page-loader'
import { PageError } from '@/shared/ui/states/page-error'

// Ничего не найдено
<EmptyState
  title="Заявок нет"
  description="Создайте первую заявку, нажав кнопку выше"
  action={<Button onClick={openCreate}>Создать</Button>}
/>

// Ошибка внутри секции
<ErrorState
  title="Не удалось загрузить"
  description="Проверьте соединение и попробуйте снова"
  onRetry={refetch}
/>

// Полный экран загрузки (пока страница инициализируется)
<PageLoader />

// Полный экран ошибки с кнопкой «Повторить»
<PageError onRetry={refetch} />
```

---

## Skeleton — заглушки при загрузке

```tsx
import { Skeleton } from '@/shared/ui/skeleton'

// Строки текста:
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>

// Аватар + строки:
<div className="flex items-center gap-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[150px]" />
    <Skeleton className="h-4 w-[100px]" />
  </div>
</div>

// Карточки:
<div className="grid grid-cols-4 gap-4">
  {Array.from({ length: 4 }).map((_, i) => (
    <Skeleton key={i} className="h-32 rounded-lg" />
  ))}
</div>
```

---

## Separator

```tsx
import { Separator } from '@/shared/ui/separator'

<Separator />                            {/* горизонтальный */}
<Separator orientation="vertical" />    {/* вертикальный */}
<Separator className="my-4" />          {/* с отступами */}
```

---

## Иконки

Проект использует [Lucide React](https://lucide.dev). Поиск иконки:

```tsx
import {
  Users, Plus, Trash2, Pencil, Search, Settings,
  BarChart2, FileText, ChevronRight, MoreHorizontal,
  Sun, Moon, Monitor, Bell, Check, X, AlertTriangle,
  Download, Upload, RefreshCw, Loader2, Info, Eye,
  Lock, Unlock, ArrowRight, ArrowLeft, Home, LogOut
} from 'lucide-react'

// Использование:
<Users className="h-4 w-4" />          // маленькая в тексте
<Users className="h-5 w-5" />          // стандартная
<Users className="h-8 w-8" />          // большая
<Loader2 className="h-4 w-4 animate-spin" />  // крутящаяся
```
