from sqlalchemy.orm import Session
from app.models.major import Major
from app.schemas.major import MajorCreate, MajorUpdate

def get_major(db: Session, major_id: int):
    return db.query(Major).filter(Major.id == major_id).first()

def get_majors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Major).offset(skip).limit(limit).all()


def update_major(db: Session, major_id: int, major_in: MajorUpdate):
    major = db.query(Major).filter(Major.id == major_id).first()
    if not major:
        return None
    data = major_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(major, field, value)
    db.add(major)
    db.commit()
    db.refresh(major)
    return major


def delete_major(db: Session, major_id: int):
    major = db.query(Major).filter(Major.id == major_id).first()
    if not major:
        return None
    db.delete(major)
    db.commit()
    return major
def create_major(db: Session, major_in: MajorCreate):
    obj = Major(**major_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
