from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_semester import get_semester, get_semesters, create_semester
from app.schemas.semester import SemesterRead, SemesterCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[SemesterRead])
def list_semesters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_semesters(db, skip=skip, limit=limit)

@router.get("/{semester_id}", response_model=SemesterRead)
def read_semester(semester_id: int, db: Session = Depends(get_db)):
    obj = get_semester(db, semester_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Semester not found")
    return obj

@router.post("/", response_model=SemesterRead)
def create_semester_endpoint(payload: SemesterCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_semester(db, payload)
