from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_in: UserCreate):
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_in: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    data = user_in.model_dump(exclude_unset=True)
    if "password" in data and data["password"]:
        hashed = get_password_hash(data["password"])
        data["password_hash"] = hashed
        data.pop("password", None)
    for field, value in data.items():
        setattr(user, field, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user


def get_user_permissions(db: Session, user: User):
    """Return a list of permission names granted to the user's role(s).
    This implementation maps the user's `role` enum to the Role table and returns
    all associated permission names. If Role/Permission tables are not present,
    returns an empty list."""
    try:
        from app.models import Role, Permission
    except Exception:
        return []

    # user.role may be an Enum or a string
    role_name = getattr(user.role, 'value', user.role)
    if not role_name:
        return []
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        return []
    return [p.name for p in role.permissions]
