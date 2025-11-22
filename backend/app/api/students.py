from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_student import get_student, get_students, create_student
from app.schemas.student import StudentRead, StudentCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[StudentRead])
def list_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_students(db, skip=skip, limit=limit)

@router.get("/{student_id}", response_model=StudentRead)
def read_student(student_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_student(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Student not found")
    return obj

@router.post("/", response_model=StudentRead)
def create_student_endpoint(payload: StudentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_student(db, payload)
