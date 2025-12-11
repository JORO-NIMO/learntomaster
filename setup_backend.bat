@echo off
echo Setting up Learn2Master Backend...

cd server
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Setup complete!
echo.
echo IMPORTANT:
echo 1. Update .env file with your actual SUPABASE_JWT_SECRET (not the token).
echo 2. Run 'python app.py' to start the server.
echo.
pause
