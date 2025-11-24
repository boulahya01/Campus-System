from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
