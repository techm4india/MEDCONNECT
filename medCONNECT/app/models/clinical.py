"""
Clinical module models and schemas
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID
from enum import Enum


class PostingStatus(str, Enum):
    """Posting status"""
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class LogbookEntryStatus(str, Enum):
    """Logbook entry status"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    VERIFIED = "verified"
    REJECTED = "rejected"


class PostingBase(BaseModel):
    """Base posting model"""
    student_id: UUID
    department_id: UUID
    start_date: datetime
    end_date: datetime
    status: PostingStatus = PostingStatus.SCHEDULED
    supervisor_id: Optional[UUID] = None
    notes: Optional[str] = None
    college_id: UUID


class PostingCreate(PostingBase):
    """Posting creation model"""
    pass


class PostingUpdate(BaseModel):
    """Posting update model"""
    department_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[PostingStatus] = None
    supervisor_id: Optional[UUID] = None
    notes: Optional[str] = None


class PostingResponse(PostingBase):
    """Posting response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ClinicalLogbookEntryBase(BaseModel):
    """Base clinical logbook entry model"""
    student_id: UUID
    posting_id: UUID
    case_type: str
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    chief_complaint: str
    diagnosis: str
    procedures_performed: List[str] = Field(default_factory=list)
    skills_demonstrated: List[str] = Field(default_factory=list)
    learning_points: Optional[str] = None
    faculty_notes: Optional[str] = None
    status: LogbookEntryStatus = LogbookEntryStatus.DRAFT
    verified_by: Optional[UUID] = None
    verified_at: Optional[datetime] = None
    college_id: UUID


class ClinicalLogbookEntryCreate(ClinicalLogbookEntryBase):
    """Clinical logbook entry creation model"""
    pass


class ClinicalLogbookEntryUpdate(BaseModel):
    """Clinical logbook entry update model"""
    case_type: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    chief_complaint: Optional[str] = None
    diagnosis: Optional[str] = None
    procedures_performed: Optional[List[str]] = None
    skills_demonstrated: Optional[List[str]] = None
    learning_points: Optional[str] = None
    faculty_notes: Optional[str] = None
    status: Optional[LogbookEntryStatus] = None
    verified_at: Optional[datetime] = None
    verified_by: Optional[UUID] = None


class ClinicalLogbookEntryResponse(ClinicalLogbookEntryBase):
    """Clinical logbook entry response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OPDSessionBase(BaseModel):
    """Base OPD session model"""
    department_id: UUID
    session_date: datetime
    total_patients: int = 0
    students_present: List[UUID] = Field(default_factory=list)
    faculty_id: UUID
    notes: Optional[str] = None
    college_id: UUID


class OPDSessionCreate(OPDSessionBase):
    """OPD session creation model"""
    pass


class OPDSessionUpdate(BaseModel):
    """OPD session update model"""
    session_date: Optional[datetime] = None
    total_patients: Optional[int] = None
    students_present: Optional[List[UUID]] = None
    faculty_id: Optional[UUID] = None
    notes: Optional[str] = None


class OPDSessionResponse(OPDSessionBase):
    """OPD session response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OPDSessionStudentInvolvementBase(BaseModel):
    """Base OPD student involvement model"""
    session_id: UUID
    student_id: UUID
    cases_observed: int = 0
    cases_assisted: int = 0
    skills_practiced: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    college_id: UUID


class OPDSessionStudentInvolvementCreate(OPDSessionStudentInvolvementBase):
    """OPD student involvement creation model"""
    pass


class OPDSessionStudentInvolvementResponse(OPDSessionStudentInvolvementBase):
    """OPD student involvement response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True



