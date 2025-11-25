import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clinicalService } from '@/services/clinicalService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Stethoscope, Plus, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'

const logbookSchema = z.object({
  case_type: z.string().min(1, 'Case type is required'),
  patient_age: z.number().optional(),
  patient_gender: z.string().optional(),
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  procedures_performed: z.array(z.string()).optional(),
  skills_demonstrated: z.array(z.string()).optional(),
  learning_points: z.string().optional(),
  posting_id: z.string().uuid('Valid posting ID is required'),
})

type LogbookForm = z.infer<typeof logbookSchema>

export function Clinical() {
  const { user } = useAuthStore()
  const [showLogbookForm, setShowLogbookForm] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: postings } = useQuery({
    queryKey: ['my-postings'],
    queryFn: async () => {
      const response = await clinicalService.getMyPostings()
      return response.data
    },
  })

  const { data: logbooks } = useQuery({
    queryKey: ['my-logbooks'],
    queryFn: async () => {
      const response = await clinicalService.getMyLogbooks()
      return response.data
    },
  })

  const createLogbookMutation = useMutation({
    mutationFn: (data: LogbookForm) => clinicalService.createLogbook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-logbooks'] })
      toast.success('Logbook entry created successfully')
      setShowLogbookForm(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create logbook entry')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LogbookForm>({
    resolver: zodResolver(logbookSchema),
  })

  const onSubmit = (data: LogbookForm) => {
    createLogbookMutation.mutate(data)
    reset()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'submitted':
        return <Clock className="h-5 w-5 text-orange-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical</h1>
          <p className="text-muted-foreground">Manage postings and clinical logbooks</p>
        </div>
        {user?.role === 'student' && (
          <Button onClick={() => setShowLogbookForm(!showLogbookForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New Logbook Entry
          </Button>
        )}
      </div>

      {showLogbookForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Logbook Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Posting</label>
                <select
                  {...register('posting_id')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a posting</option>
                  {postings?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.department_id} - {formatDate(p.start_date)}
                    </option>
                  ))}
                </select>
                {errors.posting_id && (
                  <p className="text-sm text-destructive mt-1">{errors.posting_id.message}</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Case Type</label>
                  <Input {...register('case_type')} placeholder="e.g., OPD, IPD, Emergency" />
                  {errors.case_type && (
                    <p className="text-sm text-destructive mt-1">{errors.case_type.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Patient Age</label>
                  <Input type="number" {...register('patient_age', { valueAsNumber: true })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Patient Gender</label>
                <select
                  {...register('patient_gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Chief Complaint</label>
                <Input {...register('chief_complaint')} placeholder="Patient's chief complaint" />
                {errors.chief_complaint && (
                  <p className="text-sm text-destructive mt-1">{errors.chief_complaint.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Diagnosis</label>
                <Input {...register('diagnosis')} placeholder="Diagnosis" />
                {errors.diagnosis && (
                  <p className="text-sm text-destructive mt-1">{errors.diagnosis.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" isLoading={createLogbookMutation.isPending}>
                  Create Entry
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowLogbookForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              My Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postings?.map((posting: any) => (
                <div key={posting.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{posting.department_id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(posting.start_date)} - {formatDate(posting.end_date)}
                      </p>
                      {posting.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{posting.notes}</p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        posting.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : posting.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {posting.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Logbooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logbooks?.map((logbook: any) => (
                <div key={logbook.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{logbook.case_type}</h3>
                        {getStatusIcon(logbook.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Diagnosis:</strong> {logbook.diagnosis}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Chief Complaint:</strong> {logbook.chief_complaint}
                      </p>
                      {logbook.verified_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Verified: {formatDate(logbook.verified_at)}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        logbook.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : logbook.status === 'submitted'
                          ? 'bg-orange-100 text-orange-800'
                          : logbook.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {logbook.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




