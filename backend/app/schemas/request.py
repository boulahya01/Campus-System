from pydantic import BaseModel, ConfigDict
from typing import Optional

class RequestCreate(BaseModel):
    student_id: int
    type: str
    status: Optional[str] = "pending"

class RequestRead(BaseModel):
    id: int
    student_id: int
    type: str
    status: str
    generated_pdf_url: Optional[str]

    model_config = ConfigDict(from_attributes=True)
