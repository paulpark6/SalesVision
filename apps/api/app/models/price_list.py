"""Price list model."""
from datetime import datetime
from sqlalchemy import String, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class PriceList(Base):
    """
    Product pricing by client grade.
    Maps to price list.csv data.
    """
    __tablename__ = "price_lists"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    product_description: Mapped[str] = mapped_column(String(500), nullable=True)
    client_grade: Mapped[str] = mapped_column(String(10), nullable=True, index=True)  # A, B, C, enduser
    price: Mapped[float] = mapped_column(Numeric(15, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<PriceList(id={self.id}, product={self.product_code}, grade={self.client_grade}, price={self.price})>"
