@echo off
setlocal enabledelayedexpansion

set DRY_RUN=0
set VERSION=

:parse_args
if "%~1"=="" goto check_args
if "%~1"=="--dry-run" (
    set DRY_RUN=1
    shift
    goto parse_args
)
if "!VERSION!"=="" (
    set VERSION=%~1
    shift
    goto parse_args
)
echo Unknown argument: %~1
exit /b 1

:check_args
if "%VERSION%"=="" (
    echo Usage: %0 [--dry-run] ^<version^>
    exit /b 1
)

echo Preparing release v%VERSION%...

if "%DRY_RUN%"=="1" (
    echo *** DRY RUN MODE: No files will be modified ***
    echo Would update package.json version to %VERSION%
    echo Would update src-tauri\tauri.conf.json version to %VERSION%
    echo Would update src-tauri\Cargo.toml version to %VERSION%
    echo Would create directory structure release\v%VERSION%\macos, windows, web
    echo Would run 'npm run build' and copy dist\ to release\v%VERSION%\web\
    echo Would create git tag v%VERSION%
    exit /b 0
)

:: Update package.json
if exist "package.json" (
    echo Updating package.json...
    powershell -Command "(Get-Content package.json) -replace '\"version\": \".*\"', '\"version\": \"%VERSION%\"' | Set-Content package.json"
) else (
    echo Warning: package.json not found
)

:: Update src-tauri\tauri.conf.json
if exist "src-tauri\tauri.conf.json" (
    echo Updating src-tauri\tauri.conf.json...
    powershell -Command "(Get-Content src-tauri\tauri.conf.json) -replace '\"version\": \".*\"', '\"version\": \"%VERSION%\"' | Set-Content src-tauri\tauri.conf.json"
) else (
    echo Warning: src-tauri\tauri.conf.json not found
)

:: Update src-tauri\Cargo.toml
if exist "src-tauri\Cargo.toml" (
    echo Updating src-tauri\Cargo.toml...
    powershell -Command "(Get-Content src-tauri\Cargo.toml) -replace '^version = \".*\"', 'version = \"%VERSION%\"' | Set-Content src-tauri\Cargo.toml"
) else (
    echo Warning: src-tauri\Cargo.toml not found
)

:: Create directory structure
echo Creating release directory structure...
if not exist "release\v%VERSION%\macos" mkdir "release\v%VERSION%\macos"
if not exist "release\v%VERSION%\windows" mkdir "release\v%VERSION%\windows"
if not exist "release\v%VERSION%\web" mkdir "release\v%VERSION%\web"

:: Run web build
echo Building web assets...
call npm run build
if exist "dist\" (
    xcopy /E /I /Y "dist\*" "release\v%VERSION%\web\"
) else (
    echo Warning: dist directory not found after build
)

:: Create git tag
echo Creating git tag v%VERSION%...
git rev-parse --is-inside-work-tree >nul 2>&1
if %errorlevel% equ 0 (
    git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
    git commit -m "chore: bump version to v%VERSION%"
    git tag -a "v%VERSION%" -m "Release v%VERSION%"
) else (
    echo Warning: Not a git repository, skipping tag creation
)

echo Release v%VERSION% preparation complete!
echo -------------------------------------------------------
echo Instructions for platform-specific builds:
echo 1. macOS Build (MUST run on macOS):
echo    npm run tauri build
echo    Copy generated .dmg / .app to release\v%VERSION%\macos\
echo 2. Windows Build (MUST run on Windows):
echo    npm run tauri build
echo    Copy generated .msi / .exe to release\v%VERSION%\windows\
echo -------------------------------------------------------
