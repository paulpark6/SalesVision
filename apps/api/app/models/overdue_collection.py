"""Overdue collection model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee


class OverdueCollection(Base):
    """
    Overdue payment collection tracking.
    Maps to OverdueCollection.csv data.
    """
    __tablename__ = "overdue_collections"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)
    client_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    client_number: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("clients.client_number"), nullable=True, index=True)
    staff: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("employees.staff_number"), nullable=True, index=True)
    credit_period: Mapped[int] = mapped_column(Integer, nullable=True)
    credit_amount: Mapped[int] = mapped_column(Integer, nullable=True)
    action: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped[Optional["Client"]] = relationship("Client", back_populates="overdue_collections")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff], back_populates="overdue_collections")

    def __repr__(self) -> str:
        return f"<OverdueCollection(id={self.id}, client={self.client_name}, amount={self.credit_amount})>"
