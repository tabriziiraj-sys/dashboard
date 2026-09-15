@echo off
title Start HR Dashboard
echo.
echo ========================================
echo   Starting HR Dashboard Server
echo ========================================
echo.
echo Server will run at: http://localhost:3000
echo.
echo Login Info:
echo   Username: admin
echo   Password: 12345
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause
