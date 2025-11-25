"""
College and department API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.college import (
    CollegeCreate, CollegeResponse, CollegeUpdate,
    DepartmentCreate, DepartmentResponse, DepartmentUpdate
)
from app.repositories.college_repo import CollegeRepository
from app.core.dependencies import (
    get_current_user_college_id,
    require_any_role
)
from app.models.user import UserRole
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/colleges", tags=["Colleges"])


# Colleges
@router.post("", response_model=CollegeResponse, status_code=status.HTTP_201_CREATED)
async def create_college(
    college_data: CollegeCreate,
    _: UUID = Depends(require_any_role(UserRole.DME, UserRole.ADMIN))
):
    """Create a college (DME/Admin only)"""
    college = CollegeRepository.create_college(college_data)
    return CollegeResponse(**college)


@router.get("", response_model=List[CollegeResponse])
async def get_colleges():
    """Get all colleges"""
    colleges = CollegeRepository.get_all_colleges()
    return [CollegeResponse(**c) for c in colleges]


@router.get("/{college_id}", response_model=CollegeResponse)
async def get_college(college_id: UUID):
    """Get college by ID"""
    college = CollegeRepository.get_college(college_id)
    if not college:
        raise NotFoundError("College not found")
    return CollegeResponse(**college)


@router.put("/{college_id}", response_model=CollegeResponse)
async def update_college(
    college_id: UUID,
    college_data: CollegeUpdate,
    _: UUID = Depends(require_any_role(UserRole.DME, UserRole.ADMIN, UserRole.PRINCIPAL))
):
    """Update college"""
    try:
        updated = CollegeRepository.update_college(college_id, college_data)
        return CollegeResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# Departments
@router.post("/{college_id}/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    college_id: UUID,
    department_data: DepartmentCreate,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.HOD))
):
    """Create a department"""
    department_data.college_id = college_id
    department = CollegeRepository.create_department(department_data)
    return DepartmentResponse(**department)


@router.get("/{college_id}/departments", response_model=List[DepartmentResponse])
async def get_departments(college_id: UUID):
    """Get departments for a college"""
    departments = CollegeRepository.get_departments_by_college(college_id)
    return [DepartmentResponse(**d) for d in departments]


@router.get("/departments/{department_id}", response_model=DepartmentResponse)
async def get_department(department_id: UUID):
    """Get department by ID"""
    department = CollegeRepository.get_department(department_id)
    if not department:
        raise NotFoundError("Department not found")
    return DepartmentResponse(**department)


@router.put("/departments/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: UUID,
    department_data: DepartmentUpdate,
    _: UUID = Depends(require_any_role(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.HOD))
):
    """Update department"""
    try:
        updated = CollegeRepository.update_department(department_id, department_data)
        return DepartmentResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))




