from fastapi import HTTPException
from app.models.user import User, UserRole
from app.models.employee import Employee
from typing import List

def check_access_permission(user: User, resource_owner_staff_number: str):
    """
    Enforce hierarchical access control:
    - ADMIN: Access everything.
    - MANAGER: Access self + direct reports.
    - STAFF: Access self only.
    - VIEWER: Read-only (handled by endpoint method, but scope is same as Staff usually or global read? 
      Lets assume Viewer is like Staff for now, or global read-only. 
      For now, we strictly implement the hierarchy check).
    
    If access is denied, raises HTTPException(403).
    """
    
    # 1. Admin allows all
    if user.role == UserRole.ADMIN:
        return True

    # 2. Get the staff number of the requestor
    if not user.employee:
        raise HTTPException(status_code=403, detail="User is not linked to an employee profile")
    
    requestor_staff_number = user.employee.staff_number

    # 3. Accessing own data
    if requestor_staff_number == resource_owner_staff_number:
        return True

    # 4. Manager accessing direct report
    if user.role == UserRole.MANAGER:
        # Check if resource_owner is a direct report of requestor
        # We can checks this by looking at the resource_owner's manager field
        # However, we only have the staff_number here. We might need to fetch the employee.
        # Ideally, the caller should pass the Employee object or we pass the db session.
        # But to keep this pure, let's assume we pass the Employee object OR we modify the signature to accept db.
        pass 
        # Wait, strictly speaking, to check if B is a report of A, we need to look up B.
        # Since this function assumes we just have the ID, we can't check without DB.
        # Let's refactor to accept 'resource_owner_employee' or 'db'.
    
    raise HTTPException(status_code=403, detail="Not authorized to access this resource")

# Revised approach:
# The dependency injection pattern is better.
# But for now, let's make a simple checker that takes the DB session if needed or just logic if we have objects.

def verify_hierarchical_access(user: User, targeted_employee: Employee):
    """
    Verify if 'user' allows access to 'targeted_employee' data.
    """
    if user.role == UserRole.ADMIN:
        return

    if not user.employee:
         raise HTTPException(status_code=403, detail="User has no employee profile")

    # Own data
    if user.id == targeted_employee.id:
        return

    # Manager
    if user.role == UserRole.MANAGER:
        if targeted_employee.manager_id == user.employee_id:
            return
    
    raise HTTPException(status_code=403, detail="Permission denied to access this employee's data")
