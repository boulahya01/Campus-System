Backend Structure — quick reference

Purpose
- Keep the backend layout simple and consistent so future developers can find and extend code quickly.

Top-level layout
- `app/` - application package
  - `api/` — FastAPI routers (one file per resource). Prefer: `users.py`, `students.py`, `teachers.py`, `modules.py`, `materials.py`, `announcements.py`, `exams.py`, `grades.py`, `requests.py`, `majors.py`, `semesters.py`, `auth.py`.
  - `crud/` — data access helpers (one file per model). Keep business logic here (DB queries, joins, pagination).
  - `models/` — SQLAlchemy models (one file per model). Use clear names and SQLAlchemy Enum types with `name=` to avoid migrations issues.
  - `schemas/` — Pydantic schemas (DTOs). Use `XCreate` and `XRead` patterns, set `Config.from_attributes = True` for SQLAlchemy compatibility (pydantic v2).
  - `db/` — SQLAlchemy base and session helpers (`base.py`, `session.py` with `get_db` dependency).
  - `core/` — configuration, security, constants (`config.py`, `security.py`). Keep secrets out of repo (use `.env`).
  - `deps.py` — shared FastAPI dependencies (auth helpers, `require_role()` reusable decorator / dependency).
  - `scripts/` — development scripts (seed data, maintenance helpers).

Conventions
- One resource per router file; routers mounted at `/api/<resource>` in `app/main.py`.
- CRUD in `crud/` returns ORM objects or lists; routers handle request/response and permission checks.
- Models: prefer explicit `nullable` and `default` values; use SQLAlchemy `Enum` with `name` to ensure consistent migrations.
- Migrations: Alembic config in `alembic/` with `env.py` reading `DATABASE_URL`; keep `alembic/versions/` under source control.
- Settings: use Pydantic `BaseSettings` in `core/config.py`. Do not commit `.env` with secrets.

Testing
- Add `tests/` later with pytest fixtures; use a separate test DB or in-memory DB for fast runs.

Adding features
1. Add model in `models/`.
2. Add schema in `schemas/`.
3. Add DB helpers in `crud/`.
4. Add router in `api/` and import it in `app/main.py`.
5. Add migrations (alembic revision --autogenerate), review and `alembic upgrade head`.
6. Add frontend endpoints and pages.

Notes
- Keep functions small and single-purpose.
- Add docstrings to new routers and CRUD functions.
- For RBAC use `deps.require_role('admin')` pattern for admin-only endpoints.

```text
# Example quick mapping
app/api/users.py   -> http routes for users
app/crud/crud_user.py -> db functions: get_user, get_user_by_email, create_user
app/models/user.py -> SQLAlchemy User model
app/schemas/user.py -> UserCreate, UserRead
```
