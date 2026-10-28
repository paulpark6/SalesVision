"""Role + hierarchy access control: admin = all, manager = self + direct reports, staff/viewer = self."""
from typing import List

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.employee import Employee
from app.models.user import User, UserRole

ADMIN = UserRole.ADMIN
MANAGER = UserRole.MANAGER
STAFF = UserRole.STAFF


def require_roles(*roles: UserRole):
    """Dependency: 403 unless the current user has one of `roles`."""
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Permission denied")
        return user
    return checker


def visible_employee_ids(user: User, db: Session) -> List[int] | None:
    """Employee ids whose rows `user` may see. None = everything (admin)."""
    if user.role == ADMIN:
        return None
    if not user.employee_id:
        return []
    if user.role == MANAGER:
        reports = db.query(Employee.id).filter(Employee.manager_id == user.employee_id)
        return [user.employee_id] + [r[0] for r in reports]
    return [user.employee_id]


def scope(query, employee_col, user: User, db: Session):
    """Limit a query to rows owned by employees the user may see."""
    ids = visible_employee_ids(user, db)
    return query if ids is None else query.filter(employee_col.in_(ids))


def check_owner(employee_id: int | None, user: User, db: Session) -> None:
    """403 unless the row's owner is visible to the user."""
    ids = visible_employee_ids(user, db)
    if ids is not None and employee_id not in ids:
        raise HTTPException(status_code=403, detail="Not authorized for this record")
