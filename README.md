# Блог на Nuxt 3

Проект блога с использованием Nuxt 3 и json-server для тестового API.

## Функциональность

- Просмотр всех постов с пагинацией
- Просмотр отдельного поста с комментариями
- Создание нового поста
- Редактирование существующего поста
- Удаление поста
- Адаптивный дизайн
- SEO-оптимизация с использованием useHead
- Использование SSR через useAsyncData и useLazyAsyncData

## Технологии

- Nuxt 3
- TypeScript
- SCSS
- json-server
- ESLint
- Prettier

## Установка

1. Клонируйте репозиторий:

```bash
git clone <url-репозитория>
cd blog-post
```

2. Установите зависимости:

```bash
npm install
```

## Запуск

1. Запустите json-server (API):

```bash
npm run api
```

2. В другом терминале запустите приложение:

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000
API будет доступно по адресу: http://localhost:3001

## Структура проекта

```
├── components/          # Компоненты
│   ├── TheHeader.vue   # Шапка сайта
│   └── PostCard.vue    # Карточка поста
├── layouts/            # Макеты
│   └── default.vue     # Основной макет
├── pages/              # Страницы
│   ├── index.vue       # Главная страница
│   └── posts/          # Страницы постов
│       ├── index.vue   # Список всех постов
│       ├── create.vue  # Создание поста
│       ├── [id].vue    # Детальная страница поста
│       └── [id]/
│           └── edit.vue # Редактирование поста
└── db.json            # База данных для json-server
```

## Использование BEM

В проекте используется методология BEM для именования классов:

- Блок: `post-card`
- Элемент: `post-card__title`
- Модификатор: `post-card__button--primary`

## Дополнительные возможности

- Пагинация на странице со списком всех постов
- Комментарии к постам
- Адаптивный дизайн для мобильных устройств
- SEO-оптимизация для каждой страницы
- Валидация форм
- Обработка ошибок при запросах к API
