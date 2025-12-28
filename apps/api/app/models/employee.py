from datetime import date, datetime
from sqlalchemy import String, DateTime, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Optional

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.sale import Sale
    from app.models.credit import Credit
    from app.models.overdue_collection import OverdueCollection
    from app.models.commission import Commission
    from app.models.monthly_sales_target import MonthlySalesTarget
    from app.models.cash import Cash
    from app.models.cheque import Cheque
    from app.models.user import User


class Employee(Base):
    """
    Employee information.
    Maps to Employee.csv data.
    """
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    staff_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    division: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    working_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Emergency contact fields
    emergency_contact_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    emergency_contact_relationship: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    emergency_contact_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    whatsapp: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    manager_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("employees.id"), nullable=True, index=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # relationship to User table
    user_profile: Mapped["User"] = relationship(
        "User", 
        back_populates="employee",
        uselist=False
    )

    # relationships to other models
    sales: Mapped[List["Sale"]] = relationship("Sale", foreign_keys="Sale.employee_id", back_populates="employee")
    credits: Mapped[List["Credit"]] = relationship("Credit", foreign_keys="Credit.employee_id", back_populates="employee")
    overdue_collections: Mapped[List["OverdueCollection"]] = relationship("OverdueCollection", foreign_keys="OverdueCollection.employee_id", back_populates="employee")
    commissions: Mapped[List["Commission"]] = relationship("Commission", foreign_keys="Commission.employee_id", back_populates="employee")
    monthly_targets: Mapped[List["MonthlySalesTarget"]] = relationship("MonthlySalesTarget", foreign_keys="MonthlySalesTarget.employee_id", back_populates="employee")
    cash_flows: Mapped[List["Cash"]] = relationship("Cash", foreign_keys="Cash.employee_id", back_populates="employee")
    cheques: Mapped[List["Cheque"]] = relationship("Cheque", foreign_keys="Cheque.employee_id", back_populates="employee")
    
    # Self-referential relationship for hierarchy
    manager_ref: Mapped[Optional["Employee"]] = relationship("Employee", remote_side=[id], backref="direct_reports")

    def __repr__(self) -> str:
        return f"<Employee(staff_number={self.staff_number}, name={self.name})>"