@echo off
title Niimeken - Subir a GitHub
set GIT_PATH=C:\Users\USUARIO\.gemini\antigravity\mingit\cmd\git.exe
if not exist "%GIT_PATH%" set GIT_PATH=git

echo ========================================================
echo   NIIMEKEN - Subida a GitHub
echo ========================================================
echo Repositorio: https://github.com/niimekentresislas-dot/niimeken
echo.
set /p TOKEN="Ingresa o pega tu GitHub Personal Access Token: "

if "%TOKEN%"=="" (
    echo No se ingreso token.
    pause
    exit /b
)

"%GIT_PATH%" push https://%TOKEN%@github.com/niimekentresislas-dot/niimeken.git main
if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   Subida completada exitosamente!
    echo   Revisa tu web en: https://github.com/niimekentresislas-dot/niimeken
    echo ========================================================
) else (
    echo.
    echo Ocurrio un error al subir. Verifica que el token tenga permisos de escritura.
)
pause
