# Быстрый старт — подробное руководство

## Требования к системе

| Инструмент | Минимальная версия | Проверка |
|-----------|-------------------|---------|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |
| Git | любая | `git --version` |

Рекомендуется использовать [nvm](https://github.com/nvm-sh/nvm) для управления версиями Node.js.

---

## Установка

```bash
# Клонировать или скопировать проект
git clone https://github.com/saurusel/frontend-starter-kit.git my-project
cd my-project

# Установить зависимости (занимает ~30 секунд)
npm install
```

После установки в корне появится папка `node_modules/` (~200 МБ). Она не коммитится — уже добавлена в `.gitignore`.

---

## Команды

```bash
npm run dev          # Запустить dev-сервер → http://localhost:5173
npm run build        # Собрать для production → папка dist/
npm run preview      # Посмотреть production-сборку → http://localhost:4173
npm run storybook    # Витрина компонентов → http://localhost:6006
npm run lint         # Проверка кода ESLint
npm run typecheck    # Проверка типов TypeScript
```

### Что делает `npm run dev`

Запускает Vite в режиме разработки:
- Hot Module Replacement (HMR) — изменения в файлах отражаются в браузере без перезагрузки страницы
- Source maps — ошибки в браузере ведут на строки исходного кода
- TypeScript проверяется в реальном времени через плагин
- Tailwind CSS генерируется из исходников

### Что делает `npm run build`

1. TypeScript компилируется в JavaScript
2. Vite оптимизирует и минифицирует бандл
3. CSS Tailwind очищается от неиспользуемых классов
4. Результат записывается в `dist/` (~1-2 МБ)

---

## Тестовые учётные записи

| Email | Пароль | Роль | Что можно делать |
|-------|--------|------|-----------------|
| admin@example.com | demo | Администратор | Всё, включая удаление и управление |
| manager@example.com | demo | Менеджер | Таблицы, формы, панели; нет системных настроек |
| user@example.com | demo | Пользователь | Только чтение: дашборд, графики, таблицы |
| guest@example.com | demo | Гость | Только дашборд и графики |

**Быстрый вход:** На странице `/login` есть кнопки «Войти как Администратор/Менеджер/Пользователь» — не нужно вводить email/пароль.

---

## Страницы приложения

| Путь | Доступ | Что показывает |
|------|--------|---------------|
| `/login` | Все | Форма входа с быстрыми кнопками |
| `/dashboard` | Все авторизованные | KPI-карточки, 3 графика, список пользователей |
| `/tables` | admin, manager, user | DataTable: поиск, сортировка, пагинация, CRUD |
| `/charts` | Все авторизованные | 6 типов графиков с переключением периода |
| `/forms` | admin, manager | Примеры форм в Dialog и DetailsPanel |
| `/panels` | admin, manager | DetailsPanel: просмотр, редактирование, навигация |
| `/ui-kit` | Все авторизованные | Все компоненты с примерами использования |
| `/settings` | Все авторизованные | Тема, профиль, уведомления |
| `/access-denied` | — | Страница «Нет доступа» |

---

## Структура файлов верхнего уровня

```
frontend-starter-kit/
│
├── src/                    # Исходный код приложения
├── public/                 # Статические файлы (favicon, pwa-иконки)
├── .storybook/             # Конфигурация Storybook
├── docs/                   # Документация (первая версия)
├── docs-v2/                # Документация (расширенная версия)
├── _specs/                 # Исходные ТЗ для генерации проекта (можно игнорировать)
│
├── vite.config.ts          # Конфигурация Vite + PWA
├── tailwind.config.ts      # Конфигурация Tailwind + кастомные цвета
├── tsconfig.json           # Конфигурация TypeScript
├── tsconfig.app.json       # TypeScript для кода приложения
├── .gitignore              # Игнорируемые файлы
└── package.json            # Зависимости и скрипты
```

---

## Настройка IDE

### VS Code (рекомендуется)

Установить расширения:
- **ESLint** — подсвечивает ошибки прямо в редакторе
- **Tailwind CSS IntelliSense** — автодополнение Tailwind-классов
- **TypeScript** — встроен, убедись что версия >= 5.x

Добавить в `.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Path aliases

В проекте настроен alias `@` → `src/`. Везде можно писать:
```ts
import { Button } from '@/shared/ui/button'
// вместо
import { Button } from '../../shared/ui/button'
```

Это работает и в TypeScript, и в Vite.

---

## Переменные окружения

Файл `.env.local` (создаётся вручную, не коммитится):

```env
# Базовый URL API (заменить перед подключением к бэкенду)
VITE_API_URL=http://localhost:8000/api
```

Использование в коде:
```ts
const apiUrl = import.meta.env.VITE_API_URL ?? '/api'
```

Важно: все переменные для Vite должны начинаться с `VITE_`.

---

## Частые проблемы при старте

### `npm install` завершается с ошибкой

```bash
# Очистить кеш npm и переустановить
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Порт 5173 занят

```bash
# Запустить на другом порту
npm run dev -- --port 3000
```

### TypeScript показывает ошибки «Cannot find module»

```bash
# Перезапустить TS Language Server в VS Code:
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Tailwind-классы не применяются

Убедись что в компоненте используются полные имена классов (без конкатенации строк):
```tsx
// ❌ Так Tailwind не подберёт классы:
const color = 'red'
<div className={`text-${color}-500`} />

// ✅ Так правильно:
<div className="text-red-500" />
```
