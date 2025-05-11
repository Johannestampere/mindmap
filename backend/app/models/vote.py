from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Vote(Base):
    __tablename__ = "votes"
    id         = Column(Integer, primary_key=True, index=True)
    node_id    = Column(Integer, ForeignKey("nodes.id"), nullable=False)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    node = relationship("Node", back_populates="votes")