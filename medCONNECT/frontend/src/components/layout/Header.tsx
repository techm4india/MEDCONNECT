import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { LogOut, User, Moon, Sun, Bell, Settings, Menu, X } from 'lucide-react'
import { authService } from '@/services/authService'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const getRoleColor = (role?: string) => {
    const colors: Record<string, string> = {
      student: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      faculty: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      admin: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      dme: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      principal: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      hod: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    }
    return colors[role?.toLowerCase() || ''] || 'bg-gray-100 text-gray-800'
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['student', 'faculty', 'admin', 'dme', 'principal', 'hod'] },
    { path: '/academic', label: 'Academic', roles: ['student', 'faculty', 'admin'] },
    { path: '/clinical', label: 'Clinical', roles: ['student', 'faculty', 'admin'] },
    { path: '/hostel', label: 'Hostel', roles: ['student', 'admin'] },
    { path: '/notifications', label: 'Notifications', roles: ['student', 'faculty', 'admin', 'dme'] },
  ]

  const userRole = user?.role?.toLowerCase() || ''
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-xl font-bold text-white">MC</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MedConnect
                </h1>
                <p className="text-xs text-muted-foreground">Digital Medical Campus</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className="rounded-lg"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user?.role)}`}>
                  {user?.role?.toUpperCase() || 'USER'}
                </span>
              </div>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Logout */}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  navigate(item.path)
                  setMobileMenuOpen(false)
                }}
              >
                {item.label}
              </Button>
            ))}
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
