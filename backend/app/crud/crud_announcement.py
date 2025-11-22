from sqlalchemy.orm import Session
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate
from datetime import datetime

def get_announcement(db: Session, announcement_id: int):
    return db.query(Announcement).filter(Announcement.id == announcement_id).first()

def get_announcements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Announcement).offset(skip).limit(limit).all()

def create_announcement(db: Session, announcement_in: AnnouncementCreate):
    obj = Announcement(**announcement_in.dict(), created_at=datetime.utcnow())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
