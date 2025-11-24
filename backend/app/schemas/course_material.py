from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
