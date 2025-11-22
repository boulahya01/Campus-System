"""Seed script to create initial admin and sample data."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.session import SessionLocal
from app.crud.crud_user import create_user, get_user_by_email
from app.crud.crud_major import create_major
from app.crud.crud_semester import create_semester
from app.schemas.user import UserCreate
from app.schemas.major import MajorCreate
from app.schemas.semester import SemesterCreate


def seed_data():
    db = SessionLocal()
    try:
        # Create admin user
        if not get_user_by_email(db, 'admin@example.com'):
            admin = UserCreate(email='admin@example.com', password='admin123', role='admin')
            create_user(db, admin)
            print('✓ Admin user created: admin@example.com / admin123')
        
        # Create test teacher
        if not get_user_by_email(db, 'teacher@example.com'):
            teacher = UserCreate(email='teacher@example.com', password='teacher123', role='teacher')
            create_user(db, teacher)
            print('✓ Teacher user created: teacher@example.com / teacher123')
        
        # Create test student
        if not get_user_by_email(db, 'student@example.com'):
            student = UserCreate(email='student@example.com', password='student123', role='student')
            create_user(db, student)
            print('✓ Student user created: student@example.com / student123')
        
        # Create majors
        majors_data = [
            {'name': 'Computer Science'},
            {'name': 'Mathematics'},
            {'name': 'Physics'},
            {'name': 'Engineering'}
        ]
        existing_majors = db.query(__import__('app.models.major', fromlist=['Major']).Major).count()
        if existing_majors == 0:
            for maj_data in majors_data:
                create_major(db, MajorCreate(**maj_data))
            print(f'✓ Created {len(majors_data)} majors')
        
        print('\n✅ Seeding complete! You can now login with the credentials above.')
        
    finally:
        db.close()


if __name__ == '__main__':
    seed_data()
