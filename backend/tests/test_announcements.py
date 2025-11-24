from app.schemas.user import UserCreate
from app.crud.crud_user import create_user


def create_and_login_teacher_or_admin(client, db, email="announcer@example.com", password="annpass", role="teacher"):
    from app.crud.crud_user import get_user_by_email
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role=role))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_announcements_create_list_and_read(client, db):
    # create as teacher
    headers = create_and_login_teacher_or_admin(client, db, role="teacher")
    payload = {"title": "Welcome", "content": "Welcome back!", "target": "all"}
    r = client.post("/api/announcements/", json=payload, headers=headers)
    assert r.status_code == 200
    ann = r.json()
    aid = ann["id"]

    # list
    r2 = client.get("/api/announcements/")
    assert r2.status_code == 200
    assert any(a["id"] == aid for a in r2.json())

    # read
    r3 = client.get(f"/api/announcements/{aid}")
    assert r3.status_code == 200
    assert r3.json()["title"] == "Welcome"


def test_announcements_rbac_requires_role(client, db):
    # anonymous cannot create
    payload = {"title": "Hello", "content": "Hi", "target": "all"}
    r = client.post("/api/announcements/", json=payload)
    assert r.status_code == 401

    # student cannot create
    from app.crud.crud_user import get_user_by_email
    student_email = "studannounce@example.com"
    if not get_user_by_email(db, student_email):
        create_user(db, UserCreate(email=student_email, password="p", role="student"))
    r = client.post("/api/auth/login", json={"email": student_email, "password": "p"})
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    r2 = client.post("/api/announcements/", json=payload, headers=headers)
    assert r2.status_code == 403
