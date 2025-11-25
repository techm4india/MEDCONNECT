import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Stethoscope,
  Building2,
  FileText,
  Calendar,
  Users,
  Settings,
  GraduationCap,
  ClipboardList,
  Bell,
  BarChart3,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Academic', path: '/academic' },
  { icon: Stethoscope, label: 'Clinical', path: '/clinical' },
  { icon: Building2, label: 'Hostel', path: '/hostel' },
  { icon: FileText, label: 'Admin', path: '/admin' },
  { icon: BarChart3, label: 'Governance', path: '/governance' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

const studentMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Learning Hub', path: '/learning' },
  { icon: BookOpen, label: 'Academic', path: '/academic' },
  { icon: Stethoscope, label: 'My Postings', path: '/clinical' },
  { icon: Building2, label: 'Hostel', path: '/hostel' },
  { icon: FileText, label: 'Certificates', path: '/admin' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
]

const facultyMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Faculty Portal', path: '/faculty' },
  { icon: BookOpen, label: 'Academic', path: '/academic' },
  { icon: Stethoscope, label: 'Clinical', path: '/clinical' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: ClipboardList, label: 'Logbooks', path: '/clinical/logbooks' },
  { icon: BarChart3, label: 'Analytics', path: '/governance' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
]

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()

  const getMenuItems = () => {
    if (user?.role === 'student') return studentMenuItems
    if (['faculty', 'hod'].includes(user?.role || '')) return facultyMenuItems
    return menuItems
  }

  const items = getMenuItems()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold">MedConnect</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}



