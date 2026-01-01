from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date
from app.database import get_db
from app.models import User, Certificate, Donation, Donor, CertificateStatus
from app.schemas import CertificateCreate, CertificateUpdate, CertificateResponse
from app.auth import get_current_donor, get_current_user
import uuid

router = APIRouter()

def generate_certificate_number() -> str:
    """Generate a unique certificate number"""
    return f"CERT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

@router.post("/", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate(
    certificate: CertificateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new certificate for a donation (Admin/Organizer only)"""
    
    # Check if user is organizer or admin
    if current_user.role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizers or admins can create certificates"
        )
    
    # Get donation
    donation = db.query(Donation).filter(Donation.id == certificate.donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    # Check if certificate already exists for this donation
    existing_cert = db.query(Certificate).filter(
        Certificate.donation_id == certificate.donation_id
    ).first()
    if existing_cert:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate already exists for this donation"
        )
    
    # Create certificate
    new_certificate = Certificate(
        donation_id=certificate.donation_id,
        donor_id=donation.donor_id,
        certificate_number=generate_certificate_number(),
        issue_date=date.today(),
        blood_units=certificate.blood_units,
        blood_type=certificate.blood_type,
        status=CertificateStatus.ISSUED,
        issued_by=certificate.issued_by,
        notes=certificate.notes
    )
    
    db.add(new_certificate)
    db.commit()
    db.refresh(new_certificate)
    
    return new_certificate

@router.get("/my-certificates", response_model=List[CertificateResponse])
def get_my_certificates(
    current_user: User = Depends(get_current_donor),
    db: Session = Depends(get_db)
):
    """Get all certificates for the current donor"""
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor profile not found"
        )
    
    certificates = db.query(Certificate).filter(
        Certificate.donor_id == donor.id
    ).order_by(Certificate.issue_date.desc()).all()
    
    return certificates

@router.get("/{certificate_id}", response_model=CertificateResponse)
def get_certificate(
    certificate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific certificate by ID"""
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    # Check if user has access to this certificate
    if current_user.role == "donor":
        donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
        if certificate.donor_id != donor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this certificate"
            )
    
    return certificate

@router.put("/{certificate_id}", response_model=CertificateResponse)
def update_certificate(
    certificate_id: int,
    certificate_update: CertificateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a certificate (Admin/Organizer only)"""
    
    if current_user.role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizers or admins can update certificates"
        )
    
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    update_data = certificate_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(certificate, key, value)
    
    db.commit()
    db.refresh(certificate)
    return certificate

@router.delete("/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(
    certificate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a certificate (Admin only)"""
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete certificates"
        )
    
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    db.delete(certificate)
    db.commit()
    
    return None

@router.get("/donor/{donor_id}", response_model=List[CertificateResponse])
def get_donor_certificates(
    donor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all certificates for a specific donor (Admin/Organizer)"""
    
    if current_user.role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view donor certificates"
        )
    
    certificates = db.query(Certificate).filter(
        Certificate.donor_id == donor_id
    ).order_by(Certificate.issue_date.desc()).all()
    
    return certificates

@router.get("/", response_model=List[CertificateResponse])
def list_certificates(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all certificates (Admin/Organizer only)"""
    
    if current_user.role not in ["organizer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to list certificates"
        )
    
    query = db.query(Certificate)
    
    if status:
        query = query.filter(Certificate.status == status)
    
    certificates = query.order_by(Certificate.created_at.desc()).offset(skip).limit(limit).all()
    
    return certificates
