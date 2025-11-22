from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_teacher import get_teacher, get_teachers, create_teacher
from app.schemas.teacher import TeacherRead, TeacherCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TeacherRead])
def list_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return get_teachers(db, skip=skip, limit=limit)

@router.get("/{teacher_id}", response_model=TeacherRead)
def read_teacher(teacher_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_teacher(db, teacher_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return obj

@router.post("/", response_model=TeacherRead)
def create_teacher_endpoint(payload: TeacherCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_teacher(db, payload)
