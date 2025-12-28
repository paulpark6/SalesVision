from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class CashBase(BaseModel):
    date: Optional[date] = None
    client_id: int
    employee_id: int
    cash_origin: Optional[str] = None
    cash_amount: Optional[Decimal] = None
    weekly_review: Optional[str] = None
    sale_num: Optional[int] = None

class CashCreate(CashBase):
    pass

class CashUpdate(CashBase):
    pass

class Cash(CashBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
