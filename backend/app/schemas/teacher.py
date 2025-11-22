from pydantic import BaseModel
from typing import Optional

class TeacherCreate(BaseModel):
    user_id: int
    department: Optional[str]

class TeacherRead(BaseModel):
    id: int
    user_id: int
    department: Optional[str]

    class Config:
        orm_mode = True
