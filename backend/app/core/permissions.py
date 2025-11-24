# Permission constants and initial role mappings for Campus System

# Resource:action style permission strings
PERMISSIONS = {
    # Users and roles
    'user:create', 'user:read', 'user:update', 'user:delete', 'role:assign',

    # Majors & Semesters
    'major:create', 'major:update', 'major:delete',
    'semester:create', 'semester:update', 'semester:delete',

    # Modules / Courses
    'module:create', 'module:update', 'module:delete', 'module:assign_teacher', 'module:view',

    # Materials
    'material:upload', 'material:update', 'material:delete', 'material:view',

    # Exams & Rattrapage
    'exam:create', 'exam:grade', 'exam:publish',
    'rattrapage:create', 'rattrapage:open', 'rattrapage:close', 'rattrapage:register', 'rattrapage:grade', 'rattrapage:apply',

    # Grades
    'grade:enter', 'grade:update', 'grade:publish', 'grade:view',

    # Enrollments
    'enrollment:create', 'enrollment:approve', 'enrollment:drop', 'enrollment:view',

    # Announcements
    'announcement:create', 'announcement:publish', 'announcement:delete',

    # Finance
    'finance:view', 'payment:process',

    # Reports & Transcripts
    'report:generate', 'transcript:request', 'transcript:issue',

    # System
    'settings:update', 'audit:view', 'backup:run',
}

# Role -> permissions mapping (initial seed). Keep roles minimal and expandable.
ROLE_PERMISSIONS = {
    'admin': list(PERMISSIONS),
    'registrar': [
        'user:read', 'user:update',
        'enrollment:approve', 'enrollment:view',
        'semester:create', 'semester:update',
        'rattrapage:create', 'rattrapage:open', 'rattrapage:close', 'rattrapage:apply',
        'transcript:issue', 'report:generate',
    ],
    'dept_admin': [
        'module:create', 'module:update', 'module:assign_teacher',
        'major:create', 'major:update',
    ],
    'teacher': [
        'module:view', 'material:upload', 'material:update',
        'exam:create', 'exam:grade', 'grade:enter', 'grade:update',
    ],
    'ta': [
        'module:view', 'material:upload', 'grade:enter',
    ],
    'student': [
        'module:view', 'material:view', 'enrollment:create', 'request:create', 'grade:view', 'rattrapage:register',
    ],
    'finance': ['finance:view', 'payment:process'],
    'it': ['settings:update', 'backup:run', 'storage:upload', 'storage:delete'],
}
