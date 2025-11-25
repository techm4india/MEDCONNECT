"""
Academic module API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.academic import (
    SubjectCreate, SubjectResponse, SubjectUpdate,
    CurriculumModuleCreate, CurriculumModuleResponse, CurriculumModuleUpdate,
    LearningResourceCreate, LearningResourceResponse, LearningResourceUpdate,
    StudentModuleProgressCreate, StudentModuleProgressResponse, StudentModuleProgressUpdate,
    TopicAllocationCreate, TopicAllocationResponse,
    FacultyAttendanceCreate, FacultyAttendanceResponse, FacultyAttendanceUpdate
)
from app.services.nmc_validator import NMCValidator
from app.repositories.academic_repo import AcademicRepository
from app.core.dependencies import (
    get_current_user_id,
    get_current_user_college_id,
    require_role,
    require_any_role
)
from app.models.user import UserRole
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/academic", tags=["Academic"])


# Subjects
@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject_data: SubjectCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create a subject"""
    subject_data.college_id = college_id
    subject = AcademicRepository.create_subject(subject_data)
    return SubjectResponse(**subject)


@router.get("/subjects", response_model=List[SubjectResponse])
async def get_subjects(
    year: int = None,
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Get subjects for the college"""
    subjects = AcademicRepository.get_subjects_by_college(college_id, year)
    return [SubjectResponse(**s) for s in subjects]


@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
async def get_subject(subject_id: UUID):
    """Get subject by ID"""
    subject = AcademicRepository.get_subject(subject_id)
    if not subject:
        raise NotFoundError("Subject not found")
    return SubjectResponse(**subject)


@router.put("/subjects/{subject_id}", response_model=SubjectResponse)
async def update_subject(
    subject_id: UUID,
    subject_data: SubjectUpdate,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Update subject"""
    try:
        updated = AcademicRepository.update_subject(subject_id, subject_data)
        return SubjectResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# Modules
@router.post("/modules", response_model=CurriculumModuleResponse, status_code=status.HTTP_201_CREATED)
async def create_module(
    module_data: CurriculumModuleCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create a curriculum module"""
    module_data.college_id = college_id
    module = AcademicRepository.create_module(module_data)
    return CurriculumModuleResponse(**module)


@router.get("/modules/subject/{subject_id}", response_model=List[CurriculumModuleResponse])
async def get_modules_by_subject(subject_id: UUID):
    """Get modules for a subject"""
    modules = AcademicRepository.get_modules_by_subject(subject_id)
    return [CurriculumModuleResponse(**m) for m in modules]


@router.get("/modules/{module_id}", response_model=CurriculumModuleResponse)
async def get_module(module_id: UUID):
    """Get module by ID"""
    module = AcademicRepository.get_module(module_id)
    if not module:
        raise NotFoundError("Module not found")
    return CurriculumModuleResponse(**module)


@router.put("/modules/{module_id}", response_model=CurriculumModuleResponse)
async def update_module(
    module_id: UUID,
    module_data: CurriculumModuleUpdate,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Update module"""
    try:
        updated = AcademicRepository.update_module(module_id, module_data)
        return CurriculumModuleResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# Learning Resources
@router.post("/resources", response_model=LearningResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(
    resource_data: LearningResourceCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create a learning resource"""
    resource_data.college_id = college_id
    resource = AcademicRepository.create_resource(resource_data)
    return LearningResourceResponse(**resource)


@router.get("/resources/module/{module_id}", response_model=List[LearningResourceResponse])
async def get_resources_by_module(module_id: UUID):
    """Get resources for a module"""
    resources = AcademicRepository.get_resources_by_module(module_id)
    return [LearningResourceResponse(**r) for r in resources]


@router.get("/resources/{resource_id}", response_model=LearningResourceResponse)
async def get_resource(resource_id: UUID):
    """Get resource by ID"""
    resource = AcademicRepository.get_resource(resource_id)
    if not resource:
        raise NotFoundError("Resource not found")
    return LearningResourceResponse(**resource)


@router.put("/resources/{resource_id}", response_model=LearningResourceResponse)
async def update_resource(
    resource_id: UUID,
    resource_data: LearningResourceUpdate,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Update resource"""
    try:
        updated = AcademicRepository.update_resource(resource_id, resource_data)
        return LearningResourceResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# Student Progress
@router.post("/progress", response_model=StudentModuleProgressResponse, status_code=status.HTTP_201_CREATED)
async def create_progress(
    progress_data: StudentModuleProgressCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    user_id: UUID = Depends(get_current_user_id)
):
    """Create or update student progress"""
    progress_data.student_id = user_id
    progress_data.college_id = college_id
    
    # Check if progress exists
    existing = AcademicRepository.get_progress(user_id, progress_data.module_id)
    if existing:
        # Update existing
        updated = AcademicRepository.update_progress(
            UUID(existing["id"]),
            StudentModuleProgressUpdate(**progress_data.model_dump())
        )
        return StudentModuleProgressResponse(**updated)
    else:
        # Create new
        progress = AcademicRepository.create_progress(progress_data)
        return StudentModuleProgressResponse(**progress)


@router.get("/progress/me", response_model=List[StudentModuleProgressResponse])
async def get_my_progress(user_id: UUID = Depends(get_current_user_id)):
    """Get current student's progress"""
    progress_list = AcademicRepository.get_student_progress(user_id)
    return [StudentModuleProgressResponse(**p) for p in progress_list]


@router.get("/progress/{module_id}", response_model=StudentModuleProgressResponse)
async def get_progress(
    module_id: UUID,
    user_id: UUID = Depends(get_current_user_id)
):
    """Get progress for a specific module"""
    progress = AcademicRepository.get_progress(user_id, module_id)
    if not progress:
        raise NotFoundError("Progress not found")
    return StudentModuleProgressResponse(**progress)


# Topic Allocations
@router.post("/allocations", response_model=TopicAllocationResponse, status_code=status.HTTP_201_CREATED)
async def create_allocation(
    allocation_data: TopicAllocationCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create topic allocation"""
    allocation_data.college_id = college_id
    allocation = AcademicRepository.create_topic_allocation(allocation_data)
    return TopicAllocationResponse(**allocation)


@router.get("/allocations", response_model=List[TopicAllocationResponse])
async def get_allocations(
    student_id: UUID = None,
    topic_id: UUID = None,
    college_id: UUID = Depends(get_current_user_college_id)
):
    """Get topic allocations - optionally filtered by student or topic"""
    if student_id:
        allocations = AcademicRepository.get_allocations_by_student(student_id)
    elif topic_id:
        allocations = AcademicRepository.get_allocations_by_topic(topic_id)
    else:
        allocations = AcademicRepository.get_allocations_by_college(college_id)
    return [TopicAllocationResponse(**a) for a in allocations]


# NMC Validation
@router.post("/modules/{module_id}/validate-nmc")
async def validate_module_nmc(module_id: UUID):
    """Validate module NMC alignment"""
    module = AcademicRepository.get_module(module_id)
    if not module:
        raise NotFoundError("Module not found")
    
    validation = NMCValidator.validate_module_alignment(
        topics=module.get("topics", []),
        learning_objectives=module.get("learning_objectives", []),
        competency_codes=module.get("nmc_competency_codes", [])
    )
    
    return validation


@router.get("/nmc/competencies")
async def get_nmc_competencies():
    """Get all available NMC competency codes"""
    return {
        "competencies": NMCValidator.get_all_competencies(),
        "domains": NMCValidator.NMC_COMPETENCIES
    }


@router.post("/modules/{module_id}/suggest-competencies")
async def suggest_competencies(module_id: UUID):
    """Suggest NMC competency codes for a module"""
    module = AcademicRepository.get_module(module_id)
    if not module:
        raise NotFoundError("Module not found")
    
    suggested = NMCValidator.suggest_competency_codes(
        topics=module.get("topics", []),
        learning_objectives=module.get("learning_objectives", [])
    )
    
    return {
        "suggested_codes": suggested,
        "descriptions": {code: NMCValidator.get_competency_description(code) for code in suggested}
    }


# Faculty Attendance
@router.post("/faculty-attendance", response_model=FacultyAttendanceResponse, status_code=status.HTTP_201_CREATED)
async def create_faculty_attendance(
    attendance_data: FacultyAttendanceCreate,
    college_id: UUID = Depends(get_current_user_college_id),
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.FACULTY, UserRole.HOD))
):
    """Create faculty attendance record"""
    attendance_data.college_id = college_id
    attendance = AcademicRepository.create_faculty_attendance(attendance_data)
    return FacultyAttendanceResponse(**attendance)


@router.get("/faculty-attendance/me", response_model=List[FacultyAttendanceResponse])
async def get_my_faculty_attendance(user_id: UUID = Depends(get_current_user_id)):
    """Get current faculty member's attendance"""
    records = AcademicRepository.get_attendance_by_faculty(user_id)
    return [FacultyAttendanceResponse(**r) for r in records]


@router.get("/faculty-attendance/{attendance_id}", response_model=FacultyAttendanceResponse)
async def get_faculty_attendance(attendance_id: UUID):
    """Get faculty attendance by ID"""
    attendance = AcademicRepository.get_faculty_attendance(attendance_id)
    if not attendance:
        raise NotFoundError("Faculty attendance not found")
    return FacultyAttendanceResponse(**attendance)


@router.put("/faculty-attendance/{attendance_id}", response_model=FacultyAttendanceResponse)
async def update_faculty_attendance(
    attendance_id: UUID,
    attendance_data: FacultyAttendanceUpdate,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOD, UserRole.PRINCIPAL))
):
    """Update faculty attendance"""
    try:
        updated = AcademicRepository.update_faculty_attendance(attendance_id, attendance_data)
        return FacultyAttendanceResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/faculty-attendance/department/{department_id}", response_model=List[FacultyAttendanceResponse])
async def get_faculty_attendance_by_department(
    department_id: UUID,
    start_date: str = None,
    end_date: str = None,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.HOD, UserRole.PRINCIPAL))
):
    """Get attendance records for all faculty in a department"""
    records = AcademicRepository.get_attendance_by_department(department_id, start_date, end_date)
    return [FacultyAttendanceResponse(**r) for r in records]

