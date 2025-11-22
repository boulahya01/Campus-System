Campus System — Starter

This workspace contains a starter scaffold for a Campus System with a `backend/` (FastAPI) and `frontend/` (React + Vite) plus `docker-compose.yml` for local development.

Quick start (Docker):

```bash
# from repo root
docker compose up --build
```

Backend (local):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# run migrations (Alembic) when configured
uvicorn app.main:app --reload
```

Frontend (local):

```bash
cd frontend
npm install
npm run dev
```

Environment variables: copy `backend/.env.example` to `.env` and edit as needed.

Next steps:
- Implement auth endpoints and DB migrations
- Flesh out models and frontend pages
- Add tests and CI
