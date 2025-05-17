# app/models/vote.py
from sqlalchemy import Column, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Integer


class Vote(Base):
    __tablename__ = "votes"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    node_id = Column(Integer, ForeignKey("nodes.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="votes")
    node = relationship("Node", back_populates="votes")