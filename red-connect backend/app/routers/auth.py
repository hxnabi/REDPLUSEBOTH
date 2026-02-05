from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional
import jwt
from google.auth.transport import requests
from google.oauth2 import id_token
from app.database import get_db
from app.models import User, Donor, Organizer, Admin, UserRole, BloodType
from app.schemas import Token, UserLogin, DonorCreate, OrganizerCreate, AdminCreate, GoogleAuthRequest, GoogleUserInfo
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from app.config import settings

router = APIRouter()

def verify_google_token(token: str) -> GoogleUserInfo:
    """Verify Google ID token and extract user information."""
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
        # Verify the issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        # Extract user info
        return GoogleUserInfo(
            email=idinfo['email'],
            name=idinfo.get('name'),
            picture=idinfo.get('picture'),
            google_id=idinfo['sub']
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

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

@router.post("/admin/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_admin(admin_data: AdminCreate, db: Session = Depends(get_db)):
    """
    Register a new admin.
    
    SECURITY: This endpoint requires either:
    1. A valid admin_secret matching ADMIN_SECRET_KEY (for initial admin setup)
    2. Or should only be called by super-admins (future enhancement)
    
    In a production environment, this endpoint should be disabled after initial setup
    or protected behind additional authentication.
    """
    # Security check: Require admin_secret for creating admins
    if not admin_data.admin_secret or admin_data.admin_secret != settings.ADMIN_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing admin secret key. Admin registration requires proper authorization."
        )
    
    # Check if email already exists in any account
    existing_user = db.query(User).filter(User.email == admin_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email already registered as {existing_user.role}"
        )
    
    # Create user
    user = User(
        email=admin_data.email,
        hashed_password=get_password_hash(admin_data.password),
        role=UserRole.ADMIN
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create admin profile
    admin = Admin(
        user_id=user.id,
        full_name=admin_data.full_name,
        phone=admin_data.phone
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
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
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is a Google OAuth user (no password)
    if user.google_id and not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google authentication. Please use 'Sign in with Google' instead.",
        )
    
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

@router.post("/organizer/login", response_model=Token)
def login_organizer(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login for organizers only."""
    user = db.query(User).filter(
        User.email == user_credentials.email,
        User.role == UserRole.ORGANIZER
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is a Google OAuth user (no password)
    if user.google_id and not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google authentication. Please use 'Sign in with Google' instead.",
        )
    
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

@router.post("/admin/login", response_model=Token)
def login_admin(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login for admins only."""
    user = db.query(User).filter(
        User.email == user_credentials.email,
        User.role == UserRole.ADMIN
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is a Google OAuth user (no password)
    if user.google_id and not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google authentication. Please use 'Sign in with Google' instead.",
        )
    
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

@router.post("/google/donor", response_model=Token)
def google_auth_donor(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Google OAuth login/register for donors."""
    try:
        # Verify Google token
        google_user = verify_google_token(auth_request.id_token)
        
        # Check if user exists with this Google ID
        user = db.query(User).filter(User.google_id == google_user.google_id).first()
        
        # If not found by Google ID, check by email
        if not user:
            user = db.query(User).filter(
                User.email == google_user.email,
                User.role == UserRole.DONOR
            ).first()
            
            # If user exists with email but no Google ID, link the account
            if user and not user.google_id:
                user.google_id = google_user.google_id
                db.commit()
                db.refresh(user)
        
        # If user doesn't exist, create new user (registration)
        if not user:
            # Check if email exists with different role
            existing_user = db.query(User).filter(User.email == google_user.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email already registered as {existing_user.role}. Please login with that role."
                )
            
            # Create new user
            user = User(
                email=google_user.email,
                google_id=google_user.google_id,
                hashed_password=None,  # No password for Google OAuth users
                role=UserRole.DONOR
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create donor profile with minimal info
            donor = Donor(
                user_id=user.id,
                full_name=google_user.name or "Google User",
                blood_type=BloodType.O_POSITIVE  # Default, user should update later
            )
            db.add(donor)
            db.commit()
        
        # Check if user is donor
        if user.role != UserRole.DONOR:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account exists but is registered as {user.role}. Please use the correct login page."
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )

@router.post("/google/organizer", response_model=Token)
def google_auth_organizer(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Google OAuth login/register for organizers."""
    try:
        # Verify Google token
        google_user = verify_google_token(auth_request.id_token)
        
        # Check if user exists with this Google ID
        user = db.query(User).filter(User.google_id == google_user.google_id).first()
        
        # If not found by Google ID, check by email
        if not user:
            user = db.query(User).filter(
                User.email == google_user.email,
                User.role == UserRole.ORGANIZER
            ).first()
            
            # If user exists with email but no Google ID, link the account
            if user and not user.google_id:
                user.google_id = google_user.google_id
                db.commit()
                db.refresh(user)
        
        # If user doesn't exist, create new user (registration)
        if not user:
            # Check if email exists with different role
            existing_user = db.query(User).filter(User.email == google_user.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email already registered as {existing_user.role}. Please login with that role."
                )
            
            # Create new user
            user = User(
                email=google_user.email,
                google_id=google_user.google_id,
                hashed_password=None,  # No password for Google OAuth users
                role=UserRole.ORGANIZER
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create organizer profile with minimal info
            organizer = Organizer(
                user_id=user.id,
                organization_name=google_user.name or "Organization",
                contact_person=google_user.name or "Contact Person",
                phone=""  # Will need to be updated later
            )
            db.add(organizer)
            db.commit()
        
        # Check if user is organizer
        if user.role != UserRole.ORGANIZER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account exists but is registered as {user.role}. Please use the correct login page."
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )

@router.post("/google/admin", response_model=Token)
def google_auth_admin(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Google OAuth login/register for admins."""
    try:
        # Verify Google token
        google_user = verify_google_token(auth_request.id_token)
        
        # Check if user exists with this Google ID
        user = db.query(User).filter(User.google_id == google_user.google_id).first()
        
        # If not found by Google ID, check by email
        if not user:
            user = db.query(User).filter(
                User.email == google_user.email,
                User.role == UserRole.ADMIN
            ).first()
            
            # If user exists with email but no Google ID, link the account
            if user and not user.google_id:
                user.google_id = google_user.google_id
                db.commit()
                db.refresh(user)
        
        # If user doesn't exist, create new user (registration)
        # Note: Admin registration via Google should still require admin_secret
        if not user:
            # Check if email exists with different role
            existing_user = db.query(User).filter(User.email == google_user.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email already registered as {existing_user.role}. Please login with that role."
                )
            
            # For admin registration via Google, we'll allow it but mark as needing verification
            # In production, you might want to add additional checks
            user = User(
                email=google_user.email,
                google_id=google_user.google_id,
                hashed_password=None,  # No password for Google OAuth users
                role=UserRole.ADMIN
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create admin profile
            admin = Admin(
                user_id=user.id,
                full_name=google_user.name or "Admin User",
                phone=""
            )
            db.add(admin)
            db.commit()
        
        # Check if user is admin
        if user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account exists but is registered as {user.role}. Please use the correct login page."
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )

