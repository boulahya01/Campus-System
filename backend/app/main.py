from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, users, students, modules, materials, majors, semesters, announcements, exams, grades, requests, teachers

app = FastAPI(title="Campus System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["teachers"])
app.include_router(modules.router, prefix="/api/modules", tags=["modules"])
app.include_router(materials.router, prefix="/api", tags=["materials"])
app.include_router(majors.router, prefix="/api/majors", tags=["majors"])
app.include_router(semesters.router, prefix="/api/semesters", tags=["semesters"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["announcements"])
app.include_router(exams.router, prefix="/api/exams", tags=["exams"])
app.include_router(grades.router, prefix="/api/grades", tags=["grades"])
app.include_router(requests.router, prefix="/api/requests", tags=["requests"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
