from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.db.session import get_db
from app.models.expenditure import Expenditure
from app.schemas.expenditure import Expenditure as ExpenditureSchema, ExpenditureCreate, ExpenditureUpdate
from app.core.deps import get_current_user
from app.models.user import User, UserRole

router = APIRouter(
    prefix="/expenditures",
    tags=["expenditures"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require admin role for all expenditure endpoints."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Expenditures are admin-only. Access denied."
        )
    return current_user


@router.get("/", response_model=List[ExpenditureSchema])
def read_expenditures(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all expenditures - Admin only."""
    query = db.query(Expenditure)

    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        query = query.filter(func.substr(Expenditure.date, 1, 7).in_(month_list))

    expenditures = query.offset(skip).limit(limit).all()
    return expenditures


@router.get("/{expenditure_id}", response_model=ExpenditureSchema)
def read_expenditure(
    expenditure_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get specific expenditure - Admin only."""
    expenditure = db.query(Expenditure).filter(Expenditure.id == expenditure_id).first()
    if expenditure is None:
        raise HTTPException(status_code=404, detail="Expenditure not found")
    return expenditure


@router.post("/", response_model=ExpenditureSchema, status_code=status.HTTP_201_CREATED)
def create_expenditure(
    expenditure: ExpenditureCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create expenditure - Admin only."""
    db_expenditure = Expenditure(**expenditure.model_dump())
    db.add(db_expenditure)
    db.commit()
    db.refresh(db_expenditure)
    return db_expenditure


@router.put("/{expenditure_id}", response_model=ExpenditureSchema)
def update_expenditure(
    expenditure_id: int, 
    expenditure_update: ExpenditureUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update expenditure - Admin only."""
    db_expenditure = db.query(Expenditure).filter(Expenditure.id == expenditure_id).first()
    if db_expenditure is None:
        raise HTTPException(status_code=404, detail="Expenditure not found")
    
    update_data = expenditure_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expenditure, key, value)
    
    db.add(db_expenditure)
    db.commit()
    db.refresh(db_expenditure)
    return db_expenditure


@router.delete("/{expenditure_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expenditure(
    expenditure_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete expenditure - Admin only."""
    db_expenditure = db.query(Expenditure).filter(Expenditure.id == expenditure_id).first()
    if db_expenditure is None:
        raise HTTPException(status_code=404, detail="Expenditure not found")
    
    db.delete(db_expenditure)
    db.commit()
    return None
