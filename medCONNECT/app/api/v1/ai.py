"""
AI services API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from app.core.dependencies import get_current_user_id, get_current_user_college_id
from app.models.user import UserRole
from app.core.dependencies import require_any_role
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Services"])


class AcademicQueryRequest(BaseModel):
    """Academic query request"""
    query: str = Field(..., min_length=1, description="The academic question to ask")
    context: Optional[str] = Field(None, description="Additional context for the query")
    module_id: Optional[UUID] = Field(None, description="Module ID for context-specific answers")


class AcademicQueryResponse(BaseModel):
    """Academic query response"""
    answer: str
    explanation: Optional[str] = None
    related_topics: List[str] = []
    mnemonics: List[str] = []
    study_tips: List[str] = []


class StudyPlanRequest(BaseModel):
    """Study plan generation request"""
    module_ids: List[UUID] = Field(..., description="List of module IDs to include in study plan")
    weak_areas: Optional[List[str]] = Field(None, description="Identified weak areas")


class StudyPlanResponse(BaseModel):
    """Study plan response"""
    plan: List[str]
    recommendations: List[str] = []
    timeline: dict = {}
    weak_areas: List[str] = []


class ConceptComparisonRequest(BaseModel):
    """Concept comparison request"""
    concept1: str = Field(..., description="First concept to compare")
    concept2: str = Field(..., description="Second concept to compare")
    subject: Optional[str] = Field(None, description="Subject context")


class ConceptComparisonResponse(BaseModel):
    """Concept comparison response"""
    similarities: List[str] = []
    differences: List[str] = []
    summary: str


class GovernanceQueryRequest(BaseModel):
    """Governance query request"""
    query: str = Field(..., min_length=1, description="The governance question to ask")
    metrics_type: Optional[str] = Field(None, description="Type of metrics: attendance, clinical, academic")


class GovernanceQueryResponse(BaseModel):
    """Governance query response"""
    answer: str
    insights: List[str] = []
    recommendations: List[str] = []


@router.post("/academic/query", response_model=AcademicQueryResponse)
async def academic_query(
    request: AcademicQueryRequest,
    user_id: UUID = Depends(get_current_user_id)
):
    """Query AI academic assistant for explanations, mnemonics, and study tips"""
    result = ai_service.academic_query(
        query=request.query,
        context=request.context,
        module_id=str(request.module_id) if request.module_id else None
    )
    return AcademicQueryResponse(**result)


@router.post("/academic/study-plan", response_model=StudyPlanResponse)
async def generate_study_plan(
    request: StudyPlanRequest,
    user_id: UUID = Depends(get_current_user_id)
):
    """Generate personalized AI-powered study plan"""
    weak_areas = ai_service.detect_weak_areas(str(user_id))
    if request.weak_areas:
        weak_areas.extend(request.weak_areas)
    
    result = ai_service.generate_study_plan(
        student_id=str(user_id),
        module_ids=[str(mid) for mid in request.module_ids],
        weak_areas=weak_areas if weak_areas else None
    )
    return StudyPlanResponse(**result)


@router.get("/academic/weak-areas", response_model=List[str])
async def get_weak_areas(
    user_id: UUID = Depends(get_current_user_id)
):
    """Detect weak areas from student progress"""
    weak_areas = ai_service.detect_weak_areas(str(user_id))
    return weak_areas


@router.post("/academic/compare", response_model=ConceptComparisonResponse)
async def compare_concepts(
    request: ConceptComparisonRequest,
    user_id: UUID = Depends(get_current_user_id)
):
    """Compare two medical concepts using AI"""
    result = ai_service.compare_concepts(
        concept1=request.concept1,
        concept2=request.concept2,
        subject=request.subject
    )
    return ConceptComparisonResponse(**result)


@router.post("/governance/query", response_model=GovernanceQueryResponse)
async def governance_query(
    request: GovernanceQueryRequest,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(
        UserRole.PRINCIPAL, UserRole.HOD, UserRole.ADMIN, UserRole.DME
    ))
):
    """Query AI governance assistant for insights and recommendations"""
    result = ai_service.governance_query(
        query=request.query,
        metrics_type=request.metrics_type,
        college_id=str(college_id) if college_id else None
    )
    return GovernanceQueryResponse(**result)

