"""Monthly sales target model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.employee import Employee


class MonthlySalesTarget(Base):
    """
    Sales targets by product and staff.
    Maps to monthly sales target.csv data.
    """
    __tablename__ = "monthly_sales_targets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_code: Mapped[str] = mapped_column(String(50), ForeignKey("products.product_code"), nullable=True, index=True)
    product_description: Mapped[str] = mapped_column(String(500), nullable=True)
    staff: Mapped[str] = mapped_column(String(50), ForeignKey("employees.staff_number"), nullable=True, index=True)
    sales_amount_minus_3_month: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    sales_amount_minus_2_month: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    sales_amount_minus_1_month: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    sales_monthly_target: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    company_target: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="monthly_targets")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff], back_populates="monthly_targets")

    def __repr__(self) -> str:
        return f"<MonthlySalesTarget(id={self.id}, product={self.product_code}, staff={self.staff})>"
