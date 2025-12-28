"""Expenditure model."""
from datetime import date, datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Boolean, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.product import Product


class Expenditure(Base):
    """
    Business expenditures and costs.
    Maps to Expenditures.csv data.
    """
    __tablename__ = "expenditures"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    
    # Matching schema naming
    payment_method: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # Cash, Bank, etc.
    payment_amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    expenditure_description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Boolean type as requested in schema
    receipt_availability: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    
    product_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("products.id"), nullable=True, index=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="expenditures")

    def __repr__(self) -> str:
        return f"<Expenditure(id={self.id}, amount={self.payment_amount}, method={self.payment_method})>"
