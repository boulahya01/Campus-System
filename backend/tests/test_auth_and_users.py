from app.schemas.user import UserCreate
from app.crud.crud_user import create_user


def test_register_login_refresh(client, db):
    # register a new student via API
    r = client.post("/api/auth/register", json={"email": "stu1@example.com", "password": "pass123", "role": "student"})
    assert r.status_code == 200
    u = r.json()
    assert u["email"] == "stu1@example.com" or u.get("email") == "stu1@example.com"

    # login
    r = client.post("/api/auth/login", json={"email": "stu1@example.com", "password": "pass123"})
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data and "refresh_token" in data

    # refresh (endpoint expects a query param for simple str parameter)
    r = client.post(f"/api/auth/refresh?refresh_token={data['refresh_token']}")
    assert r.status_code == 200
    assert "access_token" in r.json()


def create_admin_in_db(db):
    admin = UserCreate(email="admin2@example.com", password="adminpass", role="admin")
    return create_user(db, admin)


def get_token_headers(client, email: str, password: str):
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_admin_user_crud_and_rbac(client, db):
    # create admin in DB
    admin = create_admin_in_db(db)
    admin_headers = get_token_headers(client, "admin2@example.com", "adminpass")

    # admin can create a user via API
    r = client.post("/api/users/", json={"email": "newuser@example.com", "password": "pw1", "role": "student"}, headers=admin_headers)
    assert r.status_code == 200
    created = r.json()
    uid = created["id"]

    # non-admin cannot list users
    # create non-admin user in DB and login
    from app.crud.crud_user import create_user
    from app.schemas.user import UserCreate
    create_user(db, UserCreate(email="plain@example.com", password="pwplain", role="student"))
    non_admin_headers = get_token_headers(client, "plain@example.com", "pwplain")

    r = client.get("/api/users/", headers=non_admin_headers)
    assert r.status_code == 403

    # admin can list users
    r = client.get("/api/users/", headers=admin_headers)
    assert r.status_code == 200
    assert any(u["id"] == uid for u in r.json())

    # admin get user
    r = client.get(f"/api/users/{uid}", headers=admin_headers)
    assert r.status_code == 200

    # admin update user
    r = client.put(f"/api/users/{uid}", json={"email": "updated@example.com"}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "updated@example.com"

    # admin delete user
    r = client.delete(f"/api/users/{uid}", headers=admin_headers)
    assert r.status_code == 200
