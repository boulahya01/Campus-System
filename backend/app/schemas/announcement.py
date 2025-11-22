from pydantic import BaseModel
from datetime import datetime

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    target: str = "all"

class AnnouncementRead(BaseModel):
    id: int
    title: str
    content: str
    target: str
    created_at: datetime

    class Config:
        orm_mode = True
