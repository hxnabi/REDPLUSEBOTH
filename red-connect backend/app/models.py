from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Date, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    DONOR = "donor"
    ORGANIZER = "organizer"
    ADMIN = "admin"

class BloodType(str, enum.Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class BankCategory(str, enum.Enum):
    GOVERNMENT = "Government"
    PRIVATE = "Private"

class EventStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DonationStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CertificateStatus(str, enum.Enum):
    PENDING = "pending"
    ISSUED = "issued"
    REVOKED = "revoked"

# User Model (Base for Donors and Organizers)
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    donor_profile = relationship("Donor", back_populates="user", uselist=False)
    organizer_profile = relationship("Organizer", back_populates="user", uselist=False)

# Donor Model
class Donor(Base):
    __tablename__ = "donors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20))
    date_of_birth = Column(Date)
    blood_type = Column(Enum(BloodType), nullable=False)
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(10))
    last_donation_date = Column(Date)
    total_donations = Column(Integer, default=0)
    weight = Column(Float)  # in kg
    medical_conditions = Column(Text)
    emergency_contact = Column(String(20))
    profile_image = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="donor_profile")
    donations = relationship("Donation", back_populates="donor")
    certificates = relationship("Certificate", back_populates="donor_profile")

# Organizer Model
class Organizer(Base):
    __tablename__ = "organizers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    organization_name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(10))
    registration_number = Column(String(100))
    website = Column(String(255))
    description = Column(Text)
    verified = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="organizer_profile")
    events = relationship("Event", back_populates="organizer")

# Blood Bank Model
class BloodBank(Base):
    __tablename__ = "blood_banks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255))
    category = Column(Enum(BankCategory), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10))
    available_blood_types = Column(String(255))  # Comma-separated blood types
    operating_hours = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory = relationship("BloodInventory", back_populates="blood_bank")

# Blood Inventory Model
class BloodInventory(Base):
    __tablename__ = "blood_inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    blood_bank_id = Column(Integer, ForeignKey("blood_banks.id"), nullable=False)
    blood_type = Column(Enum(BloodType), nullable=False)
    units_available = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    blood_bank = relationship("BloodBank", back_populates="inventory")

# Event Model (Blood Donation Camps)
class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    organizer_id = Column(Integer, ForeignKey("organizers.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_date = Column(Date, nullable=False)
    start_time = Column(String(10))
    end_time = Column(String(10))
    venue = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    max_participants = Column(Integer)
    registered_participants = Column(Integer, default=0)
    status = Column(Enum(EventStatus), default=EventStatus.UPCOMING)
    banner_image = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    organizer = relationship("Organizer", back_populates="events")
    donations = relationship("Donation", back_populates="event")

# Donation Model
class Donation(Base):
    __tablename__ = "donations"
    
    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    donation_date = Column(Date, nullable=False)
    blood_type = Column(Enum(BloodType), nullable=False)
    units = Column(Float, default=1.0)  # Usually 1 unit = 450ml
    status = Column(Enum(DonationStatus), default=DonationStatus.SCHEDULED)
    notes = Column(Text)
    certificate_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    donor = relationship("Donor", back_populates="donations")
    event = relationship("Event", back_populates="donations")
    certificate = relationship("Certificate", back_populates="donation", uselist=False)

# Certificate Model
class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), unique=True, nullable=False)
    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=False)
    certificate_number = Column(String(100), unique=True, nullable=False)
    issue_date = Column(Date, nullable=False)
    blood_units = Column(Float, nullable=False)
    blood_type = Column(Enum(BloodType), nullable=False)
    status = Column(Enum(CertificateStatus), default=CertificateStatus.PENDING)
    certificate_url = Column(String(255))  # URL to PDF certificate
    issued_by = Column(String(255))  # Organization/Hospital name
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    donation = relationship("Donation", back_populates="certificate")
    donor_profile = relationship("Donor", back_populates="certificates")
