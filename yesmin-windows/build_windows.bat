@echo off
title Building Yesmin AI Assistant .EXE (Windows)
echo ========================================================
echo       YESMIN AI ASSISTANT - EXE BUILDER (WINDOWS)
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js laptop me install nahi mila!
    echo Kripya pehle https://nodejs.org se Node.js install karein.
    pause
    exit /b
)

if not exist node_modules (
    echo [INFO] Dependencies install ki ja rahi hain...
    call npm install
)

echo [INFO] Yesmin Windows Setup aur Portable .EXE build ho raha hai...
call npm run build:win

echo.
echo ========================================================
echo [SUCCESS] Build complete ho gaya hai!
echo Aapki .exe file "dist" folder ke andar milegi:
echo   - Setup: dist\Yesmin AI Assistant Setup 2.5.0.exe
echo   - Portable: dist\Yesmin-AI-Assistant-Portable-2.5.0.exe
echo ========================================================
pause
