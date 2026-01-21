from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional
from ..database import get_db
from ..models import User, Donor, Organizer, Event, Donation, BloodBank, Certificate
from ..auth import get_current_user
from ..schemas import DonorResponse, OrganizerResponse, EventResponse
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminStats(BaseModel):
    total_donors: int
    total_organizers: int
    total_events: int
    total_donations: int
    total_blood_banks: int
    upcoming_events: int
    active_donors: int
    total_certificates: int
    active_organizers: int


class DonorListItem(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    blood_group: Optional[str]
    date_of_birth: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    is_active: bool
    created_at: datetime
    total_donations: int

    class Config:
        from_attributes = True


class OrganizerListItem(BaseModel):
    id: int
    organization_name: str
    email: str
    contact_person: str
    phone: Optional[str]
    is_verified: bool
    created_at: datetime
    total_events: int

    class Config:
        from_attributes = True


class EventListItem(BaseModel):
    id: int
    title: str
    organizer_name: str
    date: datetime
    location: str
    status: str
    total_participants: int
    total_donations: int

    class Config:
        from_attributes = True


class BloodBankListItem(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    email: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


def verify_admin(current_user: dict = Depends(get_current_user)):
    """Verify that the current user is an admin"""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Get comprehensive statistics for admin dashboard"""
    
    # Total donors
    total_donors = db.query(Donor).count()
    
    # Active donors (donated in last 6 months)
    six_months_ago = datetime.now() - timedelta(days=180)
    active_donors = db.query(Donor).join(Donation).filter(
        Donation.donation_date >= six_months_ago
    ).distinct().count()
    
    # Total organizers
    total_organizers = db.query(Organizer).count()
    
    # Active organizers (verified)
    active_organizers = db.query(Organizer).filter(Organizer.is_verified == True).count()
    
    # Total events
    total_events = db.query(Event).count()
    
    # Upcoming events
    upcoming_events = db.query(Event).filter(Event.date >= datetime.now()).count()
    
    # Total donations
    total_donations = db.query(Donation).count()
    
    # Total blood banks
    total_blood_banks = db.query(BloodBank).count()
    
    # Total certificates
    total_certificates = db.query(Certificate).count()
    
    return AdminStats(
        total_donors=total_donors,
        total_organizers=total_organizers,
        total_events=total_events,
        total_donations=total_donations,
        total_blood_banks=total_blood_banks,
        upcoming_events=upcoming_events,
        active_donors=active_donors,
        total_certificates=total_certificates,
        active_organizers=active_organizers
    )


@router.get("/donors", response_model=List[DonorListItem])
def get_all_donors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Get all donors with their donation counts"""
    
    donors = db.query(
        Donor.id,
        Donor.full_name,
        User.email,
        Donor.phone,
        Donor.blood_type,
        Donor.date_of_birth,
        Donor.gender,
        Donor.is_active,
        Donor.created_at,
        func.count(Donation.id).label('total_donations')
    ).join(User, Donor.user_id == User.id).outerjoin(
        Donation, Donor.id == Donation.donor_id
    ).group_by(
        Donor.id, Donor.full_name, User.email, Donor.phone, 
        Donor.blood_type, Donor.date_of_birth, Donor.gender, 
        Donor.is_active, Donor.created_at
    ).offset(skip).limit(limit).all()
    
    def calculate_age(date_of_birth):
        if not date_of_birth:
            return None
        today = datetime.now().date()
        return today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
    
    return [
        DonorListItem(
            id=d.id,
            full_name=d.full_name,
            email=d.email,
            phone=d.phone,
            blood_group=d.blood_type.value if d.blood_type else None,
            date_of_birth=str(d.date_of_birth) if d.date_of_birth else None,
            age=calculate_age(d.date_of_birth),
            gender=d.gender,
            is_active=d.is_active,
            created_at=d.created_at,
            total_donations=d.total_donations
        )
        for d in donors
    ]


@router.get("/organizers", response_model=List[OrganizerListItem])
def get_all_organizers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Get all organizers with their event counts"""
    
    organizers = db.query(
        Organizer.id,
        Organizer.organization_name,
        User.email,
        Organizer.contact_person,
        Organizer.phone,
        Organizer.is_verified,
        Organizer.created_at,
        func.count(Event.id).label('total_events')
    ).join(User, Organizer.user_id == User.id).outerjoin(
        Event, Organizer.id == Event.organizer_id
    ).group_by(
        Organizer.id, Organizer.organization_name, User.email,
        Organizer.contact_person, Organizer.phone,
        Organizer.is_verified, Organizer.created_at
    ).offset(skip).limit(limit).all()
    
    return [
        OrganizerListItem(
            id=o.id,
            organization_name=o.organization_name,
            email=o.email,
            contact_person=o.contact_person,
            phone=o.phone,
            is_verified=o.is_verified,
            created_at=o.created_at,
            total_events=o.total_events
        )
        for o in organizers
    ]


@router.get("/events", response_model=List[EventListItem])
def get_all_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Get all events with participant and donation counts"""
    
    events = db.query(
        Event.id,
        Event.title,
        Organizer.organization_name.label('organizer_name'),
        Event.event_date,
        Event.venue,
        Event.status,
        func.count(func.distinct(Donation.donor_id)).label('total_participants'),
        func.count(Donation.id).label('total_donations')
    ).join(Organizer, Event.organizer_id == Organizer.id).outerjoin(
        Donation, Event.id == Donation.event_id
    ).group_by(
        Event.id, Event.title, Organizer.organization_name,
        Event.event_date, Event.venue, Event.status
    ).offset(skip).limit(limit).all()
    
    return [
        EventListItem(
            id=e.id,
            title=e.title,
            organizer_name=e.organizer_name,
            date=e.event_date,
            location=e.venue,
            status=e.status,
            total_participants=e.total_participants,
            total_donations=e.total_donations
        )
        for e in events
    ]


@router.get("/blood-banks", response_model=List[BloodBankListItem])
def get_all_blood_banks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Get all blood banks"""
    
    blood_banks = db.query(BloodBank).offset(skip).limit(limit).all()
    
    return [
        BloodBankListItem(
            id=bb.id,
            name=bb.name,
            address=bb.address,
            phone=bb.phone,
            email=bb.email,
            created_at=bb.created_at
        )
        for bb in blood_banks
    ]


@router.patch("/donors/{donor_id}/toggle-active")
def toggle_donor_active(
    donor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Toggle donor active status"""
    
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor not found"
        )
    
    donor.is_active = not donor.is_active
    db.commit()
    
    return {"message": f"Donor {'activated' if donor.is_active else 'deactivated'} successfully"}


@router.patch("/organizers/{organizer_id}/toggle-verified")
def toggle_organizer_verified(
    organizer_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Toggle organizer verified status"""
    
    organizer = db.query(Organizer).filter(Organizer.id == organizer_id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found"
        )
    
    organizer.is_verified = not organizer.is_verified
    db.commit()
    
    return {"message": f"Organizer {'verified' if organizer.is_verified else 'unverified'} successfully"}


@router.delete("/donors/{donor_id}")
def delete_donor(
    donor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Delete a donor"""
    
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor not found"
        )
    
    # Delete associated user
    user = db.query(User).filter(User.id == donor.user_id).first()
    if user:
        db.delete(user)
    
    db.delete(donor)
    db.commit()
    
    return {"message": "Donor deleted successfully"}


@router.delete("/organizers/{organizer_id}")
def delete_organizer(
    organizer_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Delete an organizer"""
    
    organizer = db.query(Organizer).filter(Organizer.id == organizer_id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found"
        )
    
    # Delete associated user
    user = db.query(User).filter(User.id == organizer.user_id).first()
    if user:
        db.delete(user)
    
    db.delete(organizer)
    db.commit()
    
    return {"message": "Organizer deleted successfully"}


@router.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_admin)
):
    """Delete an event"""
    
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    db.delete(event)
    db.commit()
    
    return {"message": "Event deleted successfully"}

