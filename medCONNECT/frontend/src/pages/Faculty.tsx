import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { 
  Upload, BookOpen, Users, TrendingUp, Calendar, Clock, FileText, Video, Image as ImageIcon,
  CheckCircle, XCircle, AlertCircle, Plus, Download, Search, Filter, Target, BarChart3,
  Award, Activity, FileCheck, GraduationCap, Eye, Edit, Trash2, Save
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'

// Static fake data
const FAKE_STUDENTS = [
  { id: '1', name: 'Rajesh Kumar', roll_number: 'MBBS2023-001', year: 2, batch: '2023-2024', progress: 85, attendance: 92 },
  { id: '2', name: 'Priya Sharma', roll_number: 'MBBS2023-002', year: 2, batch: '2023-2024', progress: 92, attendance: 95 },
  { id: '3', name: 'Amit Patel', roll_number: 'MBBS2023-003', year: 2, batch: '2023-2024', progress: 78, attendance: 88 },
  { id: '4', name: 'Sneha Reddy', roll_number: 'MBBS2023-004', year: 2, batch: '2023-2024', progress: 88, attendance: 90 },
  { id: '5', name: 'Vikram Singh', roll_number: 'MBBS2023-005', year: 2, batch: '2023-2024', progress: 75, attendance: 85 },
  { id: '6', name: 'Anjali Mehta', roll_number: 'MBBS2023-006', year: 2, batch: '2023-2024', progress: 90, attendance: 93 },
]

const FAKE_TOPICS = [
  { id: '1', topic: 'Cardiovascular System - Heart Anatomy', subject: 'Anatomy', batch: '2023-2024', allocated_students: 15, due_date: '2024-12-15', status: 'active' },
  { id: '2', topic: 'Respiratory System - Lung Physiology', subject: 'Physiology', batch: '2023-2024', allocated_students: 12, due_date: '2024-12-20', status: 'active' },
  { id: '3', topic: 'Nervous System - Brain Anatomy', subject: 'Anatomy', batch: '2023-2024', allocated_students: 18, due_date: '2024-12-25', status: 'upcoming' },
  { id: '4', topic: 'Cardiovascular Diseases', subject: 'Pathology', batch: '2023-2024', allocated_students: 10, due_date: '2024-12-10', status: 'completed' },
]

const FAKE_BATCHES = [
  { id: '1', name: '2023-2024', year: 2, total_students: 120, active_topics: 8, completed_topics: 15 },
  { id: '2', name: '2022-2023', year: 3, total_students: 115, active_topics: 5, completed_topics: 20 },
  { id: '3', name: '2024-2025', year: 1, total_students: 125, active_topics: 3, completed_topics: 2 },
]

const FAKE_UPLOADED_CONTENT = [
  { id: '1', title: 'Heart Anatomy Lecture Notes', type: 'notes', format: 'pdf', size: '2.5 MB', topic: 'Cardiovascular System', uploaded_at: '2024-11-20', downloads: 45 },
  { id: '2', title: 'Cardiac Cycle Video', type: 'video', format: 'mp4', size: '125 MB', topic: 'Cardiovascular System', uploaded_at: '2024-11-18', downloads: 38 },
  { id: '3', title: 'Lung Anatomy Diagram', type: 'diagram', format: 'png', size: '1.2 MB', topic: 'Respiratory System', uploaded_at: '2024-11-15', downloads: 52 },
  { id: '4', title: 'Cardiovascular Flowchart', type: 'flowchart', format: 'pdf', size: '800 KB', topic: 'Cardiovascular System', uploaded_at: '2024-11-12', downloads: 42 },
  { id: '5', title: 'Respiratory Physiology Notes', type: 'notes', format: 'pdf', size: '3.1 MB', topic: 'Respiratory System', uploaded_at: '2024-11-10', downloads: 35 },
]

const FAKE_ATTENDANCE_RECORDS = [
  { date: '2024-11-25', total_students: 120, present: 110, absent: 8, late: 2, attendance_rate: 91.7 },
  { date: '2024-11-24', total_students: 120, present: 115, absent: 3, late: 2, attendance_rate: 95.8 },
  { date: '2024-11-23', total_students: 120, present: 108, absent: 10, late: 2, attendance_rate: 90.0 },
  { date: '2024-11-22', total_students: 120, present: 112, absent: 6, late: 2, attendance_rate: 93.3 },
  { date: '2024-11-21', total_students: 120, present: 118, absent: 1, late: 1, attendance_rate: 98.3 },
]

const FAKE_CALENDAR_EVENTS = [
  { id: '1', title: 'End Semester Examinations', date: '2024-12-15', type: 'exam', priority: 'high' },
  { id: '2', title: 'Faculty Meeting', date: '2024-12-05', type: 'meeting', priority: 'medium' },
  { id: '3', title: 'Topic Submission Deadline', date: '2024-12-10', type: 'deadline', priority: 'high' },
  { id: '4', title: 'Academic Calendar Review', date: '2024-12-08', type: 'meeting', priority: 'medium' },
]

const FAKE_WORKLOAD_ANALYTICS = [
  { week: 'Week 1', lectures: 8, practicals: 4, verifications: 12, hours: 20 },
  { week: 'Week 2', lectures: 10, practicals: 5, verifications: 15, hours: 24 },
  { week: 'Week 3', lectures: 8, practicals: 6, verifications: 18, hours: 22 },
  { week: 'Week 4', lectures: 9, practicals: 4, verifications: 20, hours: 21 },
]

const FAKE_PERFORMANCE_METRICS = {
  total_lectures: 35,
  total_practicals: 19,
  logbooks_verified: 65,
  average_rating: 4.6,
  student_satisfaction: 92,
  completion_rate: 88,
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function Faculty() {
  const [activeTab, setActiveTab] = useState('content')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showAllocationDialog, setShowAllocationDialog] = useState(false)
  const [showBatchDialog, setShowBatchDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)

  // Check URL params for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab && ['content', 'allocation', 'progress', 'attendance', 'analytics'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  const handleUpload = () => {
    toast.success('Content uploaded successfully!')
    setShowUploadDialog(false)
  }

  const handleAllocateTopic = () => {
    toast.success('Topic allocated successfully!')
    setShowAllocationDialog(false)
  }

  const handleCreateBatch = () => {
    toast.success('Batch created successfully!')
    setShowBatchDialog(false)
  }

  const filteredStudents = FAKE_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTopics = FAKE_TOPICS.filter(t => 
    !selectedBatch || t.batch === selectedBatch
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Faculty Portal
          </h1>
          <p className="text-muted-foreground mt-1">Pillar 2 - Complete Faculty Management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Active
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value)
              // Update URL without page reload
              const url = new URL(window.location.href)
              url.searchParams.set('tab', value)
              window.history.pushState({}, '', url.toString())
            }} 
            className="space-y-6"
          >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Content Upload
          </TabsTrigger>
          <TabsTrigger value="allocation" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Topic Allocation
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Student Progress
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Content Upload Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload Academic Content
                </CardTitle>
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {FAKE_UPLOADED_CONTENT.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        content.type === 'notes' ? 'bg-blue-100 dark:bg-blue-900' :
                        content.type === 'video' ? 'bg-red-100 dark:bg-red-900' :
                        content.type === 'diagram' ? 'bg-green-100 dark:bg-green-900' :
                        'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        {content.type === 'notes' ? <FileText className="h-5 w-5 text-blue-600" /> :
                         content.type === 'video' ? <Video className="h-5 w-5 text-red-600" /> :
                         <ImageIcon className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{content.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {content.topic} • {content.format.toUpperCase()} • {content.size}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded: {new Date(content.uploaded_at).toLocaleDateString()} • {content.downloads} downloads
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.success(`Viewing: ${content.title}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setShowUploadDialog(true)
                          toast.info('Edit mode: ' + content.title)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => {
                          if (confirm(`Delete "${content.title}"?`)) {
                            toast.success('Content deleted successfully!')
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topic Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Topic Allocations
                  </CardTitle>
                  <Button onClick={() => setShowAllocationDialog(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Allocate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <div key={topic.id} className="p-4 rounded-lg border-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{topic.topic}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {topic.subject} • Batch: {topic.batch} • {topic.allocated_students} students
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(topic.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            topic.status === 'active' ? 'bg-green-100 text-green-800' :
                            topic.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {topic.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setShowAllocationDialog(true)
                              toast.info('Editing allocation: ' + topic.topic)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Batch Management
                  </CardTitle>
                  <Button onClick={() => setShowBatchDialog(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Batch
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {FAKE_BATCHES.map((batch) => (
                    <div 
                      key={batch.id} 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedBatch === batch.name ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedBatch(batch.name)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{batch.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Year {batch.year} • {batch.total_students} students
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Active: {batch.active_topics}</span>
                            <span>Completed: {batch.completed_topics}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setShowBatchDialog(true)
                            toast.info('Editing batch: ' + batch.name)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Student Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Student Progress Monitoring
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStudent === student.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.roll_number} • Year {student.year} • Batch {student.batch}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Progress:</span>
                              <div className="w-32 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 rounded-full bg-blue-500" 
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{student.progress}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Attendance:</span>
                              <span className="text-xs font-medium">{student.attendance}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast.success(`Viewing progress details for ${student.name}`)
                          // In real app, this would open a detailed view
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Attendance Records
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {FAKE_ATTENDANCE_RECORDS.map((record, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{new Date(record.date).toLocaleDateString()}</p>
                        <Badge className="bg-green-100 text-green-800">
                          {record.attendance_rate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Present:</span>
                          <span className="font-medium ml-2 text-green-600">{record.present}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Absent:</span>
                          <span className="font-medium ml-2 text-red-600">{record.absent}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Late:</span>
                          <span className="font-medium ml-2 text-orange-600">{record.late}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Academic Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {FAKE_CALENDAR_EVENTS.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg border-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={
                          event.priority === 'high' ? 'bg-red-100 text-red-800' :
                          event.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-sm font-medium text-blue-600">Lectures</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{FAKE_PERFORMANCE_METRICS.total_lectures}</div>
                <p className="text-xs text-muted-foreground mt-1">This Month</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="bg-green-50 dark:bg-green-950">
                <CardTitle className="text-sm font-medium text-green-600">Practicals</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{FAKE_PERFORMANCE_METRICS.total_practicals}</div>
                <p className="text-xs text-muted-foreground mt-1">This Month</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-purple-50 dark:bg-purple-950">
                <CardTitle className="text-sm font-medium text-purple-600">Verified</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{FAKE_PERFORMANCE_METRICS.logbooks_verified}</div>
                <p className="text-xs text-muted-foreground mt-1">Logbooks</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader className="bg-orange-50 dark:bg-orange-950">
                <CardTitle className="text-sm font-medium text-orange-600">Rating</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{FAKE_PERFORMANCE_METRICS.average_rating}</div>
                <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-pink-200 dark:border-pink-800">
              <CardHeader className="bg-pink-50 dark:bg-pink-950">
                <CardTitle className="text-sm font-medium text-pink-600">Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{FAKE_PERFORMANCE_METRICS.student_satisfaction}%</div>
                <p className="text-xs text-muted-foreground mt-1">Student Rating</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-cyan-200 dark:border-cyan-800">
              <CardHeader className="bg-cyan-50 dark:bg-cyan-950">
                <CardTitle className="text-sm font-medium text-cyan-600">Completion</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{FAKE_PERFORMANCE_METRICS.completion_rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Topic Completion</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Workload Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={FAKE_WORKLOAD_ANALYTICS}>
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
                  <Bar dataKey="lectures" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="practicals" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="verifications" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Content Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogClose onClose={() => setShowUploadDialog(false)} />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Academic Content
            </DialogTitle>
            <DialogDescription>
              Upload notes, videos, diagrams, or other learning resources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Content Title</label>
              <Input placeholder="Enter content title" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                <option value="">Select type</option>
                <option value="notes">Notes</option>
                <option value="video">Video</option>
                <option value="diagram">Diagram</option>
                <option value="flowchart">Flowchart</option>
                <option value="pyq">Previous Year Questions</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Topic/Subject</label>
              <Input placeholder="Enter topic or subject" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Upload File</label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, MP4, PNG, JPG (Max 500MB)</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Allocate Topic Dialog */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogClose onClose={() => setShowAllocationDialog(false)} />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Allocate Topic to Students
            </DialogTitle>
            <DialogDescription>
              Assign topics to students or batches
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Topic</label>
              <Input placeholder="Enter topic name" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                <option value="">Select subject</option>
                <option value="anatomy">Anatomy</option>
                <option value="physiology">Physiology</option>
                <option value="pathology">Pathology</option>
                <option value="pharmacology">Pharmacology</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Batch</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                <option value="">Select batch</option>
                {FAKE_BATCHES.map(batch => (
                  <option key={batch.id} value={batch.name}>{batch.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Select Students</label>
              <div className="mt-1 border rounded-lg p-4 max-h-48 overflow-y-auto">
                {FAKE_STUDENTS.map(student => (
                  <label key={student.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{student.name} ({student.roll_number})</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAllocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAllocateTopic}>
                <Save className="h-4 w-4 mr-2" />
                Allocate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Batch Dialog */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent>
          <DialogClose onClose={() => setShowBatchDialog(false)} />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Create New Batch
            </DialogTitle>
            <DialogDescription>
              Create a new student batch for academic management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Batch Name</label>
              <Input placeholder="e.g., 2024-2025" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Year</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Total Students</label>
              <Input type="number" placeholder="Enter number of students" className="mt-1" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowBatchDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBatch}>
                <Save className="h-4 w-4 mr-2" />
                Create Batch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

