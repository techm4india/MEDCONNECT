import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ClipboardList, Search, CheckCircle, XCircle, Clock, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

export function Logbooks() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Get all logbooks for faculty
  const { data: logbooks, isLoading } = useQuery({
    queryKey: ['all-logbooks', statusFilter],
    queryFn: async () => {
      const response = await api.get('/clinical/logbooks')
      let allLogbooks = response.data || []
      
      // Filter by status
      if (statusFilter !== 'all') {
        allLogbooks = allLogbooks.filter((l: any) => {
          if (statusFilter === 'pending') {
            return l.status === 'submitted' || l.status === 'pending'
          }
          return l.status === statusFilter
        })
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        allLogbooks = allLogbooks.filter((l: any) => {
          return (
            l.case_type?.toLowerCase().includes(searchLower) ||
            l.diagnosis?.toLowerCase().includes(searchLower) ||
            l.chief_complaint?.toLowerCase().includes(searchLower) ||
            l.patient_name?.toLowerCase().includes(searchLower)
          )
        })
      }
      
      // Sort by created_at (newest first)
      return allLogbooks.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },
  })

  // Verify logbook mutation
  const verifyLogbookMutation = useMutation({
    mutationFn: async (logbookId: string) => {
      const response = await api.put(`/clinical/logbooks/${logbookId}`, {
        status: 'verified',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-logbooks'] })
      toast.success('Logbook verified successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to verify logbook')
    },
  })

  // Reject logbook mutation
  const rejectLogbookMutation = useMutation({
    mutationFn: async ({ logbookId, reason }: { logbookId: string; reason?: string }) => {
      const response = await api.put(`/clinical/logbooks/${logbookId}`, {
        status: 'rejected',
        faculty_notes: reason || 'Rejected by faculty',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-logbooks'] })
      toast.success('Logbook rejected')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to reject logbook')
    },
  })

  const handleVerify = (logbookId: string) => {
    if (confirm('Are you sure you want to verify this logbook entry?')) {
      verifyLogbookMutation.mutate(logbookId)
    }
  }

  const handleReject = (logbookId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):')
    if (reason !== null) {
      rejectLogbookMutation.mutate({ logbookId, reason: reason || undefined })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'submitted':
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const pendingCount = logbooks?.filter((l: any) => l.status === 'submitted' || l.status === 'pending').length || 0
  const verifiedCount = logbooks?.filter((l: any) => l.status === 'verified').length || 0
  const rejectedCount = logbooks?.filter((l: any) => l.status === 'rejected').length || 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logbooks</h1>
          <p className="text-muted-foreground">Loading logbooks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logbooks</h1>
        <p className="text-muted-foreground">Review and verify clinical logbook entries</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by case type, diagnosis, or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logbooks List */}
      <div className="space-y-4">
        {logbooks?.map((logbook: any) => (
          <Card key={logbook.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(logbook.status)}
                  <div>
                    <CardTitle className="text-lg">{logbook.case_type || 'Clinical Case'}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted: {formatDate(logbook.created_at)}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    logbook.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : logbook.status === 'submitted' || logbook.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : logbook.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {logbook.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patient Information</p>
                    <p className="text-sm">
                      {logbook.patient_name || 'N/A'} 
                      {logbook.patient_age && `, ${logbook.patient_age} years`}
                      {logbook.patient_gender && `, ${logbook.patient_gender}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chief Complaint</p>
                    <p className="text-sm">{logbook.chief_complaint || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
                    <p className="text-sm">{logbook.diagnosis || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {logbook.procedures_performed && logbook.procedures_performed.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Procedures</p>
                      <div className="flex flex-wrap gap-1">
                        {logbook.procedures_performed.map((proc: string, idx: number) => (
                          <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                            {proc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {logbook.skills_demonstrated && logbook.skills_demonstrated.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Skills Demonstrated</p>
                      <div className="flex flex-wrap gap-1">
                        {logbook.skills_demonstrated.map((skill: string, idx: number) => (
                          <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {logbook.learning_points && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Learning Points</p>
                      <p className="text-sm">{logbook.learning_points}</p>
                    </div>
                  )}
                  {logbook.verified_at && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Verified At</p>
                      <p className="text-sm">{formatDate(logbook.verified_at)}</p>
                    </div>
                  )}
                  {logbook.status === 'rejected' && logbook.faculty_notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                      <p className="text-sm text-red-600">{logbook.faculty_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(logbook.status === 'submitted' || logbook.status === 'pending') && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    onClick={() => handleVerify(logbook.id)}
                    isLoading={verifyLogbookMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                  <Button
                    onClick={() => handleReject(logbook.id)}
                    isLoading={rejectLogbookMutation.isPending}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {logbooks?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'No logbooks found matching your filters'
                : 'No logbooks found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

