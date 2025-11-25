"""
Governance repository for database operations
"""
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.db.supabase import supabase_client
from app.models.governance import GovernanceSnapshotCreate
from app.core.exceptions import NotFoundError


class GovernanceRepository:
    """Repository for governance operations"""
    
    @staticmethod
    def create_snapshot(snapshot_data: GovernanceSnapshotCreate) -> dict:
        """Create governance snapshot"""
        snapshot_dict = snapshot_data.model_dump()
        snapshot_dict["college_id"] = str(snapshot_dict["college_id"])
        if snapshot_dict.get("created_by"):
            snapshot_dict["created_by"] = str(snapshot_dict["created_by"])
        return supabase_client.insert("governance_snapshots", snapshot_dict)
    
    @staticmethod
    def get_snapshot(snapshot_id: UUID) -> Optional[dict]:
        """Get snapshot by ID"""
        return supabase_client.select_one("governance_snapshots", filters={"id": str(snapshot_id)})
    
    @staticmethod
    def get_snapshots_by_college(college_id: UUID, snapshot_type: Optional[str] = None) -> List[dict]:
        """Get snapshots for a college"""
        filters = {"college_id": str(college_id)}
        if snapshot_type:
            filters["snapshot_type"] = snapshot_type
        return supabase_client.select(
            "governance_snapshots",
            filters=filters,
            order_by="snapshot_date"
        )
    
    @staticmethod
    def get_user_count_by_college(college_id: UUID, role: Optional[str] = None) -> int:
        """Get user count for a college"""
        filters = {"college_id": str(college_id), "is_active": True}
        if role:
            filters["role"] = role
        return supabase_client.count("users", filters=filters)
    
    @staticmethod
    def get_active_postings_count(college_id: UUID) -> int:
        """Get count of active postings"""
        return supabase_client.count(
            "postings",
            filters={"college_id": str(college_id), "status": "active"}
        )
    
    @staticmethod
    def get_pending_logbooks_count(college_id: UUID) -> int:
        """Get count of pending logbook entries"""
        return supabase_client.count(
            "clinical_logbooks",
            filters={"college_id": str(college_id), "status": "submitted"}
        )
    
    @staticmethod
    def get_attendance_rate(college_id: UUID, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> float:
        """Calculate overall attendance rate"""
        # Get all attendance records
        filters = {"college_id": str(college_id)}
        if start_date:
            filters["attendance_date"] = {"gte": start_date.isoformat()}
        if end_date:
            filters["attendance_date"] = {"lte": end_date.isoformat()}
        
        attendance_records = supabase_client.select("attendance", filters=filters)
        
        if not attendance_records:
            return 0.0
        
        total = len(attendance_records)
        present = len([r for r in attendance_records if r.get("status") == "present"])
        
        return (present / total * 100) if total > 0 else 0.0
    
    @staticmethod
    def get_pending_certificates_count(college_id: UUID) -> int:
        """Get count of pending certificate requests"""
        return supabase_client.count(
            "certificates",
            filters={"college_id": str(college_id), "status": "pending"}
        )
    
    @staticmethod
    def get_upcoming_events_count(college_id: UUID) -> int:
        """Get count of upcoming events"""
        from datetime import datetime
        now = datetime.utcnow().isoformat()
        events = supabase_client.select(
            "events",
            filters={"college_id": str(college_id)},
            order_by="start_date"
        )
        # Filter events where start_date > now
        upcoming = [e for e in events if e.get("start_date") and e["start_date"] > now]
        return len(upcoming)
    
    @staticmethod
    def get_department_stats(college_id: UUID) -> Dict[str, Any]:
        """Get department-wise statistics"""
        departments = supabase_client.select("departments", filters={"college_id": str(college_id)})
        
        stats = {}
        for dept in departments:
            dept_id = dept["id"]
            stats[dept["name"]] = {
                "total_students": supabase_client.count(
                    "student_profiles",
                    filters={"department_id": str(dept_id)}
                ),
                "total_faculty": supabase_client.count(
                    "faculty_profiles",
                    filters={"department_id": str(dept_id)}
                ),
                "active_postings": supabase_client.count(
                    "postings",
                    filters={"department_id": str(dept_id), "status": "active"}
                )
            }
        
        return stats
    
    @staticmethod
    def get_clinical_exposure_stats(college_id: UUID) -> Dict[str, Any]:
        """Get clinical exposure statistics"""
        logbooks = supabase_client.select(
            "clinical_logbooks",
            filters={"college_id": str(college_id)}
        )
        
        total_cases = len(logbooks)
        verified_cases = len([l for l in logbooks if l.get("status") == "verified"])
        
        # Get posting completion rate
        postings = supabase_client.select(
            "postings",
            filters={"college_id": str(college_id)}
        )
        total_postings = len(postings)
        completed_postings = len([p for p in postings if p.get("status") == "completed"])
        completion_rate = (completed_postings / total_postings * 100) if total_postings > 0 else 0.0
        
        return {
            "total_cases_logged": total_cases,
            "verified_cases": verified_cases,
            "posting_completion_rate": completion_rate
        }
    
    @staticmethod
    def get_academic_performance_stats(college_id: UUID) -> Dict[str, Any]:
        """Get academic performance statistics"""
        progress_records = supabase_client.select(
            "student_module_progress",
            filters={"college_id": str(college_id)}
        )
        
        if not progress_records:
            return {
                "module_completion_rates": {},
                "average_completion": 0.0
            }
        
        # Calculate average completion
        total_completion = sum(p.get("completion_percentage", 0) for p in progress_records)
        avg_completion = total_completion / len(progress_records) if progress_records else 0.0
        
        return {
            "module_completion_rates": {},
            "average_completion": avg_completion,
            "total_students_with_progress": len(set(p["student_id"] for p in progress_records))
        }




