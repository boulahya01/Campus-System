from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.deps import get_current_user

router = APIRouter()

@router.post("/modules/{module_id}/upload")
async def upload_material(module_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    # simple local save (ensure uploads folder exists)
    path = f"uploads/modules/{module_id}"
    import os
    os.makedirs(path, exist_ok=True)
    dest = os.path.join(path, file.filename)
    with open(dest, "wb") as f:
        f.write(await file.read())
    return {"file_url": dest}

@router.get("/modules/{module_id}")
def list_materials(module_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # placeholder: implement listing
    return []
