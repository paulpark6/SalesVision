from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ClientBase(BaseModel):
    client_number: Optional[str] = None # Auto-generated
    client_name: str
    client_category: Optional[str] = None
    client_grade: Optional[str] = None
    client_type: Optional[str] = None
    contact_name: Optional[str] = None
    contact_position: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_name2: Optional[str] = None
    contact_position2: Optional[str] = None
    contact_phone2: Optional[str] = None
    address: Optional[str] = None
    og_employee_id: int 
    current_employee_id: int
    average_amount: Optional[Decimal] = None
    yearly_amount: Optional[Decimal] = None
    information: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
