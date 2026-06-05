# Тема и стили

## Как работает темизация

Всё построено на CSS-переменных. В `globals.css` объявлены переменные для светлой темы (`:root`) и тёмной (`.dark`). Tailwind читает эти переменные и применяет нужные цвета.

При переключении на тёмный режим класс `dark` добавляется на `<html>` — и все цвета меняются автоматически через CSS-переменные.

---

## Все CSS-переменные

Файл: `src/app/styles/globals.css`

```css
:root {
  /* Основные цвета */
  --background: 0 0% 100%;           /* Фон страницы */
  --foreground: 222.2 84% 4.9%;      /* Основной текст */

  /* Карточки и поверхности */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Акцентный цвет (кнопки, фокусы, ссылки) */
  --primary: 221.2 83.2% 53.3%;      /* ГЛАВНЫЙ ЦВЕТ — меняй это */
  --primary-foreground: 210 40% 98%; /* Текст на primary */

  /* Вторичный цвет */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Приглушённый цвет */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Акцент (hover-состояния) */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Ошибки и деструктивные действия */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  /* Рамки */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;        /* Цвет фокуса */

  /* Скругление */
  --radius: 0.5rem;

  /* Цвета графиков */
  --chart-1: 221.2 83.2% 53.3%;    /* Синий */
  --chart-2: 142.1 76.2% 36.3%;    /* Зелёный */
  --chart-3: 24.6 95% 53.1%;       /* Оранжевый */
  --chart-4: 262.1 83.3% 57.8%;    /* Фиолетовый */
  --chart-5: 346.8 77.2% 49.8%;    /* Красный */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
  --chart-1: 217.2 91.2% 59.8%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
}
```

---

## Быстрая смена цветовой схемы

Переменная `--primary` задаёт основной акцентный цвет всего приложения — кнопки, ссылки, фокус-рамки, активные пункты меню.

Значения в формате HSL (Hue Saturation Lightness):

```css
/* Синий (дефолт) */
--primary: 221.2 83.2% 53.3%;

/* Фиолетовый */
--primary: 262.1 83.3% 57.8%;
--ring: 262.1 83.3% 57.8%;

/* Зелёный */
--primary: 142.1 76.2% 36.3%;
--ring: 142.1 76.2% 36.3%;

/* Оранжевый */
--primary: 24.6 95% 53.1%;
--ring: 24.6 95% 53.1%;

/* Розовый */
--primary: 346.8 77.2% 49.8%;
--ring: 346.8 77.2% 49.8%;
```

Не забудь изменить и в `.dark` блоке — обычно тот же оттенок, но чуть светлее (lightness +5-10%).

---

## useTheme — хук для управления темой

```ts
import { useTheme } from '@/app/providers/theme-provider'

const { theme, setTheme } = useTheme()
// theme: 'light' | 'dark' | 'system'

setTheme('dark')    // принудительно тёмная
setTheme('light')   // принудительно светлая
setTheme('system')  // следить за системной темой
```

Тема сохраняется в `localStorage` под ключом `starter-kit-theme`.

---

## Переключение темы в интерфейсе

### В Header (уже встроено)

`ThemeToggle` в правом верхнем углу — иконка солнца/луны с выпадающим меню.

### Добавить свою кнопку переключения

```tsx
import { useTheme } from '@/app/providers/theme-provider'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/shared/ui/button'

function MyThemeButton() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
```

---

## Tailwind-классы с CSS-переменными

Вместо хардкоженных цветов используй семантические классы:

```tsx
// Фон страницы
<div className="bg-background" />

// Текст
<p className="text-foreground" />         // основной
<p className="text-muted-foreground" />   // приглушённый (серый)

// Карточки
<div className="bg-card border border-border rounded-lg" />

// Акцент
<div className="bg-primary text-primary-foreground" />    // кнопка
<div className="bg-secondary text-secondary-foreground" /> // вторичный

// Ошибки
<div className="text-destructive" />                       // красный текст
<div className="bg-destructive text-destructive-foreground" /> // красный фон
```

Эти классы автоматически меняются при смене темы.

---

## Добавить новый цветовой токен

**Пример:** добавить `--brand-accent` для брендового акцента.

### 1. globals.css

```css
:root {
  /* существующие переменные */
  --brand-accent: 32 95% 50%;  /* золотой */
}

.dark {
  --brand-accent: 38 95% 55%;  /* чуть светлее в тёмном режиме */
}
```

### 2. tailwind.config.ts

```ts
theme: {
  extend: {
    colors: {
      'brand-accent': 'hsl(var(--brand-accent))',
    }
  }
}
```

### 3. Использование

```tsx
<Button className="bg-brand-accent hover:bg-brand-accent/90 text-white">
  Брендовая кнопка
</Button>
```

---

## Утилита cn() — объединение классов

```ts
import { cn } from '@/shared/lib/cn'

// Обычное объединение:
cn('px-4 py-2', 'bg-primary')
// → 'px-4 py-2 bg-primary'

// Условные классы:
cn('base-class', isActive && 'text-primary', isError && 'text-destructive')

// Без лишних пробелов и дублей (используется clsx + tailwind-merge):
cn('p-2 p-4')  // → 'p-4' (побеждает последний)
```

---

## Кастомное скругление

Скругление управляется через `--radius`:

```css
:root {
  --radius: 0.5rem;   /* дефолт — умеренное скругление */
  /* --radius: 0rem;  строгий прямоугольный стиль */
  /* --radius: 1rem;  сильно скруглённый стиль */
}
```

В Tailwind:
```tsx
<div className="rounded-md" />   // --radius (0.5rem)
<div className="rounded-lg" />   // --radius + 0.125rem
<div className="rounded-xl" />   // --radius + 0.25rem
```
