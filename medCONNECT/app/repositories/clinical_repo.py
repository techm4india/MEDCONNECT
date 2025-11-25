"""
Clinical repository for database operations
"""
from typing import Optional, List
from uuid import UUID
from app.db.supabase import supabase_client
from app.models.clinical import (
    PostingCreate, PostingUpdate,
    ClinicalLogbookEntryCreate, ClinicalLogbookEntryUpdate,
    OPDSessionCreate, OPDSessionUpdate,
    OPDSessionStudentInvolvementCreate
)
from app.core.exceptions import NotFoundError


class ClinicalRepository:
    """Repository for clinical operations"""
    
    # Postings
    @staticmethod
    def create_posting(posting_data: PostingCreate) -> dict:
        """Create a posting"""
        posting_dict = posting_data.model_dump()
        posting_dict["student_id"] = str(posting_dict["student_id"])
        posting_dict["department_id"] = str(posting_dict["department_id"])
        if posting_dict.get("supervisor_id"):
            posting_dict["supervisor_id"] = str(posting_dict["supervisor_id"])
        posting_dict["status"] = posting_dict["status"].value
        posting_dict["college_id"] = str(posting_dict["college_id"])
        return supabase_client.insert("postings", posting_dict)
    
    @staticmethod
    def get_posting(posting_id: UUID) -> Optional[dict]:
        """Get posting by ID"""
        return supabase_client.select_one("postings", filters={"id": str(posting_id)})
    
    @staticmethod
    def get_postings_by_student(student_id: UUID) -> List[dict]:
        """Get postings for a student"""
        return supabase_client.select(
            "postings",
            filters={"student_id": str(student_id)},
            order_by="start_date"
        )
    
    @staticmethod
    def get_postings_by_department(department_id: UUID) -> List[dict]:
        """Get postings for a department"""
        return supabase_client.select(
            "postings",
            filters={"department_id": str(department_id)},
            order_by="start_date"
        )
    
    @staticmethod
    def update_posting(posting_id: UUID, posting_data: PostingUpdate) -> dict:
        """Update posting"""
        update_dict = posting_data.model_dump(exclude_unset=True)
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value
        if update_dict.get("department_id"):
            update_dict["department_id"] = str(update_dict["department_id"])
        if update_dict.get("supervisor_id"):
            update_dict["supervisor_id"] = str(update_dict["supervisor_id"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("postings", update_dict, filters={"id": str(posting_id)})
        if not result:
            raise NotFoundError("Posting not found")
        return result
    
    # Clinical Logbooks
    @staticmethod
    def create_logbook_entry(entry_data: ClinicalLogbookEntryCreate) -> dict:
        """Create a logbook entry"""
        entry_dict = entry_data.model_dump()
        entry_dict["student_id"] = str(entry_dict["student_id"])
        entry_dict["posting_id"] = str(entry_dict["posting_id"])
        if entry_dict.get("verified_by"):
            entry_dict["verified_by"] = str(entry_dict["verified_by"])
        entry_dict["status"] = entry_dict["status"].value
        entry_dict["college_id"] = str(entry_dict["college_id"])
        return supabase_client.insert("clinical_logbooks", entry_dict)
    
    @staticmethod
    def get_logbook_entry(entry_id: UUID) -> Optional[dict]:
        """Get logbook entry by ID"""
        return supabase_client.select_one("clinical_logbooks", filters={"id": str(entry_id)})
    
    @staticmethod
    def get_logbook_entries_by_student(student_id: UUID) -> List[dict]:
        """Get logbook entries for a student"""
        return supabase_client.select(
            "clinical_logbooks",
            filters={"student_id": str(student_id)},
            order_by="created_at"
        )
    
    @staticmethod
    def get_logbook_entries_by_college(college_id: UUID) -> List[dict]:
        """Get all logbook entries for a college"""
        return supabase_client.select(
            "clinical_logbooks",
            filters={"college_id": str(college_id)},
            order_by="created_at"
        )
    
    @staticmethod
    def get_logbook_entries_by_posting(posting_id: UUID) -> List[dict]:
        """Get logbook entries for a posting"""
        return supabase_client.select(
            "clinical_logbooks",
            filters={"posting_id": str(posting_id)}
        )
    
    @staticmethod
    def update_logbook_entry(entry_id: UUID, entry_data: ClinicalLogbookEntryUpdate) -> dict:
        """Update logbook entry"""
        from datetime import datetime
        
        update_dict = entry_data.model_dump(exclude_unset=True)
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value if hasattr(update_dict["status"], "value") else update_dict["status"]
        if update_dict.get("verified_by"):
            update_dict["verified_by"] = str(update_dict["verified_by"])
        if update_dict.get("verified_at"):
            # Ensure verified_at is in ISO format if it's a datetime object
            if isinstance(update_dict["verified_at"], datetime):
                update_dict["verified_at"] = update_dict["verified_at"].isoformat()
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "clinical_logbooks",
            update_dict,
            filters={"id": str(entry_id)}
        )
        if not result:
            raise NotFoundError("Logbook entry not found")
        return result
    
    # OPD Sessions
    @staticmethod
    def create_opd_session(session_data: OPDSessionCreate) -> dict:
        """Create an OPD session"""
        session_dict = session_data.model_dump()
        session_dict["department_id"] = str(session_dict["department_id"])
        session_dict["faculty_id"] = str(session_dict["faculty_id"])
        session_dict["students_present"] = [str(s) for s in session_dict["students_present"]]
        session_dict["college_id"] = str(session_dict["college_id"])
        return supabase_client.insert("opd_sessions", session_dict)
    
    @staticmethod
    def get_opd_session(session_id: UUID) -> Optional[dict]:
        """Get OPD session by ID"""
        return supabase_client.select_one("opd_sessions", filters={"id": str(session_id)})
    
    @staticmethod
    def get_opd_sessions_by_department(department_id: UUID) -> List[dict]:
        """Get OPD sessions for a department"""
        return supabase_client.select(
            "opd_sessions",
            filters={"department_id": str(department_id)},
            order_by="session_date"
        )
    
    @staticmethod
    def update_opd_session(session_id: UUID, session_data: OPDSessionUpdate) -> dict:
        """Update OPD session"""
        update_dict = session_data.model_dump(exclude_unset=True)
        if update_dict.get("students_present"):
            update_dict["students_present"] = [str(s) for s in update_dict["students_present"]]
        if update_dict.get("faculty_id"):
            update_dict["faculty_id"] = str(update_dict["faculty_id"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "opd_sessions",
            update_dict,
            filters={"id": str(session_id)}
        )
        if not result:
            raise NotFoundError("OPD session not found")
        return result
    
    # OPD Student Involvement
    @staticmethod
    def create_opd_involvement(involvement_data: OPDSessionStudentInvolvementCreate) -> dict:
        """Create OPD student involvement"""
        involvement_dict = involvement_data.model_dump()
        involvement_dict["session_id"] = str(involvement_dict["session_id"])
        involvement_dict["student_id"] = str(involvement_dict["student_id"])
        involvement_dict["college_id"] = str(involvement_dict["college_id"])
        return supabase_client.insert("opd_student_involvement", involvement_dict)
    
    @staticmethod
    def get_involvement_by_session(session_id: UUID) -> List[dict]:
        """Get involvement records for a session"""
        return supabase_client.select(
            "opd_student_involvement",
            filters={"session_id": str(session_id)}
        )



