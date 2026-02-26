from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional
import re
from ..database import get_db
from ..models import User, Donor, Organizer, Event, Donation, BloodBank, Certificate, BlogPost, BlogCategory
from ..auth import get_current_user, verify_admin
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


class QuickStats(BaseModel):
    active_users_percentage: float
    event_completion_percentage: float
    donor_retention_percentage: float


class RecentActivity(BaseModel):
    id: int
    type: str  # "donor", "event", "donation", "organizer", "blood_bank"
    title: str
    description: str
    time_ago: str
    timestamp: datetime
    badge: str  # "New", "Event", "Donation", etc.


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


class AdminBlogCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    category: BlogCategory
    excerpt: Optional[str] = None
    content: str
    read_time_minutes: Optional[int] = None
    highlight: Optional[bool] = False


class AdminBlogResponse(BaseModel):
    id: int
    title: str
    slug: str
    category: BlogCategory
    excerpt: Optional[str] = None
    content: str
    read_time_minutes: Optional[int] = None
    highlight: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True





def generate_unique_slug(db: Session, base: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")
    if not slug:
        slug = "article"
    original = slug
    counter = 1
    existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    while existing is not None:
        counter += 1
        slug = f"{original}-{counter}"
        existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    return slug


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
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
    active_organizers = db.query(Organizer).filter(Organizer.verified == True).count()
    
    # Total events
    total_events = db.query(Event).count()
    
    # Upcoming events
    upcoming_events = db.query(Event).filter(Event.event_date >= datetime.now().date()).count()
    
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


@router.get("/quick-stats", response_model=QuickStats)
def get_quick_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    """Get quick statistics for admin dashboard"""
    
    # Total users (donors + organizers)
    total_users = db.query(User).filter(User.role.in_(["donor", "organizer"])).count()
    
    # Active users (logged in or donated in last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    active_users = db.query(User).filter(
        and_(
            User.role.in_(["donor", "organizer"]),
            or_(
                User.updated_at >= thirty_days_ago,
                User.id.in_(
                    db.query(Donation.donor_id).filter(
                        Donation.donation_date >= thirty_days_ago.date()
                    )
                )
            )
        )
    ).count()
    
    active_users_percentage = (active_users / total_users * 100) if total_users > 0 else 0
    
    # Event completion rate
    total_completed_events = db.query(Event).filter(Event.status == "COMPLETED").count()
    total_events = db.query(Event).count()
    event_completion_percentage = (total_completed_events / total_events * 100) if total_events > 0 else 0
    
    # Donor retention (donors who donated more than once)
    total_donors = db.query(Donor).count()
    repeat_donors = db.query(Donor).filter(Donor.total_donations > 1).count()
    donor_retention_percentage = (repeat_donors / total_donors * 100) if total_donors > 0 else 0
    
    return QuickStats(
        active_users_percentage=round(active_users_percentage, 1),
        event_completion_percentage=round(event_completion_percentage, 1),
        donor_retention_percentage=round(donor_retention_percentage, 1)
    )


@router.post("/blogs", response_model=AdminBlogResponse, status_code=status.HTTP_201_CREATED)
def create_blog(
    payload: AdminBlogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin),
):
    slug = payload.slug.lower() if payload.slug else generate_unique_slug(db, payload.title)
    existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already exists",
        )
    blog = BlogPost(
        title=payload.title,
        slug=slug,
        category=payload.category,
        excerpt=payload.excerpt,
        content=payload.content,
        read_time_minutes=payload.read_time_minutes,
        highlight=bool(payload.highlight),
        created_by_user_id=current_user.id,
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog


@router.get("/blogs", response_model=List[AdminBlogResponse])
def get_admin_blogs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    """Get all blogs for admin dashboard"""
    blogs = db.query(BlogPost).order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
    return blogs


@router.delete("/blogs/{blog_id}")
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    """Delete a blog post"""
    blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    db.delete(blog)
    db.commit()
    
    return {"message": "Blog deleted successfully"}


@router.get("/recent-activity", response_model=List[RecentActivity])
def get_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    """Get recent activity for admin dashboard"""
    
    activities = []
    
    # Helper function to calculate time ago
    def time_ago(timestamp):
        now = datetime.now()
        diff = now - timestamp
        
        if diff.days > 0:
            if diff.days == 1:
                return "1 day ago"
            return f"{diff.days} days ago"
        elif diff.seconds >= 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds >= 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"
    
    # Recent donors (limit 2)
    recent_donors = db.query(Donor).join(User).order_by(Donor.id.desc()).limit(2).all()
    for donor in recent_donors:
        activities.append({
            "id": donor.id,
            "type": "donor",
            "title": "New Donor Registered",
            "description": f"{donor.full_name} joined as a blood donor",
            "time_ago": time_ago(donor.user.created_at),
            "timestamp": donor.user.created_at,
            "badge": "New"
        })
    
    # Recent events (limit 2)
    recent_events = db.query(Event).order_by(Event.id.desc()).limit(2).all()
    for event in recent_events:
        activities.append({
            "id": event.id,
            "type": "event",
            "title": "Event Created",
            "description": f"{event.title} - {event.city}",
            "time_ago": time_ago(event.created_at),
            "timestamp": event.created_at,
            "badge": "Event"
        })
    
    # Recent donations (limit 2)
    recent_donations = db.query(Donation).join(Donor).order_by(Donation.id.desc()).limit(2).all()
    for donation in recent_donations:
        if donation.status == "COMPLETED":
            activities.append({
                "id": donation.id,
                "type": "donation",
                "title": "Donation Completed",
                "description": f"{donation.donor.full_name} donated {donation.units} unit(s)",
                "time_ago": time_ago(donation.created_at),
                "timestamp": donation.created_at,
                "badge": "Donation"
            })
    
    # Recent organizers (limit 2)
    recent_organizers = db.query(Organizer).join(User).order_by(Organizer.id.desc()).limit(2).all()
    for organizer in recent_organizers:
        activities.append({
            "id": organizer.id,
            "type": "organizer",
            "title": "New Organizer Registered",
            "description": f"{organizer.organization_name} joined the platform",
            "time_ago": time_ago(organizer.user.created_at),
            "timestamp": organizer.user.created_at,
            "badge": "Organization"
        })
    
    # Sort by timestamp and limit
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    activities = activities[:limit]
    
    return [RecentActivity(**activity) for activity in activities]


@router.get("/donors", response_model=List[DonorListItem])
def get_all_donors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
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
        User.is_active,
        User.created_at,
        func.count(Donation.id).label('total_donations')
    ).join(User, Donor.user_id == User.id).outerjoin(
        Donation, Donor.id == Donation.donor_id
    ).group_by(
        Donor.id, Donor.full_name, User.email, Donor.phone, 
        Donor.blood_type, Donor.date_of_birth, Donor.gender, 
        User.is_active, User.created_at
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
    current_user: User = Depends(verify_admin)
):
    """Get all organizers with their event counts"""
    
    organizers = db.query(
        Organizer.id,
        Organizer.organization_name,
        User.email,
        Organizer.contact_person,
        Organizer.phone,
        Organizer.verified,
        User.created_at,
        func.count(Event.id).label('total_events')
    ).join(User, Organizer.user_id == User.id).outerjoin(
        Event, Organizer.id == Event.organizer_id
    ).group_by(
        Organizer.id, Organizer.organization_name, User.email,
        Organizer.contact_person, Organizer.phone,
        Organizer.verified, User.created_at
    ).offset(skip).limit(limit).all()
    
    return [
        OrganizerListItem(
            id=o.id,
            organization_name=o.organization_name,
            email=o.email,
            contact_person=o.contact_person,
            phone=o.phone,
            is_verified=o.verified,
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
    current_user: User = Depends(verify_admin)
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
    current_user: User = Depends(verify_admin)
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
    current_user: User = Depends(verify_admin)
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
    current_user: User = Depends(verify_admin)
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
    current_user: User = Depends(verify_admin)
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
    current_user: User = Depends(verify_admin)
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
    current_user: User = Depends(verify_admin)
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
