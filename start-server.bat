@echo off
title Zahid Bin Ali Portfolio Local Server
cls
echo Starting Zahid Bin Ali Portfolio Local Server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause