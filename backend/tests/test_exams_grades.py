from datetime import datetime, timedelta
from app.schemas.user import UserCreate
from app.crud.crud_user import create_user, get_user_by_email


def create_and_login_admin(client, db, email="examadmin@example.com", password="adminpass"):
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role="admin"))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_and_login_teacher(client, db, email="grader@example.com", password="teachpass"):
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role="teacher"))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_and_login_student(client, db, email="s_exam@example.com", password="studpass"):
    if not get_user_by_email(db, email):
        create_user(db, UserCreate(email=email, password=password, role="student"))
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_exams_create_list_and_read(client, db):
    admin_headers = create_and_login_admin(client, db)

    # create a module first (admin)
    mod_payload = {"code": "EXAM101", "name": "Intro Exam"}
    r = client.post("/api/modules/", json=mod_payload, headers=admin_headers)
    assert r.status_code == 200
    module = r.json()
    module_id = module["id"]

    # create exam (admin only)
    exam_date = (datetime.utcnow() + timedelta(days=7)).isoformat()
    exam_payload = {"module_id": module_id, "date": exam_date, "room": "A1"}
    r2 = client.post("/api/exams/", json=exam_payload, headers=admin_headers)
    assert r2.status_code == 200
    exam = r2.json()
    eid = exam["id"]

    # list and read
    r3 = client.get("/api/exams/")
    assert r3.status_code == 200
    assert any(e["id"] == eid for e in r3.json())

    r4 = client.get(f"/api/exams/{eid}")
    assert r4.status_code == 200
    assert r4.json()["module_id"] == module_id


def test_grades_creation_and_student_visibility(client, db):
    admin_headers = create_and_login_admin(client, db)
    teacher_headers = create_and_login_teacher(client, db)

    # create module
    mod_payload = {"code": "G101", "name": "Grading Module"}
    r = client.post("/api/modules/", json=mod_payload, headers=admin_headers)
    assert r.status_code == 200
    module_id = r.json()["id"]

    # create two students
    from app.crud.crud_user import get_user_by_email
    s1_email = "student1_grades@example.com"
    s2_email = "student2_grades@example.com"
    if not get_user_by_email(db, s1_email):
        create_user(db, UserCreate(email=s1_email, password="p1", role="student"))
    if not get_user_by_email(db, s2_email):
        create_user(db, UserCreate(email=s2_email, password="p2", role="student"))
    s1 = get_user_by_email(db, s1_email)
    s2 = get_user_by_email(db, s2_email)

    # teacher creates a grade for student1
    grade_payload = {"student_id": s1.id, "module_id": module_id, "grade": 17.5}
    r2 = client.post("/api/grades/", json=grade_payload, headers=teacher_headers)
    assert r2.status_code == 200
    g = r2.json()
    gid = g["id"]

    # student1 can view own grades
    s1_headers = create_and_login_student(client, db, email=s1_email, password="p1")
    r3 = client.get(f"/api/grades/student/{s1.id}", headers=s1_headers)
    assert r3.status_code == 200
    assert any(grade["id"] == gid for grade in r3.json())

    # student1 cannot view student2 grades
    r4 = client.get(f"/api/grades/student/{s2.id}", headers=s1_headers)
    assert r4.status_code == 403
