from pydantic import BaseModel, ConfigDict
from typing import Optional

class ModuleCreate(BaseModel):
    code: str
    name: str
    semester_id: Optional[int] = None
    professor_id: Optional[int] = None

class ModuleRead(BaseModel):
    id: int
    code: str
    name: str
    semester_id: Optional[int]
    professor_id: Optional[int]

    model_config = ConfigDict(from_attributes=True)

class ModuleUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    semester_id: Optional[int] = None
    professor_id: Optional[int] = None
