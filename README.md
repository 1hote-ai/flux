# Flux

Flux — это минималистичный аналог Discord, современный мессенджер для общения текстом и голосом.
Проект создается с фокусом на чистый UI, высокую производительность и элегантный дизайн с использованием glassmorphism-эффектов.

## Платформы
- **Web** — браузер (Chrome, Firefox, Safari, Edge)
- **macOS** — нативное приложение (.dmg / .app)
- **Windows** — нативное приложение (.msi / .exe)

## Технологии
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express 5 + Prisma + PostgreSQL + WebSocket
- **Desktop**: Tauri 2 (Rust)
- **Auth**: JWT + Google OAuth
- **State**: Zustand

---

## ⚡ Быстрый старт (автоматическая установка)

### macOS
```bash
chmod +x setup.sh
./setup.sh
```

### Windows
```cmd
setup.bat
```

Скрипт автоматически:
1. Проверит Node.js, PostgreSQL, свободные порты
2. Создаст бэкенд (`server/`) с Prisma-схемой
3. Установит npm-зависимости
4. Создаст базу данных и заполнит начальными данными
5. Запустит фронтенд (`:5173`) и бэкенд (`:3000`)

> Требования: Node.js ≥ 20, PostgreSQL ≥ 14

### Команды скрипта

| Команда | Описание |
|---|---|
| `./setup.sh` | Полная установка + запуск |
| `./setup.sh --install` | Только установка (без запуска) |
| `./setup.sh --start` | Только запуск |
| `./setup.sh --stop` | Остановить все процессы |
| `./setup.sh --check` | Проверка зависимостей |

---

## Ручной запуск

### Фронтенд
```bash
npm install
npm run dev           # → http://localhost:5173
```

### Бэкенд
```bash
cd server
npm install
npx prisma db push
npx prisma db seed
npm run dev           # → http://localhost:3000
```

### Десктоп (Tauri)
> Требуется Rust. См. [INSTALL.md](./INSTALL.md)
```bash
npm run dev:desktop
```

---

## npm-команды

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск Vite dev-сервера (веб) |
| `npm run dev:desktop` | Запуск Tauri (десктоп + веб) |
| `npm run build` | Сборка веб-версии |
| `npm run build:macos` | Сборка .dmg / .app (macOS) |
| `npm run build:windows` | Сборка .msi / .exe (Windows) |
| `npm run lint` | Линтинг кода |

## Структура
```
flux/
├── src/                    # React-фронтенд
├── server/                 # Node.js бэкенд (Express + Prisma)
├── src-tauri/              # Tauri (Rust) — десктоп-обёртка
├── setup.sh                # Автоустановка macOS
├── setup.bat               # Автоустановка Windows
├── INSTALL.md              # Подробная инструкция
└── README.md               # ← Этот файл
```
