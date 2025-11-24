from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class PermissionRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RoleRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    permissions: List[PermissionRead] = []

    model_config = ConfigDict(from_attributes=True)


class RoleUpdate(BaseModel):
    permissions: List[str]
