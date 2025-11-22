from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_request import get_request, get_requests_by_student, get_all_requests, create_request
from app.schemas.request import RequestRead, RequestCreate
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[RequestRead])
def list_requests(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # students see only their own; admin/teacher see all
    if user.role == "student":
        # need to fetch student_id from user
        return []
    return get_all_requests(db)

@router.post("/", response_model=RequestRead)
def create_request_endpoint(payload: RequestCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_request(db, payload)
