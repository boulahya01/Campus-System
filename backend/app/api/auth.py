from fastapi import APIRouter, Depends, HTTPException, Body, Request, Query
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas.user import UserCreate, UserRead
from app.db.session import get_db
from app.crud.crud_user import get_user_by_email, create_user, get_user
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import get_settings
from app.deps import get_current_user

settings = get_settings()
router = APIRouter()


@router.post("/register", response_model=UserRead)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, payload)
    return user


@router.post("/login")
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "role": user.role}
    }


@router.post("/refresh")
async def refresh_token(request: Request, refresh_token: str | None = Query(None)):
    # Accept refresh token either as query param (?refresh_token=...) or in JSON body {"refresh_token": "..."}
    token = refresh_token
    if not token:
        try:
            body = await request.json()
            if isinstance(body, dict):
                token = body.get("refresh_token")
        except Exception:
            token = None
    if not token:
        raise HTTPException(status_code=422, detail="refresh_token is required")

    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = payload.get("sub")
    new_access_token = create_access_token(subject=user_id)
    return {"access_token": new_access_token, "token_type": "bearer"}
