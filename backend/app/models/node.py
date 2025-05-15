from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Node(Base):
    __tablename__ = "nodes"
    id           = Column(Integer, primary_key=True)
    mindmap_id   = Column(Integer, ForeignKey("mindmaps.id"), nullable=False)
    parent_id    = Column(Integer, ForeignKey("nodes.id"), nullable=True)
    content      = Column(String, nullable=False)
    created_by   = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    like_count   = Column(Integer, nullable=False, server_default="0")
    votes        = relationship("Vote", back_populates="node", cascade="all, delete-orphan")
