import api from '@/lib/api'

export const aiService = {
  academicQuery: (data: { query: string; context?: string; module_id?: string }) =>
    api.post('/ai/academic/query', data),
  governanceQuery: (data: { query: string; metrics_type?: string }) =>
    api.post('/ai/governance/query', data),
}




