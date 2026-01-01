@echo off
echo ====================================
echo Red Connect API Server
echo ====================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Check if .env exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Please create a .env file with your MySQL credentials
    echo.
    pause
    exit /b 1
)

REM Start the server
echo.
echo Starting server...
echo API Docs will be available at: http://localhost:8000/docs
echo Press CTRL+C to stop the server
echo.
uvicorn main:app --reload --host 0.0.0.0 --port 8000

