from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    VIEWER = "viewer"

class UserBase(BaseModel):
    email: str
    employee_id: int
    role: Optional[UserRole] = UserRole.STAFF
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    email: Optional[str] = None
    employee_id: Optional[int] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True
