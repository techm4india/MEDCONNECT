"""
Admin module models and schemas
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID
from enum import Enum


class AttendanceStatus(str, Enum):
    """Attendance status"""
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"


class CertificateType(str, Enum):
    """Certificate types"""
    BONAFIDE = "bonafide"
    STUDY_CERTIFICATE = "study_certificate"
    FEE_STATEMENT = "fee_statement"
    CONDUCT = "conduct"
    INTERNSHIP = "internship"
    ATTENDANCE = "attendance"


class CertificateStatus(str, Enum):
    """Certificate status"""
    PENDING = "pending"
    GENERATED = "generated"
    APPROVED = "approved"
    REJECTED = "rejected"


class PaymentStatus(str, Enum):
    """Payment status"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class AttendanceBase(BaseModel):
    """Base attendance model"""
    student_id: UUID
    session_id: UUID
    attendance_date: datetime
    status: AttendanceStatus
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    qr_code: Optional[str] = None
    verified_by: Optional[UUID] = None
    college_id: UUID


class AttendanceCreate(AttendanceBase):
    """Attendance creation model"""
    pass


class AttendanceUpdate(BaseModel):
    """Attendance update model"""
    status: Optional[AttendanceStatus] = None
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    verified_by: Optional[UUID] = None


class AttendanceResponse(AttendanceBase):
    """Attendance response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AttendanceSessionBase(BaseModel):
    """Base attendance session model"""
    name: str
    qr_code: str
    location_latitude: float
    location_longitude: float
    start_time: datetime
    end_time: datetime
    created_by: UUID
    college_id: UUID


class AttendanceSessionCreate(AttendanceSessionBase):
    """Attendance session creation model"""
    pass


class AttendanceSessionResponse(AttendanceSessionBase):
    """Attendance session response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CertificateRequestBase(BaseModel):
    """Base certificate request model"""
    student_id: UUID
    certificate_type: CertificateType
    purpose: Optional[str] = None
    status: CertificateStatus = CertificateStatus.PENDING
    generated_file_url: Optional[str] = None
    approved_by: Optional[UUID] = None
    approved_at: Optional[datetime] = None
    college_id: UUID


class CertificateRequestCreate(CertificateRequestBase):
    """Certificate request creation model"""
    pass


class CertificateRequestUpdate(BaseModel):
    """Certificate request update model"""
    purpose: Optional[str] = None
    status: Optional[CertificateStatus] = None
    generated_file_url: Optional[str] = None
    approved_by: Optional[UUID] = None
    approved_at: Optional[datetime] = None


class CertificateRequestResponse(CertificateRequestBase):
    """Certificate request response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class NoticeBase(BaseModel):
    """Base notice model"""
    title: str
    content: str
    category: str
    priority: str = "normal"  # "low", "normal", "high", "urgent"
    target_audience: List[str] = Field(default_factory=list)  # roles or "all"
    attachments: List[str] = Field(default_factory=list)
    published_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_by: UUID
    college_id: UUID


class NoticeCreate(NoticeBase):
    """Notice creation model"""
    pass


class NoticeUpdate(BaseModel):
    """Notice update model"""
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    target_audience: Optional[List[str]] = None
    attachments: Optional[List[str]] = None
    published_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None


class NoticeResponse(NoticeBase):
    """Notice response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EventBase(BaseModel):
    """Base event model"""
    title: str
    description: Optional[str] = None
    event_type: str  # "cme", "workshop", "seminar", "conference", "other"
    start_date: datetime
    end_date: datetime
    location: Optional[str] = None
    max_participants: Optional[int] = None
    registration_required: bool = False
    registration_deadline: Optional[datetime] = None
    created_by: UUID
    college_id: UUID


class EventCreate(EventBase):
    """Event creation model"""
    pass


class EventUpdate(BaseModel):
    """Event update model"""
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    max_participants: Optional[int] = None
    registration_required: Optional[bool] = None
    registration_deadline: Optional[datetime] = None


class EventResponse(EventBase):
    """Event response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    registered_count: int = 0
    
    class Config:
        from_attributes = True


class EventRegistrationBase(BaseModel):
    """Base event registration model"""
    event_id: UUID
    user_id: UUID
    registration_date: datetime
    attendance_confirmed: bool = False
    college_id: UUID


class EventRegistrationCreate(EventRegistrationBase):
    """Event registration creation model"""
    pass


class EventRegistrationResponse(EventRegistrationBase):
    """Event registration response model"""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class FeeBase(BaseModel):
    """Base fee model"""
    student_id: UUID
    fee_type: str
    amount: float
    due_date: datetime
    paid_amount: float = 0.0
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_date: Optional[datetime] = None
    transaction_id: Optional[str] = None
    college_id: UUID


class FeeCreate(FeeBase):
    """Fee creation model"""
    pass


class FeeUpdate(BaseModel):
    """Fee update model"""
    amount: Optional[float] = None
    due_date: Optional[datetime] = None
    paid_amount: Optional[float] = None
    payment_status: Optional[PaymentStatus] = None
    payment_date: Optional[datetime] = None
    transaction_id: Optional[str] = None


class FeeResponse(FeeBase):
    """Fee response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True





