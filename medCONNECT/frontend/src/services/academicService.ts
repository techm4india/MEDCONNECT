import api from '@/lib/api'

export const academicService = {
  // Subjects
  getSubjects: (year?: number) => api.get('/academic/subjects', { params: { year } }),
  getSubject: (id: string) => api.get(`/academic/subjects/${id}`),
  createSubject: (data: any) => api.post('/academic/subjects', data),
  updateSubject: (id: string, data: any) => api.put(`/academic/subjects/${id}`, data),

  // Modules
  getModules: (subjectId: string) => api.get(`/academic/modules/subject/${subjectId}`),
  getModule: (id: string) => api.get(`/academic/modules/${id}`),
  createModule: (data: any) => api.post('/academic/modules', data),
  updateModule: (id: string, data: any) => api.put(`/academic/modules/${id}`, data),

  // Resources
  getResources: (moduleId: string) => api.get(`/academic/resources/module/${moduleId}`),
  getResource: (id: string) => api.get(`/academic/resources/${id}`),
  createResource: (data: any) => api.post('/academic/resources', data),
  updateResource: (id: string, data: any) => api.put(`/academic/resources/${id}`, data),

  // Progress
  getMyProgress: () => api.get('/academic/progress/me'),
  getProgress: (moduleId: string) => api.get(`/academic/progress/${moduleId}`),
  createProgress: (data: any) => api.post('/academic/progress', data),

  // Allocations
  getAllocations: (studentId?: string, topicId?: string) => {
    const params: any = {}
    if (studentId) params.student_id = studentId
    if (topicId) params.topic_id = topicId
    return api.get('/academic/allocations', { params })
  },
  createAllocation: (data: any) => api.post('/academic/allocations', data),
}

