"""
Notifications module API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.services.notification_service import NotificationService
from app.core.dependencies import get_current_user_id
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
async def get_notifications(user_id: UUID = Depends(get_current_user_id)):
    """Get current user's notifications"""
    notifications = NotificationService.get_user_notifications(user_id, unread_only=False)
    return notifications


@router.get("/unread")
async def get_unread_notifications(user_id: UUID = Depends(get_current_user_id)):
    """Get unread notifications for current user"""
    notifications = NotificationService.get_user_notifications(user_id, unread_only=True)
    return notifications


@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: UUID,
    user_id: UUID = Depends(get_current_user_id)
):
    """Mark notification as read"""
    try:
        # Verify the notification belongs to the user
        notifications = NotificationService.get_user_notifications(user_id)
        notification = next((n for n in notifications if n.get("id") == str(notification_id)), None)
        
        if not notification:
            raise NotFoundError("Notification not found")
        
        updated = NotificationService.mark_as_read(notification_id)
        return updated
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))



