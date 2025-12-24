"""Expenditure model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.product import Product


class Expenditure(Base):
    """
    Company expenditures and costs.
    Maps to expenditure.csv data.
    """
    __tablename__ = "expenditures"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    payment_way: Mapped[str] = mapped_column(String(100), nullable=True)
    product_code: Mapped[str] = mapped_column(String(50), ForeignKey("products.product_code"), nullable=True, index=True)
    product_description: Mapped[str] = mapped_column(String(500), nullable=True)
    expenditure_category: Mapped[str] = mapped_column(String(100), nullable=True, index=True)  # salary, delivery cost, etc.
    receipt_availability: Mapped[str] = mapped_column(String(10), nullable=True)  # yes, no
    cost: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="expenditures")

    def __repr__(self) -> str:
        return f"<Expenditure(id={self.id}, category={self.expenditure_category}, cost={self.cost})>"
