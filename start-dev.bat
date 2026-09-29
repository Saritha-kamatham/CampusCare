@echo off
echo ===================================================================
echo   CampusCare - Smart Campus Service & Issue Management Platform
echo ===================================================================
echo Starting CampusCare services locally...

set "ROOT_DIR=%~dp0"

echo [1/2] Starting Spring Boot Backend (Port 8080)...
start "CampusCare Backend" cmd /k "cd /d %ROOT_DIR%backend && mvn spring-boot:run -Dspring-boot.run.profiles=h2"

timeout /t 5 /nobreak >nul

echo [2/2] Starting React Vite Frontend (Port 5173)...
start "CampusCare Frontend" cmd /k "cd /d %ROOT_DIR%frontend && npm run dev"

echo.
echo ===================================================================
echo   Both services are launching!
echo   Frontend UI : http://localhost:5173
echo   Backend API : http://localhost:8080/api
echo   Demo Admin  : admin@campuscare.com / admin123
echo   Demo Staff  : staff2@campuscare.com / staff123
echo   Demo Student: student1@campuscare.com / student123
echo ===================================================================
