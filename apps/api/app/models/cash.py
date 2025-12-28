"""Cash flow model."""
from datetime import date, datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee
    from app.models.sale import Sale


class Cash(Base):
    """
    Cash flow tracking.
    Maps to CashFlows.csv data.
    """
    __tablename__ = "cash_flows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    
    # Matching schema naming
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    
    cash_origin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    cash_amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    
    # Link to sale
    sale_num: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("sales.sale_num"), nullable=True, index=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped["Client"] = relationship("Client", back_populates="cash_flows")
    employee: Mapped["Employee"] = relationship("Employee", foreign_keys=[employee_id], back_populates="cash_flows")
    sale: Mapped[Optional["Sale"]] = relationship("Sale", back_populates="cash_flows")

    def __repr__(self) -> str:
        return f"<Cash(id={self.id}, amount={self.cash_amount})>"
