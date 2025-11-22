from pydantic import BaseModel
from typing import Optional

class CourseMaterialCreate(BaseModel):
    module_id: int
    title: str
    file_url: str
    uploaded_by: Optional[int]

class CourseMaterialRead(BaseModel):
    id: int
    module_id: int
    title: str
    file_url: str
    uploaded_by: Optional[int]

    class Config:
        orm_mode = True
