"""
FastAPI dependencies for authentication and authorization using Supabase Auth
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.exceptions import UnauthorizedError, ForbiddenError
from app.models.user import UserRole
from app.db.supabase import supabase_client
from app.repositories.user_repo import UserRepository
from uuid import UUID
from loguru import logger

# Configure HTTPBearer to return 401 instead of 403 for missing tokens
security = HTTPBearer(auto_error=False)


async def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> str:
    """Get current user ID from Supabase JWT token"""
    if not credentials:
        raise UnauthorizedError("Authentication required. Please provide a valid token.")
    
    token = credentials.credentials
    
    try:
        client = supabase_client.get_client()
        # Verify token and get user
        user_response = client.auth.get_user(token)
        
        if not user_response.user:
            raise UnauthorizedError("Invalid authentication credentials")
        
        return user_response.user.id
        
    except ValueError as e:
        # Supabase client not initialized
        logger.error(f"Supabase client error: {e}")
        raise UnauthorizedError("Authentication service unavailable. Please check server configuration.")
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise UnauthorizedError("Invalid authentication credentials")


async def get_current_user_college_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> str:
    """Get current user's college ID from user profile"""
    if not credentials:
        raise UnauthorizedError("Authentication required. Please provide a valid token.")
    
    token = credentials.credentials
    
    try:
        client = supabase_client.get_client()
        user_response = client.auth.get_user(token)
        
        if not user_response.user:
            raise UnauthorizedError("Invalid authentication credentials")
        
        # Get user from database to get college_id
        user = UserRepository.get_user_by_id(UUID(user_response.user.id))
        if not user:
            raise UnauthorizedError("User profile not found")
        
        college_id = str(user.get("college_id"))
        if not college_id:
            raise UnauthorizedError("College ID not found in user profile")
        
        return college_id
        
    except ValueError as e:
        # Supabase client not initialized
        logger.error(f"Supabase client error: {e}")
        raise UnauthorizedError("Authentication service unavailable. Please check server configuration.")
    except Exception as e:
        logger.error(f"College ID retrieval error: {e}")
        raise UnauthorizedError("Invalid authentication credentials")


async def get_current_user_role(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> UserRole:
    """Get current user role from user profile"""
    if not credentials:
        raise UnauthorizedError("Authentication required. Please provide a valid token.")
    
    token = credentials.credentials
    
    try:
        client = supabase_client.get_client()
        user_response = client.auth.get_user(token)
        
        if not user_response.user:
            raise UnauthorizedError("Invalid authentication credentials")
        
        # Get user from database to get role
        user = UserRepository.get_user_by_id(UUID(user_response.user.id))
        if not user:
            raise UnauthorizedError("User profile not found")
        
        role_str = user.get("role")
        if not role_str:
            raise UnauthorizedError("Role not found in user profile")
        
        try:
            return UserRole(role_str)
        except ValueError:
            raise UnauthorizedError(f"Invalid role in user profile: {role_str}")
            
    except ValueError as e:
        # Supabase client not initialized
        logger.error(f"Supabase client error: {e}")
        raise UnauthorizedError("Authentication service unavailable. Please check server configuration.")
    except Exception as e:
        logger.error(f"Role retrieval error: {e}")
        raise UnauthorizedError("Invalid authentication credentials")


def require_role(*allowed_roles: UserRole):
    """Dependency factory for role-based access control"""
    async def role_checker(
        user_role: UserRole = Depends(get_current_user_role)
    ) -> UserRole:
        if user_role not in allowed_roles:
            raise ForbiddenError(f"Access denied. Required roles: {allowed_roles}")
        return user_role
    
    return role_checker


def require_any_role(*allowed_roles: UserRole):
    """Dependency factory for any-of-multiple-roles access control"""
    async def role_checker(
        user_role: UserRole = Depends(get_current_user_role)
    ) -> UserRole:
        if user_role not in allowed_roles:
            raise ForbiddenError(f"Access denied. Required one of: {allowed_roles}")
        return user_role
    
    return role_checker



