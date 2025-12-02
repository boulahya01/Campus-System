from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.session import get_db
from app.crud.crud_grade import get_grade, get_grades_by_student, get_grades_by_student_with_details, calculate_gpa, create_grade
from app.schemas.grade import GradeRead, GradeCreate, GradeWithDetails
from app.deps import get_current_user, require_role

router = APIRouter()

@router.get("/student/{student_id}", response_model=List[GradeWithDetails])
def get_student_grades(student_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get all grades for a specific student with module details"""
    # students can only see their own; teachers/admin see all
    if user.role == "student" and user.id != student_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return get_grades_by_student_with_details(db, student_id)

@router.get("/student/{student_id}/gpa")
def get_student_gpa(student_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)) -> Dict[str, Any]:
    """Get GPA for a specific student"""
    # students can only see their own; teachers/admin see all
    if user.role == "student" and user.id != student_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    gpa = calculate_gpa(db, student_id)
    return {"student_id": student_id, "gpa": round(gpa, 2)}

@router.post("/", response_model=GradeRead)
def create_grade_endpoint(payload: GradeCreate, db: Session = Depends(get_db), user=Depends(require_role('admin','teacher'))):
    """Create a new grade (admin or teacher only)"""
    return create_grade(db, payload)
