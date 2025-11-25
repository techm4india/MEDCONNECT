import api from '@/lib/api'

export const userService = {
  getCurrentUser: () => api.get('/users/me'),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateCurrentUser: (data: any) => api.put('/users/me', data),
  getUsers: (role?: string) => api.get('/users', { params: { role } }),
}




