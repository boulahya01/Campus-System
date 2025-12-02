from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class EnrollmentCreate(BaseModel):
    student_id: int
    module_id: int

class EnrollmentUpdate(BaseModel):
    status: Optional[str] = None

class EnrollmentRead(BaseModel):
    id: int
    student_id: int
    module_id: int
    enrolled_at: datetime
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class EnrollmentWithDetails(BaseModel):
    id: int
    student_id: int
    module_id: int
    enrolled_at: datetime
    status: str
    module_name: Optional[str] = None
    module_code: Optional[str] = None
    professor_name: Optional[str] = None
    professor_email: Optional[str] = None
    semester: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
