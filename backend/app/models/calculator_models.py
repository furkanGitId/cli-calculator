from sqlalchemy import Column, Integer, String, DateTime,Float
from sqlalchemy.sql import func
from app.core.database import Base

class Calculation(Base):
    __tablename__ = "calculation_history"

    id = Column(Integer, primary_key=True, index=True)
    expression = Column(String(255), nullable=False)
    result = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())