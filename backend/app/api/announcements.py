from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_announcement import get_announcement, get_announcements, create_announcement
from app.schemas.announcement import AnnouncementRead, AnnouncementCreate
from app.deps import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[AnnouncementRead])
def list_announcements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_announcements(db, skip=skip, limit=limit)

@router.get("/{announcement_id}", response_model=AnnouncementRead)
def read_announcement(announcement_id: int, db: Session = Depends(get_db)):
    obj = get_announcement(db, announcement_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return obj

@router.post("/", response_model=AnnouncementRead)
def create_announcement_endpoint(payload: AnnouncementCreate, db: Session = Depends(get_db), user=Depends(require_role('admin','teacher'))):
    return create_announcement(db, payload)
