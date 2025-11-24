from typing import Optional
import os
from app.core.config import get_settings

settings = get_settings()


def save_file_local(src_path: str, dest_path: str) -> str:
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    # move or copy file
    os.replace(src_path, dest_path)
    return dest_path


def upload_to_s3(local_path: str, key: str) -> str:
    """Upload a local file to S3 and return the S3 object key or URL.
    Raises RuntimeError if boto3 is not available or S3 is not configured.
    """
    if not settings.s3_enabled:
        raise RuntimeError("S3 is not enabled in settings")
    try:
        import boto3
    except Exception as e:
        raise RuntimeError("boto3 is required for S3 support") from e

    s3_client = boto3.client(
        "s3",
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )
    bucket = settings.s3_bucket
    if not bucket:
        raise RuntimeError("S3 bucket not configured")

    s3_client.upload_file(local_path, bucket, key)
    # Return an object URL (not presigned) — frontend may use presigned URLs from get_presigned_url
    return f"s3://{bucket}/{key}"


def get_presigned_url(key: str, expires_in: int = 3600) -> Optional[str]:
    if not settings.s3_enabled:
        return None
    try:
        import boto3
    except Exception:
        return None
    s3_client = boto3.client(
        "s3",
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )
    try:
        url = s3_client.generate_presigned_url(
            "get_object", Params={"Bucket": settings.s3_bucket, "Key": key}, ExpiresIn=expires_in
        )
        return url
    except Exception:
        return None
