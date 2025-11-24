from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 60
    # Optional S3 settings
    s3_enabled: bool = False
    s3_bucket: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_region: str | None = None

    model_config = ConfigDict(env_file=".env")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
