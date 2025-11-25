"""
Notification service for in-app, email, and push notifications
"""
from typing import List, Optional
from uuid import UUID
from app.db.supabase import supabase_client
from app.core.config import settings
from loguru import logger
from datetime import datetime


class NotificationService:
    """Service for notification operations"""
    
    @staticmethod
    def create_notification(
        user_id: UUID,
        title: str,
        message: str,
        notification_type: str = "info",
        link: Optional[str] = None,
        college_id: Optional[UUID] = None
    ) -> dict:
        """Create an in-app notification"""
        notification_data = {
            "user_id": str(user_id),
            "title": title,
            "message": message,
            "type": notification_type,
            "is_read": False,
            "link": link,
            "created_at": datetime.utcnow().isoformat()
        }
        
        if college_id:
            notification_data["college_id"] = str(college_id)
        
        return supabase_client.insert("notifications", notification_data)
    
    @staticmethod
    def get_user_notifications(user_id: UUID, unread_only: bool = False) -> List[dict]:
        """Get notifications for a user"""
        filters = {"user_id": str(user_id)}
        if unread_only:
            filters["is_read"] = False
        
        return supabase_client.select(
            "notifications",
            filters=filters,
            order_by="created_at",
            limit=50
        )
    
    @staticmethod
    def mark_as_read(notification_id: UUID) -> dict:
        """Mark notification as read"""
        return supabase_client.update(
            "notifications",
            {"is_read": True},
            filters={"id": str(notification_id)}
        )
    
    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ) -> bool:
        """Send email notification"""
        # TODO: Implement email sending using SMTP or email service
        if not settings.SMTP_HOST:
            logger.warning("SMTP not configured, email not sent")
            return False
        
        # Placeholder for email implementation
        logger.info(f"Email would be sent to {to_email}: {subject}")
        return True
    
    @staticmethod
    def send_push_notification(
        user_id: UUID,
        title: str,
        message: str,
        data: Optional[dict] = None
    ) -> bool:
        """Send push notification"""
        # TODO: Implement push notification using FCM or similar
        logger.info(f"Push notification would be sent to user {user_id}: {title}")
        return True





