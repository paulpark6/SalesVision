"""Commission model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.employee import Employee


class Commission(Base):
    """
    Employee commission tracking.
    Maps to commission.csv data.
    """
    __tablename__ = "commissions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    staff_number: Mapped[str] = mapped_column(String(50), ForeignKey("employees.staff_number"), nullable=True, index=True)
    position: Mapped[str] = mapped_column(String(100), nullable=True)
    staff: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    division: Mapped[str] = mapped_column(String(100), nullable=True)
    commission: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    monthly_review: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    classification: Mapped[str] = mapped_column(String(50), nullable=True)  # import, local
    clients_type: Mapped[str] = mapped_column(String(100), nullable=True)
    import_product: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    local_product: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    client_transfer_calculation: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[staff_number], back_populates="commissions")

    def __repr__(self) -> str:
        return f"<Commission(id={self.id}, staff={self.staff}, commission={self.commission})>"
