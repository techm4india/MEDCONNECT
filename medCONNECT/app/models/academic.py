"""
Academic module models and schemas
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID
from enum import Enum


class ResourceType(str, Enum):
    """Learning resource types"""
    VIDEO = "video"
    PDF = "pdf"
    IMAGE = "image"
    DIAGRAM = "diagram"
    PYQ = "pyq"  # Previous Year Question
    THREE_D = "3d"
    AUDIO = "audio"
    DOCUMENT = "document"


class SubjectBase(BaseModel):
    """Base subject model"""
    name: str
    code: str
    description: Optional[str] = None
    year: int
    semester: Optional[int] = None
    college_id: UUID


class SubjectCreate(SubjectBase):
    """Subject creation model"""
    pass


class SubjectUpdate(BaseModel):
    """Subject update model"""
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None


class SubjectResponse(SubjectBase):
    """Subject response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CurriculumModuleBase(BaseModel):
    """Base curriculum module model"""
    subject_id: UUID
    title: str
    description: Optional[str] = None
    module_number: int
    topics: List[str] = Field(default_factory=list)
    learning_objectives: List[str] = Field(default_factory=list)
    nmc_aligned: bool = Field(default=True, description="Whether module is aligned with NMC curriculum")
    nmc_competency_codes: List[str] = Field(default_factory=list, description="NMC competency codes")
    college_id: UUID


class CurriculumModuleCreate(CurriculumModuleBase):
    """Curriculum module creation model"""
    pass


class CurriculumModuleUpdate(BaseModel):
    """Curriculum module update model"""
    title: Optional[str] = None
    description: Optional[str] = None
    module_number: Optional[int] = None
    topics: Optional[List[str]] = None
    learning_objectives: Optional[List[str]] = None
    nmc_aligned: Optional[bool] = None
    nmc_competency_codes: Optional[List[str]] = None


class CurriculumModuleResponse(CurriculumModuleBase):
    """Curriculum module response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LearningResourceBase(BaseModel):
    """Base learning resource model"""
    module_id: UUID
    title: str
    resource_type: ResourceType
    file_url: Optional[str] = None
    external_url: Optional[str] = None
    description: Optional[str] = None
    order_index: int = 0
    is_bookmarked: bool = False
    # 3D specific fields
    viewer_type: Optional[str] = Field(None, description="For 3D resources: 'anatomy', 'physiology', 'pathology', 'pharmacology'")
    interactive: bool = Field(default=False, description="Whether resource is interactive")
    embed_code: Optional[str] = Field(None, description="Embed code for 3D viewers or external content")
    college_id: UUID


class LearningResourceCreate(LearningResourceBase):
    """Learning resource creation model"""
    pass


class LearningResourceUpdate(BaseModel):
    """Learning resource update model"""
    title: Optional[str] = None
    resource_type: Optional[ResourceType] = None
    file_url: Optional[str] = None
    external_url: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    is_bookmarked: Optional[bool] = None
    viewer_type: Optional[str] = None
    interactive: Optional[bool] = None
    embed_code: Optional[str] = None


class LearningResourceResponse(LearningResourceBase):
    """Learning resource response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class StudentModuleProgressBase(BaseModel):
    """Base student module progress model"""
    student_id: UUID
    module_id: UUID
    completion_percentage: float = Field(ge=0, le=100)
    time_spent_minutes: int = 0
    last_accessed_at: Optional[datetime] = None
    resources_completed: List[UUID] = Field(default_factory=list)
    college_id: UUID


class StudentModuleProgressCreate(StudentModuleProgressBase):
    """Student module progress creation model"""
    pass


class StudentModuleProgressUpdate(BaseModel):
    """Student module progress update model"""
    completion_percentage: Optional[float] = Field(None, ge=0, le=100)
    time_spent_minutes: Optional[int] = None
    last_accessed_at: Optional[datetime] = None
    resources_completed: Optional[List[UUID]] = None


class StudentModuleProgressResponse(StudentModuleProgressBase):
    """Student module progress response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TopicAllocationBase(BaseModel):
    """Base topic allocation model"""
    module_id: UUID
    batch_id: UUID
    faculty_id: UUID
    allocated_date: datetime
    due_date: Optional[datetime] = None
    college_id: UUID


class TopicAllocationCreate(TopicAllocationBase):
    """Topic allocation creation model"""
    pass


class TopicAllocationResponse(TopicAllocationBase):
    """Topic allocation response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class FacultyAttendanceStatus(str, Enum):
    """Faculty attendance status"""
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"
    ON_LEAVE = "on_leave"


class FacultyAttendanceBase(BaseModel):
    """Base faculty attendance model"""
    faculty_id: UUID
    session_id: UUID
    attendance_date: datetime
    status: FacultyAttendanceStatus
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    qr_code: Optional[str] = None
    verified_by: Optional[UUID] = None
    remarks: Optional[str] = None
    college_id: UUID


class FacultyAttendanceCreate(FacultyAttendanceBase):
    """Faculty attendance creation model"""
    pass


class FacultyAttendanceUpdate(BaseModel):
    """Faculty attendance update model"""
    status: Optional[FacultyAttendanceStatus] = None
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    verified_by: Optional[UUID] = None
    remarks: Optional[str] = None


class FacultyAttendanceResponse(FacultyAttendanceBase):
    """Faculty attendance response model"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True




