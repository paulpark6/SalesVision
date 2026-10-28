from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.cheque import Cheque
from app.schemas.cheque import Cheque as ChequeSchema, ChequeCreate, ChequeUpdate
from app.core.deps import get_current_user
from app.models.user import User
from app.core.permissions import require_roles, ADMIN, MANAGER, scope, check_owner

router = APIRouter(
    prefix="/cheques",
    tags=["cheques"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)


@router.get("/", response_model=List[ChequeSchema])
def read_cheques(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all cheques - Scoped by hierarchy."""
    query = db.query(Cheque)
    
    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        conditions = []
        for m in month_list:
            try:
                year, month = map(int, m.split('-'))
                conditions.append(
                    (func.extract('year', Cheque.receipt_date) == year) & 
                    (func.extract('month', Cheque.receipt_date) == month)
                )
            except ValueError:
                continue
        if conditions:
            from sqlalchemy import or_
            query = query.filter(or_(*conditions))
    
    query = scope(query, Cheque.employee_id, current_user, db)
    cheques = query.offset(skip).limit(limit).all()
    return cheques


@router.get("/{cheque_id}", response_model=ChequeSchema)
def read_cheque(
    cheque_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific cheque - Scoped by hierarchy."""
    cheque = db.query(Cheque).filter(Cheque.id == cheque_id).first()
    if cheque is None:
        raise HTTPException(status_code=404, detail="Cheque not found")
    check_owner(cheque.employee_id, current_user, db)
    return cheque


@router.post("/", response_model=ChequeSchema, status_code=status.HTTP_201_CREATED)
def create_cheque(
    cheque: ChequeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN, MANAGER))
):
    """Create cheque - Admin and Manager only."""
    
    # Check if number_of_cheque already exists
    if cheque.number_of_cheque:
        db_cheque = db.query(Cheque).filter(Cheque.number_of_cheque == cheque.number_of_cheque).first()
        if db_cheque:
            raise HTTPException(status_code=400, detail="Cheque with this number already exists")

    check_owner(cheque.employee_id, current_user, db)
    db_cheque = Cheque(**cheque.model_dump())
    db.add(db_cheque)
    db.commit()
    db.refresh(db_cheque)
    return db_cheque


@router.put("/{cheque_id}", response_model=ChequeSchema)
def update_cheque(
    cheque_id: int, 
    cheque_update: ChequeUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN, MANAGER))
):
    """Update cheque - Admin and Manager only."""
    
    db_cheque = db.query(Cheque).filter(Cheque.id == cheque_id).first()
    if db_cheque is None:
        raise HTTPException(status_code=404, detail="Cheque not found")
    check_owner(db_cheque.employee_id, current_user, db)
    
    update_data = cheque_update.model_dump(exclude_unset=True)
    if 'employee_id' in update_data:
        check_owner(update_data['employee_id'], current_user, db)
    for key, value in update_data.items():
        setattr(db_cheque, key, value)
    
    db.add(db_cheque)
    db.commit()
    db.refresh(db_cheque)
    return db_cheque


@router.delete("/{cheque_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cheque(
    cheque_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN, MANAGER))
):
    """Delete cheque - Admin and Manager only."""
    
    db_cheque = db.query(Cheque).filter(Cheque.id == cheque_id).first()
    if db_cheque is None:
        raise HTTPException(status_code=404, detail="Cheque not found")
    check_owner(db_cheque.employee_id, current_user, db)
    
    db.delete(db_cheque)
    db.commit()
    return None
