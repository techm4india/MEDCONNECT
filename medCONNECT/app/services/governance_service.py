"""
Governance service for analytics and dashboards
"""
from typing import Dict, Any
from uuid import UUID
from datetime import datetime, timedelta
from app.repositories.governance_repo import GovernanceRepository
from app.models.governance import (
    DashboardMetrics,
    AttendanceAnalytics,
    ClinicalExposureAnalytics,
    AcademicPerformanceAnalytics
)


class GovernanceService:
    """Service for governance operations"""
    
    @staticmethod
    def get_dashboard_metrics(college_id: UUID) -> DashboardMetrics:
        """Get dashboard metrics for governance"""
        repo = GovernanceRepository
        
        total_students = repo.get_user_count_by_college(college_id, role="student")
        total_faculty = repo.get_user_count_by_college(college_id, role="faculty")
        active_postings = repo.get_active_postings_count(college_id)
        pending_logbooks = repo.get_pending_logbooks_count(college_id)
        attendance_rate = repo.get_attendance_rate(college_id)
        pending_certificates = repo.get_pending_certificates_count(college_id)
        upcoming_events = repo.get_upcoming_events_count(college_id)
        department_stats = repo.get_department_stats(college_id)
        
        return DashboardMetrics(
            total_students=total_students,
            total_faculty=total_faculty,
            active_postings=active_postings,
            pending_logbooks=pending_logbooks,
            attendance_rate=attendance_rate,
            certificate_requests_pending=pending_certificates,
            upcoming_events=upcoming_events,
            department_wise_stats=department_stats
        )
    
    @staticmethod
    def get_attendance_analytics(college_id: UUID, days: int = 30) -> AttendanceAnalytics:
        """Get attendance analytics"""
        repo = GovernanceRepository
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        overall_rate = repo.get_attendance_rate(college_id, start_date, end_date)
        
        # Get department-wise attendance
        from app.db.supabase import supabase_client
        departments = supabase_client.select("departments", filters={"college_id": str(college_id)})
        
        dept_attendance = {}
        for dept in departments:
            # Get students in this department
            students = supabase_client.select(
                "student_profiles",
                filters={"department_id": str(dept["id"])}
            )
            if students:
                student_ids = [s["user_id"] for s in students]
                # Calculate attendance for these students
                attendance_records = supabase_client.select(
                    "attendance",
                    filters={"college_id": str(college_id)}
                )
                dept_attendance_records = [
                    a for a in attendance_records 
                    if a.get("student_id") in student_ids
                ]
                if dept_attendance_records:
                    total = len(dept_attendance_records)
                    present = len([a for a in dept_attendance_records if a.get("status") == "present"])
                    dept_attendance[dept["name"]] = (present / total * 100) if total > 0 else 0.0
        
        # Calculate daily attendance trends for the period
        attendance_trends = []
        if days <= 30:  # For short periods, calculate daily trends
            for i in range(days):
                day_start = end_date - timedelta(days=days - i)
                day_end = day_start + timedelta(days=1)
                day_records = supabase_client.select(
                    "attendance",
                    filters={"college_id": str(college_id)}
                )
                # Filter records for this day
                day_attendance = [
                    r for r in day_records
                    if r.get("attendance_date") and 
                    day_start.isoformat() <= r["attendance_date"] < day_end.isoformat()
                ]
                if day_attendance:
                    total = len(day_attendance)
                    present = len([r for r in day_attendance if r.get("status") == "present"])
                    rate = (present / total * 100) if total > 0 else 0.0
                    attendance_trends.append({
                        "date": day_start.strftime("%Y-%m-%d"),
                        "rate": rate
                    })
        else:  # For longer periods, calculate monthly trends
            from calendar import month_abbr
            for i in range(6):  # Last 6 months
                month_date = end_date - timedelta(days=30 * (6 - i))
                month_start = month_date.replace(day=1)
                if i < 5:
                    month_end = (month_start + timedelta(days=32)).replace(day=1)
                else:
                    month_end = end_date
                
                month_records = supabase_client.select(
                    "attendance",
                    filters={"college_id": str(college_id)}
                )
                month_attendance = [
                    r for r in month_records
                    if r.get("attendance_date") and 
                    month_start.isoformat() <= r["attendance_date"] < month_end.isoformat()
                ]
                if month_attendance:
                    total = len(month_attendance)
                    present = len([r for r in month_attendance if r.get("status") == "present"])
                    rate = (present / total * 100) if total > 0 else 0.0
                    attendance_trends.append({
                        "date": month_start.strftime("%Y-%m"),
                        "rate": rate,
                        "month": month_abbr[month_start.month]
                    })
        
        return AttendanceAnalytics(
            overall_attendance_rate=overall_rate,
            department_wise_attendance=dept_attendance,
            student_wise_attendance={},
            attendance_trends=attendance_trends,
            low_attendance_flags=[]
        )
    
    @staticmethod
    def get_clinical_analytics(college_id: UUID) -> ClinicalExposureAnalytics:
        """Get clinical exposure analytics"""
        repo = GovernanceRepository
        stats = repo.get_clinical_exposure_stats(college_id)
        
        # Get department-wise exposure
        from app.db.supabase import supabase_client
        departments = supabase_client.select("departments", filters={"college_id": str(college_id)})
        
        dept_exposure = {}
        for dept in departments:
            logbooks = supabase_client.select(
                "clinical_logbooks",
                filters={"college_id": str(college_id)}
            )
            # Filter by posting department
            postings = supabase_client.select(
                "postings",
                filters={"department_id": str(dept["id"])}
            )
            posting_ids = [p["id"] for p in postings]
            dept_logbooks = [l for l in logbooks if l.get("posting_id") in posting_ids]
            
            dept_exposure[dept["name"]] = {
                "total_cases": len(dept_logbooks),
                "verified_cases": len([l for l in dept_logbooks if l.get("status") == "verified"])
            }
        
        return ClinicalExposureAnalytics(
            total_cases_logged=stats["total_cases_logged"],
            verified_cases=stats["verified_cases"],
            department_wise_exposure=dept_exposure,
            skill_competency_status={},
            posting_completion_rate=stats["posting_completion_rate"]
        )
    
    @staticmethod
    def get_academic_analytics(college_id: UUID) -> AcademicPerformanceAnalytics:
        """Get academic performance analytics"""
        repo = GovernanceRepository
        stats = repo.get_academic_performance_stats(college_id)
        
        # Get module completion rates
        from app.db.supabase import supabase_client
        modules = supabase_client.select("curriculum_modules", filters={"college_id": str(college_id)})
        
        module_rates = {}
        for module in modules:
            progress_records = supabase_client.select(
                "student_module_progress",
                filters={"module_id": str(module["id"])}
            )
            if progress_records:
                avg_completion = sum(p.get("completion_percentage", 0) for p in progress_records) / len(progress_records)
                module_rates[module["title"]] = avg_completion
        
        return AcademicPerformanceAnalytics(
            module_completion_rates=module_rates,
            student_progress_summary={},
            resource_engagement={},
            weak_areas_identified=[]
        )


