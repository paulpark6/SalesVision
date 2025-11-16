"""Credit account model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee


class Credit(Base):
    """
    Credit accounts and payment tracking.
    Maps to Credit.csv data.
    """
    __tablename__ = "credits"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV

    # Foreign key to clients
    client_number: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("clients.client_number"), nullable=True, index=True)
    client_name: Mapped[str] = mapped_column(String(255), nullable=True, index=True)

    # Foreign key to employees
    staff: Mapped[Optional[str]] = mapped_column(String(255), ForeignKey("employees.name"), nullable=True, index=True)
    payment_status: Mapped[str] = mapped_column(String(50), nullable=True)  # Credit, Pay
    credit_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    credit_payment_type: Mapped[str] = mapped_column(String(50), nullable=True)  # Cheque, Cash, SetOff, penalty, mix
    credit_due_date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped[Optional["Client"]] = relationship("Client", back_populates="credits")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff], back_populates="credits")

    def __repr__(self) -> str:
        return f"<Credit(id={self.id}, client={self.client_name}, amount={self.credit_amount}, status={self.payment_status})>"
