"""Role-based access control permissions for the SalesVision API."""
from enum import Enum
from functools import wraps
from typing import List, Optional, Callable

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from ..models.user import User, UserRole
from ..models.employee import Employee


class Permission(str, Enum):
    """Available permissions in the system."""
    # Employee management
    EMPLOYEES_VIEW_ALL = "employees:view:all"
    EMPLOYEES_VIEW_TEAM = "employees:view:team"
    EMPLOYEES_EDIT = "employees:edit"
    
    # Sales
    SALES_VIEW_ALL = "sales:view:all"
    SALES_VIEW_TEAM = "sales:view:team"
    SALES_VIEW_OWN = "sales:view:own"
    SALES_EDIT_ALL = "sales:edit:all"
    SALES_EDIT_OWN = "sales:edit:own"
    SALES_CREATE = "sales:create"
    
    # Sales Targets
    TARGETS_VIEW = "targets:view"
    TARGETS_EDIT = "targets:edit"
    
    # Commissions
    COMMISSIONS_VIEW_ALL = "commissions:view:all"
    COMMISSIONS_VIEW_TEAM = "commissions:view:team"
    COMMISSIONS_VIEW_OWN = "commissions:view:own"
    COMMISSIONS_EDIT = "commissions:edit"
    
    # Expenditures
    EXPENDITURES_VIEW = "expenditures:view"
    EXPENDITURES_EDIT = "expenditures:edit"
    
    # Credits/Cheques
    CREDITS_VIEW = "credits:view"
    CREDITS_EDIT = "credits:edit"
    CHEQUES_VIEW = "cheques:view"
    CHEQUES_EDIT = "cheques:edit"


# Role to permissions mapping
ROLE_PERMISSIONS = {
    UserRole.ADMIN: [
        # Full access to everything
        Permission.EMPLOYEES_VIEW_ALL,
        Permission.EMPLOYEES_EDIT,
        Permission.SALES_VIEW_ALL,
        Permission.SALES_EDIT_ALL,
        Permission.SALES_CREATE,
        Permission.TARGETS_VIEW,
        Permission.TARGETS_EDIT,
        Permission.COMMISSIONS_VIEW_ALL,
        Permission.COMMISSIONS_EDIT,
        Permission.EXPENDITURES_VIEW,
        Permission.EXPENDITURES_EDIT,
        Permission.CREDITS_VIEW,
        Permission.CREDITS_EDIT,
        Permission.CHEQUES_VIEW,
        Permission.CHEQUES_EDIT,
    ],
    UserRole.MANAGER: [
        # Team-level access
        Permission.EMPLOYEES_VIEW_TEAM,
        Permission.SALES_VIEW_TEAM,
        Permission.SALES_EDIT_OWN,
        Permission.SALES_CREATE,
        Permission.TARGETS_VIEW,
        Permission.COMMISSIONS_VIEW_TEAM,
        Permission.COMMISSIONS_VIEW_OWN,
        Permission.CREDITS_VIEW,
        Permission.CREDITS_EDIT,
        Permission.CHEQUES_VIEW,
        Permission.CHEQUES_EDIT,
    ],
    UserRole.STAFF: [
        # Own data only
        Permission.SALES_VIEW_OWN,
        Permission.SALES_EDIT_OWN,
        Permission.SALES_CREATE,
        Permission.TARGETS_VIEW,
        Permission.COMMISSIONS_VIEW_OWN,
        Permission.CREDITS_VIEW,
        Permission.CHEQUES_VIEW,
    ],
    UserRole.VIEWER: [
        # Read-only access to basic data
        Permission.SALES_VIEW_OWN,
        Permission.TARGETS_VIEW,
    ],
}


def has_permission(user: User, permission: Permission) -> bool:
    """Check if a user has a specific permission."""
    if not user or not user.role:
        return False
    user_permissions = ROLE_PERMISSIONS.get(user.role, [])
    return permission in user_permissions


def require_permission(permission: Permission):
    """Dependency that requires a specific permission to access the endpoint."""
    def permission_checker(current_user: User = Depends(get_current_user)):
        if not has_permission(current_user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Required: {permission.value}"
            )
        return current_user
    return permission_checker


def require_any_permission(*permissions: Permission):
    """Dependency that requires at least one of the specified permissions."""
    def permission_checker(current_user: User = Depends(get_current_user)):
        for permission in permissions:
            if has_permission(current_user, permission):
                return current_user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission denied. Required one of: {[p.value for p in permissions]}"
        )
    return permission_checker


def get_team_employee_ids(user: User, db: Session) -> List[int]:
    """Get the numeric IDs of all employees in the user's team."""
    if not user.employee_id:
        return []
    
    # Get direct reports (employees where manager_id = user's ID)
    team_members = db.query(Employee).filter(
        Employee.manager_id == user.employee_id
    ).all()
    
    # Include the user's own employee ID
    employee_ids = [user.employee_id]
    employee_ids.extend([emp.id for emp in team_members])
    
    return employee_ids


def filter_by_access(
    user: User,
    db: Session,
    view_all_permission: Permission,
    view_team_permission: Permission,
    view_own_permission: Permission,
) -> Optional[List[int]]:
    """
    Determine which numeric employee IDs the user can access.
    
    Returns:
        - None if user can view all (no filter needed)
        - List of employee IDs for team/own access
    """
    if has_permission(user, view_all_permission):
        return None  # No filter - can see all
    
    if has_permission(user, view_team_permission):
        return get_team_employee_ids(user, db)
    
    if has_permission(user, view_own_permission):
        return [user.employee_id] if user.employee_id else []
    
    return []  # No access


def can_edit(user: User, edit_all_perm: Permission, edit_own_perm: Permission, target_employee_id: int) -> bool:
    """Check if user can edit a record belonging to target_employee_id."""
    if has_permission(user, edit_all_perm):
        return True
    if has_permission(user, edit_own_perm) and user.employee_id == target_employee_id:
        return True
    return False
