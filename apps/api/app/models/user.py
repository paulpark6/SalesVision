"""User model for authentication and authorization."""
from datetime import datetime
from sqlalchemy import String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from typing import TYPE_CHECKING # ❗ Import TYPE_CHECKING

from app.db.base import Base

if TYPE_CHECKING: # ❗ Add type checking block
    from app.models.employee import Employee  # Import for type hint

class UserRole(str, enum.Enum):
    """User roles for RBAC."""
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    VIEWER = "viewer"


class User(Base):
    """
    User accounts for authentication.
    Links to Employee table via employee_id.
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    
    # reference to employee table
    employee_id: Mapped[str] = mapped_column(
        String(50),                           # 1. Type
        ForeignKey("employees.staff_number"), # 2. Constraint
        unique=True, 
        nullable=False, 
        index=True
    )    
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), nullable=False, default=UserRole.STAFF)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # adding relationship to Employee
    employee: Mapped["Employee"] = relationship(
        "Employee", 
        back_populates="user_profile", # Make sure this matches the name in Employee
        uselist=False 
    )
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"