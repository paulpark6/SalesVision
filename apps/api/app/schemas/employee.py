from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class EmployeeBase(BaseModel):
    staff_number: Optional[str] = None # Auto-generated
    manager_id: Optional[int] = None # Changed to int
    position: Optional[str] = None
    name: str
    division: Optional[str] = None
    working_start: Optional[date] = None
    phone_number: Optional[str] = None
    whatsapp: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_number: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
