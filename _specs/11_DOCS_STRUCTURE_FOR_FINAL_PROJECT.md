# Docs Structure for Final Project

Когда Claude начнёт создавать проект, внутри проекта нужно добавить папку `docs/`.

## Итоговая папка docs

```txt
docs/
  architecture.md
  fsd-rules.md
  ui-kit.md
  forms.md
  api.md
  auth-and-roles.md
  pwa.md
  storybook.md
  development-guide.md
  contribution-guide.md
```

## `architecture.md`

Описать:

- общую архитектуру;
- слои FSD;
- правила зависимостей;
- структуру папок;
- где что создавать.

## `fsd-rules.md`

Описать:

- app;
- pages;
- widgets;
- features;
- entities;
- shared;
- примеры правильного размещения;
- примеры неправильного размещения.

## `ui-kit.md`

Описать:

- где лежат компоненты;
- как добавить shadcn-компонент;
- как создать кастомный компонент;
- как добавить компонент на `/ui-kit`;
- как добавить story.

## `forms.md`

Описать:

- React Hook Form;
- zod;
- schema-first подход;
- server errors;
- dirty state;
- формы в dialog;
- формы в side panel.

## `api.md`

Описать:

- Axios instance;
- API functions;
- query hooks;
- mutations;
- invalidation;
- optimistic update;
- error handling;
- mock modes.

## `auth-and-roles.md`

Описать:

- mock auth;
- роли;
- permissions;
- protected routes;
- sidebar visibility;
- action visibility.

## `pwa.md`

Описать:

- vite-plugin-pwa;
- manifest;
- icons;
- service worker;
- offline;
- update prompt;
- проверку PWA.

## `storybook.md`

Описать:

- запуск;
- структуру stories;
- decorators;
- dark/light;
- правила добавления stories.

## `development-guide.md`

Описать:

- команды запуска;
- как добавить страницу;
- как добавить feature;
- как добавить entity;
- как добавить API-запрос;
- как добавить форму;
- как добавить компонент;
- как проверить build.

## `contribution-guide.md`

Описать:

- правила веток;
- правила коммитов;
- code style;
- checklist перед PR;
- запреты.
