# PWA Requirements

## 1. Цель

Проект должен быть PWA-ready starter kit.

Показать:

- установка приложения;
- offline состояние;
- service worker;
- manifest;
- update prompt.

## 2. Технология

```txt
vite-plugin-pwa
```

## 3. Manifest

Настроить:

```txt
name: frontend-starter-kit
short_name: Starter Kit
description: Стартовый frontend-шаблон для хакатонов
theme_color
background_color
display: standalone
start_url
icons
```

## 4. Иконки

Добавить в `public/`:

```txt
pwa-192x192.png
pwa-512x512.png
apple-touch-icon.png
favicon.ico
```

Если иконок нет, создать простые placeholder-иконки.

## 5. Offline State

Добавить `OfflineState`.

Текст:

```txt
Вы офлайн
Некоторые данные могут быть недоступны. Проверьте подключение к интернету.
```

Где использовать:

- глобальный индикатор в AppShell;
- fallback screen;
- toast при потере соединения.

## 6. Update Prompt

Добавить уведомление:

```txt
Доступна новая версия приложения
```

Кнопки:

```txt
Обновить
Позже
```

## 7. Проверка

```bash
npm run build
npm run preview
```

Проверить:

- manifest доступен;
- service worker зарегистрирован;
- приложение можно установить;
- offline fallback работает;
- update prompt показывается при обновлении.

## 8. Критерии готовности

- build проходит;
- preview работает;
- service worker активен;
- manifest валиден;
- есть offline state;
- есть update prompt;
- всё описано в документации.
