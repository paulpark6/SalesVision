from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.overdue_collection import OverdueCollection
from app.schemas.overdue_collection import OverdueCollection as OverdueCollectionSchema, OverdueCollectionCreate, OverdueCollectionUpdate

router = APIRouter(
    prefix="/overdue-collections",
    tags=["overdue-collections"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)

@router.get("/", response_model=List[OverdueCollectionSchema])
def read_overdue_collections(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db)
):
    query = db.query(OverdueCollection)

    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        conditions = []
        for m in month_list:
            try:
                year, month = map(int, m.split('-'))
                conditions.append(
                    (func.extract('year', OverdueCollection.date) == year) & 
                    (func.extract('month', OverdueCollection.date) == month)
                )
            except ValueError:
                continue
        if conditions:
            from sqlalchemy import or_
            query = query.filter(or_(*conditions))

    collections = query.offset(skip).limit(limit).all()
    return collections

@router.get("/{collection_id}", response_model=OverdueCollectionSchema)
def read_overdue_collection(collection_id: int, db: Session = Depends(get_db)):
    collection = db.query(OverdueCollection).filter(OverdueCollection.id == collection_id).first()
    if collection is None:
        raise HTTPException(status_code=404, detail="Overdue Collection not found")
    return collection

@router.post("/", response_model=OverdueCollectionSchema, status_code=status.HTTP_201_CREATED)
def create_overdue_collection(collection: OverdueCollectionCreate, db: Session = Depends(get_db)):
    db_collection = OverdueCollection(**collection.model_dump())
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@router.put("/{collection_id}", response_model=OverdueCollectionSchema)
def update_overdue_collection(collection_id: int, collection_update: OverdueCollectionUpdate, db: Session = Depends(get_db)):
    db_collection = db.query(OverdueCollection).filter(OverdueCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Overdue Collection not found")
    
    update_data = collection_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_collection, key, value)
    
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_overdue_collection(collection_id: int, db: Session = Depends(get_db)):
    db_collection = db.query(OverdueCollection).filter(OverdueCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Overdue Collection not found")
    
    db.delete(db_collection)
    db.commit()
    return None
