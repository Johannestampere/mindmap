import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, func, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    # Link to auth.users
    id = Column(UUID(as_uuid=True), ForeignKey("auth.users.id"), primary_key=True)

    # Your custom fields
    username = Column(String, unique=True, nullable=False)

    # Fields handled by auth.users:
    # - email (in auth.users)
    # - hashed_password (in auth.users as encrypted_password)
    # - created_at (in auth.users)

    # Relationships to your existing tables
    mindmaps = relationship("MindMap", back_populates="creator")
    nodes = relationship("Node", back_populates="creator")
    votes = relationship("Vote", back_populates="user")