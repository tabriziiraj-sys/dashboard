@echo off
chcp 65001 >nul
title Install HR Dashboard
echo.
echo ========================================
echo   Installing HR Dashboard Packages
echo ========================================
echo.
echo Installing required packages...
echo.
call npm install
echo.
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Installation completed successfully!
    echo ========================================
    echo.
    echo Run start.bat to start the project
) else (
    echo.
    echo ERROR: Installation failed!
    echo Please check Node.js and npm
)
echo.
pause
