from datetime import date, datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.product import Product


class Stock(Base):
    """
    Inventory/stock tracking.
    Maps to Stock.csv data.
    """
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), unique=True, nullable=False, index=True)
    
    avg_sales_qty: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    avg_sales_price: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    stock_qty: Mapped[Optional[int]] = mapped_column(Numeric, nullable=True) # Schema says integer but using Numeric for flexibility if needed, or cast to Integer
    
    check_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    monthly_review_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    monthly_review_desc: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    stock_status: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="stocks")

    def __repr__(self) -> str:
        return f"<Stock(id={self.id}, product_id={self.product_id}, quantity={self.stock_qty})>"
