from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.client import Client
from app.schemas.client import Client as ClientSchema, ClientCreate, ClientUpdate

router = APIRouter(
    prefix="/clients",
    tags=["clients"],
    responses={404: {"description": "Not found"}},
    redirect_slashes=False,
)

@router.get("/", response_model=List[ClientSchema])
def read_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    clients = db.query(Client).offset(skip).limit(limit).all()
    return clients

@router.get("/{client_id}", response_model=ClientSchema)
def read_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.post("/", response_model=ClientSchema, status_code=status.HTTP_201_CREATED)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    """Create client. client_number will be auto-generated."""
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    
    # Auto-generate client_number based on ID
    if not db_client.client_number:
        db_client.client_number = f"CLI{db_client.id:03d}"
        db.commit()
        db.refresh(db_client)
    return db_client

@router.put("/{client_id}", response_model=ClientSchema)
def update_client(client_id: int, client_update: ClientUpdate, db: Session = Depends(get_db)):
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    update_data = client_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_client, key, value)
    
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db.delete(db_client)
    db.commit()
    return None
