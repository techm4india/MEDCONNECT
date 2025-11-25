"""
Admin repository for database operations
"""
from typing import Optional, List
from uuid import UUID
from app.db.supabase import supabase_client
from app.models.admin import (
    AttendanceCreate, AttendanceUpdate,
    AttendanceSessionCreate,
    CertificateRequestCreate, CertificateRequestUpdate,
    NoticeCreate, NoticeUpdate,
    EventCreate, EventUpdate,
    EventRegistrationCreate,
    FeeCreate, FeeUpdate
)
from app.core.exceptions import NotFoundError


class AdminRepository:
    """Repository for admin operations"""
    
    # Attendance
    @staticmethod
    def create_attendance(attendance_data: AttendanceCreate) -> dict:
        """Create attendance record"""
        attendance_dict = attendance_data.model_dump()
        attendance_dict["student_id"] = str(attendance_dict["student_id"])
        attendance_dict["session_id"] = str(attendance_dict["session_id"])
        if attendance_dict.get("verified_by"):
            attendance_dict["verified_by"] = str(attendance_dict["verified_by"])
        attendance_dict["status"] = attendance_dict["status"].value
        attendance_dict["college_id"] = str(attendance_dict["college_id"])
        return supabase_client.insert("attendance", attendance_dict)
    
    @staticmethod
    def get_attendance(attendance_id: UUID) -> Optional[dict]:
        """Get attendance by ID"""
        return supabase_client.select_one("attendance", filters={"id": str(attendance_id)})
    
    @staticmethod
    def get_attendance_by_student(student_id: UUID) -> List[dict]:
        """Get attendance records for a student"""
        return supabase_client.select(
            "attendance",
            filters={"student_id": str(student_id)},
            order_by="attendance_date"
        )
    
    @staticmethod
    def update_attendance(attendance_id: UUID, attendance_data: AttendanceUpdate) -> dict:
        """Update attendance"""
        update_dict = attendance_data.model_dump(exclude_unset=True)
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value
        if update_dict.get("verified_by"):
            update_dict["verified_by"] = str(update_dict["verified_by"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("attendance", update_dict, filters={"id": str(attendance_id)})
        if not result:
            raise NotFoundError("Attendance not found")
        return result
    
    # Attendance Sessions
    @staticmethod
    def create_attendance_session(session_data: AttendanceSessionCreate) -> dict:
        """Create attendance session"""
        session_dict = session_data.model_dump()
        session_dict["created_by"] = str(session_dict["created_by"])
        session_dict["college_id"] = str(session_dict["college_id"])
        return supabase_client.insert("attendance_sessions", session_dict)
    
    @staticmethod
    def get_attendance_session(session_id: UUID) -> Optional[dict]:
        """Get attendance session by ID"""
        return supabase_client.select_one("attendance_sessions", filters={"id": str(session_id)})
    
    # Certificates
    @staticmethod
    def create_certificate_request(cert_data: CertificateRequestCreate) -> dict:
        """Create certificate request"""
        cert_dict = cert_data.model_dump()
        cert_dict["student_id"] = str(cert_dict["student_id"])
        if cert_dict.get("approved_by"):
            cert_dict["approved_by"] = str(cert_dict["approved_by"])
        cert_dict["certificate_type"] = cert_dict["certificate_type"].value
        cert_dict["status"] = cert_dict["status"].value
        cert_dict["college_id"] = str(cert_dict["college_id"])
        return supabase_client.insert("certificates", cert_dict)
    
    @staticmethod
    def get_certificate_request(cert_id: UUID) -> Optional[dict]:
        """Get certificate request by ID"""
        return supabase_client.select_one("certificates", filters={"id": str(cert_id)})
    
    @staticmethod
    def get_certificates_by_student(student_id: UUID) -> List[dict]:
        """Get certificate requests for a student"""
        return supabase_client.select(
            "certificates",
            filters={"student_id": str(student_id)},
            order_by="created_at"
        )
    
    @staticmethod
    def get_certificates_by_college(college_id: UUID) -> List[dict]:
        """Get all certificate requests for a college"""
        return supabase_client.select(
            "certificates",
            filters={"college_id": str(college_id)},
            order_by="created_at"
        )
    
    @staticmethod
    def update_certificate_request(cert_id: UUID, cert_data: CertificateRequestUpdate) -> dict:
        """Update certificate request"""
        update_dict = cert_data.model_dump(exclude_unset=True)
        if update_dict.get("certificate_type"):
            update_dict["certificate_type"] = update_dict["certificate_type"].value
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value
        if update_dict.get("approved_by"):
            update_dict["approved_by"] = str(update_dict["approved_by"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("certificates", update_dict, filters={"id": str(cert_id)})
        if not result:
            raise NotFoundError("Certificate request not found")
        return result
    
    # Notices
    @staticmethod
    def create_notice(notice_data: NoticeCreate) -> dict:
        """Create notice"""
        notice_dict = notice_data.model_dump()
        notice_dict["created_by"] = str(notice_dict["created_by"])
        notice_dict["college_id"] = str(notice_dict["college_id"])
        return supabase_client.insert("notices", notice_dict)
    
    @staticmethod
    def get_notice(notice_id: UUID) -> Optional[dict]:
        """Get notice by ID"""
        return supabase_client.select_one("notices", filters={"id": str(notice_id)})
    
    @staticmethod
    def get_notices_by_college(college_id: UUID) -> List[dict]:
        """Get notices for a college"""
        return supabase_client.select(
            "notices",
            filters={"college_id": str(college_id)},
            order_by="created_at"
        )
    
    @staticmethod
    def update_notice(notice_id: UUID, notice_data: NoticeUpdate) -> dict:
        """Update notice"""
        update_dict = notice_data.model_dump(exclude_unset=True)
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("notices", update_dict, filters={"id": str(notice_id)})
        if not result:
            raise NotFoundError("Notice not found")
        return result
    
    # Events
    @staticmethod
    def create_event(event_data: EventCreate) -> dict:
        """Create event"""
        event_dict = event_data.model_dump()
        event_dict["created_by"] = str(event_dict["created_by"])
        event_dict["college_id"] = str(event_dict["college_id"])
        return supabase_client.insert("events", event_dict)
    
    @staticmethod
    def get_event(event_id: UUID) -> Optional[dict]:
        """Get event by ID"""
        return supabase_client.select_one("events", filters={"id": str(event_id)})
    
    @staticmethod
    def get_events_by_college(college_id: UUID) -> List[dict]:
        """Get events for a college"""
        return supabase_client.select(
            "events",
            filters={"college_id": str(college_id)},
            order_by="start_date"
        )
    
    @staticmethod
    def update_event(event_id: UUID, event_data: EventUpdate) -> dict:
        """Update event"""
        update_dict = event_data.model_dump(exclude_unset=True)
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("events", update_dict, filters={"id": str(event_id)})
        if not result:
            raise NotFoundError("Event not found")
        return result
    
    # Event Registrations
    @staticmethod
    def create_event_registration(reg_data: EventRegistrationCreate) -> dict:
        """Create event registration"""
        reg_dict = reg_data.model_dump()
        reg_dict["event_id"] = str(reg_dict["event_id"])
        reg_dict["user_id"] = str(reg_dict["user_id"])
        reg_dict["college_id"] = str(reg_dict["college_id"])
        return supabase_client.insert("event_registrations", reg_dict)
    
    @staticmethod
    def get_registrations_by_event(event_id: UUID) -> List[dict]:
        """Get registrations for an event"""
        return supabase_client.select(
            "event_registrations",
            filters={"event_id": str(event_id)}
        )
    
    # Fees
    @staticmethod
    def create_fee(fee_data: FeeCreate) -> dict:
        """Create fee record"""
        fee_dict = fee_data.model_dump()
        fee_dict["student_id"] = str(fee_dict["student_id"])
        fee_dict["payment_status"] = fee_dict["payment_status"].value
        fee_dict["college_id"] = str(fee_dict["college_id"])
        return supabase_client.insert("fees", fee_dict)
    
    @staticmethod
    def get_fee(fee_id: UUID) -> Optional[dict]:
        """Get fee by ID"""
        return supabase_client.select_one("fees", filters={"id": str(fee_id)})
    
    @staticmethod
    def get_fees_by_student(student_id: UUID) -> List[dict]:
        """Get fees for a student"""
        return supabase_client.select(
            "fees",
            filters={"student_id": str(student_id)},
            order_by="due_date"
        )
    
    @staticmethod
    def update_fee(fee_id: UUID, fee_data: FeeUpdate) -> dict:
        """Update fee"""
        update_dict = fee_data.model_dump(exclude_unset=True)
        if update_dict.get("payment_status"):
            update_dict["payment_status"] = update_dict["payment_status"].value
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("fees", update_dict, filters={"id": str(fee_id)})
        if not result:
            raise NotFoundError("Fee not found")
        return result

