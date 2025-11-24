from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
import os
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.deps import get_current_user
from app.deps import require_role
from app.crud.crud_material import create_material, get_materials_by_module, get_material
from app.schemas.course_material import CourseMaterialCreate, CourseMaterialRead
from app.core.storage import save_file_local, upload_to_s3, get_presigned_url
from app.core.config import get_settings

settings = get_settings()

router = APIRouter()

@router.post("/modules/{module_id}/upload")
async def upload_material(
    module_id: int,
    title: str | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(require_role("admin", "teacher")),
):
    # Save uploaded file to a temp location then move to final destination
    import tempfile, os

    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # default title to filename when not provided (backwards compatible)
    title = title or file.filename

    if settings.s3_enabled:
        # upload to S3 under a modules/ prefix using module id
        key = f"modules/{module_id}/{file.filename}"
        s3_ref = upload_to_s3(temp_path, key)
        file_url = s3_ref
        # remove temp file
        try:
            os.remove(temp_path)
        except Exception:
            pass
    else:
        path = f"uploads/modules/{module_id}"
        os.makedirs(path, exist_ok=True)
        dest = os.path.join(path, file.filename)
        save_file_local(temp_path, dest)
        file_url = dest

    # create material record
    payload = CourseMaterialCreate(module_id=module_id, title=title, file_url=file_url, uploaded_by=user.id)
    mat = create_material(db, payload)
    return mat

@router.get("/modules/{module_id}")
def list_materials(module_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    mats = get_materials_by_module(db, module_id)
    # rely on Pydantic model_config for ORM conversion
    return [CourseMaterialRead.model_validate(m) for m in mats]


@router.get("/materials/{material_id}/download")
def download_material(material_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    mat = get_material(db, material_id)
    if not mat:
        raise HTTPException(status_code=404, detail="Material not found")

    # If S3 is enabled, return a presigned URL
    if settings.s3_enabled and mat.file_url and mat.file_url.startswith("s3://"):
        # extract key from s3://bucket/key
        try:
            _, rest = mat.file_url.split("s3://", 1)
            bucket_and_key = rest
            # key is after first /
            _, key = bucket_and_key.split("/", 1)
            url = get_presigned_url(key)
            if url:
                return {"url": url}
        except Exception:
            pass

    # otherwise serve local file
    local_path = mat.file_url
    if not local_path or not os.path.exists(local_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(local_path, filename=os.path.basename(local_path))
