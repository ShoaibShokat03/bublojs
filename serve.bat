@echo off
echo Starting simple server on http://localhost:8080
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
