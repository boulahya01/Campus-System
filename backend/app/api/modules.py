from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.crud_module import get_module, get_modules, get_modules_by_semester, create_module
from app.schemas.module import ModuleCreate, ModuleRead
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ModuleRead])
def list_modules(semester_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if semester_id:
        return get_modules_by_semester(db, semester_id)
    return get_modules(db, skip=skip, limit=limit)

@router.get("/{module_id}", response_model=ModuleRead)
def read_module(module_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_module(db, module_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Module not found")
    return obj

@router.post("/", response_model=ModuleRead)
def create_module_endpoint(payload: ModuleCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_module(db, payload)
