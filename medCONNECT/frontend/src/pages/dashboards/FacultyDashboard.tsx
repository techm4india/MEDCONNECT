import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users, BookOpen, ClipboardCheck, Clock, TrendingUp, AlertCircle, CheckCircle2, FileText, Target, Upload, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Static fake data
const FAKE_STUDENTS = [
  { id: '1', name: 'Rajesh Kumar', year: 2, progress: 85 },
  { id: '2', name: 'Priya Sharma', year: 2, progress: 92 },
  { id: '3', name: 'Amit Patel', year: 2, progress: 78 },
  { id: '4', name: 'Sneha Reddy', year: 2, progress: 88 },
  { id: '5', name: 'Vikram Singh', year: 2, progress: 75 },
]

const FAKE_LOGBOOKS = [
  { id: '1', student_name: 'Rajesh Kumar', case_title: 'Acute MI', status: 'submitted', submitted_at: '2024-11-23' },
  { id: '2', student_name: 'Priya Sharma', case_title: 'Pneumonia', status: 'submitted', submitted_at: '2024-11-22' },
  { id: '3', student_name: 'Amit Patel', case_title: 'Diabetes Type 2', status: 'pending', submitted_at: '2024-11-21' },
  { id: '4', student_name: 'Sneha Reddy', case_title: 'Hypertension', status: 'submitted', submitted_at: '2024-11-20' },
]

const FAKE_ALLOCATIONS = [
  { id: '1', module_name: 'Cardiovascular System', batch: '2023-2024', due_date: '2024-12-15', status: 'active' },
  { id: '2', module_name: 'Respiratory System', batch: '2023-2024', due_date: '2024-12-20', status: 'active' },
  { id: '3', module_name: 'Nervous System', batch: '2023-2024', due_date: '2024-12-25', status: 'upcoming' },
]

const FAKE_PROGRESS_TREND = [
  { week: 'Week 1', progress: 65 },
  { week: 'Week 2', progress: 72 },
  { week: 'Week 3', progress: 78 },
  { week: 'Week 4', progress: 82 },
  { week: 'Week 5', progress: 85 },
  { week: 'Week 6', progress: 88 },
]

const FAKE_VERIFICATION_TREND = [
  { week: 'Week 1', verified: 12, pending: 8 },
  { week: 'Week 2', verified: 15, pending: 5 },
  { week: 'Week 3', verified: 18, pending: 7 },
  { week: 'Week 4', verified: 20, pending: 3 },
]

export function FacultyDashboard() {
  const navigate = useNavigate()
  const totalStudents = FAKE_STUDENTS.length
  const pendingVerifications = FAKE_LOGBOOKS.filter(l => l.status === 'submitted' || l.status === 'pending').length
  const activeAllocations = FAKE_ALLOCATIONS.filter(a => a.status === 'active').length
  const avgCompletion = FAKE_STUDENTS.reduce((acc, s) => acc + s.progress, 0) / totalStudents

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      trend: '+2 this month',
    },
    {
      title: 'Pending Verifications',
      value: pendingVerifications,
      icon: ClipboardCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      alert: pendingVerifications > 0,
    },
    {
      title: 'Active Allocations',
      value: activeAllocations,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Avg Completion',
      value: `${avgCompletion.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      trend: '+5.2%',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Faculty Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Monitor student progress and manage academic activities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Department: Cardiology</p>
            <p className="text-xs text-muted-foreground">Designation: Associate Professor</p>
          </div>
        </div>
      </div>

      {/* Quick Access - Pillar 2 Features */}
      <Card className="border-2 border-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Quick Access - Faculty Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={() => navigate('/faculty?tab=content')}
            >
              <Upload className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Upload Content</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950"
              onClick={() => navigate('/faculty?tab=allocation')}
            >
              <Target className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Topic Allocation</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={() => navigate('/faculty?tab=progress')}
            >
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Student Progress</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-950"
              onClick={() => navigate('/faculty?tab=attendance')}
            >
              <CheckCircle2 className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Attendance</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-cyan-50 dark:hover:bg-cyan-950"
              onClick={() => navigate('/faculty?tab=analytics')}
            >
              <BarChart3 className="h-6 w-6 text-cyan-600" />
              <span className="text-sm font-medium">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  {stat.trend && (
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  )}
                  {stat.alert && (
                    <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Action needed
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
              <TrendingUp className="h-5 w-5 text-green-600" />
              Student Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={FAKE_PROGRESS_TREND}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#progressGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              Logbook Verification Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FAKE_VERIFICATION_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="verified" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-orange-600" />
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_LOGBOOKS.map((logbook) => (
                <div key={logbook.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{logbook.case_title}</p>
                    <p className="text-sm text-muted-foreground">
                      {logbook.student_name} • {new Date(logbook.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    logbook.status === 'submitted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {logbook.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Topic Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_ALLOCATIONS.map((allocation) => (
                <div key={allocation.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{allocation.module_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {allocation.batch} • Due: {new Date(allocation.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    allocation.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {allocation.status}
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
