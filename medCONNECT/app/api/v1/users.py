"""
User management API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.models.user import UserResponse, UserUpdate
from app.repositories.user_repo import UserRepository
from app.core.dependencies import get_current_user_id, get_current_user_college_id, require_role, require_any_role
from app.models.user import UserRole
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user_id: UUID = Depends(get_current_user_id)
):
    """Get current user profile"""
    user = UserRepository.get_user_by_id(user_id)
    if not user:
        raise NotFoundError("User not found")
    return UserResponse(**user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    current_user_id: UUID = Depends(get_current_user_id),
    current_college_id: UUID = Depends(get_current_user_college_id)
):
    """Get user by ID"""
    user = UserRepository.get_user_by_id(user_id)
    if not user:
        raise NotFoundError("User not found")
    
    # Verify user belongs to same college
    if UUID(user["college_id"]) != current_college_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return UserResponse(**user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    user_id: UUID = Depends(get_current_user_id)
):
    """Update current user profile"""
    try:
        updated = UserRepository.update_user(user_id, user_data)
        return UserResponse(**updated)
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("", response_model=List[UserResponse])
async def get_users(
    role: str = None,
    current_college_id: UUID = Depends(get_current_user_college_id),
    current_user_id: UUID = Depends(get_current_user_id)
):
    """Get all users for the college (filtered by role if provided)"""
    # Allow students to see other students, faculty to see students, etc.
    # Full list only for admin/HOD/Principal
    from app.repositories.user_repo import UserRepository
    current_user = UserRepository.get_user_by_id(current_user_id)
    if not current_user:
        raise NotFoundError("Current user not found")
    
    current_user_role = current_user.get("role")
    
    # If no role filter, only admins/HOD/Principal can see all users
    if not role:
        if current_user_role not in ["admin", "hod", "principal", "dme"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Role filter required."
            )
    
    users = UserRepository.get_users_by_college(current_college_id, role)
    return [UserResponse(**user) for user in users]

