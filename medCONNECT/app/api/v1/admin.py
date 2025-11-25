"""
Admin module API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.admin import (
    AttendanceCreate, AttendanceResponse, AttendanceUpdate,
    AttendanceSessionCreate, AttendanceSessionResponse,
    CertificateRequestCreate, CertificateRequestResponse, CertificateRequestUpdate,
    NoticeCreate, NoticeResponse, NoticeUpdate,
    EventCreate, EventResponse, EventUpdate,
    EventRegistrationCreate, EventRegistrationResponse,
    FeeCreate, FeeResponse, FeeUpdate
)
from app.repositories.admin_repo import AdminRepository
from app.core.dependencies import (
    get_current_user_id,
    get_current_user_college_id,
    require_any_role
)
from app.models.user import UserRole
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/admin", tags=["Admin"])


# Attendance
@router.post("/attendance", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def create_attendance(
    attendance_data: AttendanceCreate,
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Create attendance record"""
    attendance_data.college_id = college_id
    attendance = AdminRepository.create_attendance(attendance_data)
    return AttendanceResponse(**attendance)


@router.get("/attendance/me", response_model=List[AttendanceResponse])
async def get_my_attendance(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's attendance"""
    records = AdminRepository.get_attendance_by_student(user_id)
    return [AttendanceResponse(**r) for r in records]


# Attendance Sessions
@router.post("/attendance-sessions", response_model=AttendanceSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_attendance_session(
    session_data: AttendanceSessionCreate,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create attendance session"""
    session_data.created_by = user_id
    session_data.college_id = college_id
    session = AdminRepository.create_attendance_session(session_data)
    return AttendanceSessionResponse(**session)


# Certificates
@router.post("/certificates", response_model=CertificateRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_certificate_request(
    cert_data: CertificateRequestCreate,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Create certificate request"""
    cert_data.student_id = user_id
    cert_data.college_id = college_id
    cert = AdminRepository.create_certificate_request(cert_data)
    return CertificateRequestResponse(**cert)


@router.get("/certificates", response_model=List[CertificateRequestResponse])
async def get_certificates(
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOD, UserRole.PRINCIPAL))
):
    """Get all certificate requests for the college (admin only)"""
    certs = AdminRepository.get_certificates_by_college(college_id)
    return [CertificateRequestResponse(**c) for c in certs]


@router.get("/certificates/me", response_model=List[CertificateRequestResponse])
async def get_my_certificates(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's certificate requests"""
    certs = AdminRepository.get_certificates_by_student(user_id)
    return [CertificateRequestResponse(**c) for c in certs]


# Notices
@router.post("/notices", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
async def create_notice(
    notice_data: NoticeCreate,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOD, UserRole.PRINCIPAL))
):
    """Create notice"""
    notice_data.created_by = user_id
    notice_data.college_id = college_id
    notice = AdminRepository.create_notice(notice_data)
    return NoticeResponse(**notice)


@router.get("/notices", response_model=List[NoticeResponse])
async def get_notices(college_id: UUID = Depends(get_current_user_college_id)):
    """Get notices for the college"""
    notices = AdminRepository.get_notices_by_college(college_id)
    return [NoticeResponse(**n) for n in notices]


# Events
@router.post("/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create event"""
    event_data.created_by = user_id
    event_data.college_id = college_id
    event = AdminRepository.create_event(event_data)
    return EventResponse(**event)


@router.get("/events", response_model=List[EventResponse])
async def get_events(college_id: UUID = Depends(get_current_user_college_id)):
    """Get events for the college"""
    events = AdminRepository.get_events_by_college(college_id)
    return [EventResponse(**e) for e in events]


@router.post("/events/{event_id}/register", response_model=EventRegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_for_event(
    event_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Register for an event"""
    from datetime import datetime
    reg_data = EventRegistrationCreate(
        event_id=event_id,
        user_id=user_id,
        registration_date=datetime.utcnow(),
        college_id=college_id
    )
    registration = AdminRepository.create_event_registration(reg_data)
    return EventRegistrationResponse(**registration)


# Fees
@router.get("/fees/me", response_model=List[FeeResponse])
async def get_my_fees(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's fees"""
    fees = AdminRepository.get_fees_by_student(user_id)
    return [FeeResponse(**f) for f in fees]



