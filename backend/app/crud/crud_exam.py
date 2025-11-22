from sqlalchemy.orm import Session
from app.models.exam import Exam
from app.schemas.exam import ExamCreate

def get_exam(db: Session, exam_id: int):
    return db.query(Exam).filter(Exam.id == exam_id).first()

def get_exams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Exam).offset(skip).limit(limit).all()

def create_exam(db: Session, exam_in: ExamCreate):
    obj = Exam(**exam_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
