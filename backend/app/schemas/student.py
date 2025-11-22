from pydantic import BaseModel
from typing import Optional
from datetime import date

class StudentCreate(BaseModel):
    user_id: int
    cne: Optional[str]
    cin: Optional[str]
    birthdate: Optional[date]
    major_id: Optional[int]
    semester_id: Optional[int]

class StudentRead(BaseModel):
    id: int
    user_id: int
    cne: Optional[str]
    cin: Optional[str]
    birthdate: Optional[date]
    major_id: Optional[int]
    semester_id: Optional[int]

    class Config:
        orm_mode = True
