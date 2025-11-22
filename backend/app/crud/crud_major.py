from sqlalchemy.orm import Session
from app.models.major import Major
from app.schemas.major import MajorCreate

def get_major(db: Session, major_id: int):
    return db.query(Major).filter(Major.id == major_id).first()

def get_majors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Major).offset(skip).limit(limit).all()

def create_major(db: Session, major_in: MajorCreate):
    obj = Major(**major_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
