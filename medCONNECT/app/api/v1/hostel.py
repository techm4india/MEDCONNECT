"""
Hostel management API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.hostel import (
    HostelCreate, HostelResponse, HostelUpdate,
    RoomCreate, RoomResponse, RoomUpdate,
    HostelAllocationCreate, HostelAllocationResponse, HostelAllocationUpdate,
    VisitorLogCreate, VisitorLogResponse, VisitorLogUpdate,
    MovementLogResponse,
    MessAttendanceResponse
)
from app.repositories.hostel_repo import HostelRepository
from app.core.dependencies import (
    get_current_user_id,
    get_current_user_college_id,
    require_any_role
)
from app.models.user import UserRole
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/hostel", tags=["Hostel"])


# Hostels
@router.post("/hostels", response_model=HostelResponse, status_code=status.HTTP_201_CREATED)
async def create_hostel(
    hostel_data: HostelCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOSTEL_WARDEN))
):
    """Create a hostel"""
    hostel_data.college_id = college_id
    hostel = HostelRepository.create_hostel(hostel_data)
    return HostelResponse(**hostel)


@router.get("/hostels", response_model=List[HostelResponse])
async def get_hostels(college_id: UUID = Depends(get_current_user_college_id)):
    """Get hostels for the college"""
    hostels = HostelRepository.get_hostels_by_college(college_id)
    return [HostelResponse(**h) for h in hostels]


# Rooms
@router.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_data: RoomCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOSTEL_WARDEN))
):
    """Create a room"""
    room_data.college_id = college_id
    room = HostelRepository.create_room(room_data)
    return RoomResponse(**room)


@router.get("/rooms/hostel/{hostel_id}", response_model=List[RoomResponse])
async def get_rooms_by_hostel(hostel_id: UUID):
    """Get rooms for a hostel"""
    rooms = HostelRepository.get_rooms_by_hostel(hostel_id)
    return [RoomResponse(**r) for r in rooms]


# Allocations
@router.post("/allocations", response_model=HostelAllocationResponse, status_code=status.HTTP_201_CREATED)
async def create_allocation(
    allocation_data: HostelAllocationCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOSTEL_WARDEN))
):
    """Create hostel allocation"""
    allocation_data.college_id = college_id
    allocation = HostelRepository.create_allocation(allocation_data)
    return HostelAllocationResponse(**allocation)


@router.get("/allocations/me", response_model=HostelAllocationResponse)
async def get_my_allocation(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's hostel allocation"""
    allocation = HostelRepository.get_allocation_by_student(user_id)
    if not allocation:
        raise NotFoundError("No active allocation found")
    return HostelAllocationResponse(**allocation)


# Visitor Logs
@router.post("/visitors", response_model=VisitorLogResponse, status_code=status.HTTP_201_CREATED)
async def create_visitor_log(
    visitor_data: VisitorLogCreate,
    user_id: UUID = Depends(get_current_user_id),
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Create visitor log"""
    visitor_data.student_id = user_id
    visitor_data.college_id = college_id
    visitor = HostelRepository.create_visitor_log(visitor_data)
    return VisitorLogResponse(**visitor)


@router.get("/visitors/me", response_model=List[VisitorLogResponse])
async def get_my_visitor_logs(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's visitor logs"""
    logs = HostelRepository.get_visitor_logs_by_student(user_id)
    return [VisitorLogResponse(**log) for log in logs]

