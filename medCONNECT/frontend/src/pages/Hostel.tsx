import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hostelService } from '@/services/hostelService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Building2, Bed, Users, Calendar, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export function Hostel() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: hostels } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const response = await hostelService.getHostels()
      return response.data
    },
    enabled: user?.role !== 'student', // Only show hostel list to admin/warden, not students
  })

  const { data: myAllocation } = useQuery({
    queryKey: ['my-allocation'],
    queryFn: async () => {
      const response = await hostelService.getMyAllocation()
      return response.data
    },
    enabled: user?.role === 'student',
  })

  const { data: myVisitors } = useQuery({
    queryKey: ['my-visitors'],
    queryFn: async () => {
      const response = await hostelService.getMyVisitors()
      return response.data
    },
    enabled: user?.role === 'student',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hostel Management</h1>
        <p className="text-muted-foreground">Manage hostel accommodations and visitors</p>
      </div>

      {/* Student View: Room Allocation and Visitors */}
      {user?.role === 'student' && (
        <div className="grid gap-4 md:grid-cols-2">
          {myAllocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  My Room Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hostel:</span>
                    <span className="font-medium">{myAllocation.hostel_name || myAllocation.hostel_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span className="font-medium">{myAllocation.room_number || myAllocation.room_id}</span>
                  </div>
                  {myAllocation.floor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Floor:</span>
                      <span className="font-medium">{myAllocation.floor}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Allocated Date:</span>
                    <span className="font-medium">{formatDate(myAllocation.allocation_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        myAllocation.status === 'active' || myAllocation.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {myAllocation.status === 'active' || myAllocation.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visitor Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Visitor Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myVisitors && myVisitors.length > 0 ? (
                  myVisitors.map((visitor: any) => (
                    <div key={visitor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{visitor.visitor_name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Relation: {visitor.visitor_relation}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Visit Date: {formatDate(visitor.visit_date)}
                          </p>
                          {visitor.entry_time && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Entry: {formatDate(visitor.entry_time)} | Exit:{' '}
                              {visitor.exit_time ? formatDate(visitor.exit_time) : 'Pending'}
                            </p>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            visitor.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : visitor.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : visitor.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {visitor.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No visitor logs yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin/Warden View: Hostel List */}
      {user?.role !== 'student' && (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hostels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hostels && hostels.length > 0 ? (
                hostels.map((hostel: any) => (
                  <div key={hostel.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{hostel.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Capacity: {hostel.capacity} | Type: {hostel.gender || hostel.type || 'N/A'}
                        </p>
                        {hostel.address && (
                          <p className="text-sm text-muted-foreground mt-1">{hostel.address}</p>
                        )}
                        {hostel.warden_name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Warden: {hostel.warden_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hostels found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  )
}



