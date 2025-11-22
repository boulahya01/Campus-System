from sqlalchemy.orm import Session
from app.models.grade import Grade
from app.schemas.grade import GradeCreate

def get_grade(db: Session, grade_id: int):
    return db.query(Grade).filter(Grade.id == grade_id).first()

def get_grades_by_student(db: Session, student_id: int):
    return db.query(Grade).filter(Grade.student_id == student_id).all()

def create_grade(db: Session, grade_in: GradeCreate):
    obj = Grade(**grade_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
