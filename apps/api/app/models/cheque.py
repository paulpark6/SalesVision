"""Cheque tracking model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee


class Cheque(Base):
    """
    Cheque payment tracking.
    Maps to Cheque.csv data.
    """
    __tablename__ = "cheques"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    receipt_date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    due_date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    client_name: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    client_number: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("clients.client_number"), nullable=True, index=True)
    staff: Mapped[str] = mapped_column(String(50), ForeignKey("employees.staff_number"), nullable=True, index=True)
    issue_bank: Mapped[str] = mapped_column(String(255), nullable=True)
    cheque_number: Mapped[str] = mapped_column(String(100), nullable=True, unique=True, index=True)
    deposit_bank: Mapped[str] = mapped_column(String(255), nullable=True)
    deposit_date: Mapped[str] = mapped_column(String(50), nullable=True)  # Date string from CSV
    cheque_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    approval_status: Mapped[str] = mapped_column(String(100), nullable=True)  # approval, reject
    weekly_review: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped[Optional["Client"]] = relationship("Client", back_populates="cheques")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff], back_populates="cheques")

    def __repr__(self) -> str:
        return f"<Cheque(id={self.id}, number={self.cheque_number}, client={self.client_name}, amount={self.cheque_amount})>"
