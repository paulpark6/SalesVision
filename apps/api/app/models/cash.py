"""Cash flow model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee


class Cash(Base):
    """
    Cash flow tracking.
    Maps to Cash.csv data.
    """
    __tablename__ = "cash_flows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    client_name: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    client_number: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("clients.client_number"), nullable=True, index=True)
    staff: Mapped[str] = mapped_column(String(50), ForeignKey("employees.staff_number"), nullable=True, index=True)
    cash_origin: Mapped[str] = mapped_column(String(100), nullable=True)  # sales, collection, transfer, others
    cash_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    payment: Mapped[str] = mapped_column(String(100), nullable=True)
    payment_product: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    payment_expenditure: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    weekly_review: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped[Optional["Client"]] = relationship("Client", back_populates="cash_flows")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff], back_populates="cash_flows")

    def __repr__(self) -> str:
        return f"<Cash(id={self.id}, date={self.date}, amount={self.cash_amount})>"
