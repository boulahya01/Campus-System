from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_major import get_major, get_majors, create_major, update_major, delete_major
from app.schemas.major import MajorRead, MajorCreate, MajorUpdate
from app.deps import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[MajorRead])
def list_majors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_majors(db, skip=skip, limit=limit)

@router.get("/{major_id}", response_model=MajorRead)
def read_major(major_id: int, db: Session = Depends(get_db)):
    obj = get_major(db, major_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Major not found")
    return obj

@router.post("/", response_model=MajorRead)
def create_major_endpoint(payload: MajorCreate, db: Session = Depends(get_db), user=Depends(require_role('admin'))):
    return create_major(db, payload)


@router.put("/{major_id}", response_model=MajorRead)
def update_major_endpoint(major_id: int, payload: MajorUpdate, db: Session = Depends(get_db), user=Depends(require_role('admin'))):
    obj = update_major(db, major_id, payload)
    if not obj:
        raise HTTPException(status_code=404, detail="Major not found")
    return obj


@router.delete("/{major_id}", response_model=MajorRead)
def delete_major_endpoint(major_id: int, db: Session = Depends(get_db), user=Depends(require_role('admin'))):
    obj = delete_major(db, major_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Major not found")
    return obj
