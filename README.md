# Tabletastic

> Таблица с бесконечным скроллом на React

[Тестовое задания на стажировку в ВК](https://internship.vk.company/vacancy/1109)

---

## Оглавление

- [Предисловие](#предисловие)
- [Структура проекта](#структура-проекта)
- [Используемые зависимости](#используемые-зависимости)
- [Запуск проекта](#запуск-проекта)
- [Дизайн макеты](#дизайн-макеты)

---

## Предисловие

Новая версия `json-server` почему-то не возвращает хедер x-total-count, но версия 0.17.4 возвращает, я использовал ее.

Давно хотел воспользоваться и поизучать технологии из [TanStack](https://tanstack.com/), но, видимо для этого проекта это был overkill - можно было обойтись `axios` и здравым смыслом.

Я не использовал стейт менеджеры, потому что `TanStack Query` предоставляет функцию инвалидации хеша, было интересно поработать с этим.

---

## Структура проекта

###  Корневые файлы
- `App.tsx` - Главный компонент приложения
- `main.tsx` - Точка входа в приложение
- `index.css` - Глобальные стили
- `vite-env.d.ts` - Декларации типов для Vite

### Компоненты
#### `components/`
- `add-row-dialog.tsx` - Диалог добавления новых записей
- `magical-text.tsx` - Кастомный текстовый компонент
- `mode-toggle.tsx` - Переключатель светлой/тёмной темы
- `table.tsx` - Основной компонент таблицы
- `theme-provider.tsx` - Провайдер темы оформления
- `skeletons/` - Компоненты-заглушки для состояния загрузки
- `ui/` - UI-компоненты из Shadcn UI

### API слой
#### `api/`
- `client.ts` - HTTP-клиент (QueryClient)
- `fetchData.ts` - Функции для работы с API
- `index.ts` - Экспорт всех API функций

### Данные
#### `data/`
- `db.json` - Фиктивная база данных для разработки
- `large-db.json` - Большой набор тестовых данных

### Вспомогательные модули
#### `lib/`
- `utils.ts` - Вспомогательные функции и утилиты

### Тестирование
#### `tests/`
- `api/` - Тесты API модулей
- `setup.ts` - Настройка тестовой среды

### Типы
#### `types/`
- `index.ts` - Экспорт всех типов
- `users.ts` - Типы для работы с пользовательскими данными

---

## Используемые зависимости

- React
- TypeScript
- Tailwind CSS
- TanStack Table
- TanStack Query
- React Hook Form
- ShadCN UI Components
- json-server (для API)

---

## Запуск проекта

1. Склонируйте репозиторий

   ```bash
   git clone https://github.com/kreoniz/table-management-vk.git
   cd table-management-vk
2. Установите зависимости с помощью [`pnpm`](https://pnpm.io/installation)

    ```bash
    pnpm install
3. Запустите сервер `json-server` на localhost:3000

    ```bash
    pnpm json-server ./src/data/db.json
4. Запустите фронтенд и перейдите на localhost:4173

    ```bash
    pnpm build
    pnpm preview

---

## Дизайн макеты

Перед тем, как приступить к разработке, был набросан дизайн примерный дизайн в [excalidraw](https://excalidraw.com/)

![Дизайн](https://github.com/kreoniz/table-management-vk/raw/main/images/design.png)
