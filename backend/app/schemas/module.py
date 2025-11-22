from pydantic import BaseModel
from typing import Optional

class ModuleCreate(BaseModel):
    code: str
    name: str
    semester_id: Optional[int]
    professor_id: Optional[int]

class ModuleRead(BaseModel):
    id: int
    code: str
    name: str
    semester_id: Optional[int]
    professor_id: Optional[int]

    class Config:
        orm_mode = True
