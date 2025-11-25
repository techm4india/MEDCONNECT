import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export interface LoginRequest {
  email: string
  password: string
  college_id: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  phone?: string
  role: string
  college_id: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: {
    id: string
    email: string
    full_name: string
    role: string
    college_id: string
    phone?: string
    is_active: boolean
  }
}

export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', data)
    const { setAuth } = useAuthStore.getState()
    setAuth(response.data.user, response.data.access_token, response.data.refresh_token)
    return response.data
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      const { logout } = useAuthStore.getState()
      logout()
    }
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },
}




