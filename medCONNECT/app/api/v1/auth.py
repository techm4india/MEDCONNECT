"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from app.models.user import LoginRequest, TokenResponse, UserCreate, UserResponse, RefreshTokenRequest
from app.services.auth_service import AuthService
from app.core.dependencies import security
from app.core.exceptions import UnauthorizedError, ConflictError
from uuid import UUID
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequestWithCollege(LoginRequest):
    """Login request with college ID"""
    college_id: UUID


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        user = AuthService.register_user(user_data)
        return UserResponse(**user)
    except ConflictError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequestWithCollege):
    """Login user"""
    try:
        return AuthService.login(login_data, login_data.college_id)
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/refresh", response_model=dict)
async def refresh_token(token_data: RefreshTokenRequest):
    """Refresh access token"""
    try:
        return AuthService.refresh_access_token(token_data.refresh_token)
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user"""
    token = credentials.credentials
    return AuthService.logout(token)

