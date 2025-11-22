CAMPUS SYSTEM — COMPLETE SETUP GUIDE

This guide walks you through setting up the entire Campus System (backend + frontend + database) from scratch.

Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL 12+ (or use Docker)
- Git

Option A: Using Docker (Recommended)
===================================

1. Build and start all services:
   cd /home/shobee/Desktop/CampusSystemDesign
   docker compose up --build

   This will:
   - Start PostgreSQL at localhost:5432
   - Start FastAPI backend at localhost:8000
   - Start React dev server at localhost:5173

2. Run migrations and seed data:
   # In a new terminal, inside the backend container:
   docker compose exec backend alembic upgrade head
   docker compose exec backend python -m app.scripts.seed

3. Access:
   - Frontend: http://localhost:5173
   - API: http://localhost:8000/api/health
   - Swagger Docs: http://localhost:8000/docs

4. Test login:
   - Email: admin@example.com
   - Password: admin123


Option B: Local Setup (without Docker)
======================================

Backend Setup
-------------

1. Create Python virtual environment:
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate

2. Install dependencies:
   pip install -r requirements.txt

3. Create .env file from example:
   cp .env.example .env
   # Edit .env if needed (default points to localhost PostgreSQL)

4. Create database (PostgreSQL must be running):
   createdb campus_dev
   # Or if using psql:
   psql -U postgres -c "CREATE DATABASE campus_dev;"

5. Run migrations:
   alembic upgrade head

6. Seed initial data:
   python -m app.scripts.seed

7. Start backend server:
   uvicorn app.main:app --reload

   Server runs at: http://localhost:8000


Frontend Setup
--------------

1. Install dependencies:
   cd frontend
   npm install

2. Start dev server:
   npm run dev

   Frontend runs at: http://localhost:5173

3. Create .env.local if needed (optional):
   VITE_API_URL=http://localhost:8000/api


Testing the Setup
=================

1. Open http://localhost:5173 in browser
2. Click "Login" link in header
3. Enter credentials:
   - Email: admin@example.com
   - Password: admin123
4. Should redirect to /dashboard

Available test credentials:
   - Admin: admin@example.com / admin123
   - Teacher: teacher@example.com / teacher123
   - Student: student@example.com / student123


API Documentation
=================

Once backend is running, visit:
   http://localhost:8000/docs

This opens Swagger UI with interactive API docs.

Key endpoints:
   POST /api/auth/login          → login and get tokens
   POST /api/auth/register       → create new user
   POST /api/auth/refresh        → refresh access token
   GET  /api/users/me            → current user profile
   GET  /api/students            → list students (admin/teacher)
   GET  /api/modules             → list modules
   GET  /api/majors              → list majors
   GET  /api/announcements       → list announcements
   GET  /api/exams               → list exams
   GET  /api/grades/student/{id} → student grades
   POST /api/requests            → create request


Database Structure
==================

Key tables created:
- users (email, password_hash, role: admin/teacher/student)
- students (cne, cin, birthdate, major_id, semester_id)
- modules (code, name, professor_id)
- majors (name)
- semesters (name, major_id)
- announcements (title, content, target)
- exams (module_id, date, room)
- grades (student_id, module_id, grade)
- requests (student_id, type, status, generated_pdf_url)
- course_materials (module_id, title, file_url)

View schema in: backend/alembic/versions/001_initial.py


Environment Variables
=====================

Backend (.env):
   DATABASE_URL=postgresql+psycopg2://user:pass@host/dbname
   SECRET_KEY=your-secret-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=60

Frontend (.env.local or .env):
   VITE_API_URL=http://localhost:8000/api


Running Tests
=============

Backend tests (coming soon):
   cd backend
   pytest

Frontend tests (coming soon):
   cd frontend
   npm test


Building for Production
=======================

Backend:
   cd backend
   pip install gunicorn
   gunicorn app.main:app --workers 4 --bind 0.0.0.0:8000

Frontend:
   cd frontend
   npm run build
   # dist/ folder contains static files for deployment


Troubleshooting
===============

1. "Connection refused" on backend startup:
   → Check PostgreSQL is running
   → Verify DATABASE_URL in .env

2. "ModuleNotFoundError" when running seed:
   → Ensure you're in the backend directory
   → Run: python -m app.scripts.seed

3. Frontend shows "Cannot GET /":
   → Backend CORS might be misconfigured
   → Check app/main.py CORS settings

4. "Invalid token" error:
   → Clear browser localStorage: F12 → Application → localStorage → clear
   → Log in again


Need Help?
==========

Check the DOC.MD file for architecture details.
Check specific router files in app/api/ for endpoint details.
