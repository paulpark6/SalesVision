from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.credit import Credit
from app.schemas.credit import Credit as CreditSchema, CreditCreate, CreditUpdate
from app.core.deps import get_current_user
from app.models.user import User
from app.core.permissions import require_roles, ADMIN, MANAGER, scope, check_owner

router = APIRouter(
    prefix="/credits",
    tags=["credits"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)


@router.get("/", response_model=List[CreditSchema])
def read_credits(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get credits - Scoped by hierarchy.
    """
    query = db.query(Credit)
    
    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        conditions = []
        for m in month_list:
            try:
                year, month = map(int, m.split('-'))
                conditions.append(
                    (func.extract('year', Credit.date) == year) & 
                    (func.extract('month', Credit.date) == month)
                )
            except ValueError:
                continue
        if conditions:
            from sqlalchemy import or_
            query = query.filter(or_(*conditions))
    
    query = scope(query, Credit.employee_id, current_user, db)
    credits = query.offset(skip).limit(limit).all()
    return credits


@router.get("/{credit_id}", response_model=CreditSchema)
def read_credit(
    credit_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific credit - Scoped by hierarchy."""
    credit = db.query(Credit).filter(Credit.credit_id == credit_id).first()
    if credit is None:
        raise HTTPException(status_code=404, detail="Credit not found")
    check_owner(credit.employee_id, current_user, db)
    return credit


@router.post("/", response_model=CreditSchema, status_code=status.HTTP_201_CREATED)
def create_credit(
    credit: CreditCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN, MANAGER))
):
    """Create credit - Admin and Manager only."""
    
    check_owner(credit.employee_id, current_user, db)
    db_credit = Credit(**credit.model_dump())
    db.add(db_credit)
    db.commit()
    db.refresh(db_credit)
    return db_credit


@router.put("/{credit_id}", response_model=CreditSchema)
def update_credit(
    credit_id: int, 
    credit_update: CreditUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN, MANAGER))
):
    """Update credit - Admin and Manager only."""
    
    db_credit = db.query(Credit).filter(Credit.credit_id == credit_id).first()
    if db_credit is None:
        raise HTTPException(status_code=404, detail="Credit not found")
    check_owner(db_credit.employee_id, current_user, db)
    
    update_data = credit_update.model_dump(exclude_unset=True)
    if 'employee_id' in update_data:
        check_owner(update_data['employee_id'], current_user, db)
    for key, value in update_data.items():
        setattr(db_credit, key, value)
    
    db.add(db_credit)
    db.commit()
    db.refresh(db_credit)
    return db_credit


@router.delete("/{credit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_credit(
    credit_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN, MANAGER))
):
    """Delete credit - Admin and Manager only."""
    
    db_credit = db.query(Credit).filter(Credit.credit_id == credit_id).first()
    if db_credit is None:
        raise HTTPException(status_code=404, detail="Credit not found")
    check_owner(db_credit.employee_id, current_user, db)
    
    db.delete(db_credit)
    db.commit()
    return None
