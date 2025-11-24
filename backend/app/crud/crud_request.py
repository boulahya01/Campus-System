from sqlalchemy.orm import Session
from app.models.request import Request
from app.schemas.request import RequestCreate

def get_request(db: Session, request_id: int):
    return db.query(Request).filter(Request.id == request_id).first()

def get_requests_by_student(db: Session, student_id: int):
    return db.query(Request).filter(Request.student_id == student_id).all()

def get_all_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Request).offset(skip).limit(limit).all()

def create_request(db: Session, request_in: RequestCreate):
    obj = Request(**request_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
