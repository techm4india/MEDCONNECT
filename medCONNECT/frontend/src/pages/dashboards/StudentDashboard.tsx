import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BookOpen, Stethoscope, FileText, TrendingUp, CheckCircle, Award, Clock, Target, Box, ExternalLink, BookmarkCheck, Search, WifiOff, Brain, Calendar, MessageSquare, Bell } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Viewer3D } from '@/components/3DViewer'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

// Static fake data
const FAKE_PROGRESS = [
  { id: '1', module_name: 'Cardiovascular System', completion_percentage: 85 },
  { id: '2', module_name: 'Respiratory System', completion_percentage: 92 },
  { id: '3', module_name: 'Nervous System', completion_percentage: 78 },
  { id: '4', module_name: 'Digestive System', completion_percentage: 65 },
  { id: '5', module_name: 'Endocrine System', completion_percentage: 88 },
  { id: '6', module_name: 'Renal System', completion_percentage: 70 },
  { id: '7', module_name: 'Musculoskeletal', completion_percentage: 95 },
]

const FAKE_ATTENDANCE = [
  { date: '2024-11-18', status: 'present' },
  { date: '2024-11-19', status: 'present' },
  { date: '2024-11-20', status: 'absent' },
  { date: '2024-11-21', status: 'present' },
  { date: '2024-11-22', status: 'present' },
  { date: '2024-11-23', status: 'present' },
  { date: '2024-11-24', status: 'present' },
]

const FAKE_POSTINGS = [
  { id: '1', department_name: 'Cardiology', start_date: '2024-11-01', end_date: '2024-11-15', status: 'completed' },
  { id: '2', department_name: 'Pediatrics', start_date: '2024-11-16', end_date: '2024-11-30', status: 'active' },
  { id: '3', department_name: 'Surgery', start_date: '2024-12-01', end_date: '2024-12-15', status: 'upcoming' },
]

const FAKE_LOGBOOKS = [
  { id: '1', case_title: 'Acute Myocardial Infarction', status: 'verified', department_name: 'Cardiology', created_at: '2024-11-20' },
  { id: '2', case_title: 'Pneumonia Case Study', status: 'verified', department_name: 'Pulmonology', created_at: '2024-11-18' },
  { id: '3', case_title: 'Type 2 Diabetes Management', status: 'submitted', department_name: 'Endocrinology', created_at: '2024-11-22' },
  { id: '4', case_title: 'Appendicitis Case', status: 'draft', department_name: 'Surgery', created_at: '2024-11-23' },
]

const FAKE_CERTIFICATES = [
  { 
    id: '1', 
    certificate_type: 'bonafide', 
    purpose: 'Bank account opening',
    status: 'approved', 
    created_at: '2024-11-15T08:00:00Z',
    approved_at: '2024-11-16T10:00:00Z',
  },
  { 
    id: '2', 
    certificate_type: 'study_certificate', 
    purpose: 'Scholarship application',
    status: 'pending', 
    created_at: '2024-11-20T14:00:00Z',
    approved_at: null,
  },
  { 
    id: '3', 
    certificate_type: 'conduct', 
    purpose: 'Character certificate',
    status: 'approved', 
    created_at: '2024-11-10T10:00:00Z',
    approved_at: '2024-11-12T09:00:00Z',
  },
  { 
    id: '4', 
    certificate_type: 'fee_statement', 
    purpose: 'Fee payment proof',
    status: 'approved', 
    created_at: '2024-11-17T15:00:00Z',
    approved_at: '2024-11-18T11:00:00Z',
  },
  { 
    id: '5', 
    certificate_type: 'internship', 
    purpose: 'Internship completion',
    status: 'pending', 
    created_at: '2024-11-22T09:00:00Z',
    approved_at: null,
  },
]

export function StudentDashboard() {
  const navigate = useNavigate()
  const [selected3DModel, setSelected3DModel] = useState<{ title: string; imageUrl: string; viewerType: string } | null>(null)
  
  // Bookmarked resources count
  const bookmarkedCount = 8
  const offlineResources = 12
  // Calculate statistics from fake data
  const totalModules = FAKE_PROGRESS.length
  const completedModules = FAKE_PROGRESS.filter(p => p.completion_percentage >= 100).length
  const avgProgress = FAKE_PROGRESS.reduce((acc, p) => acc + p.completion_percentage, 0) / totalModules
  const activePostings = FAKE_POSTINGS.filter(p => p.status === 'active').length
  const verifiedLogbooks = FAKE_LOGBOOKS.filter(l => l.status === 'verified').length
  const attendanceRate = (FAKE_ATTENDANCE.filter(a => a.status === 'present').length / FAKE_ATTENDANCE.length) * 100

  // Chart data
  const progressData = useMemo(() => 
    FAKE_PROGRESS.map(p => ({
      name: p.module_name.length > 15 ? p.module_name.substring(0, 15) + '...' : p.module_name,
      progress: p.completion_percentage,
    })), []
  )

  const attendanceData = useMemo(() => 
    FAKE_ATTENDANCE.map((a, idx) => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: a.status === 'present' ? 1 : 0,
    })), []
  )

  const logbookStatusData = [
    { name: 'Verified', value: verifiedLogbooks },
    { name: 'Submitted', value: FAKE_LOGBOOKS.filter(l => l.status === 'submitted').length },
    { name: 'Draft', value: FAKE_LOGBOOKS.filter(l => l.status === 'draft').length },
  ]

  const stats = [
    {
      title: 'Modules Completed',
      value: `${completedModules}/${totalModules}`,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      progress: (completedModules / totalModules * 100),
      trend: '+12%',
    },
    {
      title: 'Average Progress',
      value: `${avgProgress.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      trend: '+5.2%',
    },
    {
      title: 'Active Postings',
      value: activePostings,
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      trend: '+3.1%',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your academic and clinical progress</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Current Year: 2nd MBBS</p>
            <p className="text-xs text-muted-foreground">Batch: 2023-2024</p>
          </div>
        </div>
      </div>

      {/* Quick Access - Pillar 1 Features */}
      <Card className="border-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Quick Access - Learning Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={() => navigate('/learning')}
            >
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Curriculum</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950"
              onClick={() => navigate('/learning?tab=progress')}
            >
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Progress</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={() => navigate('/learning?tab=timetable')}
            >
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Timetable</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-pink-50 dark:hover:bg-pink-950"
              onClick={() => navigate('/learning?tab=communication')}
            >
              <MessageSquare className="h-6 w-6 text-pink-600" />
              <span className="text-sm font-medium">Messages</span>
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
                </div>
                {stat.progress !== undefined && (
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.progress.toFixed(0)}% complete</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pillar 1 Feature Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4" />
              Bookmarked Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{bookmarkedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Saved for offline access</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => navigate('/learning?bookmarked=true')}
            >
              View Bookmarks
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-950">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              Offline Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{offlineResources}</div>
            <p className="text-xs text-muted-foreground mt-1">Available offline</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => navigate('/learning')}
            >
              Download More
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-purple-50 dark:bg-purple-950">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Instructor
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to help</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => navigate('/learning')}
            >
              Ask AI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Module Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="progress" fill="url(#colorGradient)" radius={[8, 8, 0, 0]}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} tickFormatter={(v) => v === 1 ? 'Present' : ''} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#attendanceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Logbook Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={logbookStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {logbookStatusData.map((entry, index) => (
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

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              Recent Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_POSTINGS.map((posting) => (
                <div key={posting.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{posting.department_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(posting.start_date).toLocaleDateString()} - {new Date(posting.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    posting.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    posting.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {posting.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              Certificate Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_CERTIFICATES.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium capitalize">{cert.certificate_type.replace('_', ' ')}</p>
                    {cert.purpose && (
                      <p className="text-xs text-muted-foreground mt-1">Purpose: {cert.purpose}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Requested: {new Date(cert.created_at).toLocaleDateString()}
                      {cert.approved_at && (
                        <span className="ml-2">• Approved: {new Date(cert.approved_at).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    cert.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    cert.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    cert.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Learning Summary */}
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Weekly Learning Summary
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/learning?tab=progress')}>
              View Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="text-3xl font-bold text-green-600">42</div>
              <p className="text-sm text-muted-foreground mt-1">Hours Studied</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="text-3xl font-bold text-blue-600">15</div>
              <p className="text-sm text-muted-foreground mt-1">Topics Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
              <div className="text-3xl font-bold text-purple-600">8</div>
              <p className="text-sm text-muted-foreground mt-1">Assignments</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
              <div className="text-3xl font-bold text-orange-600">12</div>
              <p className="text-sm text-muted-foreground mt-1">Quizzes Taken</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Logbooks */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Recent Logbook Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {FAKE_LOGBOOKS.map((logbook) => (
              <div key={logbook.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{logbook.case_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(logbook.created_at).toLocaleDateString()} • {logbook.department_name}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  logbook.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  logbook.status === 'submitted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {logbook.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3D Learning Resources */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-purple-600" />
            3D Interactive Learning Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Box className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Cardiovascular System</p>
                  <p className="text-xs text-muted-foreground">Heart Anatomy Image</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Interactive anatomy image of the human heart with detailed anatomy and labels
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelected3DModel({
                  title: 'Cardiovascular System - Heart Anatomy',
                  imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80',
                  viewerType: 'anatomy'
                })}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Image
              </Button>
            </div>
            <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Box className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Respiratory System</p>
                  <p className="text-xs text-muted-foreground">Lung Anatomy Image</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Explore the respiratory system with detailed anatomy visualization
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelected3DModel({
                  title: 'Respiratory System - Lung Anatomy',
                  imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop&q=80',
                  viewerType: 'anatomy'
                })}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3D Viewer Modal */}
      {selected3DModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected3DModel(null)}>
          <div className="w-full max-w-6xl mx-4" onClick={(e) => e.stopPropagation()}>
            <Viewer3D
              title={selected3DModel.title}
              viewerType={selected3DModel.viewerType as any}
              fileUrl={selected3DModel.imageUrl}
            />
          </div>
        </div>
      )}
    </div>
  )
}
