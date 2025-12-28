from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.employee import Employee
from app.schemas.employee import Employee as EmployeeSchema, EmployeeCreate, EmployeeUpdate
from app.core.deps import get_current_user
from app.models.user import User, UserRole

router = APIRouter(prefix="/employees", tags=["employees"], redirect_slashes=False)


@router.get("/", response_model=List[EmployeeSchema])
def read_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get employees based on role:
    - Admin: View all employees
    - Manager: View team only (employees who report to them)
    - Staff: No access (returns 403)
    """
    query = db.query(Employee)
    
    if current_user.role == UserRole.ADMIN:
        # Admin sees all
        pass
    elif current_user.role == UserRole.MANAGER:
        # Manager sees self + direct reports
        if current_user.employee_id:
            query = query.filter(
                (Employee.manager_id == current_user.employee_id) | 
                (Employee.staff_number == current_user.employee_id)
            )
    else:
        # Staff cannot access employee list
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff role cannot access employee list"
        )
    
    employees = query.offset(skip).limit(limit).all()
    return employees


@router.get("/{employee_id}", response_model=EmployeeSchema)
def read_employee_by_id(
    employee_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific employee by ID with role-based access."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check access
    if current_user.role == UserRole.ADMIN:
        return employee
    elif current_user.role == UserRole.MANAGER:
        # Manager can view self or direct reports
        is_self = employee.id == current_user.employee_id
        is_report = employee.manager_id == current_user.employee_id
        if not (is_self or is_report):
            raise HTTPException(status_code=403, detail="Access denied to this employee record")
    else:
        # Staff can only view themselves
        if employee.id != current_user.employee_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return employee


# Eliminated redundant read_employee_by_staff_number as it's now primary


@router.post("/", response_model=EmployeeSchema, status_code=status.HTTP_201_CREATED)
def create_employee(
    employee: EmployeeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create employee - Admin only. staff_number will be auto-generated."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can create employees"
        )
    
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    try:
        db.commit()
        db.refresh(db_employee)
        
        # Auto-generate staff_number based on ID
        if not db_employee.staff_number:
            db_employee.staff_number = f"EMP{db_employee.id:03d}"
            db.commit()
            db.refresh(db_employee)
    except Exception as e:
        db.rollback()
        # Check for IntegrityError (Foreign Key violation usually)
        if "foreign key constraint" in str(e).lower():
             raise HTTPException(status_code=400, detail="Manager ID not found or other relationship issue")
        raise HTTPException(status_code=500, detail=str(e))
        
    return db_employee


@router.put("/{employee_id}", response_model=EmployeeSchema)
def update_employee(
    employee_id: int, 
    employee_update: EmployeeUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update employee - Admin only."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can update employees"
        )
    
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = employee_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_employee, key, value)
    
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete employee - Admin only."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete employees"
        )
    
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return None
