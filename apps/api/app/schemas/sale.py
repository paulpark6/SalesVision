from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class SaleBase(BaseModel):
    inventory_status: Optional[str] = None
    product_id: int
    invoice_num: Optional[str] = None
    sale_date: Optional[date] = None
    quantity: Optional[int] = None
    client_id: int
    employee_id: Optional[int] = None
    unit_price: Optional[Decimal] = None
    sale_amount: Optional[Decimal] = None
    payment_type: Optional[str] = None

class SaleCreate(BaseModel):
    # Redefined to allow codes instead of just IDs
    inventory_status: Optional[str] = None
    invoice_num: Optional[str] = None
    sale_date: Optional[date] = None
    quantity: int
    unit_price: Decimal
    sale_amount: Decimal
    payment_type: Optional[str] = None
    
    # Accept codes (frontend) OR IDs (backend/legacy)
    product_code: Optional[str] = None
    product_id: Optional[int] = None
    
    client_number: Optional[str] = None
    client_id: Optional[int] = None
    
    staff_number: Optional[str] = None
    employee_id: Optional[int] = None

class SaleUpdate(SaleBase):
    pass

class Sale(SaleBase):
    sale_num: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
