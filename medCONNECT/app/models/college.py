"""
College and department models
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class CollegeBase(BaseModel):
    """Base college model"""
    name: str
    code: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    principal_id: Optional[UUID] = None
    is_active: bool = True


class CollegeCreate(CollegeBase):
    """College creation model"""
    pass


class CollegeUpdate(BaseModel):
    """College update model"""
    name: Optional[str] = None
    code: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    principal_id: Optional[UUID] = None
    is_active: Optional[bool] = None


class CollegeResponse(CollegeBase):
    """College response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DepartmentBase(BaseModel):
    """Base department model"""
    college_id: UUID
    name: str
    code: str
    department_type: str  # "academic", "clinical", "both"
    hod_id: Optional[UUID] = None
    description: Optional[str] = None
    is_active: bool = True


class DepartmentCreate(DepartmentBase):
    """Department creation model"""
    pass


class DepartmentUpdate(BaseModel):
    """Department update model"""
    name: Optional[str] = None
    code: Optional[str] = None
    department_type: Optional[str] = None
    hod_id: Optional[UUID] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class DepartmentResponse(DepartmentBase):
    """Department response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True





