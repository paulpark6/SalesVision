from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class OverdueCollectionBase(BaseModel):
    date: Optional[date] = None
    client_id: Optional[int] = None
    employee_id: Optional[int] = None
    credit_due_date: Optional[date] = None
    credit_amount: Optional[Decimal] = None
    action: Optional[str] = None
    credit_id: Optional[int] = None

class OverdueCollectionCreate(OverdueCollectionBase):
    pass

class OverdueCollectionUpdate(OverdueCollectionBase):
    pass

class OverdueCollection(OverdueCollectionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
