# Coding Rules

## 1. TypeScript

- TypeScript strict.
- Не использовать `any` без необходимости.
- Типизировать props.
- Типизировать API responses.
- Типы сущностей хранить в `entities/*/model`.
- Схемы форм хранить рядом с feature.

## 2. React

- Функциональные компоненты.
- Hooks.
- Не делать компоненты на 500 строк.
- Не смешивать UI, API и бизнес-логику.
- Не держать сложные вычисления прямо в JSX.

## 3. Состояние

### TanStack Query

Для серверного состояния:

- списки;
- детали;
- dashboard data;
- mutations;
- cache;
- loading/error.

### Zustand

Для клиентского состояния:

- session;
- theme;
- sidebar state;
- details panel state;
- selected UI state;
- mock mode.

### Нельзя

Нельзя хранить в Zustand:

- список пользователей с API;
- результаты запросов;
- аналитику;
- данные графиков.

## 4. Формы

Каждая форма должна иметь:

- zod schema;
- тип, выведенный из schema;
- React Hook Form;
- client validation;
- server error handling;
- loading submit.

## 5. UI states

Каждый async UI должен иметь:

- loading;
- error;
- empty;
- success/content.

Нельзя писать голые `Loading...` и `Error`.

## 6. Ошибки

Ошибки должны быть человекочитаемыми на русском языке.

## 7. Импорты

Использовать alias:

```ts
import { Button } from '@/shared/ui/button'
```

## 8. Имена файлов

Файлы:

```txt
kebab-case.ts
kebab-case.tsx
```

Компоненты:

```txt
PascalCase
```

## 9. Стили

Использовать Tailwind.

Если нужен className merge — использовать `cn`.

## 10. Запреты

Не делать:

- один огромный `components.tsx`;
- один огромный `store.ts`;
- бизнес-логику в `shared`;
- запросы прямо в страницах;
- серверное состояние в Zustand;
- формы без zod;
- страницы без состояния ошибки;
- UI на английском;
- декоративный дизайн ради декоративности.
