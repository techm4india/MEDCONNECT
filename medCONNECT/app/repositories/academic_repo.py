"""
Academic repository for database operations
"""
from typing import Optional, List
from uuid import UUID
from app.db.supabase import supabase_client
from app.models.academic import (
    SubjectCreate, SubjectUpdate,
    CurriculumModuleCreate, CurriculumModuleUpdate,
    LearningResourceCreate, LearningResourceUpdate,
    StudentModuleProgressCreate, StudentModuleProgressUpdate,
    TopicAllocationCreate,
    FacultyAttendanceCreate, FacultyAttendanceUpdate
)
from app.core.exceptions import NotFoundError


class AcademicRepository:
    """Repository for academic operations"""
    
    # Subjects
    @staticmethod
    def create_subject(subject_data: SubjectCreate) -> dict:
        """Create a subject"""
        subject_dict = subject_data.model_dump()
        subject_dict["college_id"] = str(subject_dict["college_id"])
        return supabase_client.insert("subjects", subject_dict)
    
    @staticmethod
    def get_subject(subject_id: UUID) -> Optional[dict]:
        """Get subject by ID"""
        return supabase_client.select_one("subjects", filters={"id": str(subject_id)})
    
    @staticmethod
    def get_subjects_by_college(college_id: UUID, year: Optional[int] = None) -> List[dict]:
        """Get subjects for a college"""
        filters = {"college_id": str(college_id)}
        if year:
            filters["year"] = year
        return supabase_client.select("subjects", filters=filters, order_by="name")
    
    @staticmethod
    def update_subject(subject_id: UUID, subject_data: SubjectUpdate) -> dict:
        """Update subject"""
        update_dict = subject_data.model_dump(exclude_unset=True)
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("subjects", update_dict, filters={"id": str(subject_id)})
        if not result:
            raise NotFoundError("Subject not found")
        return result
    
    # Curriculum Modules
    @staticmethod
    def create_module(module_data: CurriculumModuleCreate) -> dict:
        """Create a curriculum module"""
        module_dict = module_data.model_dump()
        module_dict["subject_id"] = str(module_dict["subject_id"])
        module_dict["college_id"] = str(module_dict["college_id"])
        # Ensure NMC fields are properly set
        if "nmc_competency_codes" in module_dict:
            module_dict["nmc_competency_codes"] = module_dict["nmc_competency_codes"] or []
        return supabase_client.insert("curriculum_modules", module_dict)
    
    @staticmethod
    def get_module(module_id: UUID) -> Optional[dict]:
        """Get module by ID"""
        return supabase_client.select_one("curriculum_modules", filters={"id": str(module_id)})
    
    @staticmethod
    def get_modules_by_subject(subject_id: UUID) -> List[dict]:
        """Get modules for a subject"""
        return supabase_client.select(
            "curriculum_modules",
            filters={"subject_id": str(subject_id)},
            order_by="module_number"
        )
    
    @staticmethod
    def update_module(module_id: UUID, module_data: CurriculumModuleUpdate) -> dict:
        """Update module"""
        update_dict = module_data.model_dump(exclude_unset=True)
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "curriculum_modules",
            update_dict,
            filters={"id": str(module_id)}
        )
        if not result:
            raise NotFoundError("Module not found")
        return result
    
    # Learning Resources
    @staticmethod
    def create_resource(resource_data: LearningResourceCreate) -> dict:
        """Create a learning resource"""
        resource_dict = resource_data.model_dump()
        resource_dict["module_id"] = str(resource_dict["module_id"])
        resource_dict["resource_type"] = resource_dict["resource_type"].value
        resource_dict["college_id"] = str(resource_dict["college_id"])
        # Handle 3D resource fields
        if resource_dict.get("viewer_type") is None and resource_dict["resource_type"] == "3d":
            # Default viewer type for 3D resources
            resource_dict["viewer_type"] = "anatomy"
        return supabase_client.insert("learning_resources", resource_dict)
    
    @staticmethod
    def get_resource(resource_id: UUID) -> Optional[dict]:
        """Get resource by ID"""
        return supabase_client.select_one("learning_resources", filters={"id": str(resource_id)})
    
    @staticmethod
    def get_resources_by_module(module_id: UUID) -> List[dict]:
        """Get resources for a module"""
        return supabase_client.select(
            "learning_resources",
            filters={"module_id": str(module_id)},
            order_by="order_index"
        )
    
    @staticmethod
    def update_resource(resource_id: UUID, resource_data: LearningResourceUpdate) -> dict:
        """Update resource"""
        update_dict = resource_data.model_dump(exclude_unset=True)
        if update_dict.get("resource_type"):
            update_dict["resource_type"] = update_dict["resource_type"].value
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "learning_resources",
            update_dict,
            filters={"id": str(resource_id)}
        )
        if not result:
            raise NotFoundError("Resource not found")
        return result
    
    # Student Progress
    @staticmethod
    def create_progress(progress_data: StudentModuleProgressCreate) -> dict:
        """Create student progress"""
        progress_dict = progress_data.model_dump()
        progress_dict["student_id"] = str(progress_dict["student_id"])
        progress_dict["module_id"] = str(progress_dict["module_id"])
        progress_dict["resources_completed"] = [str(r) for r in progress_dict["resources_completed"]]
        progress_dict["college_id"] = str(progress_dict["college_id"])
        return supabase_client.insert("student_module_progress", progress_dict)
    
    @staticmethod
    def get_progress(student_id: UUID, module_id: UUID) -> Optional[dict]:
        """Get student progress for a module"""
        return supabase_client.select_one(
            "student_module_progress",
            filters={"student_id": str(student_id), "module_id": str(module_id)}
        )
    
    @staticmethod
    def get_student_progress(student_id: UUID) -> List[dict]:
        """Get all progress for a student"""
        return supabase_client.select(
            "student_module_progress",
            filters={"student_id": str(student_id)}
        )
    
    @staticmethod
    def update_progress(progress_id: UUID, progress_data: StudentModuleProgressUpdate) -> dict:
        """Update progress"""
        update_dict = progress_data.model_dump(exclude_unset=True)
        if update_dict.get("resources_completed"):
            update_dict["resources_completed"] = [str(r) for r in update_dict["resources_completed"]]
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "student_module_progress",
            update_dict,
            filters={"id": str(progress_id)}
        )
        if not result:
            raise NotFoundError("Progress not found")
        return result
    
    # Topic Allocations
    @staticmethod
    def create_topic_allocation(allocation_data: TopicAllocationCreate) -> dict:
        """Create topic allocation"""
        allocation_dict = allocation_data.model_dump()
        allocation_dict["module_id"] = str(allocation_dict["module_id"])
        allocation_dict["batch_id"] = str(allocation_dict["batch_id"])
        allocation_dict["faculty_id"] = str(allocation_dict["faculty_id"])
        allocation_dict["college_id"] = str(allocation_dict["college_id"])
        return supabase_client.insert("topic_allocations", allocation_dict)
    
    @staticmethod
    def get_allocations_by_faculty(faculty_id: UUID) -> List[dict]:
        """Get allocations for a faculty"""
        return supabase_client.select(
            "topic_allocations",
            filters={"faculty_id": str(faculty_id)}
        )
    
    @staticmethod
    def get_allocations_by_student(student_id: UUID) -> List[dict]:
        """Get allocations for a student (via batch)"""
        # First get student's batch_id from student_profiles
        from app.repositories.user_repo import UserRepository
        student_profile = UserRepository.get_student_profile(student_id)
        if not student_profile or not student_profile.get("batch_id"):
            return []
        
        batch_id = student_profile["batch_id"]
        return supabase_client.select(
            "topic_allocations",
            filters={"batch_id": str(batch_id)}
        )
    
    @staticmethod
    def get_allocations_by_topic(topic_id: UUID) -> List[dict]:
        """Get allocations for a topic/module"""
        return supabase_client.select(
            "topic_allocations",
            filters={"module_id": str(topic_id)}
        )
    
    @staticmethod
    def get_allocations_by_college(college_id: UUID) -> List[dict]:
        """Get all allocations for a college"""
        return supabase_client.select(
            "topic_allocations",
            filters={"college_id": str(college_id)},
            order_by="created_at"
        )
    
    # Faculty Attendance
    @staticmethod
    def create_faculty_attendance(attendance_data: FacultyAttendanceCreate) -> dict:
        """Create faculty attendance record"""
        attendance_dict = attendance_data.model_dump()
        attendance_dict["faculty_id"] = str(attendance_dict["faculty_id"])
        attendance_dict["session_id"] = str(attendance_dict["session_id"])
        if attendance_dict.get("verified_by"):
            attendance_dict["verified_by"] = str(attendance_dict["verified_by"])
        attendance_dict["status"] = attendance_dict["status"].value
        attendance_dict["college_id"] = str(attendance_dict["college_id"])
        return supabase_client.insert("faculty_attendance", attendance_dict)
    
    @staticmethod
    def get_faculty_attendance(attendance_id: UUID) -> Optional[dict]:
        """Get faculty attendance by ID"""
        return supabase_client.select_one("faculty_attendance", filters={"id": str(attendance_id)})
    
    @staticmethod
    def get_attendance_by_faculty(faculty_id: UUID) -> List[dict]:
        """Get attendance records for a faculty member"""
        return supabase_client.select(
            "faculty_attendance",
            filters={"faculty_id": str(faculty_id)},
            order_by="attendance_date"
        )
    
    @staticmethod
    def get_attendance_by_department(department_id: UUID, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[dict]:
        """Get attendance records for all faculty in a department"""
        # Get all faculty profiles in the department
        faculty_profiles = supabase_client.select(
            "faculty_profiles",
            filters={"department_id": str(department_id)}
        )
        faculty_ids = [f["user_id"] for f in faculty_profiles]
        
        if not faculty_ids:
            return []
        
        # Get attendance for these faculty
        # Note: supabase_client.select with list filter needs special handling
        attendance_records = []
        for faculty_id in faculty_ids:
            records = supabase_client.select(
                "faculty_attendance",
                filters={"faculty_id": str(faculty_id)},
                order_by="attendance_date"
            )
            attendance_records.extend(records)
        
        # Filter by date range if provided
        if start_date or end_date:
            filtered = []
            for record in attendance_records:
                record_date = record.get("attendance_date", "")
                if start_date and record_date < start_date:
                    continue
                if end_date and record_date > end_date:
                    continue
                filtered.append(record)
            return filtered
        
        return attendance_records
    
    @staticmethod
    def update_faculty_attendance(attendance_id: UUID, attendance_data: FacultyAttendanceUpdate) -> dict:
        """Update faculty attendance"""
        update_dict = attendance_data.model_dump(exclude_unset=True)
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value
        if update_dict.get("verified_by"):
            update_dict["verified_by"] = str(update_dict["verified_by"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("faculty_attendance", update_dict, filters={"id": str(attendance_id)})
        if not result:
            raise NotFoundError("Faculty attendance not found")
        return result



