import api from '@/lib/api'

type NotificationRole = 'student' | 'faculty' | 'admin' | 'dme' | 'principal' | 'hod'

interface FakeNotification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  is_read: boolean
  created_at: string
  updated_at: string
  role: NotificationRole
}

const DEFAULT_ROLE: NotificationRole = 'student'

// Static fake data for MVP
const FAKE_NOTIFICATIONS_BY_ROLE: Record<NotificationRole, FakeNotification[]> = {
  student: [
    {
      id: 'student-1',
      user_id: 'student-1',
      title: 'Certificate Request Approved',
      message:
        'Your bonafide certificate request has been approved. You can download it from the Certificates page.',
      type: 'success',
      is_read: false,
      created_at: '2024-11-25T10:00:00Z',
      updated_at: '2024-11-25T10:00:00Z',
      role: 'student',
    },
    {
      id: 'student-2',
      user_id: 'student-1',
      title: 'New Notice: End Semester Examinations',
      message: 'The end semester examinations will commence from December 15, 2024. Please check your schedule.',
      type: 'info',
      is_read: false,
      created_at: '2024-11-25T09:00:00Z',
      updated_at: '2024-11-25T09:00:00Z',
      role: 'student',
    },
    {
      id: 'student-3',
      user_id: 'student-1',
      title: 'Logbook Entry Verified',
      message: 'Your logbook entry "Acute Myocardial Infarction" has been verified by Dr. Rajesh Kumar.',
      type: 'success',
      is_read: true,
      created_at: '2024-11-24T14:30:00Z',
      updated_at: '2024-11-24T14:30:00Z',
      role: 'student',
    },
    {
      id: 'student-4',
      user_id: 'student-1',
      title: 'Upcoming Event: Medical Conference 2024',
      message: 'Medical Conference 2024 is scheduled for December 5-7, 2024. Register now to secure your spot.',
      type: 'info',
      is_read: false,
      created_at: '2024-11-23T11:00:00Z',
      updated_at: '2024-11-23T11:00:00Z',
      role: 'student',
    },
    {
      id: 'student-5',
      user_id: 'student-1',
      title: 'Attendance Reminder',
      message: 'You were marked late on November 23, 2024. Please ensure timely arrival.',
      type: 'warning',
      is_read: true,
      created_at: '2024-11-23T09:20:00Z',
      updated_at: '2024-11-23T09:20:00Z',
      role: 'student',
    },
    {
      id: 'student-6',
      user_id: 'student-1',
      title: 'New Assignment Posted',
      message: 'A new assignment has been posted for Anatomy module. Deadline: December 1, 2024.',
      type: 'info',
      is_read: false,
      created_at: '2024-11-22T15:00:00Z',
      updated_at: '2024-11-22T15:00:00Z',
      role: 'student',
    },
  ],
  faculty: [
    {
      id: 'faculty-1',
      user_id: 'faculty-1',
      title: 'Pending Logbook Verifications',
      message: '5 logbooks from Batch 2023-24 are awaiting verification. Please review them before Friday.',
      type: 'warning',
      is_read: false,
      created_at: '2024-11-25T08:30:00Z',
      updated_at: '2024-11-25T08:30:00Z',
      role: 'faculty',
    },
    {
      id: 'faculty-2',
      user_id: 'faculty-1',
      title: 'Faculty Meeting Confirmed',
      message: 'Department meeting scheduled on December 5, 2024 at 3:00 PM in the Academic Block.',
      type: 'info',
      is_read: false,
      created_at: '2024-11-24T12:00:00Z',
      updated_at: '2024-11-24T12:00:00Z',
      role: 'faculty',
    },
    {
      id: 'faculty-3',
      user_id: 'faculty-1',
      title: 'Content Upload Approved',
      message: 'Your Cardiovascular Physiology lecture slides have been reviewed and published to the student portal.',
      type: 'success',
      is_read: true,
      created_at: '2024-11-23T16:45:00Z',
      updated_at: '2024-11-23T16:45:00Z',
      role: 'faculty',
    },
    {
      id: 'faculty-4',
      user_id: 'faculty-1',
      title: 'Simulation Lab Slot Booked',
      message: 'Your request for the Simulation Lab on December 2, 2024 (2:00 PM - 4:00 PM) is confirmed.',
      type: 'info',
      is_read: false,
      created_at: '2024-11-23T09:15:00Z',
      updated_at: '2024-11-23T09:15:00Z',
      role: 'faculty',
    },
    {
      id: 'faculty-5',
      user_id: 'faculty-1',
      title: 'NMC Audit Reminder',
      message: 'Upload the pending attendance summary for November to close the NMC audit checklist.',
      type: 'warning',
      is_read: true,
      created_at: '2024-11-22T07:45:00Z',
      updated_at: '2024-11-22T07:45:00Z',
      role: 'faculty',
    },
    {
      id: 'faculty-6',
      user_id: 'faculty-1',
      title: 'Appreciation from Dean',
      message: 'Great job on achieving 92% student satisfaction for the Cardiovascular module this term.',
      type: 'success',
      is_read: false,
      created_at: '2024-11-21T18:20:00Z',
      updated_at: '2024-11-21T18:20:00Z',
      role: 'faculty',
    },
  ],
  admin: [],
  dme: [],
  principal: [],
  hod: [],
}

const USE_STATIC_DATA = true

const getRoleKey = (role?: string): NotificationRole => {
  if (!role) return DEFAULT_ROLE
  const normalizedRole = role.toLowerCase() as NotificationRole
  return normalizedRole in FAKE_NOTIFICATIONS_BY_ROLE ? normalizedRole : DEFAULT_ROLE
}

const getRoleNotifications = (role?: string) => {
  const roleKey = getRoleKey(role)
  return FAKE_NOTIFICATIONS_BY_ROLE[roleKey]
}

const getAllNotifications = () => Object.values(FAKE_NOTIFICATIONS_BY_ROLE).flat()

export const notificationService = {
  getNotifications: async (role?: string) => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: getRoleNotifications(role) })
    }
    return api.get('/notifications')
  },
  getNotification: async (id: string) => {
    if (USE_STATIC_DATA) {
      const notification = getAllNotifications().find(n => n.id === id)
      return Promise.resolve({ data: notification || null })
    }
    return api.get(`/notifications/${id}`)
  },
  markAsRead: async (id: string) => {
    if (USE_STATIC_DATA) {
      const notification = getAllNotifications().find(n => n.id === id)
      if (notification) {
        notification.is_read = true
        notification.updated_at = new Date().toISOString()
      }
      return Promise.resolve({ data: notification || null })
    }
    return api.put(`/notifications/${id}/read`)
  },
  markAllAsRead: async (role?: string) => {
    if (USE_STATIC_DATA) {
      const targetNotifications = role ? getRoleNotifications(role) : getAllNotifications()
      targetNotifications.forEach(n => {
        n.is_read = true
        n.updated_at = new Date().toISOString()
      })
      return Promise.resolve({ data: role ? [...targetNotifications] : getAllNotifications() })
    }
    return api.put('/notifications/read-all')
  },
}
