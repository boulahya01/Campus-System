from app.schemas.user import UserCreate
from app.crud.crud_user import create_user


def create_and_login_admin(client, db, email="admin2@example.com", password="adminpass"):
    from app.crud.crud_user import get_user_by_email
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role="admin"))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_and_login_user(client, db, email="teacheruser@example.com", password="teachpass", role="teacher"):
    from app.crud.crud_user import get_user_by_email
    # create only if not exists (tests may create the user earlier)
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role=role))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_teachers_crud_and_rbac(client, db):
    # admin creates and lists teachers
    admin_headers = create_and_login_admin(client, db)

    # create a user that will be the teacher
    from app.crud.crud_user import get_user_by_email
    teacher_email = "t1@example.com"
    pwd = "teachpass"
    # ensure the user exists
    if not get_user_by_email(db, teacher_email):
        create_user(db, UserCreate(email=teacher_email, password=pwd, role="teacher"))
    teacher_obj = get_user_by_email(db, teacher_email)
    assert teacher_obj is not None

    # create teacher record as admin
    payload = {"user_id": teacher_obj.id, "department": "Mathematics"}
    r = client.post("/api/teachers/", json=payload, headers=admin_headers)
    assert r.status_code == 200
    teacher = r.json()
    tid = teacher["id"]

    # list teachers as admin
    r = client.get("/api/teachers/", headers=admin_headers)
    assert r.status_code == 200
    assert any(t["id"] == tid for t in r.json())

    # read teacher as the teacher user (any authenticated user can read)
    teacher_headers = create_and_login_user(client, db, email=teacher_email, password=pwd)
    r = client.get(f"/api/teachers/{tid}", headers=teacher_headers)
    assert r.status_code == 200
    assert r.json()["user_id"] == teacher_obj.id

    # try to create teacher as non-admin (should be forbidden)
    other_user_headers = create_and_login_user(client, db, email="other@example.com", password="opass", role="teacher")
    payload2 = {"user_id": teacher_obj.id, "department": "History"}
    r = client.post("/api/teachers/", json=payload2, headers=other_user_headers)
    assert r.status_code == 403
