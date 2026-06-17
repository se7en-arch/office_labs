@echo off
title .office labs - Dev Server
cd /d "%~dp0"

:loop
echo.
echo [%time%] Starting .office labs dev server...
echo Access: http://localhost:3001
echo Network: http://192.168.0.146:3001
echo.
npx next dev --hostname 0.0.0.0 --port 3001 --webpack
echo.
echo [%time%] Server stopped. Restarting in 2 seconds...
timeout /t 2 /nobreak >nul
goto loop
