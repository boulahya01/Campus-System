from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Major(Base):
    __tablename__ = "majors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
