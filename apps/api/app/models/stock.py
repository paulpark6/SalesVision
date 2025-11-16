"""Stock/Inventory model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Stock(Base):
    """
    Inventory/stock tracking.
    Maps to Stock.csv data.
    """
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_category: Mapped[str] = mapped_column(String(100), nullable=True, index=True)
    product_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    product_description: Mapped[str] = mapped_column(String(500), nullable=True)
    average_sales_quantity: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    stock_quantity: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    duration_period: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    check_date: Mapped[str] = mapped_column(String(50), nullable=True)  # Date string from CSV
    monthly_review: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Stock(id={self.id}, product={self.product_code}, quantity={self.stock_quantity})>"
