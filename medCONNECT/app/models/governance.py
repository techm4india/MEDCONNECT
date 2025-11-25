"""
Governance module models and schemas
"""
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


class GovernanceSnapshotBase(BaseModel):
    """Base governance snapshot model"""
    college_id: UUID
    snapshot_type: str  # "daily", "weekly", "monthly"
    snapshot_date: datetime
    metrics: Dict[str, Any] = Field(default_factory=dict)
    attendance_summary: Dict[str, Any] = Field(default_factory=dict)
    academic_summary: Dict[str, Any] = Field(default_factory=dict)
    clinical_summary: Dict[str, Any] = Field(default_factory=dict)
    department_summary: Dict[str, Any] = Field(default_factory=dict)
    alerts: list = Field(default_factory=list)
    created_by: Optional[UUID] = None


class GovernanceSnapshotCreate(GovernanceSnapshotBase):
    """Governance snapshot creation model"""
    pass


class GovernanceSnapshotResponse(GovernanceSnapshotBase):
    """Governance snapshot response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DashboardMetrics(BaseModel):
    """Dashboard metrics model"""
    total_students: int
    total_faculty: int
    active_postings: int
    pending_logbooks: int
    attendance_rate: float
    certificate_requests_pending: int
    upcoming_events: int
    department_wise_stats: Dict[str, Any] = Field(default_factory=dict)


class AttendanceAnalytics(BaseModel):
    """Attendance analytics model"""
    overall_attendance_rate: float
    department_wise_attendance: Dict[str, float] = Field(default_factory=dict)
    student_wise_attendance: Dict[str, float] = Field(default_factory=dict)
    attendance_trends: list = Field(default_factory=list)
    low_attendance_flags: list = Field(default_factory=list)


class ClinicalExposureAnalytics(BaseModel):
    """Clinical exposure analytics model"""
    total_cases_logged: int
    verified_cases: int
    department_wise_exposure: Dict[str, Any] = Field(default_factory=dict)
    skill_competency_status: Dict[str, Any] = Field(default_factory=dict)
    posting_completion_rate: float


class AcademicPerformanceAnalytics(BaseModel):
    """Academic performance analytics model"""
    module_completion_rates: Dict[str, float] = Field(default_factory=dict)
    student_progress_summary: Dict[str, Any] = Field(default_factory=dict)
    resource_engagement: Dict[str, Any] = Field(default_factory=dict)
    weak_areas_identified: list = Field(default_factory=list)





