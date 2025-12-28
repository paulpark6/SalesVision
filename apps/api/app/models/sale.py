from datetime import date, datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, DateTime, Numeric, Integer, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import AuditMixin

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.client import Client
    from app.models.employee import Employee
    from app.models.credit import Credit
    from app.models.cheque import Cheque
    from app.models.cash import Cash


class Sale(Base, AuditMixin):
    """
    Sales transactions.
    Maps to Sales.csv data.
    """
    __tablename__ = "sales"

    sale_num: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    inventory_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # sales, returns, etc.

    # Foreign key to products
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    
    invoice_num: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    sale_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    quantity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Foreign key to clients
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    
    # Foreign key to employees
    employee_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("employees.id"), nullable=True, index=True)

    unit_price: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    sale_amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    payment_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Cash, Credit, Cheque

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="sales")
    client: Mapped["Client"] = relationship("Client", back_populates="sales")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[employee_id], back_populates="sales")
    
    credits: Mapped[List["Credit"]] = relationship("Credit", back_populates="sale")
    cheques: Mapped[List["Cheque"]] = relationship("Cheque", back_populates="sale")
    cash_flows: Mapped[List["Cash"]] = relationship("Cash", back_populates="sale")

    def __repr__(self) -> str:
        return f"<Sale(sale_num={self.sale_num}, invoice={self.invoice_num}, amount={self.sale_amount})>"
