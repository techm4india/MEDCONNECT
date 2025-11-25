"""
College and department repository
"""
from typing import Optional, List
from uuid import UUID
from app.db.supabase import supabase_client
from app.models.college import CollegeCreate, CollegeUpdate, DepartmentCreate, DepartmentUpdate
from app.core.exceptions import NotFoundError


class CollegeRepository:
    """Repository for college and department operations"""
    
    # Colleges
    @staticmethod
    def create_college(college_data: CollegeCreate) -> dict:
        """Create a college"""
        college_dict = college_data.model_dump()
        if college_dict.get("principal_id"):
            college_dict["principal_id"] = str(college_dict["principal_id"])
        return supabase_client.insert("colleges", college_dict)
    
    @staticmethod
    def get_college(college_id: UUID) -> Optional[dict]:
        """Get college by ID"""
        return supabase_client.select_one("colleges", filters={"id": str(college_id)})
    
    @staticmethod
    def get_all_colleges() -> List[dict]:
        """Get all colleges"""
        return supabase_client.select("colleges", order_by="name")
    
    @staticmethod
    def update_college(college_id: UUID, college_data: CollegeUpdate) -> dict:
        """Update college"""
        update_dict = college_data.model_dump(exclude_unset=True)
        if update_dict.get("principal_id"):
            update_dict["principal_id"] = str(update_dict["principal_id"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("colleges", update_dict, filters={"id": str(college_id)})
        if not result:
            raise NotFoundError("College not found")
        return result
    
    # Departments
    @staticmethod
    def create_department(department_data: DepartmentCreate) -> dict:
        """Create a department"""
        department_dict = department_data.model_dump()
        department_dict["college_id"] = str(department_dict["college_id"])
        if department_dict.get("hod_id"):
            department_dict["hod_id"] = str(department_dict["hod_id"])
        return supabase_client.insert("departments", department_dict)
    
    @staticmethod
    def get_department(department_id: UUID) -> Optional[dict]:
        """Get department by ID"""
        return supabase_client.select_one("departments", filters={"id": str(department_id)})
    
    @staticmethod
    def get_departments_by_college(college_id: UUID) -> List[dict]:
        """Get departments for a college"""
        return supabase_client.select(
            "departments",
            filters={"college_id": str(college_id)},
            order_by="name"
        )
    
    @staticmethod
    def update_department(department_id: UUID, department_data: DepartmentUpdate) -> dict:
        """Update department"""
        update_dict = department_data.model_dump(exclude_unset=True)
        if update_dict.get("hod_id"):
            update_dict["hod_id"] = str(update_dict["hod_id"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("departments", update_dict, filters={"id": str(department_id)})
        if not result:
            raise NotFoundError("Department not found")
        return result




