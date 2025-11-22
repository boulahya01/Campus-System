from pydantic import BaseModel
from typing import Optional

class GradeCreate(BaseModel):
    student_id: int
    module_id: int
    grade: Optional[float]

class GradeRead(BaseModel):
    id: int
    student_id: int
    module_id: int
    grade: Optional[float]

    class Config:
        orm_mode = True
