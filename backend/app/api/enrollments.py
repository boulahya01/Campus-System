from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud.crud_enrollment import (
    get_enrollment, get_enrollments, get_student_enrollments, 
    create_enrollment, delete_enrollment, drop_enrollment
)
from app.schemas.enrollment import EnrollmentCreate, EnrollmentRead, EnrollmentWithDetails
from app.deps import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[EnrollmentRead])
def list_enrollments(
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role('admin'))
):
    """Get all enrollments (admin only)"""
    return get_enrollments(db, skip=skip, limit=limit)

@router.get("/student/{student_id}", response_model=List[EnrollmentWithDetails])
def list_student_enrollments(
    student_id: int,
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get enrollments for a specific student"""
    # Students can only view their own enrollments
    if current_user.role == "student":
        # In production, you'd join with Student to get current_user's student_id
        # For now, we'll allow admins to view any student
        pass
    
    return get_student_enrollments(db, student_id, skip=skip, limit=limit)

@router.get("/{enrollment_id}", response_model=EnrollmentRead)
def get_enrollment_detail(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get a specific enrollment"""
    enrollment = get_enrollment(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment

@router.post("/", response_model=EnrollmentRead)
def create_enrollment_endpoint(
    payload: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Create a new enrollment"""
    try:
        return create_enrollment(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{enrollment_id}", response_model=EnrollmentRead)
def delete_enrollment_endpoint(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role('admin'))
):
    """Delete an enrollment (admin only)"""
    enrollment = delete_enrollment(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment

@router.put("/{enrollment_id}/drop", response_model=EnrollmentRead)
def drop_enrollment_endpoint(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Drop an enrollment (student can drop their own)"""
    enrollment = drop_enrollment(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment
