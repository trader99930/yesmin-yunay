@echo off
title Launching Yesmin AI Assistant (Windows)
echo ========================================================
echo         YESMIN AI ASSISTANT - WINDOWS EDITION
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
    echo [INFO] Pehli baar setup ho raha hai... Dependencies install ki ja rahi hain...
    call npm install
)

echo [INFO] Yesmin AI Assistant start ho raha hai...
call npm start
pause
