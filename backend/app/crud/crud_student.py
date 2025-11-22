from sqlalchemy.orm import Session
from app.models.student import Student
from app.schemas.student import StudentCreate

def get_student(db: Session, student_id: int):
    return db.query(Student).filter(Student.id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Student).offset(skip).limit(limit).all()

def create_student(db: Session, student_in: StudentCreate):
    obj = Student(**student_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
