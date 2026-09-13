@echo off
title Build HR Dashboard
echo.
echo ========================================
echo   Building HR Dashboard Production
echo ========================================
echo.
echo Building project...
echo.
call npm run build
echo.
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Build completed successfully!
    echo ========================================
    echo.
    echo Output files are in the dist folder
) else (
    echo.
    echo ERROR: Build failed!
)
echo.
pause
