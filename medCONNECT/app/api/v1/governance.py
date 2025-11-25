"""
Governance module API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from uuid import UUID
from app.models.governance import (
    GovernanceSnapshotResponse,
    DashboardMetrics,
    AttendanceAnalytics,
    ClinicalExposureAnalytics,
    AcademicPerformanceAnalytics
)
from app.core.dependencies import (
    get_current_user_college_id,
    require_any_role
)
from app.models.user import UserRole
from app.services.governance_service import GovernanceService

router = APIRouter(prefix="/governance", tags=["Governance"])


@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(
        UserRole.PRINCIPAL, UserRole.HOD, UserRole.ADMIN, UserRole.DME, UserRole.SUPERINTENDENT, UserRole.FACULTY
    ))
):
    """Get dashboard metrics for governance (accessible to faculty for admin dashboard)"""
    return GovernanceService.get_dashboard_metrics(college_id)


@router.get("/attendance-analytics", response_model=AttendanceAnalytics)
async def get_attendance_analytics(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(
        UserRole.PRINCIPAL, UserRole.HOD, UserRole.ADMIN, UserRole.DME
    ))
):
    """Get attendance analytics"""
    return GovernanceService.get_attendance_analytics(college_id, days)


@router.get("/clinical-analytics", response_model=ClinicalExposureAnalytics)
async def get_clinical_analytics(
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(
        UserRole.PRINCIPAL, UserRole.HOD, UserRole.ADMIN, UserRole.SUPERINTENDENT
    ))
):
    """Get clinical exposure analytics"""
    return GovernanceService.get_clinical_analytics(college_id)


@router.get("/academic-analytics", response_model=AcademicPerformanceAnalytics)
async def get_academic_analytics(
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(
        UserRole.PRINCIPAL, UserRole.HOD, UserRole.ADMIN, UserRole.DME
    ))
):
    """Get academic performance analytics"""
    return GovernanceService.get_academic_analytics(college_id)

