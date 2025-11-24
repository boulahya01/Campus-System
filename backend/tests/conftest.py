import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.db import session as db_session


TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="session")
def engine():
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    # ensure all model modules are imported so metadata is populated
    import importlib, pkgutil
    import app.models as models_pkg
    for _finder, modname, _ispkg in pkgutil.iter_modules(models_pkg.__path__):
        importlib.import_module(f"app.models.{modname}")

    Base.metadata.create_all(bind=engine)
    # quick sanity check: majors table should be present
    if "majors" not in Base.metadata.tables:
        raise RuntimeError(f"models not imported correctly; tables: {list(Base.metadata.tables.keys())}")
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="session")
def SessionLocal(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db(SessionLocal):
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db):
    # override the dependency
    def _get_test_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[db_session.get_db] = _get_test_db
    # sanity: ensure tables exist in the test DB
    bind = db.get_bind()
    try:
        table_names = bind.engine.table_names() if hasattr(bind, 'engine') else bind.table_names()
    except Exception:
        # fallback to SQLAlchemy inspector
        from sqlalchemy import inspect
        table_names = inspect(bind).get_table_names()
    if "majors" not in table_names:
        raise RuntimeError(f"Test DB missing tables: {table_names}")

    with TestClient(app) as c:
        yield c
