from pydantic import BaseModel, ConfigDict
from typing import Optional

class MajorCreate(BaseModel):
    name: str


class MajorUpdate(BaseModel):
    name: Optional[str] = None

class MajorRead(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
