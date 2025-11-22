 
CAMPUS SYSTEM — COMPLETE SPECIFICATION

Overview
--------

This document describes a simple, practical Campus Management System using a Python (FastAPI) backend, a React frontend, and PostgreSQL for persistent storage. It contains module definitions, architecture, database schema, API endpoints, examples and developer setup instructions so you can scaffold a working prototype quickly.

Tech Stack
----------

- Backend: `Python 3.10+`, `FastAPI`, `SQLAlchemy` (core ORM), `Alembic` for migrations
- Frontend: `React` (Vite), `React Router`, `Axios` for HTTP, `Zustand` or `Redux` optional
- Database: `PostgreSQL`
- Auth: JWT (access + refresh tokens)
- Storage: local filesystem or AWS S3 (configurable)
- Dev tooling: `Docker` + `docker-compose` (recommended), `pytest` (tests)

1. System Modules
-----------------

Core Student System
- Student Accounts
- Authentication & Roles
- Student Profiles
- Academic Calendar
- Programs / Majors / Semesters
- Module & Course Management
- Groups & Sections

Learning System (LMS)
- Courses
- Materials (PDFs, slides)
- Assignments
- Quizzes
- Attendance

Administrative Services
- Certificate Requests
- Administrative Requests
- Document Downloads
- Appointment Booking

Exams System
- Exam Schedule
- Exam Rooms & Seating
- Convocations
- Grades
- Module Validation
- Rattrapage (makeup exams)

Communication
- Announcements
- Notifications
- Messaging (optional)

Admin Panel
- Student Management
- Teacher Management
- Program Structure
- Rooms Management
- Exam Planning
- Dashboard & Statistics

2. System Architecture
----------------------

High-level components

- Frontend (React): Single-page app served separately (dev server) or built and served via a static server.
- Backend (FastAPI): REST JSON API, handles business logic, authentication, file uploads, background tasks.
- Database (Postgres): Relational data store.
- Storage: local directory for simple setups; S3-compatible for production.

Communication

- Frontend calls backend via HTTPS (Axios). Backend exposes REST endpoints grouped by resource.
- JWT used for stateless auth. Sensitive routes require `Authorization: Bearer <token>`.

Optional services
- PDF generation microservice (for certificates)
- Email worker (Celery / RQ) or FastAPI background tasks

3. Database Design (Schema)
---------------------------

Key tables and important fields (normalized):

Users
- `id` (PK)
- `email` (unique)
- `password_hash`
- `role` (enum: student, teacher, admin)
- `is_active`, `created_at`

Students
- `id` (PK)
- `user_id` (FK -> users.id)
- `cne`, `cin` (identifiers)
- `birthdate`
- `major_id` (FK -> majors.id)
- `semester_id` (FK -> semesters.id)

Teachers
- `id`
- `user_id` (FK -> users.id)
- `department`

Majors
- `id`
- `name`

Semesters
- `id`
- `name`
- `major_id` (FK)

Modules
- `id`
- `code`
- `name`
- `semester_id` (FK)
- `professor_id` (FK -> teachers.id)

CourseMaterials
- `id`
- `module_id` (FK)
- `title`
- `file_url`
- `uploaded_by`

Announcements
- `id`
- `title`
- `content`
- `target` (enum: all, major, semester, group)
- `created_at`

Requests (administrative)
- `id`
- `student_id`
- `type`
- `status` (pending, approved, rejected)
- `generated_pdf_url`

Exams
- `id`
- `module_id`
- `date` (timestamp)
- `room_id`

Grades
- `id`
- `student_id`
- `module_id`
- `grade` (decimal)

Notes
- Add many-to-many tables as needed (e.g., `student_modules`, `group_members`).

4. API Design (Representative Endpoints)
---------------------------------------

Auth
- POST `/api/auth/register` — register user (admin creates teacher/admin; students via registration or import)
- POST `/api/auth/login` — body `{email, password}` → returns `{access_token, refresh_token, user}`
- POST `/api/auth/refresh` — refresh access token

Users
- GET `/api/users/me` — current user profile
- GET `/api/users/{id}` — admin only

Students
- GET `/api/students` — list (admin/teacher)
- GET `/api/students/{id}` — detail
- POST `/api/students` — create (admin)
- PUT `/api/students/{id}` — update

Majors / Semesters / Modules
- CRUD endpoints under `/api/majors`, `/api/semesters`, `/api/modules`

Materials
- POST `/api/modules/{module_id}/materials` — upload file (multipart/form-data)
- GET `/api/modules/{module_id}/materials` — list materials
- GET `/api/materials/{id}/download` — serve file (protected)

Announcements
- GET `/api/announcements` — public filtered by target
- POST `/api/announcements` — admin/teacher

Requests
- POST `/api/requests` — create administrative request
- GET `/api/requests` — student sees own; admin sees all
- POST `/api/requests/{id}/generate-pdf` — trigger PDF generation (background)

Exams
- GET `/api/exams` — schedule
- POST `/api/exams` — admin

Grades
- GET `/api/students/{id}/grades`
- POST `/api/grades` — teacher inputs grade

Error handling
- Use consistent JSON error format: `{detail: 'message', code: 'ERR_CODE'}`

Auth/Authorization
- Protect write routes with role checks. Example: `@requires_roles('admin')` or dependency that checks `current_user.role`.

5. Example FastAPI Snippets
--------------------------

Pip dependencies (example)

```text
fastapi
uvicorn[standard]
sqlalchemy
alembic
psycopg[binary]
python-jose[cryptography]
passlib[bcrypt]
python-multipart
pydantic
gunicorn
boto3  # optional for S3
```

Minimal SQLAlchemy model example (simplified)

```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class RoleEnum(str, enum.Enum):
      student = "student"
      teacher = "teacher"
      admin = "admin"

class User(Base):
      __tablename__ = "users"
      id = Column(Integer, primary_key=True, index=True)
      email = Column(String, unique=True, index=True, nullable=False)
      password_hash = Column(String, nullable=False)
      role = Column(Enum(RoleEnum), default=RoleEnum.student)

class Student(Base):
      __tablename__ = "students"
      id = Column(Integer, primary_key=True)
      user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
      cne = Column(String, unique=True)
      major_id = Column(Integer, ForeignKey("majors.id"))
      user = relationship("User")
```

Authentication utilities (sketch)

```python
from datetime import datetime, timedelta
from jose import jwt

SECRET = "your-secret-key"

def create_access_token(data: dict, expires_delta: timedelta | None = None):
      to_encode = data.copy()
      expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
      to_encode.update({"exp": expire})
      encoded = jwt.encode(to_encode, SECRET, algorithm="HS256")
      return encoded
```

File upload endpoint (sketch)

```python
from fastapi import APIRouter, UploadFile, File, Depends
router = APIRouter()

@router.post("/modules/{module_id}/materials")
async def upload_material(module_id: int, file: UploadFile = File(...), current_user=Depends(get_current_user)):
      # check permissions
      path = f"uploads/modules/{module_id}/{file.filename}"
      with open(path, "wb") as f:
            f.write(await file.read())
      # save record in DB with file_url = path
      return {"file_url": path}
```

6. Frontend Structure (React)
----------------------------

Suggested project layout

```
src/
   api/
      client.ts        # Axios wrapper
      auth.ts
   components/
   pages/
      Login.tsx
      Dashboard.tsx
      Admin/
   store/             # Zustand or Redux
   App.tsx
   main.tsx
```

Axios client example

```ts
import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(config => {
   const token = localStorage.getItem('access_token');
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
});

export default api;
```

Simple login flow (sketch)

```tsx
// pages/Login.tsx
import React, {useState} from 'react';
import api from '../api/client';

export default function Login(){
   const [email,setEmail] = useState('');
   const [password,setPassword] = useState('');
   async function submit(e){
      e.preventDefault();
      const res = await api.post('/auth/login',{email,password});
      localStorage.setItem('access_token', res.data.access_token);
      // redirect to dashboard
   }
   return (
      <form onSubmit={submit}>
         <input value={email} onChange={e=>setEmail(e.target.value)} />
         <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
         <button>Login</button>
      </form>
   );
}
```

7. Dev / Docker Compose (example)
---------------------------------

Example `docker-compose.yml` for local development

```yaml
version: '3.8'
services:
   db:
      image: postgres:15
      environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: campus_dev
      volumes:
         - db_data:/var/lib/postgresql/data
      ports:
         - "5432:5432"

   backend:
      build: ./backend
      command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
      volumes:
         - ./backend:/app
         - ./uploads:/app/uploads
      environment:
         DATABASE_URL: postgresql+psycopg2://postgres:postgres@db:5432/campus_dev
         SECRET_KEY: "dev-secret"
      ports:
         - "8000:8000"
      depends_on:
         - db

   frontend:
      build: ./frontend
      command: yarn dev --host
      ports:
         - "5173:5173"
      volumes:
         - ./frontend:/app

volumes:
   db_data:
```

Dev commands (local, non-Docker)

```bash
# Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

8. Migrations & Data Seeding
---------------------------

- Use Alembic for migrations. Create initial models, then `alembic revision --autogenerate -m "init"` and `alembic upgrade head`.
- Provide a small seed script to create an admin user and sample majors/modules for dev.

9. Testing
----------

- Backend: `pytest` for unit tests and API tests using `httpx` and FastAPI's TestClient.
- Frontend: component tests with React Testing Library and end-to-end with Playwright (optional).

10. Production Notes
--------------------

- Use environment variables for secrets. Do not commit `SECRET_KEY` to source.
- Serve static frontend from CDN or Nginx. Use Gunicorn + Uvicorn workers for backend.
- Configure HTTPS (Let's Encrypt) and database backups.
- For S3 storage, use `boto3` with credentials from environment.

11. Roadmap & Milestones (refined)
---------------------------------

- Phase 1 — Setup (0.5–1 day): repo, Docker, DB, basic models
- Phase 2 — Auth (0.5–1 day): JWT, registration, role checks
- Phase 3 — Core CRUD (1–2 days): students, majors, modules
- Phase 4 — Frontend MVP (2–4 days): login, dashboard, basic views
- Phase 5 — Student Services (3–6 days): materials, announcements, requests
- Phase 6 — Exams & Grades (3–6 days): scheduling, convocation, grading
- Phase 7 — Polish & Deploy (2–4 days): UI polish, tests, CI/CD

12. Next Steps (recommended immediate tasks)
-----------------------------------------

- Initialize repo folders: `backend/` and `frontend/` and minimal `docker-compose.yml`.
- Implement core models and run Alembic migrations.
- Add auth endpoints and a basic React login page.

Appendix — Useful snippets
-------------------------

- Example environment variables

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/campus_dev
SECRET_KEY=your-production-secret
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
```

- Minimal `README.md` instructions should include how to run via Docker and how to configure `.env`.

If you'd like, I can now:

- scaffold the `backend/` and `frontend/` folders with minimal starter files,
- create a `docker-compose.yml` and basic `README.md`, or
- implement the authentication endpoints and models in `backend/`.

Tell me which next step you want me to take and I will continue.

