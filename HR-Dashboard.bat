@echo off
title HR Dashboard - Main Menu
:MENU
cls
echo.
echo ========================================
echo   HR Dashboard - Main Menu
echo ========================================
echo.
echo   1. Install packages (first time)
echo.
echo   2. Start project (Development)
echo.
echo   3. Build Production version
echo.
echo   4. View help
echo.
echo   5. Exit
echo.
echo ========================================
echo.
set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto START
if "%choice%"=="3" goto BUILD
if "%choice%"=="4" goto HELP
if "%choice%"=="5" exit
echo.
echo Invalid choice! Please try again.
timeout /t 2 >nul
goto MENU

:INSTALL
call install.bat
goto MENU

:START
call start.bat
goto MENU

:BUILD
call build.bat
goto MENU

:HELP
cls
echo.
echo ========================================
echo              HELP GUIDE
echo ========================================
echo.
echo HOW TO USE:
echo.
echo   1. First run option 1 (Install packages)
echo   2. Then run option 2 (Start project)
echo   3. Open browser: http://localhost:3000
echo.
echo ========================================
echo.
echo LOGIN INFO:
echo   Username: admin
echo   Password: 12345
echo.
echo ========================================
echo.
echo FILES:
echo   install.bat  - Install packages
echo   start.bat    - Start dev server
echo   build.bat    - Build production
echo   README.md    - Full documentation
echo.
echo ========================================
echo.
echo REQUIREMENTS:
echo   Node.js 18 or higher
echo   npm 9 or higher
echo.
echo Download Node.js from:
echo https://nodejs.org/
echo.
echo ========================================
echo.
pause
goto MENU
