from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_user import get_user, get_user_by_email, create_user, get_users, update_user, delete_user, get_user_permissions
from app.schemas.user import UserRead, UserCreate, UserUpdate
from app.deps import require_role, get_current_user

router = APIRouter()


@router.get("/", response_model=List[UserRead])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(require_role('admin'))):
    return get_users(db, skip=skip, limit=limit)


@router.get("/me", response_model=UserRead)
def read_me(current_user=Depends(get_current_user)):
    return current_user


@router.get("/me/permissions", response_model=List[str])
def read_my_permissions(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    perms = get_user_permissions(db, current_user)
    return perms


@router.post("/", response_model=UserRead)
def create_user_endpoint(payload: UserCreate, db: Session = Depends(get_db), current_user=Depends(require_role('admin'))):
    return create_user(db, payload)


@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(require_role('admin'))):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user_endpoint(user_id: int, payload: UserUpdate, db: Session = Depends(get_db), current_user=Depends(require_role('admin'))):
    user = update_user(db, user_id, payload)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", response_model=UserRead)
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db), current_user=Depends(require_role('admin'))):
    user = delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
