from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models import User, Donation, Donor
from app.schemas import DonationCreate, DonationUpdate, DonationResponse
from app.auth import get_current_donor, get_current_user

router = APIRouter()

@router.post("/", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation: DonationCreate,
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Create a new donation record."""
    # Get donor profile
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    new_donation = Donation(
        donor_id=donor.id,
        **donation.model_dump()
    )
    
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)
    
    # Update donor statistics
    donor.total_donations += 1
    donor.last_donation_date = donation.donation_date
    db.commit()
    
    return new_donation

@router.get("/my-donations", response_model=List[DonationResponse])
def get_my_donations(
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Get all donations for the current donor."""
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    donations = db.query(Donation).filter(
        Donation.donor_id == donor.id
    ).order_by(Donation.donation_date.desc()).all()
    
    return donations

@router.get("/{donation_id}", response_model=DonationResponse)
def get_donation(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific donation by ID."""
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    # Check if user has access to this donation
    if current_user.role == "donor":
        donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
        if donation.donor_id != donor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this donation"
            )
    
    return donation

@router.put("/{donation_id}", response_model=DonationResponse)
def update_donation(
    donation_id: int,
    donation_update: DonationUpdate,
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Update a donation record."""
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    # Check if user owns this donation
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if donation.donor_id != donor.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this donation"
        )
    
    update_data = donation_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(donation, key, value)
    
    db.commit()
    db.refresh(donation)
    return donation

@router.delete("/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_donation(
    donation_id: int,
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Delete a donation record."""
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    # Check if user owns this donation
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if donation.donor_id != donor.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this donation"
        )
    
    db.delete(donation)
    
    # Update donor statistics
    donor.total_donations = max(0, donor.total_donations - 1)
    db.commit()
    
    return None

@router.get("/", response_model=List[DonationResponse])
def list_donations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """List all donations with optional filters (admin/organizer access)."""
    query = db.query(Donation)
    
    if status:
        query = query.filter(Donation.status == status)
    if from_date:
        query = query.filter(Donation.donation_date >= from_date)
    if to_date:
        query = query.filter(Donation.donation_date <= to_date)
    
    donations = query.order_by(
        Donation.donation_date.desc()
    ).offset(skip).limit(limit).all()
    
    return donations

@router.get("/stats/summary")
def get_donation_stats(db: Session = Depends(get_db)):
    """Get donation statistics."""
    from sqlalchemy import func
    
    total_donations = db.query(func.count(Donation.id)).scalar()
    completed_donations = db.query(func.count(Donation.id)).filter(
        Donation.status == "completed"
    ).scalar()
    
    total_units = db.query(func.sum(Donation.units)).scalar() or 0
    
    return {
        "total_donations": total_donations,
        "completed_donations": completed_donations,
        "scheduled_donations": total_donations - completed_donations,
        "total_units_collected": float(total_units)
    }

