from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_grade import get_grade, get_grades_by_student, create_grade
from app.schemas.grade import GradeRead, GradeCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/student/{student_id}", response_model=List[GradeRead])
def get_student_grades(student_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # students can only see their own; teachers/admin see all
    if user.role == "student" and user.id != student_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return get_grades_by_student(db, student_id)

@router.post("/", response_model=GradeRead)
def create_grade_endpoint(payload: GradeCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # only teachers/admin can input grades
    if user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_grade(db, payload)
