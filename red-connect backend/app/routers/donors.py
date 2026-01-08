from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta
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

@router.get("/me/eligibility")
def check_donation_eligibility(
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Check if donor is eligible to donate blood."""
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    issues = []
    
    # Age check (18-65 years)
    if donor.date_of_birth:
        today = date.today()
        age = today.year - donor.date_of_birth.year - ((today.month, today.day) < (donor.date_of_birth.month, donor.date_of_birth.day))
        if age < 18 or age > 65:
            issues.append(f"Age must be between 18-65 years (Current: {age} years)")
    else:
        issues.append("Date of birth not provided")
    
    # Weight check (>= 50 kg)
    if donor.weight:
        if donor.weight < 50:
            issues.append(f"Weight must be at least 50 kg (Current: {donor.weight} kg)")
    else:
        issues.append("Weight not provided")
    
    # Hemoglobin check
    if donor.hemoglobin and donor.gender:
        min_hb = 12.5 if donor.gender.lower() == 'female' else 13.0
        if donor.hemoglobin < min_hb:
            issues.append(f"Hemoglobin must be at least {min_hb} g/dL (Current: {donor.hemoglobin} g/dL)")
    else:
        if not donor.hemoglobin:
            issues.append("Hemoglobin level not provided")
        if not donor.gender:
            issues.append("Gender not provided")
    
    # Last donation check (minimum 90 days gap for males, 120 days for females)
    if donor.last_donation_date:
        today = date.today()
        days_since_last = (today - donor.last_donation_date).days
        min_gap = 120 if donor.gender and donor.gender.lower() == 'female' else 90
        
        if days_since_last < min_gap:
            days_remaining = min_gap - days_since_last
            next_eligible_date = donor.last_donation_date + timedelta(days=min_gap)
            issues.append(f"Must wait {days_remaining} more days. Next eligible date: {next_eligible_date.strftime('%B %d, %Y')}")
    
    eligible = len(issues) == 0
    
    return {
        "eligible": eligible,
        "issues": issues,
        "last_donation_date": donor.last_donation_date,
        "next_eligible_date": donor.last_donation_date + timedelta(days=(120 if donor.gender and donor.gender.lower() == 'female' else 90)) if donor.last_donation_date else None
    }

