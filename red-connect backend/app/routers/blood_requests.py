from fastapi import APIRouter, Depends, status, UploadFile, File, Form, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.utils.email import send_blood_request_confirmation
from app.models import (
  BloodRequest,
  BloodType,
  BloodRequestUrgency,
  BloodRequestApprovalStatus,
  BloodRequestDonorStatus,
  BloodRequestCompletionStatus,
)
from app.schemas import BloodRequestCreate, BloodRequestResponse
from app.auth import get_current_user
from app.models import UserRole


router = APIRouter()


@router.post("/", response_model=BloodRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_blood_request(
  background_tasks: BackgroundTasks,
  patient_name: str = Form(...),
  required_blood_group: BloodType = Form(...),
  quantity_units: int = Form(...),
  hospital_name: str = Form(...),
  hospital_address: Optional[str] = Form(None),
  doctor_name: Optional[str] = Form(None),
  urgency_level: BloodRequestUrgency = Form(...),
  contact_name: str = Form(...),
  contact_phone: str = Form(...),
  contact_email: Optional[str] = Form(None),
  relation_to_patient: Optional[str] = Form(None),
  additional_notes: Optional[str] = Form(None),
  medical_proof: Optional[UploadFile] = File(None),
  db: Session = Depends(get_db),
) -> BloodRequestResponse:
  medical_proof_url = medical_proof.filename if medical_proof else None

  payload = BloodRequestCreate(
    patient_name=patient_name,
    required_blood_group=required_blood_group,
    quantity_units=quantity_units,
    hospital_name=hospital_name,
    hospital_address=hospital_address,
    doctor_name=doctor_name,
    urgency_level=urgency_level,
    contact_name=contact_name,
    contact_phone=contact_phone,
    contact_email=contact_email,
    relation_to_patient=relation_to_patient,
    additional_notes=additional_notes,
    medical_proof_url=medical_proof_url,
  )

  new_request = BloodRequest(
    patient_name=payload.patient_name,
    required_blood_group=payload.required_blood_group,
    quantity_units=payload.quantity_units,
    hospital_name=payload.hospital_name,
    hospital_address=payload.hospital_address,
    doctor_name=payload.doctor_name,
    urgency_level=payload.urgency_level,
    contact_name=payload.contact_name,
    contact_phone=payload.contact_phone,
    contact_email=payload.contact_email,
    relation_to_patient=payload.relation_to_patient,
    additional_notes=payload.additional_notes,
    medical_proof_url=payload.medical_proof_url,
    approval_status=BloodRequestApprovalStatus.PENDING,
    donor_status=BloodRequestDonorStatus.SEARCHING,
    completion_status=BloodRequestCompletionStatus.OPEN,
  )

  db.add(new_request)
  db.commit()
  db.refresh(new_request)

  # Send confirmation email
  if payload.contact_email:
    background_tasks.add_task(
      send_blood_request_confirmation,
      to_email=payload.contact_email,
      patient_name=payload.patient_name,
      request_id=new_request.id
    )

  return new_request


@router.get("/{request_id}", response_model=BloodRequestResponse)
def get_blood_request(request_id: int, db: Session = Depends(get_db)) -> BloodRequestResponse:
  blood_request = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
  if not blood_request:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blood request not found")
  return blood_request


@router.get("/", response_model=List[BloodRequestResponse])
def list_blood_requests(
  skip: int = 0,
  limit: int = 100,
  db: Session = Depends(get_db),
  current_user=Depends(get_current_user),
) -> List[BloodRequestResponse]:
  if current_user.role != UserRole.ADMIN:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
  return (
    db.query(BloodRequest)
    .order_by(BloodRequest.created_at.desc())
    .offset(skip)
    .limit(limit)
    .all()
  )


@router.patch("/{request_id}", response_model=BloodRequestResponse)
def update_blood_request_status(
  request_id: int,
  approval_status: Optional[BloodRequestApprovalStatus] = Form(None),
  donor_status: Optional[BloodRequestDonorStatus] = Form(None),
  completion_status: Optional[BloodRequestCompletionStatus] = Form(None),
  db: Session = Depends(get_db),
  current_user=Depends(get_current_user),
) -> BloodRequestResponse:
  if current_user.role != UserRole.ADMIN:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

  blood_request = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
  if not blood_request:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blood request not found")

  if approval_status is not None:
    blood_request.approval_status = approval_status
  if donor_status is not None:
    blood_request.donor_status = donor_status
  if completion_status is not None:
    blood_request.completion_status = completion_status

  db.commit()
  db.refresh(blood_request)
  return blood_request
