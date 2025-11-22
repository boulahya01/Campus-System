from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_exam import get_exam, get_exams, create_exam
from app.schemas.exam import ExamRead, ExamCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ExamRead])
def list_exams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_exams(db, skip=skip, limit=limit)

@router.get("/{exam_id}", response_model=ExamRead)
def read_exam(exam_id: int, db: Session = Depends(get_db)):
    obj = get_exam(db, exam_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Exam not found")
    return obj

@router.post("/", response_model=ExamRead)
def create_exam_endpoint(payload: ExamCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_exam(db, payload)
