from typing import List
from sqlalchemy.orm import Session
from app.models.role import Role
from app.models.permission import Permission


def get_permissions(db: Session) -> List[Permission]:
    return db.query(Permission).order_by(Permission.name).all()


def get_roles(db: Session) -> List[Role]:
    return db.query(Role).order_by(Role.name).all()


def get_role(db: Session, role_id: int) -> Role | None:
    return db.query(Role).filter(Role.id == role_id).first()


def update_role_permissions(db: Session, role_id: int, permission_names: List[str]) -> Role | None:
    role = get_role(db, role_id)
    if not role:
        return None
    # find Permission objects by name
    perms = db.query(Permission).filter(Permission.name.in_(permission_names)).all()
    role.permissions = perms
    db.add(role)
    db.commit()
    db.refresh(role)
    return role
