from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExamCreate(BaseModel):
    module_id: int
    date: datetime
    room: Optional[str]

class ExamRead(BaseModel):
    id: int
    module_id: int
    date: datetime
    room: Optional[str]

    class Config:
        orm_mode = True
