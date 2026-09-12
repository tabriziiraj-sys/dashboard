@echo off
chcp 65001 >nul
title سیستم مدیریت منابع انسانی - همه کارها
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║     سیستم مدیریت منابع انسانی - نصب و اجرا              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: بررسی Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js نصب نیست!
    echo.
    echo لطفاً Node.js را از آدرس زیر دانلود و نصب کنید:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version
echo.

:: نصب پکیج‌ها
if not exist "node_modules\" (
    echo 📦 در حال نصب پکیج‌ها...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ خطا در نصب!
        pause
        exit /b 1
    )
    echo ✅ نصب انجام شد!
    echo.
) else (
    echo ✅ پکیج‌ها قبلاً نصب شده‌اند
    echo.
)

:: Build
echo 🔨 در حال ساخت پروژه...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ خطا در ساخت!
    pause
    exit /b 1
)
echo ✅ ساخت انجام شد!
echo.

echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ پروژه با موفقیت آماده شد!
echo.
echo 📁 فایل‌های خروجی: dist/
echo.
echo 🚀 برای اجرای سرور توسعه:
echo    start.bat را اجرا کنید
echo.
echo 🌐 یا فایل dist/index.html را در مرورگر باز کنید
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
