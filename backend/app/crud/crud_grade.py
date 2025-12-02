from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.grade import Grade
from app.models.module import Module
from app.schemas.grade import GradeCreate
from typing import List, Dict, Any, Optional

def get_grade(db: Session, grade_id: int):
    return db.query(Grade).filter(Grade.id == grade_id).first()

def get_grades_by_student(db: Session, student_id: int):
    return db.query(Grade).filter(Grade.student_id == student_id).all()

def get_grades_by_student_with_details(db: Session, student_id: int) -> List[Dict[str, Any]]:
    """Get all grades for a student with module details"""
    grades = db.query(
        Grade.id,
        Grade.student_id,
        Grade.module_id,
        Grade.grade,
        Module.name.label("module_name"),
        Module.code.label("module_code"),
        Module.credits,
    ).join(
        Module, Grade.module_id == Module.id
    ).filter(
        Grade.student_id == student_id
    ).all()
    
    result = []
    for g in grades:
        result.append({
            "id": g.id,
            "student_id": g.student_id,
            "module_id": g.module_id,
            "grade": g.grade,
            "module_name": g.module_name,
            "module_code": g.module_code,
            "credits": g.credits or 3,
            "date": None  # Add timestamp if Grade model has one
        })
    return result

def calculate_gpa(db: Session, student_id: int) -> float:
    """Calculate GPA for a student"""
    grades = get_grades_by_student(db, student_id)
    if not grades or not any(g.grade for g in grades):
        return 0.0
    graded = [g.grade for g in grades if g.grade is not None]
    if not graded:
        return 0.0
    return sum(graded) / len(graded)

def create_grade(db: Session, grade_in: GradeCreate):
    obj = Grade(**grade_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
