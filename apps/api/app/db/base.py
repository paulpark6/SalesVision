"""
Database base configuration.
All models inherit from Base.
"""
from sqlalchemy import String, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all database models."""
    
    # Audit columns
    created_by: Mapped[str] = mapped_column(String(255), nullable=True)
    updated_by: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Optimistic Locking
    version_id: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    __mapper_args__ = {
        "version_id_col": version_id
    }
