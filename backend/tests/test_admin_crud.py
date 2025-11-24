import json
from app.schemas.user import UserCreate
from app.crud.crud_user import create_user


def create_admin(db):
    admin_data = UserCreate(email="admin@example.com", password="adminpass", role="admin")
    return create_user(db, admin_data)


def get_auth_header(client, email: str, password: str):
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200
    data = resp.json()
    token = data.get("access_token")
    return {"Authorization": f"Bearer {token}"}


def test_admin_crud_major_semester_module(client, db):
    # seed admin
    admin = create_admin(db)

    headers = get_auth_header(client, "admin@example.com", "adminpass")

    # create major
    r = client.post("/api/majors/", json={"name": "Computer Science"}, headers=headers)
    assert r.status_code == 200
    major = r.json()
    assert major["name"] == "Computer Science" or major.get("name") == "Computer Science"
    major_id = major["id"]

    # create semester
    r = client.post("/api/semesters/", json={"name": "2025 Fall", "major_id": major_id}, headers=headers)
    assert r.status_code == 200
    semester = r.json()
    semester_id = semester["id"]

    # create module
    r = client.post("/api/modules/", json={"code": "CS101", "name": "Intro CS", "semester_id": semester_id}, headers=headers)
    if r.status_code != 200:
        print("Create module failed:", r.status_code, r.text)
    assert r.status_code == 200
    module = r.json()
    module_id = module["id"]

    # list majors
    r = client.get("/api/majors/", headers=headers)
    assert r.status_code == 200
    assert any(m["id"] == major_id for m in r.json())

    # update major
    r = client.put(f"/api/majors/{major_id}", json={"name": "CS"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["name"] == "CS" or r.json().get("name") == "CS"

    # update semester
    r = client.put(f"/api/semesters/{semester_id}", json={"name": "2025 Autumn"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["name"] == "2025 Autumn"

    # update module
    r = client.put(f"/api/modules/{module_id}", json={"name": "Intro to Computer Science"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["name"] == "Intro to Computer Science"

    # delete module
    r = client.delete(f"/api/modules/{module_id}", headers=headers)
    assert r.status_code == 200

    # delete semester
    r = client.delete(f"/api/semesters/{semester_id}", headers=headers)
    assert r.status_code == 200

    # delete major
    r = client.delete(f"/api/majors/{major_id}", headers=headers)
    assert r.status_code == 200
