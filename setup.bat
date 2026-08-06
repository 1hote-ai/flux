@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

:: ═══════════════════════════════════════════════════════════════════════════════
:: Flux — Автоматическая установка (Windows)
:: ═══════════════════════════════════════════════════════════════════════════════
::
:: Использование:
::   setup.bat            — полная установка + запуск
::   setup.bat --install  — только установка (без запуска)
::   setup.bat --start    — только запуск (без установки)
::   setup.bat --check    — только проверка зависимостей
::   setup.bat --stop     — остановить все процессы Flux
::
:: ═══════════════════════════════════════════════════════════════════════════════

set "SCRIPT_DIR=%~dp0"
set "FRONTEND_DIR=%SCRIPT_DIR%"
set "SERVER_DIR=%SCRIPT_DIR%server"
set "ENV_FILE=%SERVER_DIR%\.env"
set "LOG_DIR=%SCRIPT_DIR%.flux-logs"
set "FRONTEND_LOG=%LOG_DIR%\frontend.log"
set "BACKEND_LOG=%LOG_DIR%\backend.log"
set "PID_FILE=%LOG_DIR%\flux.pids"

set "FRONTEND_PORT=5173"
set "BACKEND_PORT=3000"
set "DB_PORT=5432"

set "DB_USER=flux"
set "DB_NAME=flux_db"
set "DB_PASSWORD=flux_dev_secret"

set "NODE_MIN_VERSION=20"

set "HAS_ERRORS=0"

:: ─── Точка входа ─────────────────────────────────────────────────────────────

call :print_banner

if "%~1"=="--check"   goto :cmd_check
if "%~1"=="--install"  goto :cmd_install
if "%~1"=="--start"    goto :cmd_start
if "%~1"=="--stop"     goto :cmd_stop
if "%~1"=="--help"     goto :cmd_help
if "%~1"=="-h"         goto :cmd_help
if "%~1"==""           goto :cmd_full

echo [!] Неизвестная команда: %~1
goto :cmd_help

:: ═══════════════════════════════════════════════════════════════════════════════
:: КОМАНДЫ
:: ═══════════════════════════════════════════════════════════════════════════════

:cmd_check
call :check_all
if !HAS_ERRORS! equ 1 (
    echo.
    echo [x] Некоторые проверки не пройдены.
    exit /b 1
)
echo.
echo [v] Все проверки пройдены
exit /b 0

:cmd_install
call :check_all
if !HAS_ERRORS! equ 1 exit /b 1
call :setup_backend
call :install_dependencies
call :setup_database
echo.
echo [v] Установка завершена. Запустите: setup.bat --start
exit /b 0

:cmd_start
call :check_ports
if !HAS_ERRORS! equ 1 exit /b 1
call :start_app
exit /b 0

:cmd_stop
call :stop_app
exit /b 0

:cmd_help
echo.
echo Использование:
echo   setup.bat            Полная установка + запуск
echo   setup.bat --install  Только установка (без запуска)
echo   setup.bat --start    Только запуск
echo   setup.bat --stop     Остановить Flux
echo   setup.bat --check    Проверка зависимостей
echo   setup.bat --help     Это сообщение
exit /b 0

:cmd_full
call :check_all
if !HAS_ERRORS! equ 1 exit /b 1
call :setup_backend
call :install_dependencies
call :setup_database
call :start_app
exit /b 0

:: ═══════════════════════════════════════════════════════════════════════════════
:: ПРОВЕРКИ
:: ═══════════════════════════════════════════════════════════════════════════════

:check_all
set "HAS_ERRORS=0"
call :check_node
call :check_postgres
call :check_ports
goto :eof

:check_node
echo.
echo --- Проверка Node.js ---
where node >nul 2>&1
if errorlevel 1 (
    echo   [x] Node.js не найден
    echo   --^> Скачайте: https://nodejs.org
    set "HAS_ERRORS=1"
    goto :eof
)

for /f "tokens=1 delims=v" %%V in ('node -v') do set "RAW_NODE_VER=%%V"
for /f "tokens=1 delims=v." %%M in ('node -v') do set "NODE_VER=%%M"
:: Удаляем 'v' из версии
set "NODE_VER=%NODE_VER:v=%"

if !NODE_VER! lss %NODE_MIN_VERSION% (
    echo   [x] Node.js v!RAW_NODE_VER! — требуется v%NODE_MIN_VERSION%+
    echo   --^> Обновите: https://nodejs.org
    set "HAS_ERRORS=1"
    goto :eof
)

for /f "tokens=*" %%V in ('node -v') do echo   [v] Node.js %%V

where npm >nul 2>&1
if errorlevel 1 (
    echo   [x] npm не найден
    set "HAS_ERRORS=1"
    goto :eof
)

for /f "tokens=*" %%V in ('npm -v') do echo   [v] npm v%%V
goto :eof

:check_postgres
echo.
echo --- Проверка PostgreSQL ---
where psql >nul 2>&1
if errorlevel 1 (
    echo   [x] PostgreSQL не найден
    echo   --^> Скачайте: https://www.postgresql.org/download/windows/
    echo   --^> Добавьте bin\ в PATH: C:\Program Files\PostgreSQL\16\bin
    set "HAS_ERRORS=1"
    goto :eof
)

for /f "tokens=3" %%V in ('psql --version') do (
    echo   [v] PostgreSQL %%V ^(CLI^)
)

:: Проверяем подключение
psql -U postgres -c "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo   [!] PostgreSQL сервер не отвечает
    echo   --^> Запустите через Services: postgresql-x64-16
    echo   --^> Или: pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
    set "HAS_ERRORS=1"
    goto :eof
)

echo   [v] PostgreSQL сервер запущен
goto :eof

:check_ports
echo.
echo --- Проверка портов ---
set "PORTS_OK=1"

netstat -ano | findstr ":%FRONTEND_PORT% " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo   [x] Порт %FRONTEND_PORT% занят
    for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%FRONTEND_PORT% " ^| findstr "LISTENING"') do (
        echo   --^> PID: %%P. Остановите: taskkill /PID %%P /F
    )
    set "PORTS_OK=0"
    set "HAS_ERRORS=1"
) else (
    echo   [v] Порт %FRONTEND_PORT% свободен
)

netstat -ano | findstr ":%BACKEND_PORT% " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo   [x] Порт %BACKEND_PORT% занят
    for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%BACKEND_PORT% " ^| findstr "LISTENING"') do (
        echo   --^> PID: %%P. Остановите: taskkill /PID %%P /F
    )
    set "PORTS_OK=0"
    set "HAS_ERRORS=1"
) else (
    echo   [v] Порт %BACKEND_PORT% свободен
)
goto :eof

:: ═══════════════════════════════════════════════════════════════════════════════
:: УСТАНОВКА БЭКЕНДА
:: ═══════════════════════════════════════════════════════════════════════════════

:setup_backend
echo.
echo --- Настройка бэкенда ---

if not exist "%SERVER_DIR%" (
    echo   [~] Создание директории server\...
    mkdir "%SERVER_DIR%\src" 2>nul
    mkdir "%SERVER_DIR%\prisma" 2>nul
)

if not exist "%SERVER_DIR%\package.json" (
    echo   [~] Инициализация package.json бэкенда...
    (
        echo {
        echo   "name": "flux-server",
        echo   "version": "0.1.0",
        echo   "private": true,
        echo   "type": "module",
        echo   "scripts": {
        echo     "dev": "tsx watch src/index.ts",
        echo     "build": "tsc",
        echo     "start": "node dist/index.js",
        echo     "db:generate": "prisma generate",
        echo     "db:migrate": "prisma migrate dev",
        echo     "db:push": "prisma db push",
        echo     "db:seed": "prisma db seed",
        echo     "db:studio": "prisma studio"
        echo   },
        echo   "dependencies": {
        echo     "@prisma/client": "^6.8.0",
        echo     "bcrypt": "^5.1.1",
        echo     "cors": "^2.8.5",
        echo     "dotenv": "^16.5.0",
        echo     "express": "^5.1.0",
        echo     "jsonwebtoken": "^9.0.2",
        echo     "passport": "^0.7.0",
        echo     "passport-google-oauth20": "^2.0.0",
        echo     "ws": "^8.18.0",
        echo     "zod": "^3.25.0"
        echo   },
        echo   "devDependencies": {
        echo     "@types/bcrypt": "^5.0.2",
        echo     "@types/cors": "^2.8.17",
        echo     "@types/express": "^5.0.0",
        echo     "@types/jsonwebtoken": "^9.0.9",
        echo     "@types/node": "^24.13.0",
        echo     "@types/passport": "^1.0.17",
        echo     "@types/passport-google-oauth20": "^2.0.16",
        echo     "@types/ws": "^8.18.0",
        echo     "prisma": "^6.8.0",
        echo     "tsx": "^4.19.0",
        echo     "typescript": "~6.0.2"
        echo   },
        echo   "prisma": {
        echo     "seed": "tsx prisma/seed.ts"
        echo   }
        echo }
    ) > "%SERVER_DIR%\package.json"
    echo   [v] package.json создан
) else (
    echo   [v] package.json уже существует
)

if not exist "%SERVER_DIR%\tsconfig.json" (
    echo   [~] Создание tsconfig.json...
    (
        echo {
        echo   "compilerOptions": {
        echo     "target": "ES2022",
        echo     "module": "ESNext",
        echo     "moduleResolution": "bundler",
        echo     "lib": ["ES2022"],
        echo     "outDir": "./dist",
        echo     "rootDir": "./src",
        echo     "strict": true,
        echo     "esModuleInterop": true,
        echo     "skipLibCheck": true,
        echo     "forceConsistentCasingInFileNames": true,
        echo     "resolveJsonModule": true,
        echo     "declaration": true,
        echo     "declarationMap": true,
        echo     "sourceMap": true
        echo   },
        echo   "include": ["src/**/*"],
        echo   "exclude": ["node_modules", "dist"]
        echo }
    ) > "%SERVER_DIR%\tsconfig.json"
    echo   [v] tsconfig.json создан
)

:: Prisma schema — копируем из macOS скрипта если нет
if not exist "%SERVER_DIR%\prisma\schema.prisma" (
    echo   [!] Prisma-схема не найдена.
    echo   --^> Сначала запустите setup.sh на macOS или скопируйте server\prisma\schema.prisma
    echo   --^> Или запустите: setup.bat --install ещё раз после создания схемы
    set "HAS_ERRORS=1"
)

:: .env файл
if not exist "%ENV_FILE%" (
    echo   [~] Создание .env...
    (
        echo DATABASE_URL=postgresql://%DB_USER%:%DB_PASSWORD%@localhost:%DB_PORT%/%DB_NAME%
        echo PORT=%BACKEND_PORT%
        echo NODE_ENV=development
        echo JWT_SECRET=dev-jwt-secret-change-in-production
        echo JWT_ACCESS_EXPIRES=15m
        echo JWT_REFRESH_EXPIRES=30d
        echo GOOGLE_CLIENT_ID=
        echo GOOGLE_CLIENT_SECRET=
        echo GOOGLE_CALLBACK_URL=http://localhost:%BACKEND_PORT%/api/auth/google/callback
        echo CLIENT_URL=http://localhost:%FRONTEND_PORT%
    ) > "%ENV_FILE%"
    echo   [v] .env создан
) else (
    echo   [v] .env уже существует
)

goto :eof

:: ═══════════════════════════════════════════════════════════════════════════════
:: УСТАНОВКА ЗАВИСИМОСТЕЙ
:: ═══════════════════════════════════════════════════════════════════════════════

:install_dependencies
echo.
echo --- Установка npm-зависимостей ---

echo   [~] Фронтенд...
pushd "%FRONTEND_DIR%"
call npm install --silent 2>nul
echo   [v] Фронтенд: зависимости установлены
popd

echo   [~] Бэкенд...
pushd "%SERVER_DIR%"
call npm install --silent 2>nul
echo   [v] Бэкенд: зависимости установлены
popd

goto :eof

:: ═══════════════════════════════════════════════════════════════════════════════
:: НАСТРОЙКА БАЗЫ ДАННЫХ
:: ═══════════════════════════════════════════════════════════════════════════════

:setup_database
echo.
echo --- Настройка базы данных ---

:: Проверяем пользователя
psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='%DB_USER%'" 2>nul | findstr "1" >nul 2>&1
if errorlevel 1 (
    echo   [~] Создание пользователя '%DB_USER%'...
    psql -U postgres -c "CREATE USER %DB_USER% WITH PASSWORD '%DB_PASSWORD%' CREATEDB;" 2>nul
    if errorlevel 1 (
        echo   [x] Не удалось создать пользователя. Проверьте доступ к PostgreSQL.
        set "HAS_ERRORS=1"
        goto :eof
    )
    echo   [v] Пользователь '%DB_USER%' создан
) else (
    echo   [v] Пользователь '%DB_USER%' существует
)

:: Проверяем БД
psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%'" 2>nul | findstr "1" >nul 2>&1
if errorlevel 1 (
    echo   [~] Создание базы данных '%DB_NAME%'...
    psql -U postgres -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;" 2>nul
    if errorlevel 1 (
        echo   [x] Не удалось создать БД.
        set "HAS_ERRORS=1"
        goto :eof
    )
    echo   [v] База данных '%DB_NAME%' создана
) else (
    echo   [v] База данных '%DB_NAME%' существует
)

:: Prisma
echo   [~] Генерация Prisma Client...
pushd "%SERVER_DIR%"
call npx prisma generate --schema=prisma/schema.prisma 2>nul
echo   [v] Prisma Client сгенерирован

echo   [~] Применение схемы БД...
call npx prisma db push --accept-data-loss 2>nul
echo   [v] Схема БД синхронизирована

echo   [~] Заполнение начальными данными...
call npx prisma db seed 2>nul
echo   [v] Начальные данные загружены
popd

goto :eof

:: ═══════════════════════════════════════════════════════════════════════════════
:: ЗАПУСК
:: ═══════════════════════════════════════════════════════════════════════════════

:start_app
echo.
echo --- Запуск Flux ---

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: Бэкенд
echo   [~] Запуск бэкенда на порту %BACKEND_PORT%...
pushd "%SERVER_DIR%"
start "Flux-Backend" /B cmd /c "npm run dev > "%BACKEND_LOG%" 2>&1"
popd

:: Ждём бэкенд
set "RETRIES=0"
:wait_backend
if !RETRIES! geq 15 goto :backend_timeout
timeout /t 1 /nobreak >nul
curl -s "http://localhost:%BACKEND_PORT%/api/health" >nul 2>&1
if errorlevel 1 (
    set /a RETRIES+=1
    goto :wait_backend
)
echo   [v] Бэкенд запущен
goto :start_frontend

:backend_timeout
echo   [!] Бэкенд запускается... (проверьте %BACKEND_LOG%)

:start_frontend
echo   [~] Запуск фронтенда на порту %FRONTEND_PORT%...
pushd "%FRONTEND_DIR%"
start "Flux-Frontend" /B cmd /c "npm run dev > "%FRONTEND_LOG%" 2>&1"
popd

:: Ждём фронтенд
set "RETRIES=0"
:wait_frontend
if !RETRIES! geq 10 goto :frontend_timeout
timeout /t 1 /nobreak >nul
curl -s "http://localhost:%FRONTEND_PORT%" >nul 2>&1
if errorlevel 1 (
    set /a RETRIES+=1
    goto :wait_frontend
)
echo   [v] Фронтенд запущен
goto :print_success

:frontend_timeout
echo   [!] Фронтенд запускается... (проверьте %FRONTEND_LOG%)

:print_success
echo.
echo   ===============================================
echo        ⚡ Flux запущен!
echo   ===============================================
echo.
echo   Фронтенд:  http://localhost:%FRONTEND_PORT%
echo   API:        http://localhost:%BACKEND_PORT%/api
echo   WebSocket:  ws://localhost:%BACKEND_PORT%/ws
echo   Health:     http://localhost:%BACKEND_PORT%/api/health
echo.
echo   Остановить: setup.bat --stop
echo   Логи:       .flux-logs\
echo.
echo   ===============================================

goto :eof

:: ═══════════════════════════════════════════════════════════════════════════════
:: ОСТАНОВКА
:: ═══════════════════════════════════════════════════════════════════════════════

:stop_app
echo.
echo --- Остановка Flux ---

:: Убиваем по портам
for %%P in (%FRONTEND_PORT% %BACKEND_PORT%) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P " ^| findstr "LISTENING" 2^>nul') do (
        taskkill /PID %%A /F >nul 2>&1
        echo   [v] Остановлен процесс на порту %%P ^(PID: %%A^)
    )
)

:: Убиваем Flux-окна
taskkill /FI "WINDOWTITLE eq Flux-Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Flux-Frontend" /F >nul 2>&1

echo   [v] Flux остановлен
goto :eof

:: ═══════════════════════════════════════════════════════════════════════════════
:: УТИЛИТЫ
:: ═══════════════════════════════════════════════════════════════════════════════

:print_banner
echo.
echo   ===================================================
echo        ⚡ F L U X  —  Setup (Windows)
echo        Modern messenger for teams
echo   ===================================================
echo.
goto :eof
