from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
import enum
from datetime import datetime, timezone
from app.db.base import Base


class AnnouncementTarget(str, enum.Enum):
    all = "all"
    major = "major"
    semester = "semester"
    group = "group"


class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    target = Column(SQLEnum(AnnouncementTarget, name="announcement_target"), nullable=False, default=AnnouncementTarget.all)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
