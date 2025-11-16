"""Sale model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional

from app.db.base import Base


class Sale(Base):
    """
    Sales transactions.
    Maps to Sales.csv data.
    """
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    inventory_in_out: Mapped[str] = mapped_column(String(50), nullable=True)  # sales, returns, internal use, etc.

    # Foreign key to products
    product_code: Mapped[str] = mapped_column(String(50), ForeignKey("products.product_code"), nullable=False, index=True)
    product_description: Mapped[str] = mapped_column(String(500), nullable=True)
    product_category: Mapped[str] = mapped_column(String(100), nullable=True)

    invoice: Mapped[str] = mapped_column(String(100), nullable=True, index=True)
    date: Mapped[str] = mapped_column(String(50), nullable=True, index=True)  # Date string from CSV
    quantity: Mapped[int] = mapped_column(Integer, nullable=True)
    client_grade: Mapped[str] = mapped_column(String(10), nullable=True)

    # Foreign key to clients
    client_number: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("clients.client_number"), nullable=True, index=True)
    client_name: Mapped[str] = mapped_column(String(255), nullable=True, index=True)

    # Foreign key to employees
    staff: Mapped[Optional[str]] = mapped_column(String(255), ForeignKey("employees.name"), nullable=True, index=True)

    unit_price: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    payment_type: Mapped[str] = mapped_column(String(50), nullable=True)  # Cash, Credit, Cheque
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="sales")
    client: Mapped[Optional["Client"]] = relationship("Client", back_populates="sales")
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff], back_populates="sales")

    def __repr__(self) -> str:
        return f"<Sale(id={self.id}, invoice={self.invoice}, client={self.client_name}, amount={self.amount})>"
