import api from '@/lib/api'

export const collegeService = {
  // Colleges
  getColleges: () => api.get('/colleges'),
  getCollege: (id: string) => api.get(`/colleges/${id}`),
  createCollege: (data: any) => api.post('/colleges', data),
  updateCollege: (id: string, data: any) => api.put(`/colleges/${id}`, data),

  // Departments
  getDepartments: (collegeId: string) => api.get(`/colleges/${collegeId}/departments`),
  getDepartment: (id: string) => api.get(`/colleges/departments/${id}`),
  createDepartment: (collegeId: string, data: any) => api.post(`/colleges/${collegeId}/departments`, data),
  updateDepartment: (id: string, data: any) => api.put(`/colleges/departments/${id}`, data),
}




