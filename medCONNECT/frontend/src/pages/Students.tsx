import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Users, Search, Mail, Phone, GraduationCap, BookOpen, Stethoscope } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export function Students() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Get all students
  const { data: students, isLoading } = useQuery({
    queryKey: ['students', searchTerm],
    queryFn: async () => {
      const response = await api.get('/users?role=student')
      const allStudents = response.data || []
      
      // Filter by search term if provided
      if (searchTerm) {
        return allStudents.filter((student: any) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            student.full_name?.toLowerCase().includes(searchLower) ||
            student.email?.toLowerCase().includes(searchLower) ||
            student.phone?.toLowerCase().includes(searchLower)
          )
        })
      }
      
      return allStudents
    },
  })

  // Get student progress for each student
  const { data: studentProgress } = useQuery({
    queryKey: ['student-progress-all'],
    queryFn: async () => {
      if (!students || students.length === 0) return {}
      
      const progressPromises = students.map(async (student: any) => {
        try {
          // Get progress for student (would need a backend endpoint)
          // For now, return empty
          return { studentId: student.id, progress: [] }
        } catch {
          return { studentId: student.id, progress: [] }
        }
      })
      
      const results = await Promise.all(progressPromises)
      return results.reduce((acc: any, curr: any) => {
        acc[curr.studentId] = curr.progress
        return acc
      }, {})
    },
    enabled: !!students && students.length > 0,
  })

  // Get student logbooks count
  const { data: logbooksData } = useQuery({
    queryKey: ['student-logbooks-all'],
    queryFn: async () => {
      const response = await api.get('/clinical/logbooks')
      const logbooks = response.data || []
      
      // Group by student_id
      const grouped = logbooks.reduce((acc: any, logbook: any) => {
        const studentId = logbook.student_id
        if (!acc[studentId]) {
          acc[studentId] = { total: 0, verified: 0, pending: 0 }
        }
        acc[studentId].total++
        if (logbook.status === 'verified') {
          acc[studentId].verified++
        } else if (logbook.status === 'submitted' || logbook.status === 'pending') {
          acc[studentId].pending++
        }
        return acc
      }, {})
      
      return grouped
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">View and manage student information</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students?.map((student: any) => {
          const logbookStats = logbooksData?.[student.id] || { total: 0, verified: 0, pending: 0 }
          const progress = studentProgress?.[student.id] || []
          const avgProgress = progress.length > 0
            ? progress.reduce((acc: number, p: any) => acc + (p.completion_percentage || 0), 0) / progress.length
            : 0

          return (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {student.full_name || 'Unknown Student'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {student.email}
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {student.phone}
                    </div>
                  )}
                  
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Progress
                      </span>
                      <span className="font-medium">{avgProgress.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Stethoscope className="h-4 w-4" />
                        Logbooks
                      </span>
                      <span className="font-medium">
                        {logbookStats.verified}/{logbookStats.total}
                      </span>
                    </div>
                    {logbookStats.pending > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-medium text-orange-600">{logbookStats.pending}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground">
                      Joined: {formatDate(student.created_at)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      student.is_active ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {students?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No students found matching your search' : 'No students found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



