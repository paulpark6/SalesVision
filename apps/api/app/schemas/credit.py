from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CreditBase(BaseModel):
    date: Optional[date] = None
    client_id: int
    employee_id: int
    sale_num: Optional[int] = None
    payment_status: Optional[str] = None
    credit_amount: Optional[Decimal] = None
    credit_payment_type: Optional[str] = None
    credit_due_date: Optional[date] = None

class CreditCreate(CreditBase):
    pass

class CreditUpdate(CreditBase):
    pass

class Credit(CreditBase):
    credit_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
