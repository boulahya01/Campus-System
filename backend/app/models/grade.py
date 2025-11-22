from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    grade = Column(Float, nullable=True)
    student = relationship("Student")
    module = relationship("Module")
