from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Donor
from app.schemas import DonorResponse, DonorUpdate
from app.auth import get_current_donor

router = APIRouter()

@router.get("/me", response_model=DonorResponse)
def get_donor_profile(
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Get current donor's profile."""
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    return {
        **donor.__dict__,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@router.put("/me", response_model=DonorResponse)
def update_donor_profile(
    donor_update: DonorUpdate,
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Update current donor's profile."""
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    # Update fields
    update_data = donor_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(donor, key, value)
    
    db.commit()
    db.refresh(donor)
    
    return {
        **donor.__dict__,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@router.get("/{donor_id}", response_model=DonorResponse)
def get_donor_by_id(donor_id: int, db: Session = Depends(get_db)):
    """Get donor by ID (public information)."""
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor not found"
        )
    
    user = db.query(User).filter(User.id == donor.user_id).first()
    
    return {
        **donor.__dict__,
        "email": user.email,
        "created_at": user.created_at
    }

@router.get("/", response_model=List[DonorResponse])
def list_donors(
    skip: int = 0,
    limit: int = 10,
    blood_type: str = None,
    city: str = None,
    state: str = None,
    db: Session = Depends(get_db)
):
    """List donors with optional filters."""
    query = db.query(Donor)
    
    if blood_type:
        query = query.filter(Donor.blood_type == blood_type)
    if city:
        query = query.filter(Donor.city == city)
    if state:
        query = query.filter(Donor.state == state)
    
    donors = query.offset(skip).limit(limit).all()
    
    result = []
    for donor in donors:
        user = db.query(User).filter(User.id == donor.user_id).first()
        result.append({
            **donor.__dict__,
            "email": user.email,
            "created_at": user.created_at
        })
    
    return result

