"""
Hostel module models and schemas
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID
from enum import Enum


class RoomStatus(str, Enum):
    """Room status"""
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"
    RESERVED = "reserved"


class VisitorStatus(str, Enum):
    """Visitor status"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class HostelBase(BaseModel):
    """Base hostel model"""
    name: str
    address: Optional[str] = None
    capacity: int
    gender: str  # "male", "female", "mixed"
    warden_id: Optional[UUID] = None
    college_id: UUID


class HostelCreate(HostelBase):
    """Hostel creation model"""
    pass


class HostelUpdate(BaseModel):
    """Hostel update model"""
    name: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None
    gender: Optional[str] = None
    warden_id: Optional[UUID] = None


class HostelResponse(HostelBase):
    """Hostel response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RoomBase(BaseModel):
    """Base room model"""
    hostel_id: UUID
    room_number: str
    floor: int
    capacity: int
    current_occupancy: int = 0
    status: RoomStatus = RoomStatus.AVAILABLE
    amenities: List[str] = Field(default_factory=list)
    college_id: UUID


class RoomCreate(RoomBase):
    """Room creation model"""
    pass


class RoomUpdate(BaseModel):
    """Room update model"""
    room_number: Optional[str] = None
    floor: Optional[int] = None
    capacity: Optional[int] = None
    current_occupancy: Optional[int] = None
    status: Optional[RoomStatus] = None
    amenities: Optional[List[str]] = None


class RoomResponse(RoomBase):
    """Room response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class HostelAllocationBase(BaseModel):
    """Base hostel allocation model"""
    student_id: UUID
    room_id: UUID
    hostel_id: UUID
    allocation_date: datetime
    deallocation_date: Optional[datetime] = None
    is_active: bool = True
    college_id: UUID


class HostelAllocationCreate(HostelAllocationBase):
    """Hostel allocation creation model"""
    pass


class HostelAllocationUpdate(BaseModel):
    """Hostel allocation update model"""
    room_id: Optional[UUID] = None
    deallocation_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class HostelAllocationResponse(HostelAllocationBase):
    """Hostel allocation response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class VisitorLogBase(BaseModel):
    """Base visitor log model"""
    student_id: UUID
    visitor_name: str
    visitor_phone: str
    visitor_relation: str
    visit_date: datetime
    entry_time: Optional[datetime] = None
    exit_time: Optional[datetime] = None
    status: VisitorStatus = VisitorStatus.PENDING
    approved_by: Optional[UUID] = None
    notes: Optional[str] = None
    college_id: UUID


class VisitorLogCreate(VisitorLogBase):
    """Visitor log creation model"""
    pass


class VisitorLogUpdate(BaseModel):
    """Visitor log update model"""
    visitor_name: Optional[str] = None
    visitor_phone: Optional[str] = None
    visitor_relation: Optional[str] = None
    visit_date: Optional[datetime] = None
    entry_time: Optional[datetime] = None
    exit_time: Optional[datetime] = None
    status: Optional[VisitorStatus] = None
    notes: Optional[str] = None


class VisitorLogResponse(VisitorLogBase):
    """Visitor log response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MovementLogBase(BaseModel):
    """Base movement log model"""
    student_id: UUID
    movement_type: str  # "entry", "exit"
    timestamp: datetime
    location: Optional[str] = None
    reason: Optional[str] = None
    college_id: UUID


class MovementLogCreate(MovementLogBase):
    """Movement log creation model"""
    pass


class MovementLogResponse(MovementLogBase):
    """Movement log response model"""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class MessAttendanceBase(BaseModel):
    """Base mess attendance model"""
    student_id: UUID
    meal_type: str  # "breakfast", "lunch", "dinner"
    attendance_date: datetime
    present: bool = True
    college_id: UUID


class MessAttendanceCreate(MessAttendanceBase):
    """Mess attendance creation model"""
    pass


class MessAttendanceResponse(MessAttendanceBase):
    """Mess attendance response model"""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True





