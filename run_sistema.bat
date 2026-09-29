@echo off
title Cine Regina - Sistema de Informacion
echo ========================================================
echo   Iniciando Servidor de Cine Regina (Flask + Frontend)
echo ========================================================
echo.
echo Abriendo servidor en http://localhost:5000 ...
echo Para detener el sistema presiona Ctrl + C en esta ventana.
echo.
cd backend
python app.py
pause
