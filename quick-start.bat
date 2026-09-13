@echo off
chcp 65001 >nul
title شروع سریع - HR Dashboard
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║     شروع سریع سیستم مدیریت منابع انسانی                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: بررسی نصب بودن Node.js
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

:: نمایش نسخه Node
echo ✅ Node.js نصب است:
node --version
echo.

:: بررسی node_modules
if not exist "node_modules\" (
    echo 📦 پکیج‌ها نصب نشده‌اند. در حال نصب...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ خطا در نصب پکیج‌ها!
        pause
        exit /b 1
    )
    echo.
    echo ✅ نصب پکیج‌ها انجام شد!
    echo.
)

echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 در حال اجرای سرور...
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo   🌐 آدرس: http://localhost:3000
echo.
echo   🔐 اطلاعات ورود:
echo      نام کاربری: admin
echo      رمز عبور:   12345
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo برای توقف: Ctrl+C
echo.

:: باز کردن مرورگر بعد از 3 ثانیه
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

call npm run dev
pause
