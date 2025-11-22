from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_major import get_major, get_majors, create_major
from app.schemas.major import MajorRead, MajorCreate
from app.deps import get_current_user

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
def create_major_endpoint(payload: MajorCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # only admin can create
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_major(db, payload)
