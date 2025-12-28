from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class ExpenditureBase(BaseModel):
    date: Optional[date] = None
    payment_method: Optional[str] = None
    payment_amount: Optional[Decimal] = None
    expenditure_description: Optional[str] = None
    receipt_availability: Optional[bool] = None
    product_id: Optional[int] = None
    cost: Optional[Decimal] = None

class ExpenditureCreate(ExpenditureBase):
    pass

class ExpenditureUpdate(ExpenditureBase):
    pass

class Expenditure(ExpenditureBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
