**Frontend Quick Start**

- Seed credentials (run `python -m app.scripts.seed` in `backend`):
  - admin@example.com / admin123
  - teacher@example.com / teacher123
  - student@example.com / student123

Base API: `http://localhost:8000` (run backend with `uvicorn app.main:app --reload --port 8000`)

Important endpoints (examples):
- POST `/api/auth/login`  {email, password} -> {access_token, refresh_token}
- POST `/api/auth/register` {email, password, role}
- GET `/api/users/me` -> current user
- GET `/api/modules/` -> list modules
- POST `/api/modules/{id}/upload` (multipart, form fields: `file`, optional `title`) -> material record
- GET `/api/modules/{id}` -> list materials for module (or module detail)
- GET `/api/materials/{id}/download` -> returns `{ url: <presigned> }` for S3 or streams local file

Notes for frontend devs:
- CORS: backend allows `http://localhost:5173` by default.
- Auth: include `Authorization: Bearer <access_token>` header on requests requiring auth.
- File uploads: use multipart/form-data. The minimal `apiClient.ts` (Axios + fetch) is in `frontend/apiClient.ts`.

Example curl (login):

```bash
curl -X POST 'http://localhost:8000/api/auth/login' -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Example upload (using curl):

```bash
curl -X POST 'http://localhost:8000/api/modules/1/upload' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F 'file=@./sample.pdf' \
  -F 'title=Lecture 1'
```
