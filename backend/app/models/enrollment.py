from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime
import enum

class EnrollmentStatusEnum(str, enum.Enum):
    active = "active"
    dropped = "dropped"
    completed = "completed"

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(EnrollmentStatusEnum, name="enrollment_status"), default=EnrollmentStatusEnum.active)
    
    # Relationships
    student = relationship("Student")
    module = relationship("Module")
