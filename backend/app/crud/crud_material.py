from sqlalchemy.orm import Session
from app.models.course_material import CourseMaterial
from app.schemas.course_material import CourseMaterialCreate

def get_material(db: Session, material_id: int):
    return db.query(CourseMaterial).filter(CourseMaterial.id == material_id).first()

def get_materials_by_module(db: Session, module_id: int):
    return db.query(CourseMaterial).filter(CourseMaterial.module_id == module_id).all()

def create_material(db: Session, material_in: CourseMaterialCreate):
    obj = CourseMaterial(**material_in.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
