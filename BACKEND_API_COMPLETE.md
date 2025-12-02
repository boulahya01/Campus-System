# Campus System Backend - Complete API Documentation

## Overview
Comprehensive FastAPI backend with full RBAC, student management, course management, grading, exams, and enrollment system.

## Architecture

### Technology Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL (via SQLAlchemy ORM)
- **Authentication**: JWT (access + refresh tokens)
- **Authorization**: Role-Based Access Control (RBAC)
- **Validation**: Pydantic v2
- **API Documentation**: Swagger UI (automatic at `/docs`)

### Structure
- `app/api/` — API routers (one file per resource)
- `app/crud/` — Data access layer (database queries)
- `app/models/` — SQLAlchemy ORM models
- `app/schemas/` — Pydantic request/response schemas
- `app/core/` — Configuration, security, permissions
- `app/deps.py` — Shared dependencies (auth, role checks)

---

## Authentication Endpoints

### POST `/api/auth/login`
**Description**: Authenticate user and receive JWT tokens
**Request**:
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "role": "student",
    "is_active": true
  }
}
```
**Authorization**: None
**Status**: 200 (success), 401 (invalid credentials)

### POST `/api/auth/refresh`
**Description**: Refresh access token using refresh token
**Request**: Form-encoded
```
refresh_token=<token>
```
**Response**:
```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```
**Authorization**: None
**Status**: 200 (success), 401 (invalid token)

---

## User Management Endpoints

### GET `/api/users/`
**Description**: List all users (admin only)
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true
  }
]
```
**Authorization**: Admin role required
**Status**: 200, 403 (forbidden)

### GET `/api/users/me`
**Description**: Get current authenticated user
**Response**:
```json
{
  "id": 1,
  "email": "student@example.com",
  "role": "student",
  "is_active": true
}
```
**Authorization**: Authenticated user
**Status**: 200

### GET `/api/users/me/permissions`
**Description**: Get all permissions for current user
**Response**:
```json
[
  "module:view",
  "grade:view",
  "enrollment:create",
  "request:create"
]
```
**Authorization**: Authenticated user
**Status**: 200

### PUT `/api/users/change-password`
**Description**: Change current user's password
**Request**:
```json
{
  "current_password": "old_password",
  "new_password": "new_password"
}
```
**Response**:
```json
{
  "message": "Password changed successfully"
}
```
**Authorization**: Authenticated user
**Status**: 200, 400 (incorrect current password)

### POST `/api/users/`
**Description**: Create a new user (admin only)
**Request**:
```json
{
  "email": "newstudent@example.com",
  "password": "password123",
  "role": "student"
}
```
**Response**:
```json
{
  "id": 2,
  "email": "newstudent@example.com",
  "role": "student",
  "is_active": true
}
```
**Authorization**: Admin role required
**Status**: 201, 403

### GET `/api/users/{user_id}`
**Description**: Get a specific user (admin only)
**Authorization**: Admin role required
**Status**: 200, 404, 403

### PUT `/api/users/{user_id}`
**Description**: Update a user (admin only)
**Request**: Same as POST but all fields optional
**Authorization**: Admin role required
**Status**: 200, 404, 403

### DELETE `/api/users/{user_id}`
**Description**: Delete a user (admin only)
**Authorization**: Admin role required
**Status**: 200, 404, 403

---

## Student Endpoints

### GET `/api/students/`
**Description**: List all students
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "user_id": 5,
    "cne": "ABC123456",
    "cin": "AB123456",
    "birthdate": "2000-01-15",
    "major_id": 1,
    "semester_id": 2
  }
]
```
**Authorization**: Authenticated user
**Status**: 200

### GET `/api/students/{student_id}`
**Description**: Get a specific student
**Authorization**: Authenticated user
**Status**: 200, 404

### GET `/api/students/profile/me`
**Description**: Get current logged-in student's profile
**Response**: Same as GET `/api/students/{student_id}`
**Authorization**: Authenticated user
**Status**: 200, 404

### GET `/api/students/profile/me/enrollments`
**Description**: Get current student's course enrollments
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "module_id": 2,
    "enrolled_at": "2024-09-15T10:30:00",
    "status": "active",
    "module_name": "Web Development",
    "module_code": "CS201",
    "semester": "Spring 2024",
    "professor_email": "professor@example.com"
  }
]
```
**Authorization**: Authenticated user
**Status**: 200, 404

### GET `/api/students/profile/me/transcript`
**Description**: Get current student's academic transcript (grades with details)
**Response**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "module_id": 2,
    "grade": 85.5,
    "module_name": "Web Development",
    "module_code": "CS201",
    "credits": 3,
    "date": null
  }
]
```
**Authorization**: Authenticated user
**Status**: 200, 404

### GET `/api/students/profile/me/gpa`
**Description**: Get current student's GPA (calculated from grades)
**Response**:
```json
{
  "student_id": 1,
  "gpa": 3.65
}
```
**Authorization**: Authenticated user
**Status**: 200, 404

### PUT `/api/students/profile/me`
**Description**: Update current student's profile
**Request**:
```json
{
  "birthdate": "2000-01-15",
  "cne": "ABC123456",
  "cin": "AB123456",
  "major_id": 1,
  "semester_id": 2
}
```
**Response**: Same as GET `/api/students/{student_id}`
**Authorization**: Authenticated user
**Status**: 200, 404

### POST `/api/students/`
**Description**: Create a new student record (admin only)
**Request**:
```json
{
  "user_id": 5,
  "cne": "ABC123456",
  "cin": "AB123456",
  "birthdate": "2000-01-15",
  "major_id": 1,
  "semester_id": 2
}
```
**Authorization**: Admin role required
**Status**: 201, 403

---

## Enrollment Endpoints

### GET `/api/enrollments/`
**Description**: List all enrollments (admin only)
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "module_id": 2,
    "enrolled_at": "2024-09-15T10:30:00",
    "status": "active"
  }
]
```
**Authorization**: Admin role required
**Status**: 200, 403

### GET `/api/enrollments/student/{student_id}`
**Description**: Get enrollments for a specific student with full details
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "module_id": 2,
    "enrolled_at": "2024-09-15T10:30:00",
    "status": "active",
    "module_name": "Web Development",
    "module_code": "CS201",
    "semester": "Spring 2024",
    "professor_email": "professor@example.com"
  }
]
```
**Authorization**: Authenticated user
**Status**: 200, 404

### GET `/api/enrollments/{enrollment_id}`
**Description**: Get a specific enrollment
**Authorization**: Authenticated user
**Status**: 200, 404

### POST `/api/enrollments/`
**Description**: Enroll a student in a module
**Request**:
```json
{
  "student_id": 1,
  "module_id": 2
}
```
**Response**:
```json
{
  "id": 1,
  "student_id": 1,
  "module_id": 2,
  "enrolled_at": "2024-09-15T10:30:00",
  "status": "active"
}
```
**Authorization**: Authenticated user
**Status**: 201, 400 (already enrolled)

### PUT `/api/enrollments/{enrollment_id}/drop`
**Description**: Drop an enrollment (mark as dropped)
**Response**: Same as GET `/api/enrollments/{enrollment_id}`
**Authorization**: Authenticated user
**Status**: 200, 404

### DELETE `/api/enrollments/{enrollment_id}`
**Description**: Delete an enrollment (admin only)
**Authorization**: Admin role required
**Status**: 200, 404, 403

---

## Grades Endpoints

### GET `/api/grades/student/{student_id}`
**Description**: Get all grades for a student with module details
**Response**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "module_id": 2,
    "grade": 85.5,
    "module_name": "Web Development",
    "module_code": "CS201",
    "credits": 3,
    "date": null
  }
]
```
**Authorization**: Authenticated user (students see own, teachers/admins see all)
**Status**: 200, 404, 403

### GET `/api/grades/student/{student_id}/gpa`
**Description**: Get GPA for a student
**Response**:
```json
{
  "student_id": 1,
  "gpa": 3.65
}
```
**Authorization**: Authenticated user (students see own, teachers/admins see all)
**Status**: 200, 404, 403

### POST `/api/grades/`
**Description**: Create a grade record (teacher or admin)
**Request**:
```json
{
  "student_id": 1,
  "module_id": 2,
  "grade": 85.5
}
```
**Response**:
```json
{
  "id": 1,
  "student_id": 1,
  "module_id": 2,
  "grade": 85.5
}
```
**Authorization**: Teacher or Admin role required
**Status**: 201, 403

---

## Exams Endpoints

### GET `/api/exams/`
**Description**: List exams (filtered by student enrollments if student)
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "module_id": 2,
    "exam_date": "2024-12-15",
    "start_time": "09:00",
    "end_time": "11:00",
    "duration": 120,
    "location": "Room A201"
  }
]
```
**Authorization**: Authenticated user
**Status**: 200

### GET `/api/exams/student/{student_id}`
**Description**: Get exams for a student's enrolled modules
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "module_id": 2,
    "exam_date": "2024-12-15",
    "start_time": "09:00",
    "end_time": "11:00",
    "duration": 120,
    "location": "Room A201",
    "module_name": "Web Development",
    "module_code": "CS201"
  }
]
```
**Authorization**: Authenticated user
**Status**: 200, 404

### GET `/api/exams/{exam_id}`
**Description**: Get a specific exam
**Authorization**: Authenticated user
**Status**: 200, 404

### POST `/api/exams/`
**Description**: Create an exam (admin only)
**Request**:
```json
{
  "module_id": 2,
  "exam_date": "2024-12-15",
  "start_time": "09:00",
  "end_time": "11:00",
  "duration": 120,
  "location": "Room A201"
}
```
**Authorization**: Admin role required
**Status**: 201, 403

---

## Modules (Courses) Endpoints

### GET `/api/modules/`
**Description**: List all modules
**Query Parameters**:
- `skip`: int (default 0)
- `limit`: int (default 100)

**Response**:
```json
[
  {
    "id": 1,
    "name": "Introduction to Programming",
    "code": "CS101",
    "description": "Learn programming basics",
    "credits": 3,
    "semester_id": 1,
    "teacher_id": 2
  }
]
```
**Authorization**: Authenticated user
**Status**: 200

### GET `/api/modules/{module_id}`
**Description**: Get a specific module
**Authorization**: Authenticated user
**Status**: 200, 404

### POST `/api/modules/`
**Description**: Create a module (admin only)
**Authorization**: Admin role required
**Status**: 201, 403

---

## Teachers Endpoints

### GET `/api/teachers/`
**Description**: List all teachers
**Authorization**: Authenticated user
**Status**: 200

### GET `/api/teachers/{teacher_id}`
**Description**: Get a specific teacher
**Authorization**: Authenticated user
**Status**: 200, 404

### POST `/api/teachers/`
**Description**: Create a teacher record (admin only)
**Authorization**: Admin role required
**Status**: 201, 403

---

## Majors Endpoints

### GET `/api/majors/`
**Description**: List all majors
**Authorization**: Authenticated user
**Status**: 200

### POST `/api/majors/`
**Description**: Create a major (admin only)
**Authorization**: Admin role required
**Status**: 201, 403

---

## Semesters Endpoints

### GET `/api/semesters/`
**Description**: List all semesters
**Authorization**: Authenticated user
**Status**: 200

### POST `/api/semesters/`
**Description**: Create a semester (admin only)
**Authorization**: Admin role required
**Status**: 201, 403

---

## Roles & Permissions Endpoints

### GET `/api/roles/`
**Description**: List all roles with permissions
**Response**:
```json
[
  {
    "id": 1,
    "name": "student",
    "permissions": ["module:view", "grade:view", "enrollment:create"]
  }
]
```
**Authorization**: Admin role required
**Status**: 200, 403

### PUT `/api/roles/{role_id}/permissions`
**Description**: Update permissions for a role (admin only)
**Request**:
```json
{
  "permission_ids": [1, 2, 3]
}
```
**Authorization**: Admin role required
**Status**: 200, 403

---

## Announcements Endpoints

### GET `/api/announcements/`
**Description**: List announcements
**Authorization**: Authenticated user
**Status**: 200

### POST `/api/announcements/`
**Description**: Create announcement (admin/teacher)
**Authorization**: Admin or Teacher role required
**Status**: 201, 403

---

## Requests Endpoints

### GET `/api/requests/`
**Description**: List requests (own requests for students)
**Authorization**: Authenticated user
**Status**: 200

### POST `/api/requests/`
**Description**: Create a request (e.g., transcript, certificate)
**Request**:
```json
{
  "type": "transcript",
  "reason": "Required for application"
}
```
**Authorization**: Authenticated user
**Status**: 201

---

## Course Materials Endpoints

### GET `/api/materials/`
**Description**: List course materials
**Authorization**: Authenticated user
**Status**: 200

### POST `/api/materials/`
**Description**: Upload material (teacher/admin)
**Form Data**:
- `module_id`: int
- `file`: binary

**Authorization**: Teacher or Admin role required
**Status**: 201, 403

---

## Role-Based Access Control (RBAC)

### Permissions by Role

#### Student
- `module:view` — View available modules
- `material:view` — Access course materials
- `enrollment:create` — Register for courses
- `enrollment:view` — View own enrollments
- `grade:view` — View own grades
- `request:create` — Request transcript/certificate
- `rattrapage:register` — Register for makeup exams

#### Teacher
- `module:view`, `module:create`, `module:update`
- `material:view`, `material:create`, `material:upload`
- `grade:create` — Enter grades
- `enrollment:view`, `enrollment:approve`
- `rattrapage:approve`

#### Admin
- All permissions

---

## Error Handling

All endpoints return error responses in this format:
```json
{
  "detail": "Error message description"
}
```

Common status codes:
- `200` — OK
- `201` — Created
- `400` — Bad Request (invalid input)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `500` — Internal Server Error

---

## Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

Access tokens expire after 15 minutes. Use the refresh token endpoint to get a new one.

---

## Database Models

### User
- id, email (unique), password_hash, role, is_active

### Student
- id, user_id (FK), cne (unique), cin (unique), birthdate, major_id, semester_id

### Enrollment
- id, student_id (FK), module_id (FK), enrolled_at, status (active/dropped/completed)

### Grade
- id, student_id (FK), module_id (FK), grade

### Exam
- id, module_id (FK), exam_date, start_time, end_time, duration, location

### Module (Course)
- id, name, code, description, credits, semester_id, teacher_id

### Teacher
- id, user_id (FK)

### Major
- id, name

### Semester
- id, name, year

### Role
- id, name, permissions (M2M)

### Permission
- id, name

---

## Running the Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload

# View API docs
Visit http://localhost:8000/docs
```

---

## Notes

- All timestamps are in UTC
- Passwords are hashed using PBKDF2-SHA256
- JWT tokens use HS256 algorithm
- Database uses PostgreSQL with SQLAlchemy ORM
- Pydantic v2 is used for all request/response validation
