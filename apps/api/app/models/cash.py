"""Cash flow model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Cash(Base):
    """
    Cash flow tracking.
    Maps to Cash.csv data.
    """
    __tablename__ = "cash_flows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    client_name: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    staff: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    cash_origin: Mapped[str] = mapped_column(String(100), nullable=True)  # sales, collection, transfer, others
    cash_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    payment: Mapped[str] = mapped_column(String(100), nullable=True)
    payment_product: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    payment_expenditure: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    weekly_review: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Cash(id={self.id}, date={self.date}, amount={self.cash_amount})>"
