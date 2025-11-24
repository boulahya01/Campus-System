from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
