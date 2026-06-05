# Темизация

## Tailwind + CSS-переменные

Тема определена через CSS-переменные в `src/app/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... остальные токены */
  --chart-1: 221.2 83.2% 53.3%;
  --chart-2: 142.1 76.2% 36.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... тёмные значения */
}
```

В `tailwind.config.ts` цвета маппируются на переменные:
```ts
colors: {
  background: 'hsl(var(--background))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
}
```

## ThemeProvider

`src/app/providers/theme-provider.tsx` — управляет классом `dark` на `document.documentElement`.

```tsx
const { theme, setTheme } = useTheme()
// theme: 'light' | 'dark' | 'system'
setTheme('dark')
```

Значение сохраняется в localStorage под ключом `starter-kit-theme`.

## Переключение темы

- **Header**: `ThemeToggle` — иконка с выпадающим меню (Light / Dark / System)
- **Настройки**: страница `/settings` — три кнопки выбора темы

## Добавление нового цветового токена

1. Добавить переменную в `:root` и `.dark` в `globals.css`
2. Добавить маппинг в `tailwind.config.ts` → `theme.extend.colors`
3. Использовать как `bg-my-token text-my-token-foreground`
