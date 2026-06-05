# Руководство: использование проекта на хакатоне

Ты единственный фронтендер. Нейросетей нет. Бэкендеры дают API.
Вот как работать с этим проектом максимально эффективно.

---

## Часть 1. Подготовка рабочего места (до хакатона)

### 1.1 Скопировать себе проект

```bash
# Вариант 1: просто скопировать папку
xcopy /E /I frontend-starter-kit мой-хакатон-проект

# Вариант 2: если используешь git
git clone <твой-remote-репо> мой-хакатон-проект
# или создать новый репо из текущего
cd мой-хакатон-проект
git remote add origin <url-нового-репо>
git push -u origin master
```

### 1.2 Первый запуск

```bash
cd мой-хакатон-проект
npm install
npm run dev
```

Если открывается http://localhost:5173 и ты видишь страницу логина — всё готово.

### 1.3 Настройка под задачу

**Что менять сразу:**
1. `src/app/styles/globals.css` — поменяй цвета (`--primary`, `--background` и т.д.)
2. `src/widgets/app-shell/config/nav-items.ts` — замени пункты меню под твой продукт
3. `src/shared/config/route-paths.ts` — переименуй маршруты под задачу
4. `README.md` — название проекта

**Что НЕ трогать в начале:**
- Провайдеры (`src/app/providers/`)
- Guard-компоненты
- Базовые UI-компоненты (`src/shared/ui/`)

---

## Часть 2. Работа с макетом — как переносить верстку

### 2.1 Принцип работы

Каждый экран = страница в `src/pages/`.
Каждая страница = набор компонентов из `src/shared/ui/` + бизнес-данные.

**Алгоритм:**
1. Смотришь макет
2. Определяешь, какие UI-компоненты там нужны (из `/ui-kit` в браузере или Storybook)
3. Открываешь нужную страницу в `src/pages/`
4. Собираешь из компонентов

### 2.2 Пример: нужно сделать страницу «Список заявок»

```tsx
// src/pages/requests/index.tsx
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { StatusBadge } from '@/shared/ui/status-badge'
import { SectionCard } from '@/shared/ui/section-card'

// Временные mock-данные — можно накидать руками
const MOCK_REQUESTS = [
  { id: '1', title: 'Заявка #1', status: 'active', date: '2025-01-01' },
  { id: '2', title: 'Заявка #2', status: 'warning', date: '2025-01-02' },
]

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Заявки" description="Список всех заявок" />
      <SectionCard>
        <DataTable
          data={MOCK_REQUESTS}
          columns={[
            { key: 'title', header: 'Название', sortable: true },
            { key: 'date', header: 'Дата', sortable: true },
            {
              key: 'status',
              header: 'Статус',
              cell: (row) => (
                <StatusBadge
                  label={row.status === 'active' ? 'Активна' : 'Ожидание'}
                  variant={row.status === 'active' ? 'success' : 'warning'}
                />
              ),
            },
          ]}
          keyField="id"
        />
      </SectionCard>
    </div>
  )
}
```

### 2.3 Подключить страницу к роутеру

Открыть `src/app/routes/router.tsx`, найти блок с `children` у AppShell и добавить:

```tsx
{
  path: ROUTES.REQUESTS,           // добавить в route-paths.ts
  lazy: async () => {
    const { default: C } = await import('@/pages/requests')
    return { Component: C }
  },
},
```

Добавить в `src/shared/config/route-paths.ts`:
```ts
REQUESTS: '/requests',
```

Добавить пункт меню в `src/widgets/app-shell/config/nav-items.ts`:
```ts
{ title: 'Заявки', href: ROUTES.REQUESTS, icon: FileText, permission: 'requests:read' },
```

### 2.4 Готовые компоненты на каждый случай

| Нужно | Компонент |
|-------|-----------|
| Список с поиском | `<DataTable>` |
| Карточка с метрикой | `<MetricCard>` |
| Секция страницы | `<SectionCard>` |
| Заголовок страницы | `<PageHeader>` |
| Диалог подтверждения | `<ConfirmDialog>` |
| Боковая панель с деталями | `<DetailsPanel>` |
| График | `<LineChart>` / `<BarChart>` / `<AreaChart>` / `<DonutChart>` |
| Форма с валидацией | `react-hook-form` + `zod` + `<FormFieldWrapper>` |
| Поиск | `<SearchInput>` |
| Статус строки | `<StatusBadge>` |
| Пустой список | `<EmptyState>` |
| Ошибка загрузки | `<ErrorState>` |

### 2.5 Tailwind-шпаргалка

```tsx
// Сетка 2 колонки → 4 колонки
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

// Карточка с паддингом
<div className="rounded-lg border bg-card p-6">

// Flex с выравниванием
<div className="flex items-center justify-between gap-4">

// Текст приглушённый
<p className="text-sm text-muted-foreground">

// Кнопка с иконкой
<Button><Plus className="mr-2 h-4 w-4" /> Добавить</Button>

// Отступы между секциями
<div className="space-y-6"> ... </div>
```

---

## Часть 3. Подключение к бэкенду

### 3.1 Как работает сейчас (mock)

Сейчас данные берутся из `*/model/mock-data.ts` через `mockRequest()`.
Все запросы идут через TanStack Query. Axios настроен на `baseURL: '/api'`.

### 3.2 Переключить одну сущность на реальный API

Пример: переключить `users` с mock на реальный backend.

**Шаг 1.** Открыть `src/entities/user/api/user.api.ts`

Сейчас там что-то вроде:
```ts
getUsers: async () => mockList(MOCK_USERS)
```

Заменить на:
```ts
import { axiosInstance } from '@/shared/api/axios-instance'

export const userApi = {
  getUsers: async () => {
    const { data } = await axiosInstance.get<User[]>('/users')
    return data
  },
  createUser: async (payload: CreateUserPayload) => {
    const { data } = await axiosInstance.post<User>('/users', payload)
    return data
  },
  deleteUser: async (id: string) => {
    await axiosInstance.delete(`/users/${id}`)
    return id
  },
}
```

**Шаг 2.** Настроить базовый URL

В `src/shared/api/axios-instance.ts` поменяй `baseURL`:
```ts
baseURL: 'http://localhost:8000/api'  // адрес бэкенда
// или через env:
baseURL: import.meta.env.VITE_API_URL ?? '/api'
```

Создать `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

**Шаг 3.** Всё остальное работает без изменений — хуки, компоненты, таблицы.

### 3.3 Auth token

Если бэкенд возвращает JWT-токен при логине:

Открыть `src/features/auth/login/ui/login-form.tsx`, найти блок `onSubmit`.
Сейчас он использует `findMockUser`. Заменить на:
```ts
const onSubmit = async (data: LoginFormValues) => {
  try {
    const response = await axiosInstance.post('/auth/login', data)
    const { token, user } = response.data
    setSession({
      user,
      token,
      permissions: ROLE_PERMISSIONS[user.role],
    })
    navigate(ROUTES.DASHBOARD)
  } catch {
    setError('root', { message: 'Неверный email или пароль' })
  }
}
```

Токен автоматически будет добавляться в заголовок `Authorization: Bearer <token>` —
это уже настроено в `src/shared/api/axios-instance.ts`.

### 3.4 CORS на dev

Если бэкенд на другом порту — вместо правки CORS на сервере лучше проксировать через Vite.

`vite.config.ts`:
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

Тогда запросы на `/api/users` будут проксироваться на `http://localhost:8000/users`.

### 3.5 Типы данных от бэкенда

Если бэкенд возвращает другую структуру — исправь типы в `*/model/types.ts`.
Например, если бэкенд возвращает `created_at` вместо `createdAt`:

```ts
// src/entities/user/model/types.ts
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  team: string
  created_at: string  // поменял
}
```

И обнови `columns` в `src/pages/tables/index.tsx`:
```ts
{ key: 'created_at', header: 'Дата создания', sortable: true }
```

---

## Часть 4. Деплой (если успеешь)

### 4.1 Netlify Drop (самый быстрый способ — 2 минуты)

1. `npm run build` — создаст папку `dist/`
2. Открыть https://app.netlify.com/drop
3. Перетащить папку `dist/` в браузер
4. Получить публичный URL вида `https://random-name.netlify.app`

Проблема: SPA-роутинг сломается при обновлении страницы.
Решение: создать файл `public/_redirects`:
```
/*    /index.html   200
```

### 4.2 Vercel CLI

```bash
npm install -g vercel
vercel
```

Следовать интерактивным подсказкам. Vercel автоматически определяет Vite и настраивает SPA.

### 4.3 Если есть сервер с Docker

```dockerfile
# Dockerfile
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
    try_files $uri $uri/ /index.html;
  }
}
```

```bash
docker build -t hackathon-frontend .
docker run -p 80:80 hackathon-frontend
```

---

## Часть 5. Быстрые рецепты на хакатоне

### Добавить новую сущность (например, «Продукт»)

1. Создать `src/entities/product/model/types.ts` — интерфейс Product
2. Создать `src/entities/product/model/mock-data.ts` — тестовые данные
3. Создать `src/entities/product/api/product.api.ts` — CRUD через mockRequest или axios
4. Создать `src/entities/product/model/product.queries.ts` — TanStack Query хуки
5. Создать `src/pages/products/index.tsx` — страница с DataTable
6. Добавить маршрут в роутер + пункт в меню

### Добавить форму создания

1. Создать `src/features/product/create-product/model/schema.ts` — zod схема
2. Создать `src/features/product/create-product/ui/create-product-form.tsx` — форма
3. Вставить в Dialog или DetailsPanel на странице

### Сделать страницу за 10 минут (только читаемые данные)

```tsx
// src/pages/products/index.tsx
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
        columns={[
          { key: 'name', header: 'Название', sortable: true },
          { key: 'price', header: 'Цена', sortable: true },
        ]}
        keyField="id"
      />
    </div>
  )
}
```

### Изменить палитру цветов

`src/app/styles/globals.css`, строки `:root { ... }`:
```css
--primary: 262.1 83.3% 57.8%;          /* фиолетовый */
--primary: 221.2 83.2% 53.3%;          /* синий (дефолт) */
--primary: 142.1 76.2% 36.3%;          /* зелёный */
--primary: 24.6 95% 53.1%;             /* оранжевый */
```

Поменять нужно `DEFAULT` и `foreground` пару.

---

## Структура проекта — шпаргалка

```
src/
├── app/           НЕ ТРОГАТЬ без нужды (провайдеры, роутер, стили)
├── pages/         СЮДА добавлять новые страницы
├── widgets/       app-shell и details-panel — можно использовать как есть
├── features/      СЮДА — действия пользователя (формы, CRUD)
├── entities/      СЮДА — новые бизнес-сущности (types + api + queries)
└── shared/
    ├── api/       axios + mockRequest — НЕ ТРОГАТЬ
    ├── config/    route-paths.ts — добавлять новые маршруты
    ├── lib/       cn.ts — НЕ ТРОГАТЬ
    └── ui/        готовые компоненты — ИСПОЛЬЗОВАТЬ, не писать заново
```
