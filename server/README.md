Learn2Master - Local Flask backend

This minimal backend is for local development and pilot testing. It provides simple endpoints:

- `POST /api/v1/auth/register` {lin,name,secret,method}
- `POST /api/v1/auth/login` {lin,name,secret}
- `POST /api/v1/sync/upload` {queue: [...]}
- `GET /api/v1/recommendations/<lin>`

Run locally:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

This backend is intentionally small — use it to test client-side sync and auth migration.
