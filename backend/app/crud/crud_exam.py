from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from datetime import datetime
from typing import List, Optional
from app.models.exam import Exam
from app.models.module import Module
from app.models.enrollment import Enrollment
from app.schemas.exam import ExamCreate

def get_exam(db: Session, exam_id: int):
    return db.query(Exam).filter(Exam.id == exam_id).first()

def get_exams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Exam).offset(skip).limit(limit).all()

def get_exams_for_student(db: Session, student_id: int, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get exams for a student's enrolled modules, sorted by exam_date"""
    exams = db.query(
        Exam.id,
        Exam.module_id,
        Exam.exam_date,
        Exam.start_time,
        Exam.end_time,
        Exam.duration,
        Exam.location,
        Module.name.label("module_name"),
        Module.code.label("module_code"),
    ).join(
        Module, Exam.module_id == Module.id
    ).join(
        Enrollment, and_(
            Enrollment.module_id == Module.id,
            Enrollment.student_id == student_id
        )
    ).order_by(
        desc(Exam.exam_date)
    ).offset(skip).limit(limit).all()
    
    result = []
    for e in exams:
        result.append({
            "id": e.id,
            "module_id": e.module_id,
            "exam_date": e.exam_date,
            "start_time": e.start_time,
            "end_time": e.end_time,
            "duration": e.duration,
            "location": e.location,
            "module_name": e.module_name,
            "module_code": e.module_code,
        })
    return result

def create_exam(db: Session, exam_in: ExamCreate):
    obj = Exam(**exam_in.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
