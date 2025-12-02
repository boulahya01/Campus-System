from sqlalchemy.orm import Session
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate
from typing import Optional

def get_student(db: Session, student_id: int):
    return db.query(Student).filter(Student.id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Student).offset(skip).limit(limit).all()

def get_student_by_user_id(db: Session, user_id: int):
    return db.query(Student).filter(Student.user_id == user_id).first()

def create_student(db: Session, student_in: StudentCreate):
    obj = Student(**student_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_student(db: Session, student_id: int, student_in: StudentUpdate) -> Optional[Student]:
    """Update a student profile"""
    student = get_student(db, student_id)
    if not student:
        return None
    
    data = student_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(student, field, value)
    
    db.add(student)
    db.commit()
    db.refresh(student)
    return student
