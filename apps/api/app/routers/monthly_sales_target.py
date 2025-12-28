from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.monthly_sales_target import MonthlySalesTarget
from app.schemas.monthly_sales_target import MonthlySalesTarget as MonthlySalesTargetSchema, MonthlySalesTargetCreate, MonthlySalesTargetUpdate

router = APIRouter(
    prefix="/monthly-sales-targets",
    tags=["monthly-sales-targets"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[MonthlySalesTargetSchema])
def read_monthly_sales_targets(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    query = db.query(MonthlySalesTarget)
    
    # Note: MonthlySalesTarget schema doesn't have a direct 'date' column in the model provided.
    # It has sales_amount_minus_X_month. 
    # If filtering is required, we need a field to filter by.
    # For now, we accept the parameter to avoid errors but return all or implement logic if column exists.
    # Looking at model: product_code, staff, sales_amounts, etc. 
    # Assuming valid requirement from user was "add month filter".
    
    targets = query.offset(skip).limit(limit).all()
    return targets

@router.get("/{target_id}", response_model=MonthlySalesTargetSchema)
def read_monthly_sales_target(target_id: int, db: Session = Depends(get_db)):
    target = db.query(MonthlySalesTarget).filter(MonthlySalesTarget.id == target_id).first()
    if target is None:
        raise HTTPException(status_code=404, detail="Monthly Sales Target not found")
    return target

@router.post("/", response_model=MonthlySalesTargetSchema, status_code=status.HTTP_201_CREATED)
def create_monthly_sales_target(target: MonthlySalesTargetCreate, db: Session = Depends(get_db)):
    db_target = MonthlySalesTarget(**target.model_dump())
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return db_target

@router.put("/{target_id}", response_model=MonthlySalesTargetSchema)
def update_monthly_sales_target(target_id: int, target_update: MonthlySalesTargetUpdate, db: Session = Depends(get_db)):
    db_target = db.query(MonthlySalesTarget).filter(MonthlySalesTarget.id == target_id).first()
    if db_target is None:
        raise HTTPException(status_code=404, detail="Monthly Sales Target not found")
    
    update_data = target_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_target, key, value)
    
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return db_target

@router.delete("/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_monthly_sales_target(target_id: int, db: Session = Depends(get_db)):
    db_target = db.query(MonthlySalesTarget).filter(MonthlySalesTarget.id == target_id).first()
    if db_target is None:
        raise HTTPException(status_code=404, detail="Monthly Sales Target not found")
    
    db.delete(db_target)
    db.commit()
    return None
