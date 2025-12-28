from datetime import date, datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Date, Integer
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    
    input_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    target_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    sales_monthly_target: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    company_target: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="monthly_targets")
    employee: Mapped["Employee"] = relationship("Employee", foreign_keys=[employee_id], back_populates="monthly_targets")

    def __repr__(self) -> str:
        return f"<MonthlySalesTarget(id={self.id}, product_id={self.product_id}, employee_id={self.employee_id})>"
