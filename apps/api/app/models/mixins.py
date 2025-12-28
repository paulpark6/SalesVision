from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional

class AuditMixin:
    """
    Mixin to add audit logging fields to models.
    Tracks who created/updated a record and when.
    """
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    created_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Email of creator
    updated_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Email of updater
