from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CommissionBase(BaseModel):
    employee_id: Optional[int] = None
    position: Optional[str] = None
    staff: Optional[str] = None
    division: Optional[str] = None
    commission: Optional[Decimal] = None
    monthly_review: Optional[Decimal] = None
    classification: Optional[str] = None
    clients_type: Optional[str] = None
    import_product: Optional[Decimal] = None
    local_product: Optional[Decimal] = None
    client_transfer_calculation: Optional[Decimal] = None
    date: Optional[str] = None

class CommissionCreate(CommissionBase):
    pass

class CommissionUpdate(CommissionBase):
    pass

class Commission(CommissionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
