from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class StudentCreate(BaseModel):
    user_id: int
    cne: Optional[str] = None
    cin: Optional[str] = None
    birthdate: Optional[date] = None
    major_id: Optional[int] = None
    semester_id: Optional[int] = None

class StudentRead(BaseModel):
    id: int
    user_id: int
    cne: Optional[str]
    cin: Optional[str]
    birthdate: Optional[date]
    major_id: Optional[int]
    semester_id: Optional[int]

    model_config = ConfigDict(from_attributes=True)
