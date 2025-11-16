"""Client model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.sale import Sale
    from app.models.credit import Credit
    from app.models.overdue_collection import OverdueCollection
    from app.models.cash import Cash
    from app.models.cheque import Cheque


class Client(Base):
    """
    Client/Customer information.
    Maps to Client.csv data.
    """
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    client_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    client_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    client_category: Mapped[str] = mapped_column(String(100), nullable=True)  # bus transportation, garage, etc.
    client_grade: Mapped[str] = mapped_column(String(10), nullable=True, index=True)  # A, B, C
    clients_type: Mapped[str] = mapped_column(String(100), nullable=True)  # Own develop, transfer

    # Contact information
    contact_name: Mapped[str] = mapped_column(String(255), nullable=True)
    contact_position: Mapped[str] = mapped_column(String(100), nullable=True)
    contact_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    contact_name2: Mapped[str] = mapped_column(String(255), nullable=True)
    contact_position2: Mapped[str] = mapped_column(String(100), nullable=True)
    contact_phone2: Mapped[str] = mapped_column(String(50), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)

    # Staff and financial info
    staff: Mapped[str] = mapped_column(String(255), nullable=True, index=True)  # Managing employee
    average_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)  # Monthly average
    yearly_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)  # Previous year total
    information: Mapped[str] = mapped_column(Text, nullable=True)  # Additional notes

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    sales: Mapped[List["Sale"]] = relationship("Sale", back_populates="client")
    credits: Mapped[List["Credit"]] = relationship("Credit", back_populates="client")
    overdue_collections: Mapped[List["OverdueCollection"]] = relationship("OverdueCollection", back_populates="client")
    cash_flows: Mapped[List["Cash"]] = relationship("Cash", back_populates="client")
    cheques: Mapped[List["Cheque"]] = relationship("Cheque", back_populates="client")

    def __repr__(self) -> str:
        return f"<Client(id={self.id}, client_number={self.client_number}, name={self.client_name})>"
