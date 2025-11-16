"""Product model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.sale import Sale
    from app.models.price_list import PriceList
    from app.models.stock import Stock
    from app.models.monthly_sales_target import MonthlySalesTarget
    from app.models.expenditure import Expenditure


class Product(Base):
    """
    Product catalog and pricing.
    Maps to Product.csv data.
    """
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    product_description: Mapped[str] = mapped_column(String(500), nullable=True)
    product_category: Mapped[str] = mapped_column(String(100), nullable=True, index=True)  # Oil, Tire, Filter, Others
    unit_cost: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    classification: Mapped[str] = mapped_column(String(50), nullable=True)  # import, local purchasing
    creditor_cash: Mapped[str] = mapped_column(String(50), nullable=True)  # cash or credit
    amount_credit: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    upload_date: Mapped[str] = mapped_column(String(50), nullable=True)  # Date string from CSV
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    sales: Mapped[List["Sale"]] = relationship("Sale", back_populates="product")
    price_lists: Mapped[List["PriceList"]] = relationship("PriceList", back_populates="product")
    stocks: Mapped[List["Stock"]] = relationship("Stock", back_populates="product")
    monthly_targets: Mapped[List["MonthlySalesTarget"]] = relationship("MonthlySalesTarget", back_populates="product")
    expenditures: Mapped[List["Expenditure"]] = relationship("Expenditure", back_populates="product")

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, code={self.product_code}, category={self.product_category})>"
