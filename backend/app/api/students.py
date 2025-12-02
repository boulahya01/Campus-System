from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_student import get_student, get_students, create_student, get_student_by_user_id, update_student
from app.crud.crud_enrollment import get_student_enrollments
from app.crud.crud_grade import get_grades_by_student_with_details, calculate_gpa
from app.schemas.student import StudentRead, StudentCreate, StudentUpdate
from app.deps import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[StudentRead])
def list_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """List all students"""
    return get_students(db, skip=skip, limit=limit)

@router.get("/{student_id}", response_model=StudentRead)
def read_student(student_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get a specific student"""
    obj = get_student(db, student_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Student not found")
    return obj

@router.get("/profile/me")
def get_my_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Get current logged-in student's profile"""
    student = get_student_by_user_id(db, current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.get("/profile/me/enrollments", response_model=List[dict])
def get_my_enrollments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Get current student's enrollments"""
    student = get_student_by_user_id(db, current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return get_student_enrollments(db, student.id, skip=skip, limit=limit)

@router.get("/profile/me/transcript", response_model=List[dict])
def get_my_transcript(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Get current student's transcript (grades with details)"""
    student = get_student_by_user_id(db, current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return get_grades_by_student_with_details(db, student.id)

@router.get("/profile/me/gpa")
def get_my_gpa(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Get current student's GPA"""
    student = get_student_by_user_id(db, current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    gpa = calculate_gpa(db, student.id)
    return {"student_id": student.id, "gpa": round(gpa, 2)}

@router.put("/profile/me", response_model=StudentRead)
def update_my_profile(payload: StudentUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Update current student's profile"""
    student = get_student_by_user_id(db, current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    updated = update_student(db, student.id, payload)
    return updated

@router.post("/", response_model=StudentRead)
def create_student_endpoint(payload: StudentCreate, db: Session = Depends(get_db), user=Depends(require_role('admin'))):
    """Create a new student (admin only)"""
    return create_student(db, payload)
