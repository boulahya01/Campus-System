from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Semester(Base):
    __tablename__ = "semesters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    major_id = Column(Integer, ForeignKey("majors.id"))
    major = relationship("Major")
