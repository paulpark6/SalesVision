from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.price_list import PriceList
from app.schemas.price_list import PriceList as PriceListSchema, PriceListCreate, PriceListUpdate

router = APIRouter(
    prefix="/price-lists",
    tags=["price-lists"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)

@router.get("/", response_model=List[PriceListSchema])
def read_price_lists(
    skip: int = 0,
    limit: int = 100,
    product_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PriceList)
    if product_id:
        query = query.filter(PriceList.product_id == product_id)
    price_lists = query.offset(skip).limit(limit).all()
    return price_lists

@router.get("/{price_list_id}", response_model=PriceListSchema)
def read_price_list(price_list_id: int, db: Session = Depends(get_db)):
    price_list = db.query(PriceList).filter(PriceList.id == price_list_id).first()
    if price_list is None:
        raise HTTPException(status_code=404, detail="Price List not found")
    return price_list

@router.post("/", response_model=PriceListSchema, status_code=status.HTTP_201_CREATED)
def create_price_list(price_list: PriceListCreate, db: Session = Depends(get_db)):
    db_price_list = PriceList(**price_list.model_dump())
    db.add(db_price_list)
    db.commit()
    db.refresh(db_price_list)
    return db_price_list

@router.put("/{price_list_id}", response_model=PriceListSchema)
def update_price_list(price_list_id: int, price_list_update: PriceListUpdate, db: Session = Depends(get_db)):
    db_price_list = db.query(PriceList).filter(PriceList.id == price_list_id).first()
    if db_price_list is None:
        raise HTTPException(status_code=404, detail="Price List not found")
    
    update_data = price_list_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_price_list, key, value)
    
    db.add(db_price_list)
    db.commit()
    db.refresh(db_price_list)
    return db_price_list

@router.delete("/{price_list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_price_list(price_list_id: int, db: Session = Depends(get_db)):
    db_price_list = db.query(PriceList).filter(PriceList.id == price_list_id).first()
    if db_price_list is None:
        raise HTTPException(status_code=404, detail="Price List not found")
    
    db.delete(db_price_list)
    db.commit()
    return None
