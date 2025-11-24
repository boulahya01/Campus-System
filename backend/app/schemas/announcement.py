from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
