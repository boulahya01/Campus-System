from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_user import get_user, get_user_by_email, create_user
from app.schemas.user import UserRead, UserCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[UserRead])
def list_users(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # admin check should be added
    users = db.query(get_user.__self__ if False else 'users').all()
    # placeholder: return empty list until implemented
    return []

@router.get("/me", response_model=UserRead)
def read_me(current_user=Depends(get_current_user)):
    return current_user

@router.post("/", response_model=UserRead)
def create_user_endpoint(payload: UserCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # only admin should create real users in production
    return create_user(db, payload)
