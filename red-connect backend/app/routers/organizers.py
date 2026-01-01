from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Organizer
from app.schemas import OrganizerResponse, OrganizerUpdate
from app.auth import get_current_organizer

router = APIRouter()

@router.get("/me", response_model=OrganizerResponse)
def get_organizer_profile(
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Get current organizer's profile."""
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer profile not found"
        )
    
    return {
        **organizer.__dict__,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@router.put("/me", response_model=OrganizerResponse)
def update_organizer_profile(
    organizer_update: OrganizerUpdate,
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Update current organizer's profile."""
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer profile not found"
        )
    
    # Update fields
    update_data = organizer_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(organizer, key, value)
    
    db.commit()
    db.refresh(organizer)
    
    return {
        **organizer.__dict__,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@router.get("/{organizer_id}", response_model=OrganizerResponse)
def get_organizer_by_id(organizer_id: int, db: Session = Depends(get_db)):
    """Get organizer by ID (public information)."""
    organizer = db.query(Organizer).filter(Organizer.id == organizer_id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found"
        )
    
    user = db.query(User).filter(User.id == organizer.user_id).first()
    
    return {
        **organizer.__dict__,
        "email": user.email,
        "created_at": user.created_at
    }

@router.get("/", response_model=List[OrganizerResponse])
def list_organizers(
    skip: int = 0,
    limit: int = 10,
    verified: bool = None,
    city: str = None,
    state: str = None,
    db: Session = Depends(get_db)
):
    """List organizers with optional filters."""
    query = db.query(Organizer)
    
    if verified is not None:
        query = query.filter(Organizer.verified == verified)
    if city:
        query = query.filter(Organizer.city == city)
    if state:
        query = query.filter(Organizer.state == state)
    
    organizers = query.offset(skip).limit(limit).all()
    
    result = []
    for organizer in organizers:
        user = db.query(User).filter(User.id == organizer.user_id).first()
        result.append({
            **organizer.__dict__,
            "email": user.email,
            "created_at": user.created_at
        })
    
    return result

