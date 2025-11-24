from sqlalchemy.orm import Session
from app.models.semester import Semester
from app.schemas.semester import SemesterCreate, SemesterUpdate

def get_semester(db: Session, semester_id: int):
    return db.query(Semester).filter(Semester.id == semester_id).first()

def get_semesters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Semester).offset(skip).limit(limit).all()
    
def update_semester(db: Session, semester_id: int, semester_in: SemesterUpdate):
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        return None
    data = semester_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(semester, field, value)
    db.add(semester)
    db.commit()
    db.refresh(semester)
    return semester

def delete_semester(db: Session, semester_id: int):
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        return None
    db.delete(semester)
    db.commit()
    return semester

def create_semester(db: Session, semester_in: SemesterCreate):
    obj = Semester(**semester_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
