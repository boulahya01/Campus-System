"""Initial migration - create all tables."""
from alembic import op
import sqlalchemy as sa


revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('student', 'teacher', 'admin', name='roleenum'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'])
    op.create_index(op.f('ix_users_id'), 'users', ['id'])

    # Majors table
    op.create_table(
        'majors',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Semesters table
    op.create_table(
        'semesters',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('major_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['major_id'], ['majors.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Teachers table
    op.create_table(
        'teachers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('department', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Students table
    op.create_table(
        'students',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('cne', sa.String(), nullable=True),
        sa.Column('cin', sa.String(), nullable=True),
        sa.Column('birthdate', sa.Date(), nullable=True),
        sa.Column('major_id', sa.Integer(), nullable=True),
        sa.Column('semester_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['major_id'], ['majors.id']),
        sa.ForeignKeyConstraint(['semester_id'], ['semesters.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('cne'),
        sa.UniqueConstraint('cin')
    )
    op.create_index(op.f('ix_students_id'), 'students', ['id'])

    # Modules table
    op.create_table(
        'modules',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('semester_id', sa.Integer(), nullable=True),
        sa.Column('professor_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['professor_id'], ['teachers.id']),
        sa.ForeignKeyConstraint(['semester_id'], ['semesters.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # Course Materials table
    op.create_table(
        'course_materials',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('module_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('file_url', sa.String(), nullable=False),
        sa.Column('uploaded_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['module_id'], ['modules.id']),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Announcements table
    op.create_table(
        'announcements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('target', sa.Enum('all', 'major', 'semester', 'group', name='targeteenum'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Exams table
    op.create_table(
        'exams',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('module_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=False),
        sa.Column('room', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['module_id'], ['modules.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Grades table
    op.create_table(
        'grades',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('student_id', sa.Integer(), nullable=False),
        sa.Column('module_id', sa.Integer(), nullable=False),
        sa.Column('grade', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['students.id']),
        sa.ForeignKeyConstraint(['module_id'], ['modules.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Requests table
    op.create_table(
        'requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('student_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'approved', 'rejected', name='statusenum'), nullable=False),
        sa.Column('generated_pdf_url', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['student_id'], ['students.id']),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('requests')
    op.drop_table('grades')
    op.drop_table('exams')
    op.drop_table('announcements')
    op.drop_table('course_materials')
    op.drop_table('modules')
    op.drop_table('students')
    op.drop_table('teachers')
    op.drop_table('semesters')
    op.drop_table('majors')
    op.drop_table('users')
