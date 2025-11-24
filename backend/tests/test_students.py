from app.schemas.user import UserCreate
from app.crud.crud_user import create_user


def create_and_login_student(client, db, email="sstudent@example.com", password="studpass"):
    # create user in DB
    create_user(db, UserCreate(email=email, password=password, role="student"))
    # login via API
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_students_create_list_read(client, db):
    headers = create_and_login_student(client, db)

    # create student record (user_id must be set) - find user id
    # GET current user
    r = client.get("/api/users/me", headers=headers)
    assert r.status_code == 200
    me = r.json()
    user_id = me["id"]

    payload = {"user_id": user_id, "cne": "CNE12345", "cin": "CIN98765"}
    r = client.post("/api/students/", json=payload, headers=headers)
    assert r.status_code == 200
    student = r.json()
    sid = student["id"]

    # list students
    r = client.get("/api/students/", headers=headers)
    assert r.status_code == 200
    assert any(s["id"] == sid for s in r.json())

    # read student
    r = client.get(f"/api/students/{sid}", headers=headers)
    assert r.status_code == 200
    assert r.json()["user_id"] == user_id
