from sqlalchemy.orm import Session
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate

def get_teacher(db: Session, teacher_id: int):
    return db.query(Teacher).filter(Teacher.id == teacher_id).first()

def get_teachers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Teacher).offset(skip).limit(limit).all()

def create_teacher(db: Session, teacher_in: TeacherCreate):
    obj = Teacher(**teacher_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
