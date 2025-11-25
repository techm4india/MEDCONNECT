import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, TrendingUp, Stethoscope, BookOpen, AlertTriangle, CheckCircle, BarChart3, Activity, Building2 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts'

// Static fake data
const FAKE_ATTENDANCE_TREND = [
  { month: 'Jun', rate: 82 },
  { month: 'Jul', rate: 85 },
  { month: 'Aug', rate: 88 },
  { month: 'Sep', rate: 87 },
  { month: 'Oct', rate: 90 },
  { month: 'Nov', rate: 92 },
]

const FAKE_DEPT_ATTENDANCE = [
  { name: 'Cardiology', rate: 95 },
  { name: 'Pediatrics', rate: 88 },
  { name: 'Surgery', rate: 92 },
  { name: 'Orthopedics', rate: 85 },
  { name: 'Neurology', rate: 90 },
]

const FAKE_CLINICAL_EXPOSURE = [
  { name: 'Cardiology', cases: 245, verified: 230 },
  { name: 'Pediatrics', cases: 180, verified: 175 },
  { name: 'Surgery', cases: 320, verified: 310 },
  { name: 'Orthopedics', cases: 150, verified: 145 },
]

const FAKE_MODULE_PROGRESS = [
  { name: 'Cardiovascular', progress: 88 },
  { name: 'Respiratory', progress: 85 },
  { name: 'Nervous System', progress: 82 },
  { name: 'Digestive', progress: 80 },
  { name: 'Endocrine', progress: 78 },
]

export function GovernanceDashboard() {
  const totalStudents = 450
  const totalFaculty = 85
  const attendanceRate = 92
  const clinicalCases = 895
  const verifiedCases = 860
  const postingCompletion = 88
  const avgAcademicProgress = 82.5

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
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      trend: '+5.2%',
    },
    {
      title: 'Clinical Cases',
      value: `${clinicalCases}`,
      icon: Stethoscope,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      subtitle: `${verifiedCases} verified`,
    },
    {
      title: 'Posting Completion',
      value: `${postingCompletion}%`,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      title: 'Academic Progress',
      value: `${avgAcademicProgress}%`,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      trend: '+3.1%',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Governance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Institutional overview and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Government Medical College</p>
            <p className="text-xs text-muted-foreground">DME Telangana</p>
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
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
                {stat.trend && (
                  <p className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </p>
                )}
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
              Attendance Trend (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={FAKE_ATTENDANCE_TREND}>
                <defs>
                  <linearGradient id="attendanceTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#attendanceTrendGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Department-wise Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FAKE_DEPT_ATTENDANCE}>
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
                <Bar dataKey="rate" fill="url(#deptGradient)" radius={[8, 8, 0, 0]}>
                  <defs>
                    <linearGradient id="deptGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* More Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-orange-600" />
              Clinical Exposure by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={FAKE_CLINICAL_EXPOSURE}>
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
                <Bar dataKey="cases" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="verified" fill="#10b981" radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Module Completion Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FAKE_MODULE_PROGRESS}>
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
                <Bar dataKey="progress" fill="url(#moduleGradient)" radius={[8, 8, 0, 0]}>
                  <defs>
                    <linearGradient id="moduleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-orange-700 dark:text-orange-300">
              ✓ Attendance rate improved by 5.2% this month
            </p>
            <p className="text-orange-700 dark:text-orange-300">
              ✓ Clinical case logging increased by 12% compared to last month
            </p>
            <p className="text-orange-700 dark:text-orange-300">
              ⚠ Orthopedics department attendance below 85% - review needed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
