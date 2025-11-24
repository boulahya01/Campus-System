from pydantic import BaseModel, ConfigDict
from typing import Optional

class TeacherCreate(BaseModel):
    user_id: int
    department: Optional[str]

class TeacherRead(BaseModel):
    id: int
    user_id: int
    department: Optional[str]

    model_config = ConfigDict(from_attributes=True)
