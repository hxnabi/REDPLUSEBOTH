from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import BloodBank, BloodInventory
from app.schemas import (
    BloodBankCreate,
    BloodBankUpdate,
    BloodBankResponse,
    BloodInventoryCreate,
    BloodInventoryUpdate,
    BloodInventoryResponse
)

router = APIRouter()

# Blood Bank CRUD Operations
@router.post("/", response_model=BloodBankResponse, status_code=status.HTTP_201_CREATED)
def create_blood_bank(
    blood_bank: BloodBankCreate,
    db: Session = Depends(get_db)
):
    """Create a new blood bank."""
    new_bank = BloodBank(**blood_bank.model_dump())
    db.add(new_bank)
    db.commit()
    db.refresh(new_bank)
    return new_bank

@router.get("/", response_model=List[BloodBankResponse])
def list_blood_banks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    state: Optional[str] = None,
    city: Optional[str] = None,
    category: Optional[str] = None,
    blood_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all blood banks with optional filters."""
    query = db.query(BloodBank)
    
    if state:
        query = query.filter(BloodBank.state == state)
    if city:
        query = query.filter(BloodBank.city == city)
    if category:
        query = query.filter(BloodBank.category == category)
    if blood_type:
        query = query.filter(BloodBank.available_blood_types.contains(blood_type))
    
    banks = query.offset(skip).limit(limit).all()
    return banks

@router.get("/{bank_id}", response_model=BloodBankResponse)
def get_blood_bank(bank_id: int, db: Session = Depends(get_db)):
    """Get a specific blood bank by ID."""
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blood bank not found"
        )
    return bank

@router.put("/{bank_id}", response_model=BloodBankResponse)
def update_blood_bank(
    bank_id: int,
    bank_update: BloodBankUpdate,
    db: Session = Depends(get_db)
):
    """Update a blood bank."""
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blood bank not found"
        )
    
    update_data = bank_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(bank, key, value)
    
    db.commit()
    db.refresh(bank)
    return bank

@router.delete("/{bank_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blood_bank(bank_id: int, db: Session = Depends(get_db)):
    """Delete a blood bank."""
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blood bank not found"
        )
    
    db.delete(bank)
    db.commit()
    return None

# Blood Inventory Operations
@router.post("/inventory", response_model=BloodInventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory(
    inventory: BloodInventoryCreate,
    db: Session = Depends(get_db)
):
    """Create or update blood inventory for a blood bank."""
    # Check if bank exists
    bank = db.query(BloodBank).filter(BloodBank.id == inventory.blood_bank_id).first()
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blood bank not found"
        )
    
    # Check if inventory already exists
    existing_inventory = db.query(BloodInventory).filter(
        BloodInventory.blood_bank_id == inventory.blood_bank_id,
        BloodInventory.blood_type == inventory.blood_type
    ).first()
    
    if existing_inventory:
        existing_inventory.units_available = inventory.units_available
        db.commit()
        db.refresh(existing_inventory)
        return existing_inventory
    
    new_inventory = BloodInventory(**inventory.model_dump())
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory

@router.get("/inventory/{bank_id}", response_model=List[BloodInventoryResponse])
def get_bank_inventory(bank_id: int, db: Session = Depends(get_db)):
    """Get all blood inventory for a specific bank."""
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blood bank not found"
        )
    
    inventory = db.query(BloodInventory).filter(
        BloodInventory.blood_bank_id == bank_id
    ).all()
    
    return inventory

@router.put("/inventory/{inventory_id}", response_model=BloodInventoryResponse)
def update_inventory(
    inventory_id: int,
    inventory_update: BloodInventoryUpdate,
    db: Session = Depends(get_db)
):
    """Update blood inventory units."""
    inventory = db.query(BloodInventory).filter(BloodInventory.id == inventory_id).first()
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found"
        )
    
    inventory.units_available = inventory_update.units_available
    db.commit()
    db.refresh(inventory)
    return inventory

@router.get("/states/list")
def get_states(db: Session = Depends(get_db)):
    """Get list of all unique states where blood banks are located."""
    states = db.query(BloodBank.state).distinct().all()
    return {"states": [state[0] for state in states if state[0]]}

@router.get("/cities/{state}")
def get_cities_by_state(state: str, db: Session = Depends(get_db)):
    """Get list of cities in a specific state."""
    cities = db.query(BloodBank.city).filter(
        BloodBank.state == state
    ).distinct().all()
    return {"cities": [city[0] for city in cities if city[0]]}

