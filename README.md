# frontend-starter-kit

Базовый frontend-шаблон для хакатонов и быстрых прототипов.

## Стек

- React 18 + TypeScript + Vite
- Feature-Sliced Design (FSD)
- React Router DOM v6
- Zustand
- Axios + TanStack Query
- shadcn/ui + Tailwind CSS + Lucide Icons
- React Hook Form + zod
- Recharts
- PWA (vite-plugin-pwa)
- Storybook

## Быстрый старт

```bash
npm install
npm run dev
```

## Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Production сборка |
| `npm run preview` | Предпросмотр production-сборки |
| `npm run lint` | Проверка линтером |
| `npm run storybook` | Запуск Storybook |
| `npm run build-storybook` | Сборка Storybook |

## Маршруты

| Путь | Описание |
|------|----------|
| `/login` | Страница входа с выбором роли |
| `/dashboard` | Главная панель с метриками |
| `/tables` | Таблицы с поиском, фильтрами, сортировкой |
| `/charts` | Графики (line, bar, area, pie) |
| `/forms` | Примеры форм |
| `/panels` | Правые выдвижные панели |
| `/ui-kit` | Витрина компонентов |
| `/settings` | Настройки профиля и темы |

## Архитектура

Проект построен по [Feature-Sliced Design](docs/architecture.md).

```
src/
  app/        — инициализация (провайдеры, роутер, стили)
  pages/      — страницы
  widgets/    — крупные блоки интерфейса
  features/   — пользовательские действия
  entities/   — бизнес-сущности
  shared/     — переиспользуемая инфраструктура и UI
```

Подробнее: [docs/](docs/)
