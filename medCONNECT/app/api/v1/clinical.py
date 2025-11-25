"""
Clinical module API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.clinical import (
    PostingCreate, PostingResponse, PostingUpdate,
    ClinicalLogbookEntryCreate, ClinicalLogbookEntryResponse, ClinicalLogbookEntryUpdate,
    LogbookEntryStatus,
    OPDSessionCreate, OPDSessionResponse, OPDSessionUpdate,
    OPDSessionStudentInvolvementCreate, OPDSessionStudentInvolvementResponse
)
from app.repositories.clinical_repo import ClinicalRepository
from app.core.dependencies import (
    get_current_user_id,
    get_current_user_college_id,
    require_any_role
)
from app.models.user import UserRole
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/clinical", tags=["Clinical"])


# Postings
@router.post("/postings", response_model=PostingResponse, status_code=status.HTTP_201_CREATED)
async def create_posting(
    posting_data: PostingCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.CLINICAL_COORDINATOR, UserRole.HOD))
):
    """Create a posting"""
    posting_data.college_id = college_id
    posting = ClinicalRepository.create_posting(posting_data)
    return PostingResponse(**posting)


@router.get("/postings/me", response_model=List[PostingResponse])
async def get_my_postings(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's postings"""
    postings = ClinicalRepository.get_postings_by_student(user_id)
    return [PostingResponse(**p) for p in postings]


@router.get("/postings/{posting_id}", response_model=PostingResponse)
async def get_posting(posting_id: UUID):
    """Get posting by ID"""
    posting = ClinicalRepository.get_posting(posting_id)
    if not posting:
        raise NotFoundError("Posting not found")
    return PostingResponse(**posting)


# Logbook Entries
@router.post("/logbooks", response_model=ClinicalLogbookEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_logbook_entry(
    entry_data: ClinicalLogbookEntryCreate,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Create a logbook entry"""
    entry_data.student_id = user_id
    entry_data.college_id = college_id
    entry = ClinicalRepository.create_logbook_entry(entry_data)
    return ClinicalLogbookEntryResponse(**entry)


@router.get("/logbooks/me", response_model=List[ClinicalLogbookEntryResponse])
async def get_my_logbook_entries(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's logbook entries"""
    entries = ClinicalRepository.get_logbook_entries_by_student(user_id)
    return [ClinicalLogbookEntryResponse(**e) for e in entries]


@router.get("/logbooks", response_model=List[ClinicalLogbookEntryResponse])
async def get_logbook_entries(
    student_id: UUID = None,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN))
):
    """Get logbook entries (faculty/admin only) - optionally filtered by student"""
    if student_id:
        entries = ClinicalRepository.get_logbook_entries_by_student(student_id)
    else:
        # Get all logbook entries for the college
        entries = ClinicalRepository.get_logbook_entries_by_college(college_id)
    return [ClinicalLogbookEntryResponse(**e) for e in entries]


@router.put("/logbooks/{entry_id}", response_model=ClinicalLogbookEntryResponse)
async def update_logbook_entry(
    entry_id: UUID,
    entry_data: ClinicalLogbookEntryUpdate,
    user_id: UUID = Depends(get_current_user_id),
    _: UUID = Depends(require_any_role(UserRole.FACULTY, UserRole.HOD))
):
    """Update logbook entry (faculty verification)"""
    from datetime import datetime
    
    try:
        # If status is being set to verified, automatically set verified_at and verified_by
        if entry_data.status == LogbookEntryStatus.VERIFIED:
            entry_data.verified_at = datetime.utcnow()
            entry_data.verified_by = user_id
        
        updated = ClinicalRepository.update_logbook_entry(entry_id, entry_data)
        return ClinicalLogbookEntryResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# OPD Sessions
@router.post("/opd-sessions", response_model=OPDSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_opd_session(
    session_data: OPDSessionCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN))
):
    """Create an OPD session"""
    session_data.college_id = college_id
    session = ClinicalRepository.create_opd_session(session_data)
    return OPDSessionResponse(**session)


@router.get("/opd-sessions/{session_id}", response_model=OPDSessionResponse)
async def get_opd_session(session_id: UUID):
    """Get OPD session by ID"""
    session = ClinicalRepository.get_opd_session(session_id)
    if not session:
        raise NotFoundError("OPD session not found")
    return OPDSessionResponse(**session)



