from sqlalchemy.orm import Session
from app.models.semester import Semester
from app.schemas.semester import SemesterCreate

def get_semester(db: Session, semester_id: int):
    return db.query(Semester).filter(Semester.id == semester_id).first()

def get_semesters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Semester).offset(skip).limit(limit).all()

def create_semester(db: Session, semester_in: SemesterCreate):
    obj = Semester(**semester_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
