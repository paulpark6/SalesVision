from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.stock import Stock
from app.schemas.stock import Stock as StockSchema, StockCreate, StockUpdate

router = APIRouter(
    prefix="/stocks",
    tags=["stocks"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[StockSchema])
def read_stocks(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    query = db.query(Stock)

    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        query = query.filter(func.substr(Stock.check_date, 1, 7).in_(month_list))

    stocks = query.offset(skip).limit(limit).all()
    return stocks

@router.get("/{stock_id}", response_model=StockSchema)
def read_stock(stock_id: int, db: Session = Depends(get_db)):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.post("/", response_model=StockSchema, status_code=status.HTTP_201_CREATED)
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    # Check if product_id already exists
    db_stock = db.query(Stock).filter(Stock.product_id == stock.product_id).first()
    if db_stock:
        raise HTTPException(status_code=400, detail="Stock for this product already exists")
    
    db_stock = Stock(**stock.model_dump())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@router.put("/{stock_id}", response_model=StockSchema)
def update_stock(stock_id: int, stock_update: StockUpdate, db: Session = Depends(get_db)):
    db_stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if db_stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    update_data = stock_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_stock, key, value)
    
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@router.delete("/{stock_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    db_stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if db_stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    db.delete(db_stock)
    db.commit()
    return None
