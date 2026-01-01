from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models import User, Event, Organizer
from app.schemas import EventCreate, EventUpdate, EventResponse
from app.auth import get_current_organizer, get_current_user

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
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    if event.max_participants and event.registered_participants >= event.max_participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full"
        )
    
    # Increment registered participants
    event.registered_participants += 1
    db.commit()
    
    return {
        "message": "Successfully registered for event",
        "event_id": event_id,
        "event_title": event.title
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

