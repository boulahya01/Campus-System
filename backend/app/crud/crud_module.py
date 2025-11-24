from sqlalchemy.orm import Session
from app.models.module import Module
from app.schemas.module import ModuleCreate, ModuleUpdate

def get_module(db: Session, module_id: int):
    return db.query(Module).filter(Module.id == module_id).first()

def get_modules(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Module).offset(skip).limit(limit).all()

def get_modules_by_semester(db: Session, semester_id: int):
    return db.query(Module).filter(Module.semester_id == semester_id).all()

def create_module(db: Session, module_in: ModuleCreate):
    obj = Module(**module_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_module(db: Session, module_id: int, module_in: ModuleUpdate):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        return None
    data = module_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(module, field, value)
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


def delete_module(db: Session, module_id: int):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        return None
    db.delete(module)
    db.commit()
    return module
