from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

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

class GradeWithDetails(BaseModel):
    id: int
    student_id: int
    module_id: int
    grade: Optional[float]
    module_name: Optional[str] = None
    module_code: Optional[str] = None
    credits: Optional[int] = 3
    date: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
