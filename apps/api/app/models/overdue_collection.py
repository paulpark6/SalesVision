from datetime import date, datetime
from sqlalchemy import String, DateTime, Integer, Text, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.employee import Employee
    from app.models.credit import Credit


class OverdueCollection(Base):
    """
    Overdue payment collection tracking.
    Maps to OverdueCollection.csv data.
    """
    __tablename__ = "overdue_collections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    
    # Foreign key to clients
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    
    # Foreign key to employees
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    
    # Matching schema fields
    credit_due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    credit_amount: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    action: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Foreign key to credits
    credit_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("credits.credit_id"), nullable=True, index=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    client: Mapped["Client"] = relationship("Client", back_populates="overdue_collections")
    employee: Mapped["Employee"] = relationship("Employee", foreign_keys=[employee_id], back_populates="overdue_collections")
    credit: Mapped[Optional["Credit"]] = relationship("Credit", back_populates="overdue_collections")

    def __repr__(self) -> str:
        return f"<OverdueCollection(id={self.id}, client_id={self.client_id}, amount={self.credit_amount})>"
