@echo off
chcp 65001 >nul
title سیستم مدیریت منابع انسانی - منوی اصلی
:MENU
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         سیستم مدیریت منابع انسانی - HR Dashboard         ║
echo ║                                                           ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║   1. نصب پکیج‌ها (اولین بار)                             ║
echo ║                                                           ║
echo ║   2. اجرای پروژه (Development)                           ║
echo ║                                                           ║
echo ║   3. ساخت نسخه Production                                ║
echo ║                                                           ║
echo ║   4. مشاهده راهنما                                       ║
echo ║                                                           ║
echo ║   5. خروج                                                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
set /p choice=لطفاً عدد گزینه مورد نظر را وارد کنید: 

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto START
if "%choice%"=="3" goto BUILD
if "%choice%"=="4" goto HELP
if "%choice%"=="5" exit
echo.
echo ❌ گزینه نامعتبر! لطفاً دوباره تلاش کنید.
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
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                      راهنمای استفاده                      ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📋 مراحل استفاده:
echo.
echo   1. ابتدا گزینه 1 (نصب پکیج‌ها) را اجرا کنید
echo   2. سپس گزینه 2 (اجرای پروژه) را انتخاب کنید
echo   3. مرورگر را باز کنید: http://localhost:3000
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🔐 اطلاعات ورود:
echo   نام کاربری: admin
echo   رمز عبور:   12345
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 📁 فایل‌های مهم:
echo   • install.bat  - نصب پکیج‌ها
echo   • start.bat    - اجرای سرور توسعه
echo   • build.bat    - ساخت نسخه Production
echo   • README.md    - راهنمای کامل
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🛠 پیش‌نیازها:
echo   • Node.js نسخه 18 یا بالاتر
echo   • npm نسخه 9 یا بالاتر
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
goto MENU
