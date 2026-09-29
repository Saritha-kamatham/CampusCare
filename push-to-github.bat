@echo off
title Push CampusCare to GitHub
color 0A
echo ========================================================
echo   CampusCare - Pushing to GitHub (Saritha-kamatham)
echo ========================================================
echo.
set "PATH=C:\Users\cool\.tools\git\cmd;C:\Users\cool\.tools\git\ucrt64\bin;%PATH%"
cd /d "C:\Users\cool\.gemini\antigravity\scratch\campuscare"

echo Verifying Git repository status...
git remote -v
echo.
echo Connecting to GitHub repository...
echo (If a GitHub sign-in window appears in your browser, please click "Authorize")
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All 137 files uploaded to GitHub!
    echo   Open: https://github.com/Saritha-kamatham/CampusCare
    echo ========================================================
) else (
    echo.
    echo If prompted or if GitHub requires a Personal Access Token:
    echo 1. Generate one at: https://github.com/settings/tokens
    echo 2. Paste the token below:
    echo.
    set /p GHTOKEN="Enter GitHub Token: "
    if not "%GHTOKEN%"=="" (
        git push -u https://%GHTOKEN%@github.com/Saritha-kamatham/CampusCare.git main
    )
)
echo.
pause
