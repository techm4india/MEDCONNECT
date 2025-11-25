import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notificationService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

export function Notifications() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const userRole = user?.role?.toLowerCase() || 'student'

  const { data: notifications } = useQuery({
    queryKey: ['notifications', userRole],
    queryFn: async () => {
      const response = await notificationService.getNotifications(userRole)
      return response.data
    },
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userRole] })
      toast.success('Notification marked as read')
    },
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications?.map((notification: any) => (
          <Card
            key={notification.id}
            className={notification.is_read ? 'opacity-75' : 'border-primary'}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(notification.created_at)}
                  </p>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {notifications?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



