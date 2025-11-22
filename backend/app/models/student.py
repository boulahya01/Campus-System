from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.base import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cne = Column(String, unique=True, index=True)
    cin = Column(String, unique=True, index=True)
    birthdate = Column(Date, nullable=True)
    major_id = Column(Integer, ForeignKey("majors.id"), nullable=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=True)
    user = relationship("User")
