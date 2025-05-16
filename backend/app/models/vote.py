from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy.dialects.postgresql import UUID

class Vote(Base):
    __tablename__ = "votes"
    node_id    = Column(Integer, ForeignKey("nodes.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("Profile", back_populates="votes")
    node       = relationship("Node", back_populates="votes")