@echo off
title HR Dashboard - Setup and Build
echo.
echo ========================================
echo   HR Dashboard - Setup and Build
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

:: Install packages if needed
if not exist "node_modules\" (
    echo Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Installation failed!
        pause
        exit /b 1
    )
    echo Installation completed!
    echo.
) else (
    echo Packages already installed
    echo.
)

:: Build
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build completed!
echo.

echo ========================================
echo.
echo Project is ready!
echo.
echo Output files: dist/
echo.
echo To run dev server:
echo    Run start.bat
echo.
echo Or open dist/index.html in browser
echo.
echo ========================================
echo.
pause
