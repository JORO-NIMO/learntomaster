# Learn2Master Platform

Welcome to the Learn2Master platform. This project consists of a React frontend and a Flask (Python) backend.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **Node.js** (v18 or higher) & **npm** - [Download Node.js](https://nodejs.org/)
2.  **Python** (v3.8 or higher) - [Download Python](https://www.python.org/downloads/)

## Quick Start Guide

### 1. Backend Setup (Python/Flask)

The backend handles API requests, database operations, and AI services.

**Terminal 1:**

```bash
# Navigate to the server directory
cd server

# Create a virtual environment (Recommended)
# Windows:
python -m venv venv
venv\Scripts\activate

# Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The server will start at `http://localhost:5000`.

### 2. Frontend Setup (React/Vite)

The frontend is the user interface for the platform.

**Terminal 2:**

```bash
# Navigate to the project root (if not already there)
cd learn2master/learntomaster

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080` (or the port shown in your terminal).

## Key Components

-   **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui.
-   **Backend**: Flask, SQLite (auto-initialized on first run).
-   **Database**: Located at `server/data.db`.

## Configuration

### Environment Variables

A `.env.example` file is provided in the root. To customize the setup (e.g., if running the backend on a different port), copy it to `.env`:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
VITE_SERVER_URL=http://localhost:5000
```


## Browser Support

This application is designed to run on all modern browsers, including:
- Google Chrome (Desktop & Mobile)
- Mozilla Firefox
- Microsoft Edge
- Safari (macOS & iOS)
- Opera

We use standard web technologies and polyfills where necessary to ensure broad compatibility (including fixes for cryptographic operations like PBKDF2).

## AI Service Setup

To enable the AI features (OpenAI, Gemini, Anthropic), you must install the additional python dependencies:

```bash
cd server
pip install -r requirements.txt
```

Then, configure your API keys in the `.env` file (or system environment variables):

```env
AI_PROVIDER=openai  # or gemini, anthropic
AI_API_KEY=your_api_key_here
```

## Troubleshooting

-   **Port Conflicts**: If port 5000 or 8080 is in use, the applications may fail to start.
    -   *Frontend*: Vite will automatically try the next available port.
    -   *Backend*: Edit `server/app.py` or check console output.
-   **Database Errors**: If you encounter database issues, delete `server/data.db` and restart the backend. It will be recreated automatically.
-   **"Module not found" in Python**: Ensure you have activated your virtual environment and installed `requirements.txt`.
