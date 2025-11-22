from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    professor_id = Column(Integer, ForeignKey("teachers.id"))
    professor = relationship("Teacher")
