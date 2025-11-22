from pydantic import BaseModel
from typing import Optional

class SemesterCreate(BaseModel):
    name: str
    major_id: Optional[int]

class SemesterRead(BaseModel):
    id: int
    name: str
    major_id: Optional[int]

    class Config:
        orm_mode = True
