import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, FileText, Calendar, DollarSign, Bell, CheckCircle, Clock, AlertTriangle, Building2, TrendingUp } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

// Static fake data
const FAKE_ATTENDANCE_TREND = [
  { day: 'Mon', rate: 88 },
  { day: 'Tue', rate: 92 },
  { day: 'Wed', rate: 85 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 94 },
  { day: 'Sat', rate: 78 },
  { day: 'Sun', rate: 82 },
]

const FAKE_CERTIFICATES = [
  { name: 'Pending', value: 12 },
  { name: 'Generated', value: 45 },
  { name: 'Approved', value: 38 },
]

const FAKE_DEPT_DISTRIBUTION = [
  { name: 'Cardiology', students: 45 },
  { name: 'Pediatrics', students: 38 },
  { name: 'Surgery', students: 52 },
  { name: 'Orthopedics', students: 35 },
  { name: 'Neurology', students: 28 },
]

const FAKE_NOTICES = [
  { id: '1', title: 'Annual Day Celebration', created_at: '2024-11-20', priority: 'high' },
  { id: '2', title: 'Examination Schedule', created_at: '2024-11-18', priority: 'high' },
  { id: '3', title: 'Hostel Rules Update', created_at: '2024-11-15', priority: 'medium' },
  { id: '4', title: 'Library Timings', created_at: '2024-11-12', priority: 'low' },
]

const FAKE_EVENTS = [
  { id: '1', title: 'Medical Conference 2024', start_date: '2024-12-05', status: 'upcoming' },
  { id: '2', title: 'Workshop on Clinical Skills', start_date: '2024-12-10', status: 'upcoming' },
  { id: '3', title: 'CME Program', start_date: '2024-12-15', status: 'upcoming' },
]

export function AdminDashboard() {
  const totalStudents = 450
  const totalFaculty = 85
  const pendingCerts = 12
  const attendanceRate = 88.5
  const activePostings = 25
  const pendingLogbooks = 18
  const upcomingEvents = FAKE_EVENTS.length

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      trend: '+12 this year',
    },
    {
      title: 'Total Faculty',
      value: totalFaculty,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Pending Certificates',
      value: pendingCerts,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      alert: pendingCerts > 0,
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      trend: '+3.2%',
    },
    {
      title: 'Active Postings',
      value: activePostings,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      title: 'Pending Logbooks',
      value: pendingLogbooks,
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      alert: pendingLogbooks > 0,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage campus operations and monitor system metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Campus Administration</p>
            <p className="text-xs text-muted-foreground">System Overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.trend && (
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  )}
                  {stat.alert && (
                    <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Weekly Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={FAKE_ATTENDANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Certificate Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={FAKE_CERTIFICATES}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {FAKE_CERTIFICATES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* More Charts */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Department Student Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={FAKE_DEPT_DISTRIBUTION}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="students" fill="url(#deptStudentsGradient)" radius={[8, 8, 0, 0]}>
                <defs>
                  <linearGradient id="deptStudentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Recent Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_NOTICES.map((notice) => (
                <div key={notice.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    notice.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {notice.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_EVENTS.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
