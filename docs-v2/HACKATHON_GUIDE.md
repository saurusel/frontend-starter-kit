# Полное руководство по работе с проектом на хакатоне

---

## Содержание

1. [Что здесь есть — обзор за 2 минуты](#1-что-здесь-есть)
2. [Первые 10 минут — настройка под задачу](#2-первые-10-минут)
3. [Как добавить новую страницу](#3-новая-страница)
4. [Как собрать страницу из компонентов](#4-собрать-страницу)
5. [Подключение к бэкенду](#5-подключение-к-бэкенду)
6. [Формы и создание данных](#6-формы)
7. [Частые задачи — быстрые рецепты](#7-рецепты)
8. [Деплой](#8-деплой)
9. [Что где лежит — шпаргалка](#9-структура)

---

## 1. Что здесь есть

Это готовый каркас React-приложения с авторизацией, темой, таблицами, графиками и формами. Твоя задача — добавить страницы под задачу хакатона и подключить API бэкенда.

### Что уже сделано — не трогай

| Что | Где |
|-----|-----|
| Вход/выход, роли, права | `src/features/auth/`, `src/entities/session/` |
| Layout (меню + шапка) | `src/widgets/app-shell/` |
| Тёмная тема | `src/app/providers/theme-provider.tsx` |
| Все UI-компоненты | `src/shared/ui/` |
| Axios с токеном | `src/shared/api/axios-instance.ts` |
| TanStack Query | `src/app/providers/query-provider.tsx` |
| Zustand stores | `src/entities/session/model/session-store.ts` |

### Что делаешь ты

1. Меняешь пункты меню под задачу
2. Создаёшь страницы в `src/pages/`
3. Добавляешь сущности в `src/entities/`
4. Пишешь формы в `src/features/`
5. Подключаешь API бэкенда

---

## 2. Первые 10 минут

### 2.1 Установить и запустить

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 2.2 Поменять меню

Файл: `src/widgets/app-shell/config/nav-items.ts`

```ts
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react'
import { ROUTES } from '@/shared/config/route-paths'

// Оставь только нужные пункты. Иконки — с https://lucide.dev
export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Дашборд',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    permission: 'dashboard:read',  // кто видит этот пункт
  },
  {
    title: 'Заявки',
    href: '/requests',             // твой новый маршрут
    icon: FileText,
    permission: 'dashboard:read',  // временно — любое уже существующее право
  },
  // ... остальные
]
```

### 2.3 Поменять маршруты

Файл: `src/shared/config/route-paths.ts`

```ts
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  REQUESTS: '/requests',   // ← добавить свои
  PRODUCTS: '/products',
  // ...
} as const
```

### 2.4 Поменять цвет (опционально)

Файл: `src/app/styles/globals.css`, строка `--primary`:

```css
/* Синий (дефолт) */    --primary: 221.2 83.2% 53.3%;
/* Фиолетовый */        --primary: 262.1 83.3% 57.8%;
/* Зелёный */           --primary: 142.1 76.2% 36.3%;
/* Оранжевый */         --primary: 24.6 95% 53.1%;
```

Поменять и в блоке `.dark` тоже.

---

## 3. Новая страница

### Шаг 1. Создать файл

```tsx
// src/pages/requests/index.tsx
export default function RequestsPage() {
  return <div>Заявки — заглушка</div>
}
```

### Шаг 2. Подключить к роутеру

Файл: `src/app/routes/router.tsx`

Найди массив `children` у объекта с `element: <AppShell />`:

```tsx
{
  path: ROUTES.REQUESTS,
  lazy: async () => {
    const { default: C } = await import('@/pages/requests')
    return { Component: C }
  },
},
```

Так страница загружается лениво — основной бандл меньше.

### Шаг 3. Проверить

Перейти на http://localhost:5173/requests — должна показаться заглушка.

---

## 4. Собрать страницу из компонентов

### Типичная страница со списком

```tsx
// src/pages/requests/index.tsx
import { useState } from 'react'
import { Plus } from 'lucide-react'

import { PageHeader }    from '@/shared/ui/page-header'
import { SectionCard }   from '@/shared/ui/section-card'
import { Button }        from '@/shared/ui/button'
import { DataTable }     from '@/shared/ui/data-table/data-table'
import { StatusBadge }   from '@/shared/ui/status-badge'
import { PageLoader }    from '@/shared/ui/states/page-loader'
import { PageError }     from '@/shared/ui/states/page-error'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

import { useRequests, useDeleteRequest } from '@/entities/request/model/request.queries'
import { CreateRequestForm } from '@/features/request/create-request/ui/create-request-form'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/shared/ui/dialog'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from '@/shared/ui/dropdown-menu'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function RequestsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data = [], isLoading, isError, refetch } = useRequests()
  const deleteRequest = useDeleteRequest()

  if (isLoading) return <PageLoader />
  if (isError) return <PageError onRetry={refetch} />

  return (
    <div className="space-y-6">

      {/* Заголовок */}
      <PageHeader
        title="Заявки"
        description={`${data.length} записей`}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Новая заявка</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Новая заявка</DialogTitle></DialogHeader>
              <CreateRequestForm onSuccess={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Таблица */}
      <SectionCard>
        <DataTable
          data={data}
          keyField="id"
          columns={[
            { key: 'title',     header: 'Название',  sortable: true },
            { key: 'authorId',  header: 'Автор',     sortable: true },
            { key: 'createdAt', header: 'Дата',      sortable: true,
              cell: (row) => new Date(row.createdAt).toLocaleDateString('ru-RU') },
            { key: 'status', header: 'Статус',
              cell: (row) => {
                const map = {
                  new:         { label: 'Новая',      variant: 'info' },
                  in_progress: { label: 'В работе',   variant: 'warning' },
                  done:        { label: 'Выполнена',  variant: 'success' },
                  cancelled:   { label: 'Отменена',   variant: 'error' },
                } as const
                const s = map[row.status as keyof typeof map] ?? { label: row.status, variant: 'neutral' }
                return <StatusBadge label={s.label} variant={s.variant} />
              }
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
                  <Trash2 className="mr-2 h-4 w-4" />Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </SectionCard>

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить заявку?"
        description="Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        isLoading={deleteRequest.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteRequest.mutate(deleteTarget, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Удалено') }
          })
        }}
      />
    </div>
  )
}
```

---

## 5. Подключение к бэкенду

### 5.1 Узнай у бэкендеров

- Адрес сервера: например `http://192.168.1.50:8080`
- Эндпоинты: `GET /api/requests`, `POST /api/requests`, `DELETE /api/requests/:id`
- Структуру объекта в JSON

### 5.2 Настроить адрес (один раз)

**Вариант А — через `.env.local`** (создай в корне проекта):

```env
VITE_API_URL=http://192.168.1.50:8080/api
```

Открой `src/shared/api/axios-instance.ts` и убедись что:

```ts
baseURL: import.meta.env.VITE_API_URL ?? '/api',
```

**Вариант Б — Vite proxy** (решает CORS, рекомендуется):

В `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://192.168.1.50:8080',
      changeOrigin: true,
      // Если бэкенд ожидает /requests (без /api):
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

Тогда `baseURL: '/api'` в axios-instance оставь как есть.

### 5.3 Написать API-файл

Создай `src/entities/request/api/request.api.ts`:

```ts
import { axiosInstance } from '@/shared/api/axios-instance'
import type { Request, CreateRequestPayload } from '../model/types'

export const requestApi = {
  getAll: async (): Promise<Request[]> => {
    const { data } = await axiosInstance.get('/requests')
    return data
  },

  getById: async (id: string): Promise<Request> => {
    const { data } = await axiosInstance.get(`/requests/${id}`)
    return data
  },

  create: async (payload: CreateRequestPayload): Promise<Request> => {
    const { data } = await axiosInstance.post('/requests', payload)
    return data
  },

  update: async (id: string, patch: Partial<Request>): Promise<Request> => {
    const { data } = await axiosInstance.patch(`/requests/${id}`, patch)
    return data
  },

  delete: async (id: string): Promise<string> => {
    await axiosInstance.delete(`/requests/${id}`)
    return id
  },
}
```

### 5.4 Написать хуки

Создай `src/entities/request/model/request.queries.ts`:

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestApi } from '../api/request.api'
import type { Request, CreateRequestPayload } from './types'

const keys = {
  all:    ['requests'] as const,
  lists:  () => [...keys.all, 'list'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function useRequests() {
  return useQuery({ queryKey: keys.lists(), queryFn: requestApi.getAll })
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => requestApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: requestApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useUpdateRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<Request> & { id: string }) =>
      requestApi.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDeleteRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: requestApi.delete,
    // Оптимистичное удаление:
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: keys.all })
      const prev = qc.getQueryData(keys.lists())
      qc.setQueryData(keys.lists(), (old: Request[]) => old?.filter(r => r.id !== id))
      return { prev }
    },
    onError: (_e, _id, ctx) => qc.setQueryData(keys.lists(), ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}
```

### 5.5 Использовать в странице

```tsx
import { useRequests, useDeleteRequest } from '@/entities/request/model/request.queries'

const { data = [], isLoading, isError, refetch } = useRequests()
const deleteRequest = useDeleteRequest()
```

Данные теперь берутся с реального сервера.

### 5.6 Авторизация через бэкенд

Файл: `src/features/auth/login/ui/login-form.tsx`

Найди функцию `onSubmit` и замени блок логина:

```ts
const onSubmit = async (data: LoginFormValues) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email: data.email,
      password: data.password,
    })
    const { user, token } = response.data
    setSession({
      user,
      token,
      permissions: ROLE_PERMISSIONS[user.role as UserRole] ?? [],
    })
    navigate(ROUTES.DASHBOARD)
  } catch {
    setError('root', { message: 'Неверный email или пароль' })
  }
}
```

Токен автоматически добавляется в каждый следующий запрос.

---

## 6. Формы

### Создать форму (полный паттерн)

#### Шаг 1. Схема валидации

```ts
// src/features/request/create-request/model/schema.ts
import { z } from 'zod'

export const createRequestSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(100),
  description: z.string().min(10, 'Минимум 10 символов'),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Выберите приоритет' }),
})

export type CreateRequestValues = z.infer<typeof createRequestSchema>
```

#### Шаг 2. Компонент формы

```tsx
// src/features/request/create-request/ui/create-request-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Input }            from '@/shared/ui/input'
import { Textarea }         from '@/shared/ui/textarea'
import { Button }           from '@/shared/ui/button'
import { FormFieldWrapper } from '@/shared/ui/form-section'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useCreateRequest } from '@/entities/request/model/request.queries'
import { createRequestSchema, type CreateRequestValues } from '../model/schema'

interface Props {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateRequestForm({ onSuccess, onCancel }: Props) {
  const createRequest = useCreateRequest()
  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestValues>({ resolver: zodResolver(createRequestSchema) })

  const priority = watch('priority')

  const onSubmit = async (data: CreateRequestValues) => {
    try {
      await createRequest.mutateAsync(data)
      toast.success('Заявка создана')
      onSuccess?.()
    } catch {
      toast.error('Не удалось создать заявку')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldWrapper label="Название" required error={errors.title?.message}>
        <Input placeholder="Краткое название" {...register('title')} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Описание" required error={errors.description?.message}>
        <Textarea placeholder="Подробное описание..." rows={3} {...register('description')} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Приоритет" required error={errors.priority?.message}>
        <Select
          value={priority}
          onValueChange={(v) => setValue('priority', v as 'low' | 'medium' | 'high', { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Низкий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  )
}
```

#### Шаг 3. Вставить в диалог

```tsx
// В странице requests:
const [createOpen, setCreateOpen] = useState(false)

<Dialog open={createOpen} onOpenChange={setCreateOpen}>
  <DialogTrigger asChild>
    <Button><Plus className="mr-2 h-4 w-4" />Новая заявка</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Новая заявка</DialogTitle></DialogHeader>
    <CreateRequestForm onSuccess={() => setCreateOpen(false)} />
  </DialogContent>
</Dialog>
```

---

## 7. Рецепты

### Добавить KPI-карточки (как на дашборде)

```tsx
import { MetricCard } from '@/shared/ui/metric-card'
import { FileText, Users, CheckCircle, Clock } from 'lucide-react'

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <MetricCard
    title="Всего заявок"
    value={data.length.toString()}
    description="С начала месяца"
    trend={{ value: 8, direction: 'up' }}
    icon={<FileText className="h-5 w-5" />}
  />
  <MetricCard
    title="Выполнено"
    value={data.filter(r => r.status === 'done').length.toString()}
    description="Успешно закрыто"
    trend={{ value: 15, direction: 'up' }}
    icon={<CheckCircle className="h-5 w-5" />}
  />
  <MetricCard
    title="В ожидании"
    value={data.filter(r => r.status === 'new').length.toString()}
    description="Требует обработки"
    icon={<Clock className="h-5 w-5" />}
  />
</div>
```

### Добавить боковую панель с деталями

```tsx
import { DetailsPanel } from '@/widgets/details-panel/ui/details-panel'

const [panelOpen, setPanelOpen] = useState(false)
const [selectedItem, setSelectedItem] = useState<Request | null>(null)

// В DataTable:
onRowClick={(row) => {
  setSelectedItem(row)
  setPanelOpen(true)
}}

// После таблицы:
<DetailsPanel
  open={panelOpen}
  onClose={() => setPanelOpen(false)}
  title={selectedItem?.title ?? ''}
  description={selectedItem?.status}
  size="lg"
>
  {selectedItem && (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-muted-foreground">Описание</p>
        <p>{selectedItem.description}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Создана</p>
        <p>{new Date(selectedItem.createdAt).toLocaleString('ru-RU')}</p>
      </div>
    </div>
  )}
</DetailsPanel>
```

### Добавить graph/chart на страницу

```tsx
import { LineChart, AreaChart, BarChart, DonutChart } from '@/shared/ui/charts'
import { SectionCard } from '@/shared/ui/section-card'

// Данные в формате массива объектов:
const chartData = [
  { date: 'Пн', value: 12 },
  { date: 'Вт', value: 19 },
  { date: 'Ср', value: 8 },
  { date: 'Чт', value: 25 },
  { date: 'Пт', value: 17 },
]

<div className="grid gap-4 lg:grid-cols-2">
  <SectionCard title="Заявки по дням">
    <LineChart
      data={chartData}
      lines={[{ key: 'value', name: 'Заявки' }]}
    />
  </SectionCard>

  <SectionCard title="Распределение по статусам">
    <DonutChart
      data={[
        { name: 'Новые',     value: 30 },
        { name: 'В работе',  value: 45 },
        { name: 'Выполнены', value: 25 },
      ]}
    />
  </SectionCard>
</div>
```

### Получить данные из двух источников

```tsx
// Оба запроса уходят параллельно:
const { data: requests = [], isLoading: loadingRequests } = useRequests()
const { data: users = [],    isLoading: loadingUsers }    = useUsers()

const isLoading = loadingRequests || loadingUsers

if (isLoading) return <PageLoader />
```

### Сделать страницу за 5 минут (только данные, без CRUD)

```tsx
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api/axios-instance'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { PageLoader } from '@/shared/ui/states/page-loader'
import { PageError } from '@/shared/ui/states/page-error'

export default function ProductsPage() {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/products')
      return data
    },
  })

  if (isLoading) return <PageLoader />
  if (isError) return <PageError onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader title="Продукты" />
      <DataTable
        data={data}
        keyField="id"
        columns={[
          { key: 'name',     header: 'Название',  sortable: true },
          { key: 'price',    header: 'Цена',      sortable: true },
          { key: 'category', header: 'Категория', sortable: true },
        ]}
      />
    </div>
  )
}
```

---

## 8. Деплой

### Netlify Drop (самый быстрый — 2 минуты)

```bash
npm run build
# Открыть https://app.netlify.com/drop
# Перетащить папку dist/ в браузер
# Получить ссылку вида https://random-name.netlify.app
```

Чтобы SPA-роутинг работал при обновлении страницы:

```
# public/_redirects
/*    /index.html   200
```

### Vercel

```bash
npm install -g vercel
vercel
# Следовать инструкциям, Vercel сам определит Vite
```

### Docker + nginx

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;  # SPA routing
  }
}
```

```bash
docker build -t myapp .
docker run -p 80:80 myapp
```

---

## 9. Структура — шпаргалка

```
src/
│
├── app/                   ⛔ НЕ ТРОГАТЬ
│   ├── providers/         Провайдеры (Query, Theme, PWA)
│   ├── routes/
│   │   ├── router.tsx     ✅ ДОБАВЛЯТЬ новые маршруты
│   │   └── guards/        RequireAuth, RequirePermission
│   └── styles/globals.css ✅ МЕНЯТЬ цвета (--primary)
│
├── pages/                 ✅ СОЗДАВАТЬ новые страницы
│   ├── dashboard/
│   ├── requests/          ← твои новые страницы
│   └── ...
│
├── widgets/
│   ├── app-shell/
│   │   └── config/
│   │       └── nav-items.ts  ✅ МЕНЯТЬ пункты меню
│   └── details-panel/
│
├── features/              ✅ СОЗДАВАТЬ формы и действия
│   └── request/
│       └── create-request/
│
├── entities/              ✅ СОЗДАВАТЬ бизнес-сущности
│   └── request/
│       ├── api/request.api.ts          Axios-запросы
│       ├── model/types.ts              Интерфейсы
│       ├── model/mock-data.ts          Тестовые данные
│       └── model/request.queries.ts   TanStack Query хуки
│
└── shared/
    ├── api/
    │   └── axios-instance.ts  ✅ ПОМЕНЯТЬ baseURL под бэкенд
    ├── config/
    │   └── route-paths.ts     ✅ ДОБАВЛЯТЬ маршруты
    └── ui/                    ✅ ИСПОЛЬЗОВАТЬ готовые компоненты
```

---

## Компоненты — шпаргалка «нужно → использую»

| Задача | Компонент | Откуда |
|--------|-----------|--------|
| Заголовок страницы | `<PageHeader>` | `@/shared/ui/page-header` |
| Карточка-блок | `<SectionCard>` | `@/shared/ui/section-card` |
| KPI с трендом | `<MetricCard>` | `@/shared/ui/metric-card` |
| Таблица с поиском | `<DataTable>` | `@/shared/ui/data-table/data-table` |
| Цветной статус | `<StatusBadge label="" variant="">` | `@/shared/ui/status-badge` |
| Поле поиска | `<SearchInput>` | `@/shared/ui/search-input` |
| Боковая панель | `<DetailsPanel>` | `@/widgets/details-panel/ui/details-panel` |
| Модальное окно | `<Dialog>` + содержимое | `@/shared/ui/dialog` |
| Диалог «Вы уверены?» | `<ConfirmDialog>` | `@/shared/ui/confirm-dialog` |
| Линейный график | `<LineChart>` | `@/shared/ui/charts` |
| Столбчатый график | `<BarChart>` | `@/shared/ui/charts` |
| Площадной график | `<AreaChart>` | `@/shared/ui/charts` |
| Пончик-диаграмма | `<DonutChart>` | `@/shared/ui/charts` |
| Уведомление | `toast.success('...')` | `sonner` |
| Загрузка страницы | `<PageLoader>` | `@/shared/ui/states/page-loader` |
| Ошибка страницы | `<PageError onRetry={}>` | `@/shared/ui/states/page-error` |
| «Ничего не найдено» | `<EmptyState>` | `@/shared/ui/states/empty-state` |
| Заглушка загрузки | `<Skeleton>` | `@/shared/ui/skeleton` |
| Поле ввода | `<Input>` | `@/shared/ui/input` |
| Многострочное поле | `<Textarea>` | `@/shared/ui/textarea` |
| Выпадающий список | `<Select>` | `@/shared/ui/select` |
| Меню действий | `<DropdownMenu>` | `@/shared/ui/dropdown-menu` |
| Кнопка | `<Button variant="" size="">` | `@/shared/ui/button` |
| Вкладки | `<Tabs>` | `@/shared/ui/tabs` |
| Переключатель | `<Switch>` | `@/shared/ui/switch` |
| Флажок | `<Checkbox>` | `@/shared/ui/checkbox` |

---

## Типичные ошибки и как их решить

### «Cannot find module '@/...'»

Неверный путь импорта. Проверь:
```ts
import { Button } from '@/shared/ui/button'  // ✅
import { Button } from '../../../shared/ui/button'  // тоже работает, но хуже
```

### «Type X is not assignable to type Y»

TypeScript ругается на несовпадение типов. Проверь что данные от API совпадают с интерфейсом в `types.ts`. Временное решение — добавить `as unknown as YourType`, но это плохая практика.

### «Cannot read properties of undefined»

Данные ещё не загрузились. Добавь fallback:
```ts
const { data = [] } = useRequests()  // пустой массив по умолчанию
const name = user?.name ?? 'Неизвестно'  // optional chaining
```

### Таблица пустая хотя данные есть

Проверь что в `keyField` передаётся реальное поле с уникальным ID:
```tsx
<DataTable data={items} keyField="id" ... />  // 'id' должен быть в каждом объекте
```

### CORS ошибка в консоли

Настрой proxy в `vite.config.ts` (см. раздел 5.2 Вариант Б).

### Form не валидирует

Select и Checkbox не работают через `register` — используй `Controller` или `setValue`:
```ts
onValueChange={(v) => setValue('field', v, { shouldValidate: true })}
```
