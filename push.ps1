# Script automatizado para subir el proyecto a GitHub
$gitPath = "C:\Users\USUARIO\.gemini\antigravity\mingit\cmd\git.exe"
if (-not (Test-Path $gitPath)) {
    $gitPath = "git"
}

Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  NIIMEKEN - Subida Automatizada a GitHub" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "Repositorio: https://github.com/niimekentresislas-dot/niimeken" -ForegroundColor Cyan
Write-Host ""

# Si el usuario pasa el token como parámetro o lo solicita interactivamente
param (
    [string]$Token = ""
)

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "Para subir cambios a GitHub se requiere un Token de Acceso Personal (PAT) de GitHub." -ForegroundColor Yellow
    Write-Host "(Puedes generarlo en: https://github.com/settings/tokens con permiso 'repo')" -ForegroundColor Gray
    Write-Host ""
    $Token = Read-Host "Ingresa o pega tu GitHub Token"
}

if (-not [string]::IsNullOrWhiteSpace($Token)) {
    $remoteUrl = "https://$($Token.Trim())@github.com/niimekentresislas-dot/niimeken.git"
    Write-Host "Subiendo cambios a la rama main..." -ForegroundColor Cyan
    & $gitPath push $remoteUrl main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "¡Subida completada con exito!" -ForegroundColor Green
        Write-Host "Tu repositorio se ha actualizado en: https://github.com/niimekentresislas-dot/niimeken" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Hubo un problema al subir. Por favor verifica que el token tenga permisos 'repo'." -ForegroundColor Red
    }
} else {
    Write-Host "No se ingreso token. Operacion cancelada." -ForegroundColor Red
}
