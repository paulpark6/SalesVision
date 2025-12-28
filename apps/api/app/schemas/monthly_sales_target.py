from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class MonthlySalesTargetBase(BaseModel):
    employee_id: int
    product_id: int
    target_date: Optional[date] = None
    sales_amount: Optional[Decimal] = None
    monthly_sales_target: Optional[Decimal] = None
    input_date: Optional[date] = None
    company_target: Optional[Decimal] = None

class MonthlySalesTargetCreate(MonthlySalesTargetBase):
    pass

class MonthlySalesTargetUpdate(MonthlySalesTargetBase):
    pass

class MonthlySalesTarget(MonthlySalesTargetBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
