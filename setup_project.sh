#!/bin/bash

echo "=========================================="
echo "  Learn2Master Project Setup (Linux/Mac)"
echo "=========================================="

echo ""
echo "[1/4] Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install it first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed. Please install it first."
    exit 1
fi
echo "Prerequisites found."

echo ""
echo "[2/4] Installing Frontend Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing npm dependencies."
    exit 1
fi

echo ""
echo "[3/4] Setting up Backend Environment..."
cd server
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error installing python dependencies."
    cd ..
    exit 1
fi
cd ..

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "To start the project:"
echo ""
echo "1. Open TWO terminal windows."
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server"
echo "  source venv/bin/activate"
echo "  python3 app.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
