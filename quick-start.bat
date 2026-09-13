@echo off
title HR Dashboard - Quick Start
echo.
echo ========================================
echo   HR Dashboard - Quick Start
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
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Installation failed!
        pause
        exit /b 1
    )
    echo.
    echo Installation completed!
    echo.
)

echo ========================================
echo.
echo Starting server...
echo.
echo ========================================
echo.
echo   URL: http://localhost:3000
echo.
echo   Login:
echo     Username: admin
echo     Password: 12345
echo.
echo ========================================
echo.
echo Press Ctrl+C to stop
echo.

:: Open browser after 3 seconds
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

call npm run dev
pause
