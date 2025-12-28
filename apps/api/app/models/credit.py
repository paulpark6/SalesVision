from datetime import date, datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING, List

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee
    from app.models.sale import Sale
    from app.models.overdue_collection import OverdueCollection


class Credit(Base):
    """
    Credit accounts and payment tracking.
    Maps to Credit.csv data.
    """
    __tablename__ = "credits"

    credit_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)

    # Foreign key to clients
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    
    # Foreign key to employees
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    
    payment_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Credit, Pay
    credit_amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    credit_payment_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Cheque, Cash, etc.
    credit_due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    
    # Foreign key to sales
    sale_num: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("sales.sale_num"), nullable=True, index=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped["Client"] = relationship("Client", back_populates="credits")
    employee: Mapped["Employee"] = relationship("Employee", foreign_keys=[employee_id], back_populates="credits")
    sale: Mapped[Optional["Sale"]] = relationship("Sale", back_populates="credits")
    overdue_collections: Mapped[List["OverdueCollection"]] = relationship("OverdueCollection", back_populates="credit")

    def __repr__(self) -> str:
        return f"<Credit(credit_id={self.credit_id}, client={self.client_number}, amount={self.credit_amount})>"
