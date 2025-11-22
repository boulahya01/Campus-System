from sqlalchemy.orm import Session
from app.models.module import Module
from app.schemas.module import ModuleCreate

def get_module(db: Session, module_id: int):
    return db.query(Module).filter(Module.id == module_id).first()

def get_modules(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Module).offset(skip).limit(limit).all()

def get_modules_by_semester(db: Session, semester_id: int):
    return db.query(Module).filter(Module.semester_id == semester_id).all()

def create_module(db: Session, module_in: ModuleCreate):
    obj = Module(**module_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
