# CampusCare Local Development Launcher for PowerShell
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  CampusCare - Smart Campus Service & Issue Management Platform" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\backend'; mvn spring-boot:run -Dspring-boot.run.profiles=h2"

Start-Sleep -Seconds 5

Write-Host "[2/2] Starting React Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm.cmd run dev"

Write-Host "`n===================================================================" -ForegroundColor Cyan
Write-Host "  Both services launched in separate windows!" -ForegroundColor Green
Write-Host "  Frontend URL : http://localhost:5173" -ForegroundColor White
Write-Host "  Backend URL  : http://localhost:8080/api" -ForegroundColor White
Write-Host "  Demo Admin   : admin@campuscare.com / admin123" -ForegroundColor Yellow
Write-Host "  Demo Staff   : staff2@campuscare.com / staff123" -ForegroundColor Yellow
Write-Host "  Demo Student : student1@campuscare.com / student123" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
