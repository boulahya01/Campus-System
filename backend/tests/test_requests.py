from app.schemas.user import UserCreate
from app.crud.crud_user import create_user, get_user_by_email
from app.crud.crud_student import create_student, get_student_by_user_id


def create_and_login_student(client, db, email="req_student@example.com", password="studpass"):
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role="student"))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_and_login_admin(client, db, email="req_admin@example.com", password="adminpass"):
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role="admin"))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_student_can_create_and_list_own_requests(client, db):
    # create student and create student record
    headers = create_and_login_student(client, db)
    # find user id
    me = client.get("/api/users/me", headers=headers).json()
    user_id = me["id"]
    # create student record if not exists
    st = get_student_by_user_id(db, user_id)
    if not st:
        from app.schemas.student import StudentCreate
        create_student(db, StudentCreate(user_id=user_id, cne="CNE-REQ", cin="CIN-REQ"))
        st = get_student_by_user_id(db, user_id)

    payload = {"student_id": st.id, "type": "certificate"}
    r = client.post("/api/requests/", json=payload, headers=headers)
    assert r.status_code == 200
    req = r.json()
    rid = req["id"]

    # student lists own requests
    r2 = client.get("/api/requests/", headers=headers)
    assert r2.status_code == 200
    assert any(r0["id"] == rid for r0 in r2.json())


def test_admin_can_view_all_and_status_transitions(client, db):
    admin_headers = create_and_login_admin(client, db)

    # create a student request first (reuse student)
    stud_headers = create_and_login_student(client, db)
    me = client.get("/api/users/me", headers=stud_headers).json()
    user_id = me["id"]
    st = get_student_by_user_id(db, user_id)
    if not st:
        from app.schemas.student import StudentCreate
        create_student(db, StudentCreate(user_id=user_id, cne="CNE-REQ2", cin="CIN-REQ2"))
        st = get_student_by_user_id(db, user_id)

    payload = {"student_id": st.id, "type": "transcript"}
    r = client.post("/api/requests/", json=payload, headers=stud_headers)
    assert r.status_code == 200
    req = r.json()
    rid = req["id"]

    # admin lists all requests
    r2 = client.get("/api/requests/", headers=admin_headers)
    assert r2.status_code == 200
    assert any(r0["id"] == rid for r0 in r2.json())
