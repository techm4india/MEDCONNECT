import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FileText, Calendar, Bell, DollarSign, Plus, QrCode, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const certificateSchema = z.object({
  certificate_type: z.enum(['bonafide', 'study_certificate', 'fee_statement', 'conduct', 'internship', 'attendance']),
  purpose: z.string().optional(),
})

type CertificateForm = z.infer<typeof certificateSchema>

export function Admin() {
  const { user } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'certificates' | 'notices' | 'events' | 'attendance'>('certificates')
  const [showCertificateForm, setShowCertificateForm] = useState(false)
  const queryClient = useQueryClient()

  // Check URL params for tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['certificates', 'notices', 'events', 'attendance'].includes(tab)) {
      setActiveTab(tab as any)
    }
  }, [searchParams])

  const { data: myCertificates } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: async () => {
      const response = await adminService.getMyCertificates()
      return response.data
    },
    enabled: user?.role === 'student',
  })

  const { data: notices } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const response = await adminService.getNotices()
      return response.data
    },
  })

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await adminService.getEvents()
      return response.data
    },
  })

  const { data: myAttendance } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: async () => {
      const response = await adminService.getMyAttendance()
      return response.data
    },
    enabled: user?.role === 'student',
  })

  const createCertificateMutation = useMutation({
    mutationFn: (data: CertificateForm) => adminService.createCertificate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-certificates'] })
      toast.success('Certificate request created successfully')
      setShowCertificateForm(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create certificate request')
    },
  })

  const registerEventMutation = useMutation({
    mutationFn: (eventId: string) => adminService.registerForEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Registered for event successfully')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CertificateForm>({
    resolver: zodResolver(certificateSchema),
  })

  const onSubmit = (data: CertificateForm) => {
    createCertificateMutation.mutate(data)
    reset()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">Manage certificates, notices, events, and attendance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => {
            setActiveTab('certificates')
            setSearchParams({ tab: 'certificates' })
          }}
          className={`px-4 py-2 font-medium ${
            activeTab === 'certificates'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <FileText className="inline h-4 w-4 mr-2" />
          Certificates
        </button>
        <button
          onClick={() => {
            setActiveTab('notices')
            setSearchParams({ tab: 'notices' })
          }}
          className={`px-4 py-2 font-medium ${
            activeTab === 'notices'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Bell className="inline h-4 w-4 mr-2" />
          Notices
        </button>
        <button
          onClick={() => {
            setActiveTab('events')
            setSearchParams({ tab: 'events' })
          }}
          className={`px-4 py-2 font-medium ${
            activeTab === 'events'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Calendar className="inline h-4 w-4 mr-2" />
          Events
        </button>
        <button
          onClick={() => {
            setActiveTab('attendance')
            setSearchParams({ tab: 'attendance' })
          }}
          className={`px-4 py-2 font-medium ${
            activeTab === 'attendance'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <QrCode className="inline h-4 w-4 mr-2" />
          Attendance
        </button>
      </div>

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {user?.role === 'student' && (
            <div className="flex justify-end">
              <Button onClick={() => setShowCertificateForm(!showCertificateForm)}>
                <Plus className="mr-2 h-4 w-4" />
                Request Certificate
              </Button>
            </div>
          )}

          {showCertificateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Request Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Certificate Type</label>
                    <select
                      {...register('certificate_type')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="bonafide">Bonafide Certificate</option>
                      <option value="study_certificate">Study Certificate</option>
                      <option value="fee_statement">Fee Statement</option>
                      <option value="conduct">Conduct Certificate</option>
                      <option value="internship">Internship Certificate</option>
                      <option value="attendance">Attendance Certificate</option>
                    </select>
                    {errors.certificate_type && (
                      <p className="text-sm text-destructive mt-1">{errors.certificate_type.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Purpose (Optional)</label>
                    <Input {...register('purpose')} placeholder="Purpose of certificate" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" isLoading={createCertificateMutation.isPending}>
                      Submit Request
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCertificateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {myCertificates && myCertificates.length > 0 ? (
              myCertificates.map((cert: any) => (
                <Card key={cert.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold capitalize">
                          {cert.certificate_type.replace('_', ' ')}
                        </h3>
                        {cert.purpose && (
                          <p className="text-sm text-muted-foreground mt-1">Purpose: {cert.purpose}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Requested: {formatDate(cert.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {cert.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : cert.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-orange-600" />
                        ) : null}
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            cert.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : cert.status === 'generated'
                              ? 'bg-blue-100 text-blue-800'
                              : cert.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cert.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No certificate requests yet</p>
                  {user?.role === 'student' && (
                    <Button
                      onClick={() => setShowCertificateForm(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Request Your First Certificate
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {notices?.map((notice: any) => (
            <Card key={notice.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{notice.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(notice.created_at)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      notice.priority === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : notice.priority === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {notice.priority}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notice.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events?.map((event: any) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(event.start_date)} - {formatDate(event.end_date)}
                    </p>
                    {event.location && (
                      <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                    )}
                  </div>
                  <span className="rounded-full px-2 py-1 text-xs bg-primary/10 text-primary">
                    {event.event_type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {event.description && <p className="text-sm mb-4">{event.description}</p>}
                {event.registration_required && (
                  <Button
                    onClick={() => registerEventMutation.mutate(event.id)}
                    isLoading={registerEventMutation.isPending}
                  >
                    Register
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && user?.role === 'student' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myAttendance?.map((attendance: any) => (
                  <div key={attendance.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{formatDate(attendance.attendance_date)}</p>
                      <p className="text-sm text-muted-foreground">
                        Session: {attendance.session_id?.slice(0, 8)}...
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        attendance.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : attendance.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : attendance.status === 'late'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {attendance.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}



