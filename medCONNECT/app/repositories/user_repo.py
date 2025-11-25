"""
User repository for database operations
"""
from typing import Optional, List
from uuid import UUID
from app.db.supabase import supabase_client
from app.models.user import UserCreate, UserUpdate, UserResponse, StudentProfile, FacultyProfile
from app.core.exceptions import NotFoundError, ConflictError
from datetime import datetime


class UserRepository:
    """Repository for user operations"""
    
    @staticmethod
    def create_user(user_data: UserCreate, user_id: str) -> dict:
        """Create a new user profile (after Supabase Auth user is created)"""
        # Check if email already exists
        existing = supabase_client.select_one(
            "users",
            filters={"email": user_data.email, "college_id": str(user_data.college_id)}
        )
        if existing:
            raise ConflictError("User with this email already exists")
        
        user_dict = user_data.model_dump()
        user_dict["id"] = user_id  # Use Supabase Auth user ID
        user_dict.pop("password", None)  # Don't store password hash, Supabase handles it
        # Temporary workaround: Set placeholder password_hash until migration is run
        # TODO: Remove this after running: ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
        user_dict["password_hash"] = "supabase_auth_managed"  # Placeholder - Supabase Auth handles passwords
        user_dict["college_id"] = str(user_dict["college_id"])
        user_dict["role"] = user_dict["role"].value
        
        result = supabase_client.insert("users", user_dict)
        return result
    
    @staticmethod
    def get_user_by_id(user_id: UUID) -> Optional[dict]:
        """Get user by ID"""
        return supabase_client.select_one("users", filters={"id": str(user_id)})
    
    @staticmethod
    def get_user_by_email(email: str, college_id: UUID) -> Optional[dict]:
        """Get user by email and college"""
        return supabase_client.select_one(
            "users",
            filters={"email": email, "college_id": str(college_id)}
        )
    
    @staticmethod
    def update_user(user_id: UUID, user_data: UserUpdate) -> dict:
        """Update user"""
        update_dict = user_data.model_dump(exclude_unset=True)
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "users",
            update_dict,
            filters={"id": str(user_id)}
        )
        if not result:
            raise NotFoundError("User not found")
        return result
    
    @staticmethod
    def get_users_by_college(college_id: UUID, role: Optional[str] = None) -> List[dict]:
        """Get all users for a college, optionally filtered by role"""
        filters = {"college_id": str(college_id)}
        if role:
            filters["role"] = role
        
        return supabase_client.select("users", filters=filters)
    
    @staticmethod
    def create_student_profile(profile_data: StudentProfile) -> dict:
        """Create student profile"""
        profile_dict = profile_data.model_dump()
        profile_dict["user_id"] = str(profile_dict["user_id"])
        if profile_dict.get("department_id"):
            profile_dict["department_id"] = str(profile_dict["department_id"])
        if profile_dict.get("batch_id"):
            profile_dict["batch_id"] = str(profile_dict["batch_id"])
        if profile_dict.get("hostel_id"):
            profile_dict["hostel_id"] = str(profile_dict["hostel_id"])
        profile_dict["college_id"] = str(profile_dict["college_id"])
        
        return supabase_client.insert("student_profiles", profile_dict)
    
    @staticmethod
    def get_student_profile(user_id: UUID) -> Optional[dict]:
        """Get student profile"""
        return supabase_client.select_one("student_profiles", filters={"user_id": str(user_id)})
    
    @staticmethod
    def create_faculty_profile(profile_data: FacultyProfile) -> dict:
        """Create faculty profile"""
        profile_dict = profile_data.model_dump()
        profile_dict["user_id"] = str(profile_dict["user_id"])
        profile_dict["department_id"] = str(profile_dict["department_id"])
        profile_dict["college_id"] = str(profile_dict["college_id"])
        
        return supabase_client.insert("faculty_profiles", profile_dict)
    
    @staticmethod
    def get_faculty_profile(user_id: UUID) -> Optional[dict]:
        """Get faculty profile"""
        return supabase_client.select_one("faculty_profiles", filters={"user_id": str(user_id)})



