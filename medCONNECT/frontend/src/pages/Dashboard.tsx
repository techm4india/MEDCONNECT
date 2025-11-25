import { useAuthStore } from '@/store/authStore'
import { StudentDashboard } from './dashboards/StudentDashboard'
import { FacultyDashboard } from './dashboards/FacultyDashboard'
import { AdminDashboard } from './dashboards/AdminDashboard'
import { GovernanceDashboard } from './dashboards/GovernanceDashboard'

export function Dashboard() {
  const { user } = useAuthStore()

  // Route to appropriate dashboard based on user role
  if (user?.role === 'student') {
    return <StudentDashboard />
  }

  if (['faculty', 'hod'].includes(user?.role || '')) {
    return <FacultyDashboard />
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  if (['principal', 'dme', 'superintendent'].includes(user?.role || '')) {
    return <GovernanceDashboard />
  }

  // Default dashboard (fallback)
  return <AdminDashboard />
}
