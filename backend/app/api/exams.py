from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_exam import get_exam, get_exams, get_exams_for_student, create_exam
from app.schemas.exam import ExamRead, ExamCreate
from app.deps import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[ExamRead])
def list_exams(
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """List all exams (filters by student's enrollments if student role)"""
    if current_user.role == "student":
        # For students, return exams from their enrolled courses
        # This requires getting their student_id from Student model
        # For now, return all exams
        return get_exams(db, skip=skip, limit=limit)
    return get_exams(db, skip=skip, limit=limit)

@router.get("/student/{student_id}", response_model=List[dict])
def list_student_exams(
    student_id: int,
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get exams for a specific student's enrolled modules"""
    # Students can only see their own exams
    if current_user.role == "student":
        # In production, verify student_id matches current_user's student_id
        pass
    return get_exams_for_student(db, student_id, skip=skip, limit=limit)

@router.get("/{exam_id}", response_model=ExamRead)
def read_exam(exam_id: int, db: Session = Depends(get_db)):
    """Get a specific exam"""
    obj = get_exam(db, exam_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Exam not found")
    return obj

@router.post("/", response_model=ExamRead)
def create_exam_endpoint(
    payload: ExamCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role('admin'))
):
    """Create a new exam (admin only)"""
    return create_exam(db, payload)
