from datetime import date, datetime
from sqlalchemy import String, DateTime, Numeric, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Optional

from app.db.base import Base
from app.models.mixins import AuditMixin

if TYPE_CHECKING:
    from app.models.sale import Sale
    from app.models.price_list import PriceList
    from app.models.stock import Stock
    from app.models.monthly_sales_target import MonthlySalesTarget
    from app.models.expenditure import Expenditure


class Product(Base, AuditMixin):
    """
    Product catalog and pricing.
    Maps to Product.csv data.
    """
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    product_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    product_category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    unit_cost: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    classification: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    credit_or_cash: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    upload_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Relationships
    sales: Mapped[List["Sale"]] = relationship("Sale", back_populates="product")
    price_lists: Mapped[List["PriceList"]] = relationship("PriceList", back_populates="product")
    stocks: Mapped[List["Stock"]] = relationship("Stock", back_populates="product")
    monthly_targets: Mapped[List["MonthlySalesTarget"]] = relationship("MonthlySalesTarget", back_populates="product")
    expenditures: Mapped[List["Expenditure"]] = relationship("Expenditure", back_populates="product")

    def __repr__(self) -> str:
        return f"<Product(product_code={self.product_code}, category={self.product_category})>"
