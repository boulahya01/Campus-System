from sqlalchemy import Column, Integer, String, ForeignKey, Enum
import enum
from sqlalchemy.orm import relationship
from app.db.base import Base

class RequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    type = Column(String, nullable=False)  # e.g., "certificate", "transcript"
    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
    generated_pdf_url = Column(String, nullable=True)
    student = relationship("Student")
