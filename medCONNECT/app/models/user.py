"""
User models and schemas
"""
from typing import Optional, List
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class UserRole(str, Enum):
    """User roles in the system"""
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"
    HOD = "hod"
    PRINCIPAL = "principal"
    SUPERINTENDENT = "superintendent"
    DME = "dme"
    HOSTEL_WARDEN = "hostel_warden"
    CLINICAL_COORDINATOR = "clinical_coordinator"


class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    college_id: UUID
    is_active: bool = True


class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update model"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """User response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class StudentProfile(BaseModel):
    """Student profile model"""
    user_id: UUID
    enrollment_number: str
    admission_year: int
    current_year: int
    department_id: Optional[UUID] = None
    batch_id: Optional[UUID] = None
    hostel_id: Optional[UUID] = None
    room_number: Optional[str] = None


class FacultyProfile(BaseModel):
    """Faculty profile model"""
    user_id: UUID
    employee_id: str
    department_id: UUID
    designation: str
    specialization: Optional[str] = None
    qualification: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request model"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str





