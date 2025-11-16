"""Cheque tracking model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


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
    staff: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    issue_bank: Mapped[str] = mapped_column(String(255), nullable=True)
    cheque_number: Mapped[str] = mapped_column(String(100), nullable=True, unique=True, index=True)
    deposit_bank: Mapped[str] = mapped_column(String(255), nullable=True)
    deposit_date: Mapped[str] = mapped_column(String(50), nullable=True)  # Date string from CSV
    cheque_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    approval_status: Mapped[str] = mapped_column(String(100), nullable=True)  # approval, reject
    weekly_review: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Cheque(id={self.id}, number={self.cheque_number}, client={self.client_name}, amount={self.cheque_amount})>"
