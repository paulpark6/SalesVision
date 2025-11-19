"""Employee model."""
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Optional # ❗ Added Optional

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.sale import Sale
    from app.models.credit import Credit
    from app.models.overdue_collection import OverdueCollection
    from app.models.commission import Commission
    from app.models.monthly_sales_target import MonthlySalesTarget
    from app.models.cash import Cash
    from app.models.cheque import Cheque
    from app.models.user import User  # ❗ Import User for the relationship


class Employee(Base):
    """
    Employee information.
    Maps to Employee.csv data.
    """
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # This is the unique column that the User table references
    staff_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    
    position: Mapped[str] = mapped_column(String(100), nullable=True)  # manager, staff
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    division: Mapped[str] = mapped_column(String(100), nullable=True)  # sales, internal work
    working_start: Mapped[str] = mapped_column(String(100), nullable=True)  # Date string from CSV
    phone_number: Mapped[str] = mapped_column(String(50), nullable=True)
    emergency_contact: Mapped[str] = mapped_column(String(255), nullable=True)
    emergency_call: Mapped[str] = mapped_column(String(50), nullable=True)
    whatsapp: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # relationship to User table
    user_profile: Mapped["User"] = relationship(
        "User", 
        back_populates="employee", # Points back to the 'employee' property in User
        uselist=False
    )

    # relationships to other models
    sales: Mapped[List["Sale"]] = relationship("Sale", foreign_keys="Sale.staff", back_populates="employee")
    credits: Mapped[List["Credit"]] = relationship("Credit", foreign_keys="Credit.staff", back_populates="employee")
    overdue_collections: Mapped[List["OverdueCollection"]] = relationship("OverdueCollection", foreign_keys="OverdueCollection.staff", back_populates="employee")
    commissions: Mapped[List["Commission"]] = relationship("Commission", foreign_keys="Commission.staff", back_populates="employee")
    monthly_targets: Mapped[List["MonthlySalesTarget"]] = relationship("MonthlySalesTarget", foreign_keys="MonthlySalesTarget.staff", back_populates="employee")
    cash_flows: Mapped[List["Cash"]] = relationship("Cash", foreign_keys="Cash.staff", back_populates="employee")
    cheques: Mapped[List["Cheque"]] = relationship("Cheque", foreign_keys="Cheque.staff", back_populates="employee")

    def __repr__(self) -> str:
        return f"<Employee(id={self.id}, staff_number={self.staff_number}, name={self.name})>"