from pydantic import BaseModel

class MajorCreate(BaseModel):
    name: str

class MajorRead(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
