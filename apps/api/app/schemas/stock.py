from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class StockBase(BaseModel):
    product_id: int
    avg_sales_qty: Optional[Decimal] = None
    avg_sales_price: Optional[Decimal] = None
    stock_qty: Optional[Decimal] = None
    check_date: Optional[date] = None
    monthly_review_date: Optional[date] = None
    monthly_review_desc: Optional[str] = None
    stock_status: Optional[str] = None

class StockCreate(StockBase):
    pass

class StockUpdate(StockBase):
    pass

class Stock(StockBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
