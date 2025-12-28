from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class PriceListBase(BaseModel):
    product_id: int
    product_description: Optional[str] = None
    client_grade: Optional[str] = None
    price: Optional[Decimal] = None

class PriceListCreate(PriceListBase):
    pass

class PriceListUpdate(PriceListBase):
    pass

class PriceList(PriceListBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
