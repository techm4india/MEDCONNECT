"""
Hostel repository for database operations
"""
from typing import Optional, List
from uuid import UUID
from app.db.supabase import supabase_client
from app.models.hostel import (
    HostelCreate, HostelUpdate,
    RoomCreate, RoomUpdate,
    HostelAllocationCreate, HostelAllocationUpdate,
    VisitorLogCreate, VisitorLogUpdate,
    MovementLogCreate,
    MessAttendanceCreate
)
from app.core.exceptions import NotFoundError


class HostelRepository:
    """Repository for hostel operations"""
    
    # Hostels
    @staticmethod
    def create_hostel(hostel_data: HostelCreate) -> dict:
        """Create a hostel"""
        hostel_dict = hostel_data.model_dump()
        if hostel_dict.get("warden_id"):
            hostel_dict["warden_id"] = str(hostel_dict["warden_id"])
        hostel_dict["college_id"] = str(hostel_dict["college_id"])
        return supabase_client.insert("hostels", hostel_dict)
    
    @staticmethod
    def get_hostel(hostel_id: UUID) -> Optional[dict]:
        """Get hostel by ID"""
        return supabase_client.select_one("hostels", filters={"id": str(hostel_id)})
    
    @staticmethod
    def get_hostels_by_college(college_id: UUID) -> List[dict]:
        """Get hostels for a college"""
        return supabase_client.select("hostels", filters={"college_id": str(college_id)})
    
    @staticmethod
    def update_hostel(hostel_id: UUID, hostel_data: HostelUpdate) -> dict:
        """Update hostel"""
        update_dict = hostel_data.model_dump(exclude_unset=True)
        if update_dict.get("warden_id"):
            update_dict["warden_id"] = str(update_dict["warden_id"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("hostels", update_dict, filters={"id": str(hostel_id)})
        if not result:
            raise NotFoundError("Hostel not found")
        return result
    
    # Rooms
    @staticmethod
    def create_room(room_data: RoomCreate) -> dict:
        """Create a room"""
        room_dict = room_data.model_dump()
        room_dict["hostel_id"] = str(room_dict["hostel_id"])
        room_dict["status"] = room_dict["status"].value
        room_dict["college_id"] = str(room_dict["college_id"])
        return supabase_client.insert("rooms", room_dict)
    
    @staticmethod
    def get_room(room_id: UUID) -> Optional[dict]:
        """Get room by ID"""
        return supabase_client.select_one("rooms", filters={"id": str(room_id)})
    
    @staticmethod
    def get_rooms_by_hostel(hostel_id: UUID) -> List[dict]:
        """Get rooms for a hostel"""
        return supabase_client.select("rooms", filters={"hostel_id": str(hostel_id)})
    
    @staticmethod
    def update_room(room_id: UUID, room_data: RoomUpdate) -> dict:
        """Update room"""
        update_dict = room_data.model_dump(exclude_unset=True)
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update("rooms", update_dict, filters={"id": str(room_id)})
        if not result:
            raise NotFoundError("Room not found")
        return result
    
    # Allocations
    @staticmethod
    def create_allocation(allocation_data: HostelAllocationCreate) -> dict:
        """Create hostel allocation"""
        allocation_dict = allocation_data.model_dump()
        allocation_dict["student_id"] = str(allocation_dict["student_id"])
        allocation_dict["room_id"] = str(allocation_dict["room_id"])
        allocation_dict["hostel_id"] = str(allocation_dict["hostel_id"])
        allocation_dict["college_id"] = str(allocation_dict["college_id"])
        return supabase_client.insert("hostel_allocations", allocation_dict)
    
    @staticmethod
    def get_allocation_by_student(student_id: UUID) -> Optional[dict]:
        """Get active allocation for a student"""
        allocations = supabase_client.select(
            "hostel_allocations",
            filters={"student_id": str(student_id), "is_active": True}
        )
        return allocations[0] if allocations else None
    
    @staticmethod
    def update_allocation(allocation_id: UUID, allocation_data: HostelAllocationUpdate) -> dict:
        """Update allocation"""
        update_dict = allocation_data.model_dump(exclude_unset=True)
        if update_dict.get("room_id"):
            update_dict["room_id"] = str(update_dict["room_id"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "hostel_allocations",
            update_dict,
            filters={"id": str(allocation_id)}
        )
        if not result:
            raise NotFoundError("Allocation not found")
        return result
    
    # Visitor Logs
    @staticmethod
    def create_visitor_log(visitor_data: VisitorLogCreate) -> dict:
        """Create visitor log"""
        visitor_dict = visitor_data.model_dump()
        visitor_dict["student_id"] = str(visitor_dict["student_id"])
        if visitor_dict.get("approved_by"):
            visitor_dict["approved_by"] = str(visitor_dict["approved_by"])
        visitor_dict["status"] = visitor_dict["status"].value
        visitor_dict["college_id"] = str(visitor_dict["college_id"])
        return supabase_client.insert("visitor_logs", visitor_dict)
    
    @staticmethod
    def get_visitor_log(visitor_id: UUID) -> Optional[dict]:
        """Get visitor log by ID"""
        return supabase_client.select_one("visitor_logs", filters={"id": str(visitor_id)})
    
    @staticmethod
    def get_visitor_logs_by_student(student_id: UUID) -> List[dict]:
        """Get visitor logs for a student"""
        return supabase_client.select(
            "visitor_logs",
            filters={"student_id": str(student_id)},
            order_by="visit_date"
        )
    
    @staticmethod
    def update_visitor_log(visitor_id: UUID, visitor_data: VisitorLogUpdate) -> dict:
        """Update visitor log"""
        update_dict = visitor_data.model_dump(exclude_unset=True)
        if update_dict.get("status"):
            update_dict["status"] = update_dict["status"].value
        if update_dict.get("approved_by"):
            update_dict["approved_by"] = str(update_dict["approved_by"])
        if not update_dict:
            raise ValueError("No fields to update")
        
        result = supabase_client.update(
            "visitor_logs",
            update_dict,
            filters={"id": str(visitor_id)}
        )
        if not result:
            raise NotFoundError("Visitor log not found")
        return result
    
    # Movement Logs
    @staticmethod
    def create_movement_log(movement_data: MovementLogCreate) -> dict:
        """Create movement log"""
        movement_dict = movement_data.model_dump()
        movement_dict["student_id"] = str(movement_dict["student_id"])
        movement_dict["college_id"] = str(movement_dict["college_id"])
        return supabase_client.insert("movement_logs", movement_dict)
    
    @staticmethod
    def get_movement_logs_by_student(student_id: UUID) -> List[dict]:
        """Get movement logs for a student"""
        return supabase_client.select(
            "movement_logs",
            filters={"student_id": str(student_id)},
            order_by="timestamp"
        )
    
    # Mess Attendance
    @staticmethod
    def create_mess_attendance(attendance_data: MessAttendanceCreate) -> dict:
        """Create mess attendance"""
        attendance_dict = attendance_data.model_dump()
        attendance_dict["student_id"] = str(attendance_dict["student_id"])
        attendance_dict["college_id"] = str(attendance_dict["college_id"])
        return supabase_client.insert("mess_attendance", attendance_dict)
    
    @staticmethod
    def get_mess_attendance_by_student(student_id: UUID, date: str = None) -> List[dict]:
        """Get mess attendance for a student"""
        filters = {"student_id": str(student_id)}
        if date:
            filters["attendance_date"] = date
        return supabase_client.select("mess_attendance", filters=filters)





