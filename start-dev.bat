@echo off
title CampusCare - Local Runner
color 0B
echo ===================================================================
echo   CampusCare - Smart Campus Service & Issue Management Platform
echo ===================================================================
echo Setting up environment paths...

set "JAVA_HOME=C:\Users\cool\.tools\jdk-17.0.20.1+1"
set "PATH=C:\Users\cool\.tools\jdk-17.0.20.1+1\bin;C:\Users\cool\.tools\apache-maven-3.9.6\bin;C:\Program Files\nodejs;C:\Users\cool\.tools\git\cmd;%PATH%"

set "ROOT_DIR=C:\Users\cool\.gemini\antigravity\scratch\campuscare\"

echo.
echo [1/2] Starting Spring Boot Backend (Port 8080)...
start "CampusCare Backend" cmd /k "cd /d %ROOT_DIR%backend && set JAVA_HOME=C:\Users\cool\.tools\jdk-17.0.20.1+1 && set PATH=C:\Users\cool\.tools\jdk-17.0.20.1+1\bin;C:\Users\cool\.tools\apache-maven-3.9.6\bin;%%PATH%% && java -jar target\campuscare-backend-1.0.0.jar --spring.profiles.active=h2"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Frontend (Port 5173)...
start "CampusCare Frontend" cmd /k "cd /d %ROOT_DIR%frontend && set PATH=C:\Program Files\nodejs;%%PATH%% && npm run dev"

echo.
echo ===================================================================
echo   Platform is running!
echo.
echo   Open in your browser:
echo   --> Frontend Application : http://localhost:5173
echo   --> Backend REST API    : http://localhost:8080/api
echo.
echo   Demo Login Accounts:
echo   * Admin  : admin@campuscare.com / admin123
echo   * Staff  : staff2@campuscare.com / staff123 (IT Specialist)
echo   * Student: student1@campuscare.com / student123
echo ===================================================================
echo.
pause
