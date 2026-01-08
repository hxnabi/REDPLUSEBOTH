from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from app.database import get_db
from app.models import User, Event, Organizer, Donor, Donation, DonationStatus, Certificate
from app.schemas import EventCreate, EventUpdate, EventResponse
from app.auth import get_current_organizer, get_current_user, get_current_donor

router = APIRouter()

@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event: EventCreate,
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Create a new blood donation event."""
    # Get organizer profile
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer profile not found"
        )
    
    new_event = Event(
        organizer_id=organizer.id,
        **event.model_dump()
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/my-events", response_model=List[EventResponse])
def get_my_events(
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Get all events created by the current organizer."""
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer profile not found"
        )
    
    events = db.query(Event).filter(
        Event.organizer_id == organizer.id
    ).order_by(Event.event_date.desc()).all()
    
    return events

@router.get("/", response_model=List[EventResponse])
def list_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """List all events with optional filters."""
    query = db.query(Event)
    
    if status:
        query = query.filter(Event.status == status)
    if city:
        query = query.filter(Event.city == city)
    if state:
        query = query.filter(Event.state == state)
    if from_date:
        query = query.filter(Event.event_date >= from_date)
    if to_date:
        query = query.filter(Event.event_date <= to_date)
    
    events = query.order_by(Event.event_date.asc()).offset(skip).limit(limit).all()
    return events

@router.get("/upcoming", response_model=List[EventResponse])
def get_upcoming_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    city: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get upcoming events."""
    from datetime import datetime
    
    query = db.query(Event).filter(
        Event.event_date >= datetime.now().date(),
        Event.status == "upcoming"
    )
    
    if city:
        query = query.filter(Event.city == city)
    if state:
        query = query.filter(Event.state == state)
    
    events = query.order_by(Event.event_date.asc()).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific event by ID."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Update an event."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if user owns this event
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if event.organizer_id != organizer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this event"
        )
    
    update_data = event_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
    
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Delete an event."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if user owns this event
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if event.organizer_id != organizer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this event"
        )
    
    db.delete(event)
    db.commit()
    return None

@router.post("/{event_id}/register")
def register_for_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register current user (donor) for an event."""
    # Check if user is a donor
    if current_user.role != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only donors can register for events"
        )
    
    # Get donor profile
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    # Get event
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if event is full
    if event.max_participants and event.registered_participants >= event.max_participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full. No more participants can join."
        )
    
    # Check if donor already registered for this event
    existing_donation = db.query(Donation).filter(
        Donation.donor_id == donor.id,
        Donation.event_id == event_id
    ).first()
    
    if existing_donation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already registered for this event"
        )
    
    # Create scheduled donation record
    new_donation = Donation(
        donor_id=donor.id,
        event_id=event_id,
        donation_date=event.event_date,
        blood_type=donor.blood_type,
        units=1.0,
        status=DonationStatus.SCHEDULED,
        notes=f"Registered for event: {event.title}"
    )
    
    db.add(new_donation)
    
    # Increment registered participants
    event.registered_participants += 1
    
    db.commit()
    db.refresh(event)
    
    return {
        "message": "Successfully registered for event",
        "event_id": event_id,
        "event_title": event.title,
        "donation_id": new_donation.id,
        "event_date": event.event_date,
        "remaining_slots": (event.max_participants - event.registered_participants) if event.max_participants else None
    }

@router.get("/{event_id}/participants")
def get_event_participants(
    event_id: int,
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Get list of participants for an event (Organizer only)."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if user owns this event
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if event.organizer_id != organizer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view participants for this event"
        )
    
    # Get all donations for this event
    donations = db.query(Donation).filter(Donation.event_id == event_id).all()
    
    participants = []
    for donation in donations:
        donor = db.query(Donor).filter(Donor.id == donation.donor_id).first()
        participants.append({
            "donation_id": donation.id,
            "donor_name": donor.full_name,
            "blood_type": donor.blood_type,
            "status": donation.status,
            "donation_date": donation.donation_date,
            "has_certificate": db.query(Certificate).filter(Certificate.donation_id == donation.id).first() is not None
        })
    
    return {
        "event_id": event_id,
        "event_title": event.title,
        "total_participants": len(participants),
        "participants": participants
    }

@router.post("/{event_id}/complete-donation/{donation_id}")
def complete_donation_and_issue_certificate(
    event_id: int,
    donation_id: int,
    current_user: User = Depends(get_current_organizer),
    db: Session = Depends(get_db)
):
    """Mark donation as completed and issue certificate (Organizer only)."""
    from app.models import Certificate, CertificateStatus
    import uuid
    
    # Get event
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if user owns this event
    organizer = db.query(Organizer).filter(Organizer.user_id == current_user.id).first()
    if event.organizer_id != organizer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to manage this event"
        )
    
    # Get donation
    donation = db.query(Donation).filter(
        Donation.id == donation_id,
        Donation.event_id == event_id
    ).first()
    
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found for this event"
        )
    
    # Check if already completed
    if donation.status == DonationStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation already marked as completed"
        )
    
    # Update donation status
    donation.status = DonationStatus.COMPLETED
    
    # Update donor statistics
    donor = db.query(Donor).filter(Donor.id == donation.donor_id).first()
    donor.total_donations += 1
    donor.last_donation_date = donation.donation_date
    
    # Check if certificate already exists
    existing_cert = db.query(Certificate).filter(
        Certificate.donation_id == donation_id
    ).first()
    
    if not existing_cert:
        # Create certificate
        certificate_number = f"CERT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        new_certificate = Certificate(
            donation_id=donation_id,
            donor_id=donor.id,
            certificate_number=certificate_number,
            issue_date=date.today(),
            blood_units=donation.units,
            blood_type=donation.blood_type,
            status=CertificateStatus.ISSUED,
            issued_by=organizer.organization_name,
            notes=f"Certificate for participation in {event.title}"
        )
        
        db.add(new_certificate)
    
    db.commit()
    
    return {
        "message": "Donation completed and certificate issued successfully",
        "donation_id": donation_id,
        "donor_name": donor.full_name,
        "certificate_number": new_certificate.certificate_number if not existing_cert else existing_cert.certificate_number
    }

@router.get("/stats/summary")
def get_event_stats(db: Session = Depends(get_db)):
    """Get event statistics."""
    from sqlalchemy import func
    from datetime import datetime
    
    total_events = db.query(func.count(Event.id)).scalar()
    upcoming_events = db.query(func.count(Event.id)).filter(
        Event.event_date >= datetime.now().date(),
        Event.status == "upcoming"
    ).scalar()
    completed_events = db.query(func.count(Event.id)).filter(
        Event.status == "completed"
    ).scalar()
    
    total_participants = db.query(func.sum(Event.registered_participants)).scalar() or 0
    
    return {
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "completed_events": completed_events,
        "ongoing_events": total_events - upcoming_events - completed_events,
        "total_participants": total_participants
    }

