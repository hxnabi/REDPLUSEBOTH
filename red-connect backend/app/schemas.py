from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional, List
from app.models import UserRole, BloodType, BankCategory, EventStatus, DonationStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: UserRole

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None

# Donor Schemas
class DonorBase(BaseModel):
    full_name: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    blood_type: BloodType
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    weight: Optional[float] = None
    medical_conditions: Optional[str] = None
    emergency_contact: Optional[str] = None

class DonorCreate(DonorBase):
    email: EmailStr
    password: str

class DonorUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    blood_type: Optional[BloodType] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    weight: Optional[float] = None
    medical_conditions: Optional[str] = None
    emergency_contact: Optional[str] = None

class DonorResponse(DonorBase):
    id: int
    user_id: int
    email: EmailStr
    last_donation_date: Optional[date] = None
    total_donations: int
    profile_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Organizer Schemas
class OrganizerBase(BaseModel):
    organization_name: str
    contact_person: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    registration_number: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None

class OrganizerCreate(OrganizerBase):
    email: EmailStr
    password: str

class OrganizerUpdate(BaseModel):
    organization_name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None

class OrganizerResponse(OrganizerBase):
    id: int
    user_id: int
    email: EmailStr
    verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Blood Bank Schemas
class BloodBankBase(BaseModel):
    name: str
    address: str
    phone: str
    email: Optional[str] = None
    category: BankCategory
    city: str
    state: str
    pincode: Optional[str] = None
    available_blood_types: Optional[str] = None
    operating_hours: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class BloodBankCreate(BloodBankBase):
    pass

class BloodBankUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    category: Optional[BankCategory] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    available_blood_types: Optional[str] = None
    operating_hours: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class BloodBankResponse(BloodBankBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Blood Inventory Schemas
class BloodInventoryBase(BaseModel):
    blood_bank_id: int
    blood_type: BloodType
    units_available: int

class BloodInventoryCreate(BloodInventoryBase):
    pass

class BloodInventoryUpdate(BaseModel):
    units_available: int

class BloodInventoryResponse(BloodInventoryBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: date
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    venue: str
    city: str
    state: str
    max_participants: Optional[int] = None
    banner_image: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[date] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    venue: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    max_participants: Optional[int] = None
    status: Optional[EventStatus] = None
    banner_image: Optional[str] = None

class EventResponse(EventBase):
    id: int
    organizer_id: int
    registered_participants: int
    status: EventStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Donation Schemas
class DonationBase(BaseModel):
    donation_date: date
    blood_type: BloodType
    units: float = 1.0
    notes: Optional[str] = None
    event_id: Optional[int] = None

class DonationCreate(DonationBase):
    pass

class DonationUpdate(BaseModel):
    donation_date: Optional[date] = None
    status: Optional[DonationStatus] = None
    notes: Optional[str] = None

class DonationResponse(DonationBase):
    id: int
    donor_id: int
    status: DonationStatus
    certificate_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Filter Schemas
class BloodBankFilter(BaseModel):
    state: Optional[str] = None
    city: Optional[str] = None
    blood_type: Optional[BloodType] = None
    category: Optional[BankCategory] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)

class EventFilter(BaseModel):
    state: Optional[str] = None
    city: Optional[str] = None
    status: Optional[EventStatus] = None
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)

# Certificate Schemas
class CertificateBase(BaseModel):
    blood_units: float
    blood_type: BloodType
    issued_by: str
    notes: Optional[str] = None

class CertificateCreate(CertificateBase):
    donation_id: int

class CertificateUpdate(BaseModel):
    status: Optional[str] = None
    certificate_url: Optional[str] = None
    notes: Optional[str] = None
    issued_by: Optional[str] = None

class CertificateResponse(CertificateBase):
    id: int
    donation_id: int
    donor_id: int
    certificate_number: str
    issue_date: date
    status: str
    certificate_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DonationWithCertificate(DonationResponse):
    certificate: Optional[CertificateResponse] = None

    class Config:
        from_attributes = True
