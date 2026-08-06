# Flux — Установка и сборка

Полная инструкция по настройке среды разработки и сборке Flux для macOS, Windows и веб.

---

## Содержание

- [Требования](#требования)
- [Зависимости проекта](#зависимости-проекта)
- [Настройка среды](#настройка-среды)
  - [macOS](#macos)
  - [Windows](#windows)
- [Запуск в режиме разработки](#запуск-в-режиме-разработки)
- [Сборка для продакшена](#сборка-для-продакшена)
- [Горячая перезагрузка](#горячая-перезагрузка)
- [Структура проекта](#структура-проекта)
- [npm-команды](#npm-команды)
- [Устранение проблем](#устранение-проблем)

---

## Требования

### Общие (все платформы)

| Инструмент | Версия | Назначение |
|---|---|---|
| **Node.js** | ≥ 20 LTS | Сборка фронтенда, npm-скрипты |
| **npm** | ≥ 10 | Менеджер пакетов |
| **Rust** | ≥ 1.77 (stable) | Компиляция Tauri-обёртки |
| **Git** | ≥ 2.40 | Контроль версий |

> **Примечание:** Rust необходим **только** для десктоп-сборки. Для веб-версии достаточно Node.js.

### macOS

| Инструмент | Версия | Установка |
|---|---|---|
| **Xcode Command Line Tools** | ≥ 15 | `xcode-select --install` |
| **macOS SDK** | ≥ 10.15 (Catalina) | Входит в Xcode CLT |

### Windows

| Инструмент | Версия | Установка |
|---|---|---|
| **Visual Studio Build Tools** | 2022+ | [Скачать](https://visualstudio.microsoft.com/visual-cpp-build-tools/) |
| **WebView2 Runtime** | Latest | [Скачать](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) |
| **MSVC C++ Build Tools** | v143+ | Через Visual Studio Installer |
| **Windows SDK** | 10/11 | Через Visual Studio Installer |

---

## Зависимости проекта

### npm-зависимости (фронтенд)

| Пакет | Версия | Назначение |
|---|---|---|
| `react` | ^19.2 | UI-фреймворк |
| `react-dom` | ^19.2 | Рендеринг React в DOM |
| `react-router-dom` | ^7.18 | Маршрутизация SPA |
| `zustand` | ^5.0 | Управление состоянием |
| `framer-motion` | ^13.0 | Анимации |
| `lucide-react` | ^1.28 | Иконки |
| `classnames` | ^2.5 | Утилита для CSS-классов |
| `@tauri-apps/api` | ^2.11 | Tauri IPC (связь с Rust) |

### devDependencies

| Пакет | Версия | Назначение |
|---|---|---|
| `vite` | ^8.2 | Сборщик |
| `@vitejs/plugin-react` | ^6.0 | React Fast Refresh |
| `typescript` | ~6.0 | Типизация |
| `tailwindcss` | ^4.3 | CSS-фреймворк |
| `@tailwindcss/vite` | ^4.3 | Tailwind-плагин для Vite |
| `oxlint` | ^1.75 | Линтер |
| `@tauri-apps/cli` | ^2.11 | Tauri CLI (dev, build, icon) |

### Rust-зависимости (src-tauri/Cargo.toml)

| Крейт | Версия | Назначение |
|---|---|---|
| `tauri` | 2 | Десктоп-рантайм |
| `tauri-build` | 2 | Скрипт сборки |
| `serde` | 1 | Сериализация данных |
| `serde_json` | 1 | JSON-парсинг |

---

## Настройка среды

### macOS

```bash
# 1. Xcode Command Line Tools
xcode-select --install

# 2. Rust (через rustup)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Проверка
rustc --version      # ≥ 1.77.0
cargo --version      # ≥ 1.77.0
node --version       # ≥ 20.0.0

# 4. Клонирование и установка
git clone <repo-url> flux
cd flux
npm install

# 5. Запуск
npm run dev:desktop
```

#### Сборка macOS Universal Binary (Intel + Apple Silicon)

```bash
# Добавить targets для обеих архитектур
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin

# Собрать
npm run build:macos
```

Результат:
```
src-tauri/target/universal-apple-darwin/release/bundle/
├── dmg/
│   └── Flux_0.1.0_universal.dmg     ← Установщик
└── macos/
    └── Flux.app                      ← Приложение
```

---

### Windows

```powershell
# 1. Visual Studio Build Tools 2022
#    Скачайте и установите с https://visualstudio.microsoft.com/visual-cpp-build-tools/
#    Выберите рабочую нагрузку: "Разработка классических приложений на C++"
#    Компоненты: MSVC v143, Windows SDK

# 2. WebView2 Runtime (обычно предустановлен в Windows 10/11)
#    Если нет: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

# 3. Rust (через rustup)
#    Скачайте и запустите https://rustup.rs
rustc --version      # ≥ 1.77.0

# 4. Node.js
#    Скачайте с https://nodejs.org (LTS)
node --version       # ≥ 20.0.0

# 5. Клонирование и установка
git clone <repo-url> flux
cd flux
npm install

# 6. Запуск
npm run dev:desktop
```

#### Сборка для Windows

```powershell
npm run build:windows
```

Результат:
```
src-tauri\target\x86_64-pc-windows-msvc\release\bundle\
├── msi\
│   └── Flux_0.1.0_x64_en-US.msi     ← MSI-установщик
└── nsis\
    └── Flux_0.1.0_x64-setup.exe     ← NSIS-установщик
```

---

## Запуск в режиме разработки

### Только веб (без Tauri)
```bash
npm run dev
# → http://localhost:5173
```
Не требует Rust. Приложение открывается в браузере.

### Десктоп (Tauri + Vite)
```bash
npm run dev:desktop
```
Команда выполняет:
1. Запускает Vite dev-сервер на `localhost:5173`
2. Компилирует Rust-бинарник Tauri
3. Открывает нативное окно, загружающее Vite dev-сервер
4. Включает горячую перезагрузку для фронтенда и Rust

> **Первый запуск** займёт 2–5 минут (компиляция Rust-зависимостей). Последующие запуски — 5–15 секунд.

---

## Сборка для продакшена

| Команда | Платформа | Результат |
|---|---|---|
| `npm run build` | Веб | `dist/` — статические файлы для деплоя |
| `npm run build:macos` | macOS | `.dmg` + `.app` (universal binary) |
| `npm run build:windows` | Windows | `.msi` + `.exe` |
| `npm run build:desktop` | Текущая ОС | Автоматически определяет target |

> **Важно:** Сборка `.dmg` возможна **только** на macOS. Сборка `.msi` / `.exe` возможна **только** на Windows. Для кросс-компиляции используйте CI/CD (GitHub Actions).

---

## Горячая перезагрузка

### Фронтенд (React / TypeScript / CSS)
- **Механизм:** Vite HMR (Hot Module Replacement)
- **Скорость:** Мгновенная (~50ms)
- **Что обновляется:** Компоненты, стили, хуки — без потери состояния
- **Работает:** И в браузере (`npm run dev`), и в Tauri-окне (`npm run dev:desktop`)

### Rust (Tauri backend)
- **Механизм:** `tauri dev` автоматически следит за `src-tauri/src/` и перекомпилирует при изменениях
- **Скорость:** 5–15 секунд (инкрементальная компиляция Rust)
- **Что обновляется:** IPC-команды, нативная логика — окно перезапускается
- **Отслеживаемые файлы:** `src-tauri/src/**/*.rs`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`

### Конфигурация HMR

Горячая перезагрузка настроена в `vite.config.ts`:

```typescript
server: {
  port: 5173,           // Фиксированный порт для Tauri
  strictPort: true,     // Ошибка если порт занят
  host: false,          // localhost only (безопасность)
}
```

Tauri CLI автоматически подключается к Vite dev-серверу через `devUrl` из `tauri.conf.json`.

---

## Структура проекта

```
flux/
│
├── src/                          # === ФРОНТЕНД (React + TypeScript) ===
│   ├── main.tsx                  # Точка входа React
│   ├── App.tsx                   # Корневой компонент + маршрутизация
│   ├── index.css                 # Глобальные стили + Tailwind
│   │
│   ├── components/               # UI Kit
│   │   └── modals/               # Модальные окна
│   │
│   ├── features/                 # Feature-модули
│   │   ├── channels/             # Каналы (текст + голос)
│   │   ├── chat/                 # Чат (сообщения, ввод)
│   │   ├── modals/               # Модальные формы
│   │   ├── server/               # Навигация по серверу
│   │   ├── servers/              # Список серверов
│   │   ├── ui/                   # Общие UI-элементы
│   │   └── voice/                # Голосовые комнаты
│   │
│   ├── hooks/                    # Кастомные React-хуки
│   ├── layouts/                  # Обёртки и навигация
│   ├── pages/                    # Страницы (ServerPage, DMsPage)
│   ├── store/                    # Zustand-хранилища
│   ├── styles/                   # CSS-модули, миксины
│   ├── utils/                    # Утилиты
│   └── assets/                   # Шрифты, изображения
│
├── src-tauri/                    # === ДЕСКТОП-ОБЁРТКА (Rust + Tauri) ===
│   ├── tauri.conf.json           # Конфигурация Tauri (окно, бандлер, build)
│   ├── Cargo.toml                # Rust-зависимости
│   ├── build.rs                  # Скрипт сборки Tauri
│   │
│   ├── src/
│   │   ├── lib.rs                # Rust-логика: IPC-команды, инициализация
│   │   └── main.rs               # Точка входа десктоп-бинарника
│   │
│   ├── capabilities/
│   │   └── default.json          # Разрешения безопасности Tauri
│   │
│   └── icons/                    # Сгенерированные иконки
│       ├── icon.icns             # macOS
│       ├── icon.ico              # Windows
│       ├── 32x32.png
│       ├── 128x128.png
│       └── 128x128@2x.png
│
├── public/                       # Статика для веб (favicon)
├── index.html                    # HTML-шаблон
├── vite.config.ts                # Конфигурация Vite + Tauri HMR
├── tsconfig.json                 # TypeScript (корень)
├── tsconfig.app.json             # TypeScript (приложение)
├── tsconfig.node.json            # TypeScript (Node/Vite)
├── package.json                  # npm-скрипты и зависимости
├── README.md                     # Описание проекта
└── INSTALL.md                    # ← Этот файл
```

---

## npm-команды

### Разработка

| Команда | Описание |
|---|---|
| `npm run dev` | Vite dev-сервер (веб-версия) |
| `npm run dev:web` | Алиас для `dev` |
| `npm run dev:desktop` | Tauri + Vite (десктоп с горячей перезагрузкой) |

### Сборка

| Команда | Описание |
|---|---|
| `npm run build` | Веб-сборка → `dist/` |
| `npm run build:web` | Алиас для `build` |
| `npm run build:macos` | macOS universal binary → `.dmg` + `.app` |
| `npm run build:windows` | Windows → `.msi` + `.exe` |
| `npm run build:desktop` | Текущая ОС (авто-определение) |

### Утилиты

| Команда | Описание |
|---|---|
| `npm run lint` | Проверка кода (oxlint) |
| `npm run preview` | Превью веб-сборки |
| `npm run icons` | Перегенерация иконок из исходника |
| `npm run tauri -- info` | Информация о среде Tauri |

### Tauri CLI (прямой доступ)

```bash
# Любая команда Tauri CLI
npm run tauri -- <command>

# Примеры:
npm run tauri -- info         # Диагностика среды
npm run tauri -- icon <file>  # Генерация иконок из файла
npm run tauri -- signer       # Управление ключами подписи
```

---

## Устранение проблем

### «Command not found: rustc»

Rust не установлен. Установите через rustup:
```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# Windows — скачайте https://rustup.rs
```

### Первая компиляция Tauri очень долгая

Это нормально. Rust компилирует ~300 зависимостей при первом запуске. Используйте `sccache` для ускорения:
```bash
cargo install sccache
export RUSTC_WRAPPER=sccache   # добавьте в .zshrc / .bashrc
```

### Ошибка «port 5173 already in use»

Vite настроен с `strictPort: true`. Закройте процесс на порту 5173:
```bash
lsof -ti:5173 | xargs kill -9
```

### Windows: «WebView2 not found»

Установите WebView2 Runtime:
https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### macOS: «No signing identity found»

Для локальной разработки подписка не нужна. Для дистрибуции:
```bash
# Проверить доступные сертификаты
security find-identity -v -p codesigning

# Для тестовых сборок — отключить подписание в tauri.conf.json:
# "macOS": { "signingIdentity": null }
```

### Горячая перезагрузка не работает

1. Проверьте, что Vite запущен на порту 5173
2. Проверьте `devUrl` в `tauri.conf.json` → `http://localhost:5173`
3. Перезапустите: `npm run dev:desktop`
