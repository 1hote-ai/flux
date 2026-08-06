# Flux

Flux — это минималистичный аналог Discord, современный мессенджер для общения текстом и голосом.
Проект создается с фокусом на чистый UI, высокую производительность и элегантный дизайн с использованием glassmorphism-эффектов.

## Технологии
- **Frontend Framework**: React + Vite
- **Язык**: TypeScript
- **Маршрутизация**: React Router v7
- **Управление состоянием**: Zustand
- **Стилизация**: Tailwind CSS + CSS Modules + CSS Variables (Dark theme by default)
- **Анимации**: Framer Motion
- **Desktop Ready**: Архитектура подготовлена для миграции/сборки под Tauri.

## Структура Репозитория
- `src/components`: Независимый UI Kit (Button, Modal, Input, GlassPanel).
- `src/features`: Модули функционала (servers, channels, chat, voice).
- `src/layouts`: Каркас приложения, обертки, навигация.
- `src/pages`: Страницы-агрегаторы (ServerPage, DMsPage).
- `src/store`: Глобальные хранилища Zustand.
- `src/utils`: Вспомогательные функции.

## Инструкции по запуску
1. Установите зависимости:
```bash
npm install
```
2. Запустите сервер для разработки:
```bash
npm run dev
```
3. Откройте приложение в браузере (обычно `http://localhost:5173`).
