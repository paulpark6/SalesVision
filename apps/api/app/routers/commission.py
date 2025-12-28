from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.commission import Commission
from app.schemas.commission import Commission as CommissionSchema, CommissionCreate, CommissionUpdate
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.models.employee import Employee

router = APIRouter(
    prefix="/commissions",
    tags=["commissions"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)


@router.get("/", response_model=List[CommissionSchema])
def read_commissions(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get commissions based on role:
    - Admin: View all commissions
    - Manager: View own + team's commissions
    - Staff: View own commissions only
    """
    query = db.query(Commission)
    
    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        query = query.filter(func.substr(Commission.date, 1, 7).in_(month_list))
    
    if current_user.role == UserRole.ADMIN:
        # Admin sees all
        pass
    elif current_user.role == UserRole.MANAGER:
        # Manager sees own + direct reports
        if current_user.employee_id:
            # Get employee IDs of direct reports
            reports = db.query(Employee.id).filter(
                Employee.manager_id == current_user.employee_id
            ).all()
            team_ids = [r[0] for r in reports] + [current_user.employee_id]
            query = query.filter(Commission.employee_id.in_(team_ids))
    else:
        # Staff sees own only
        if current_user.employee_id:
            query = query.filter(Commission.employee_id == current_user.employee_id)
        else:
            return []  # No employee linked, no commissions
    
    commissions = query.offset(skip).limit(limit).all()
    return commissions


@router.get("/{commission_id}", response_model=CommissionSchema)
def read_commission(
    commission_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific commission with role-based access."""
    commission = db.query(Commission).filter(Commission.id == commission_id).first()
    if commission is None:
        raise HTTPException(status_code=404, detail="Commission not found")
    
    # Check access based on role
    if current_user.role == UserRole.ADMIN:
        return commission
    elif current_user.role == UserRole.MANAGER:
        # Can view own or team's
        is_own = commission.employee_id == current_user.employee_id
        is_report = False
        if not is_own and current_user.employee_id:
            emp = db.query(Employee).filter(Employee.id == commission.employee_id).first()
            if emp and emp.manager_id == current_user.employee_id:
                is_report = True
        if not (is_own or is_report):
            raise HTTPException(status_code=403, detail="Access denied to this commission record")
    else:
        # Staff can only view own
        if commission.employee_id != current_user.employee_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return commission


@router.post("/", response_model=CommissionSchema, status_code=status.HTTP_201_CREATED)
def create_commission(
    commission: CommissionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create commission - Admin only."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can create commissions"
        )
    
    db_commission = Commission(**commission.model_dump())
    db.add(db_commission)
    db.commit()
    db.refresh(db_commission)
    return db_commission


@router.put("/{commission_id}", response_model=CommissionSchema)
def update_commission(
    commission_id: int, 
    commission_update: CommissionUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update commission - Admin only."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can update commissions"
        )
    
    db_commission = db.query(Commission).filter(Commission.id == commission_id).first()
    if db_commission is None:
        raise HTTPException(status_code=404, detail="Commission not found")
    
    update_data = commission_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_commission, key, value)
    
    db.add(db_commission)
    db.commit()
    db.refresh(db_commission)
    return db_commission


@router.delete("/{commission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_commission(
    commission_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete commission - Admin only."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete commissions"
        )
    
    db_commission = db.query(Commission).filter(Commission.id == commission_id).first()
    if db_commission is None:
        raise HTTPException(status_code=404, detail="Commission not found")
    
    db.delete(db_commission)
    db.commit()
    return None
