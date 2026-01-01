from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models import User, Donor, Organizer, UserRole
from app.schemas import Token, UserLogin, DonorCreate, OrganizerCreate
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from app.config import settings

router = APIRouter()

@router.post("/donor/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_donor(donor_data: DonorCreate, db: Session = Depends(get_db)):
    """Register a new donor."""
    # Check if email already exists in any account
    existing_user = db.query(User).filter(User.email == donor_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email already registered as {existing_user.role}"
        )
    
    # Create user
    user = User(
        email=donor_data.email,
        hashed_password=get_password_hash(donor_data.password),
        role=UserRole.DONOR
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create donor profile
    donor = Donor(
        user_id=user.id,
        full_name=donor_data.full_name,
        phone=donor_data.phone,
        date_of_birth=donor_data.date_of_birth,
        blood_type=donor_data.blood_type,
        address=donor_data.address,
        city=donor_data.city,
        state=donor_data.state,
        pincode=donor_data.pincode,
        weight=donor_data.weight,
        medical_conditions=donor_data.medical_conditions,
        emergency_contact=donor_data.emergency_contact
    )
    db.add(donor)
    db.commit()
    db.refresh(donor)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }

@router.post("/organizer/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_organizer(organizer_data: OrganizerCreate, db: Session = Depends(get_db)):
    """Register a new organizer."""
    # Check if email already exists in any account
    existing_user = db.query(User).filter(User.email == organizer_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email already registered as {existing_user.role}"
        )
    
    # Create user
    user = User(
        email=organizer_data.email,
        hashed_password=get_password_hash(organizer_data.password),
        role=UserRole.ORGANIZER
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create organizer profile
    organizer = Organizer(
        user_id=user.id,
        organization_name=organizer_data.organization_name,
        contact_person=organizer_data.contact_person,
        phone=organizer_data.phone,
        address=organizer_data.address,
        city=organizer_data.city,
        state=organizer_data.state,
        pincode=organizer_data.pincode,
        registration_number=organizer_data.registration_number,
        website=organizer_data.website,
        description=organizer_data.description
    )
    db.add(organizer)
    db.commit()
    db.refresh(organizer)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }

@router.post("/donor/login", response_model=Token)
def login_donor(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login for donors only."""
    user = db.query(User).filter(
        User.email == user_credentials.email,
        User.role == UserRole.DONOR
    ).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }

@router.post("/organizer/login", response_model=Token)
def login_organizer(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login for organizers only."""
    user = db.query(User).filter(
        User.email == user_credentials.email,
        User.role == UserRole.ORGANIZER
    ).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Generic login endpoint - returns error if same email exists for multiple roles."""
    users = db.query(User).filter(User.email == user_credentials.email).all()
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if multiple users with same email exist (different roles)
    if len(users) > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Multiple accounts found with this email. Please use /api/auth/donor/login or /api/auth/organizer/login",
        )
    
    user = users[0]
    
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }

@router.post("/logout")
def logout():
    """Logout (client should remove the token)."""
    return {"message": "Successfully logged out"}

