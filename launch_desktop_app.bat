@echo off
title Cyber Racer 3D - Standalone Desktop App
echo Dang khoi dong Cyber Racer 3D dang ung dung Windows 11...
start /b python -m http.server 8088 --directory "%~dp0" >nul 2>&1
timeout /t 1 >nul
start msedge.exe --app=http://localhost:8088 --window-size=1280,720
exit
