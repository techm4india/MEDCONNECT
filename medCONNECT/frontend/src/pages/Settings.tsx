import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Mail, Phone, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function Settings() {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await userService.getCurrentUser()
      return response.data
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => userService.updateCurrentUser(data),
    onSuccess: (data) => {
      updateUser(data.data)
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      toast.success('Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: currentUser?.full_name || user?.full_name || '',
      email: currentUser?.email || user?.email || '',
      phone: currentUser?.phone || user?.phone || '',
    },
  })

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <Input {...register('full_name')} />
              {errors.full_name && (
                <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input type="email" {...register('email')} disabled />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                Phone
              </label>
              <Input type="tel" {...register('phone')} />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2">Role</label>
              <Input value={user?.role?.toUpperCase() || ''} disabled />
            </div>
            <Button type="submit" isLoading={updateProfileMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}




