from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.cash import Cash
from app.schemas.cash import Cash as CashSchema, CashCreate, CashUpdate

router = APIRouter(
    prefix="/cash",
    tags=["cash"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)

@router.get("/", response_model=List[CashSchema])
def read_cash_flows(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    query = db.query(Cash)
    
    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        conditions = []
        for m in month_list:
            try:
                year, month = map(int, m.split('-'))
                conditions.append(
                    (func.extract('year', Cash.date) == year) & 
                    (func.extract('month', Cash.date) == month)
                )
            except ValueError:
                continue
        if conditions:
            from sqlalchemy import or_
            query = query.filter(or_(*conditions))
    
    cash_flows = query.offset(skip).limit(limit).all()
    return cash_flows

@router.get("/{cash_id}", response_model=CashSchema)
def read_cash_flow(cash_id: int, db: Session = Depends(get_db)):
    cash = db.query(Cash).filter(Cash.id == cash_id).first()
    if cash is None:
        raise HTTPException(status_code=404, detail="Cash flow not found")
    return cash

@router.post("/", response_model=CashSchema, status_code=status.HTTP_201_CREATED)
def create_cash_flow(cash: CashCreate, db: Session = Depends(get_db)):
    db_cash = Cash(**cash.model_dump())
    db.add(db_cash)
    db.commit()
    db.refresh(db_cash)
    return db_cash

@router.put("/{cash_id}", response_model=CashSchema)
def update_cash_flow(cash_id: int, cash_update: CashUpdate, db: Session = Depends(get_db)):
    db_cash = db.query(Cash).filter(Cash.id == cash_id).first()
    if db_cash is None:
        raise HTTPException(status_code=404, detail="Cash flow not found")
    
    update_data = cash_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cash, key, value)
    
    db.add(db_cash)
    db.commit()
    db.refresh(db_cash)
    return db_cash

@router.delete("/{cash_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cash_flow(cash_id: int, db: Session = Depends(get_db)):
    db_cash = db.query(Cash).filter(Cash.id == cash_id).first()
    if db_cash is None:
        raise HTTPException(status_code=404, detail="Cash flow not found")
    
    db.delete(db_cash)
    db.commit()
    return None
