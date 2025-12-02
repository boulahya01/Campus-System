from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.models.module import Module
from app.models.teacher import Teacher
from app.models.semester import Semester
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate

def get_enrollment(db: Session, enrollment_id: int) -> Optional[Enrollment]:
    """Get an enrollment by ID"""
    return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

def get_enrollments(db: Session, skip: int = 0, limit: int = 100) -> List[Enrollment]:
    """Get all enrollments with pagination"""
    return db.query(Enrollment).offset(skip).limit(limit).all()

def get_student_enrollments(db: Session, student_id: int, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get enrollments for a specific student with module details"""
    enrollments = db.query(
        Enrollment.id,
        Enrollment.student_id,
        Enrollment.module_id,
        Enrollment.enrolled_at,
        Enrollment.status,
        Module.name.label("module_name"),
        Module.code.label("module_code"),
        Semester.name.label("semester"),
        Teacher.user_id
    ).join(
        Module, Enrollment.module_id == Module.id
    ).outerjoin(
        Semester, Module.semester_id == Semester.id
    ).outerjoin(
        Teacher, Module.teacher_id == Teacher.id
    ).filter(
        Enrollment.student_id == student_id
    ).offset(skip).limit(limit).all()
    
    result = []
    for e in enrollments:
        # Get teacher email if available
        teacher_email = None
        if e.user_id:
            from app.models.user import User
            teacher_user = db.query(User).filter(User.id == e.user_id).first()
            teacher_email = teacher_user.email if teacher_user else None
        
        result.append({
            "id": e.id,
            "student_id": e.student_id,
            "module_id": e.module_id,
            "enrolled_at": e.enrolled_at,
            "status": e.status,
            "module_name": e.module_name,
            "module_code": e.module_code,
            "semester": e.semester,
            "professor_email": teacher_email
        })
    
    return result

def check_enrollment_exists(db: Session, student_id: int, module_id: int) -> bool:
    """Check if a student is already enrolled in a module"""
    return db.query(Enrollment).filter(
        and_(
            Enrollment.student_id == student_id,
            Enrollment.module_id == module_id
        )
    ).first() is not None

def create_enrollment(db: Session, payload: EnrollmentCreate) -> Enrollment:
    """Create a new enrollment"""
    # Check if already enrolled
    if check_enrollment_exists(db, payload.student_id, payload.module_id):
        raise ValueError("Student is already enrolled in this module")
    
    db_obj = Enrollment(**payload.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_enrollment(db: Session, enrollment_id: int) -> Optional[Enrollment]:
    """Delete an enrollment"""
    db_obj = get_enrollment(db, enrollment_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj

def drop_enrollment(db: Session, enrollment_id: int) -> Optional[Enrollment]:
    """Drop an enrollment by marking status as dropped"""
    db_obj = get_enrollment(db, enrollment_id)
    if db_obj:
        db_obj.status = "dropped"
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
    return db_obj
