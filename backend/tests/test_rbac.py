from app.schemas.user import UserCreate
from app.crud.crud_user import create_user, get_user_by_email


def login(client, db, email, password, role):
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role=role))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_student_cannot_perform_admin_actions(client, db):
    studs = login(client, db, "rbac_student@example.com", "p", "student")

    # student tries to create a module (admin-only)
    r = client.post("/api/modules/", json={"code": "S100", "name": "StudentModule"}, headers=studs)
    assert r.status_code in (401, 403)

    # student tries to create announcement (teacher/admin)
    r2 = client.post("/api/announcements/", json={"title": "X", "content": "Y"}, headers=studs)
    assert r2.status_code == 403


def test_teacher_permissions(client, db):
    teach = login(client, db, "rbac_teacher@example.com", "tp", "teacher")
    admin = login(client, db, "rbac_admin@example.com", "ap", "admin")

    # teacher can create announcement
    r = client.post("/api/announcements/", json={"title": "T", "content": "C"}, headers=teach)
    assert r.status_code == 200

    # teacher cannot create modules (admin only)
    r2 = client.post("/api/modules/", json={"code": "T100", "name": "Mod"}, headers=teach)
    assert r2.status_code in (401, 403)

    # admin can create module
    r3 = client.post("/api/modules/", json={"code": "A100", "name": "AdminMod"}, headers=admin)
    assert r3.status_code == 200


def test_admin_full_access(client, db):
    admin = login(client, db, "rbac_admin2@example.com", "ap2", "admin")
    # create major, semester, module, announcement
    r = client.post("/api/majors/", json={"name": "RBACMajor"}, headers=admin)
    assert r.status_code == 200
    r2 = client.post("/api/semesters/", json={"name": "RBACSem"}, headers=admin)
    assert r2.status_code == 200
