"""
Authentication service using Supabase Auth
"""
from typing import Optional
from uuid import UUID
from app.core.exceptions import UnauthorizedError, NotFoundError, ConflictError
from app.repositories.user_repo import UserRepository
from app.models.user import LoginRequest, TokenResponse, UserResponse, UserCreate
from app.db.supabase import supabase_client
from loguru import logger


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def register_user(user_data: UserCreate) -> dict:
        """Register a new user using Supabase Auth"""
        try:
            # Check if user already exists in our users table
            existing = UserRepository.get_user_by_email(user_data.email, user_data.college_id)
            if existing:
                raise ConflictError("User with this email already exists")
            
            # Create user in Supabase Auth using admin API (auto-confirms email)
            client = supabase_client.get_client()
            
            # Use admin API to create user with email auto-confirmed
            # This bypasses email confirmation requirement
            try:
                # Create user via admin API (auto-confirms)
                admin_response = client.auth.admin.create_user({
                    "email": user_data.email,
                    "password": user_data.password,
                    "email_confirm": True,  # Auto-confirm email
                    "user_metadata": {
                        "full_name": user_data.full_name,
                        "role": user_data.role.value,
                        "college_id": str(user_data.college_id),
                        "phone": user_data.phone
                    }
                })
                
                if not admin_response.user:
                    raise UnauthorizedError("Failed to create user account")
                
                auth_response = type('obj', (object,), {
                    'user': admin_response.user,
                    'session': None  # No session on admin create
                })()
                
            except AttributeError:
                # Fallback: If admin API not available, use regular sign_up
                # Note: User will need to confirm email unless disabled in Supabase settings
                auth_response = client.auth.sign_up({
                    "email": user_data.email,
                    "password": user_data.password,
                    "options": {
                        "data": {
                            "full_name": user_data.full_name,
                            "role": user_data.role.value,
                            "college_id": str(user_data.college_id),
                            "phone": user_data.phone
                        }
                    }
                })
                
                if not auth_response.user:
                    raise UnauthorizedError("Failed to create user account")
                
                # Try to auto-confirm using admin API
                try:
                    client.auth.admin.update_user_by_id(
                        auth_response.user.id,
                        {"email_confirm": True}
                    )
                except Exception as e:
                    logger.warning(f"Could not auto-confirm email: {e}")
                    logger.warning("User will need to confirm email via link")
            except Exception as supabase_error:
                error_str = str(supabase_error).lower()
                if "already registered" in error_str or "user already exists" in error_str or "email" in error_str or "409" in error_str:
                    raise ConflictError("User with this email already exists")
                logger.error(f"Supabase error: {supabase_error}")
                raise UnauthorizedError(f"Failed to create user in Supabase: {str(supabase_error)}")
            
            if not auth_response.user:
                raise UnauthorizedError("Failed to create user account")
            
            # Create user profile in our users table
            user = UserRepository.create_user(user_data, str(auth_response.user.id))
            
            logger.info(f"User registered successfully: {user_data.email}")
            return user
            
        except ConflictError:
            # Re-raise ConflictError as-is
            raise
        except Exception as e:
            logger.error(f"Registration error: {e}")
            error_str = str(e).lower()
            if "already registered" in error_str or "user already exists" in error_str or "409" in error_str:
                raise ConflictError("User with this email already exists")
            raise UnauthorizedError(f"Registration failed: {str(e)}")
    
    @staticmethod
    def login(login_data: LoginRequest, college_id: UUID) -> TokenResponse:
        """Authenticate user using Supabase Auth and return tokens"""
        try:
            # Authenticate with Supabase Auth
            client = supabase_client.get_client()
            auth_response = client.auth.sign_in_with_password({
                "email": login_data.email,
                "password": login_data.password
            })
            
            if not auth_response.user or not auth_response.session:
                raise UnauthorizedError("Invalid email or password")
            
            # Get user from our users table
            user = UserRepository.get_user_by_id(UUID(auth_response.user.id))
            
            # If user doesn't exist in our table but exists in Supabase Auth, create profile
            if not user:
                logger.warning(f"User {login_data.email} exists in Supabase Auth but not in users table. Creating profile...")
                # Try to get user metadata from Supabase Auth
                auth_user = auth_response.user
                user_metadata = auth_user.user_metadata or {}
                
                # Create user profile from Supabase Auth metadata
                from app.models.user import UserCreate, UserRole
                try:
                    role_str = user_metadata.get("role", "student")
                    user_create = UserCreate(
                        email=auth_user.email,
                        password="",  # Not needed, already in Supabase Auth
                        full_name=user_metadata.get("full_name", auth_user.email),
                        phone=user_metadata.get("phone"),
                        role=UserRole(role_str),
                        college_id=UUID(user_metadata.get("college_id", str(college_id)))
                    )
                    user = UserRepository.create_user(user_create, str(auth_user.id))
                    logger.info(f"Created user profile for {login_data.email}")
                except Exception as create_error:
                    logger.error(f"Failed to create user profile: {create_error}")
                    raise UnauthorizedError("User profile not found. Please contact administrator.")
            
            # Verify college_id matches
            if str(user["college_id"]) != str(college_id):
                raise UnauthorizedError("User does not belong to this college")
            
            # Check if user is active
            if not user.get("is_active", True):
                raise UnauthorizedError("User account is inactive")
            
            # Return Supabase tokens
            user_response = UserResponse(
                id=UUID(user["id"]),
                email=user["email"],
                full_name=user["full_name"],
                phone=user.get("phone"),
                role=user["role"],
                college_id=UUID(user["college_id"]),
                is_active=user.get("is_active", True),
                created_at=user.get("created_at"),
                updated_at=user.get("updated_at")
            )
            
            return TokenResponse(
                access_token=auth_response.session.access_token,
                refresh_token=auth_response.session.refresh_token,
                user=user_response
            )
            
        except UnauthorizedError:
            # Re-raise UnauthorizedError as-is
            raise
        except Exception as e:
            logger.error(f"Login error: {e}")
            error_str = str(e).lower()
            if "invalid login credentials" in error_str or "email not confirmed" in error_str:
                raise UnauthorizedError("Invalid email or password")
            raise UnauthorizedError(f"Login failed: {str(e)}")
    
    @staticmethod
    def refresh_access_token(refresh_token: str) -> dict:
        """Refresh access token using Supabase Auth"""
        try:
            client = supabase_client.get_client()
            # Set the session with refresh token
            auth_response = client.auth.refresh_session(refresh_token)
            
            if not auth_response.session:
                raise UnauthorizedError("Invalid or expired refresh token")
            
            return {
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token,
                "token_type": "bearer"
            }
            
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            raise UnauthorizedError("Failed to refresh token")
    
    @staticmethod
    def logout(access_token: str):
        """Logout user using Supabase Auth"""
        try:
            client = supabase_client.get_client()
            # Sign out the user
            client.auth.sign_out()
            return {"message": "Logged out successfully"}
        except Exception as e:
            logger.error(f"Logout error: {e}")
            # Even if sign_out fails, return success
            return {"message": "Logged out successfully"}

