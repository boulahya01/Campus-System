from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import require_role, get_current_user
from app.crud.crud_role import get_permissions, get_roles, update_role_permissions
from app.schemas.role import PermissionRead, RoleRead, RoleUpdate

router = APIRouter()


@router.get("/permissions", response_model=List[PermissionRead])
def list_permissions(db: Session = Depends(get_db)):
    return get_permissions(db)


@router.get("/", response_model=List[RoleRead])
def list_roles(db: Session = Depends(get_db)):
    return get_roles(db)


@router.put("/{role_id}/permissions", response_model=RoleRead)
def set_role_permissions(role_id: int, payload: RoleUpdate, db: Session = Depends(get_db), current_user=Depends(require_role('admin'))):
    role = update_role_permissions(db, role_id, payload.permissions)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role
