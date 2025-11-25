import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export function Events() {
  const queryClient = useQueryClient()

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await adminService.getEvents()
      return response.data
    },
  })

  const registerEventMutation = useMutation({
    mutationFn: (eventId: string) => adminService.registerForEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Registered for event successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to register')
    },
  })

  const upcomingEvents = events?.filter((e: any) => new Date(e.start_date) > new Date()) || []
  const pastEvents = events?.filter((e: any) => new Date(e.start_date) <= new Date()) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events & CMEs</h1>
        <p className="text-muted-foreground">View and register for upcoming events</p>
      </div>

      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event: any) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.description && <p className="text-sm">{event.description}</p>}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.start_date)} - {formatDate(event.end_date)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Max {event.max_participants} participants
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="rounded-full px-2 py-1 text-xs bg-primary/10 text-primary">
                        {event.event_type}
                      </span>
                      {event.registration_required && (
                        <Button
                          onClick={() => registerEventMutation.mutate(event.id)}
                          isLoading={registerEventMutation.isPending}
                          size="sm"
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event: any) => (
              <Card key={event.id} className="opacity-75">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.description && <p className="text-sm">{event.description}</p>}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.start_date)} - {formatDate(event.end_date)}
                    </div>
                    <span className="rounded-full px-2 py-1 text-xs bg-gray-100 text-gray-800">
                      {event.event_type}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}




