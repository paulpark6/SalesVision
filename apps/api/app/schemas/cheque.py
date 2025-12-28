from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class ChequeBase(BaseModel):
    receipt_date: Optional[date] = None
    due_date: Optional[date] = None
    client_id: int
    employee_id: int
    issue_bank: Optional[str] = None
    number_of_cheque: str
    deposit_bank: Optional[str] = None
    deposit_date: Optional[date] = None
    cheque_amount: Optional[Decimal] = None
    approval_status: Optional[str] = None
    weekly_review: Optional[str] = None
    sale_num: Optional[int] = None

class ChequeCreate(ChequeBase):
    pass

class ChequeUpdate(ChequeBase):
    pass

class Cheque(ChequeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
