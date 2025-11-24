from pydantic import BaseModel, ConfigDict
from typing import Optional

class SemesterCreate(BaseModel):
    name: str
    major_id: Optional[int] = None
    
class SemesterUpdate(BaseModel):
    name: Optional[str] = None
    major_id: Optional[int] = None

class SemesterRead(BaseModel):
    id: int
    name: str
    major_id: Optional[int]

    model_config = ConfigDict(from_attributes=True)
