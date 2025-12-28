from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class ProductBase(BaseModel):
    product_code: Optional[str] = None # Auto-generated
    product_description: Optional[str] = None
    product_category: Optional[str] = None
    unit_cost: Optional[Decimal] = None
    classification: Optional[str] = None
    credit_or_cash: Optional[str] = None
    amount: Optional[Decimal] = None
    upload_date: Optional[date] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
