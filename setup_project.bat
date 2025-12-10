@echo off
echo ==========================================
echo   Learn2Master Project Setup (Windows)
echo ==========================================

echo.
echo [1/4] Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Python is not installed. Please install it from https://python.org/
    pause
    exit /b 1
)
echo Prerequisites found.

echo.
echo [2/4] Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing npm dependencies.
    pause
    exit /b 1
)

echo.
echo [3/4] Setting up Backend Environment...
cd server
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing python dependencies.
    pause
    cd ..
    exit /b 1
)
cd ..

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo To start the project:
echo.
echo 1. Open TWO terminal windows.
echo.
echo Terminal 1 (Backend):
echo   cd server
echo   venv\Scripts\activate
echo   python app.py
echo.
echo Terminal 2 (Frontend):
echo   npm run dev
echo.
pause
