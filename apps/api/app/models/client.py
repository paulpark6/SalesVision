from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Optional

from app.db.base import Base
from app.models.mixins import AuditMixin

if TYPE_CHECKING:
    from app.models.sale import Sale
    from app.models.credit import Credit
    from app.models.overdue_collection import OverdueCollection
    from app.models.cash import Cash
    from app.models.cheque import Cheque
    from app.models.employee import Employee
    from app.models.price_list import PriceList


class Client(Base, AuditMixin):
    """
    Client/Customer information.
    Maps to Client.csv data.
    """
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    client_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    client_category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    client_grade: Mapped[Optional[str]] = mapped_column(String(10), nullable=True, index=True)
    
    # Contact information
    contact_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    contact_name2: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_position2: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_phone2: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Staff and financial info
    og_employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    current_employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    
    client_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    average_amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    yearly_amount: Mapped[Optional[float]] = mapped_column(Numeric(15, 2), nullable=True)
    information: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    sales: Mapped[List["Sale"]] = relationship("Sale", back_populates="client")
    credits: Mapped[List["Credit"]] = relationship("Credit", back_populates="client")
    overdue_collections: Mapped[List["OverdueCollection"]] = relationship("OverdueCollection", back_populates="client")
    cash_flows: Mapped[List["Cash"]] = relationship("Cash", back_populates="client")
    cheques: Mapped[List["Cheque"]] = relationship("Cheque", back_populates="client")
    price_lists: Mapped[List["PriceList"]] = relationship(
        "PriceList",
        primaryjoin="Client.client_grade == PriceList.client_grade",
        foreign_keys="PriceList.client_grade",
        viewonly=True
    )

    def __repr__(self) -> str:
        return f"<Client(client_number={self.client_number}, name={self.client_name})>"
