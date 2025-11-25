import api from '@/lib/api'

// Static fake data for MVP
const FAKE_POSTINGS = [
  {
    id: '1',
    student_id: 'student-1',
    department_id: 'dept-1',
    department_name: 'Cardiology',
    start_date: '2024-11-16',
    end_date: '2024-11-30',
    status: 'active',
    supervisor_id: 'faculty-1',
    supervisor_name: 'Dr. Rajesh Kumar',
    college_id: 'college-1',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-16T00:00:00Z',
  },
  {
    id: '2',
    student_id: 'student-1',
    department_id: 'dept-2',
    department_name: 'Pediatrics',
    start_date: '2024-12-01',
    end_date: '2024-12-15',
    status: 'upcoming',
    supervisor_id: 'faculty-2',
    supervisor_name: 'Dr. Priya Sharma',
    college_id: 'college-1',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-16T00:00:00Z',
  },
  {
    id: '3',
    student_id: 'student-1',
    department_id: 'dept-3',
    department_name: 'Surgery',
    start_date: '2024-10-01',
    end_date: '2024-10-15',
    status: 'completed',
    supervisor_id: 'faculty-3',
    supervisor_name: 'Dr. Amit Patel',
    college_id: 'college-1',
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
  },
]

const FAKE_LOGBOOKS = [
  {
    id: '1',
    student_id: 'student-1',
    posting_id: '1',
    case_title: 'Acute Myocardial Infarction',
    case_description: 'Patient presented with chest pain and ST elevation',
    diagnosis: 'STEMI',
    management: 'Thrombolysis and PCI',
    learning_points: 'ECG interpretation, cardiac enzymes, management protocol',
    status: 'verified',
    verified_by: 'faculty-1',
    verified_at: '2024-11-20T10:00:00Z',
    department_name: 'Cardiology',
    college_id: 'college-1',
    created_at: '2024-11-18T08:00:00Z',
    updated_at: '2024-11-20T10:00:00Z',
  },
  {
    id: '2',
    student_id: 'student-1',
    posting_id: '1',
    case_title: 'Hypertensive Crisis',
    case_description: 'Patient with severe hypertension and headache',
    diagnosis: 'Hypertensive Emergency',
    management: 'IV antihypertensives, monitoring',
    learning_points: 'Blood pressure management, drug selection',
    status: 'submitted',
    verified_by: null,
    verified_at: null,
    department_name: 'Cardiology',
    college_id: 'college-1',
    created_at: '2024-11-19T14:00:00Z',
    updated_at: '2024-11-19T14:00:00Z',
  },
  {
    id: '3',
    student_id: 'student-1',
    posting_id: '3',
    case_title: 'Appendicitis',
    case_description: 'Patient with right lower quadrant pain',
    diagnosis: 'Acute Appendicitis',
    management: 'Appendectomy',
    learning_points: 'Clinical examination, differential diagnosis',
    status: 'verified',
    verified_by: 'faculty-3',
    verified_at: '2024-10-10T11:00:00Z',
    department_name: 'Surgery',
    college_id: 'college-1',
    created_at: '2024-10-08T09:00:00Z',
    updated_at: '2024-10-10T11:00:00Z',
  },
]

// Use static data for MVP (bypass API calls)
const USE_STATIC_DATA = true

export const clinicalService = {
  // Postings
  getMyPostings: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_POSTINGS })
    }
    return api.get('/clinical/postings/me')
  },
  getPosting: async (id: string) => {
    if (USE_STATIC_DATA) {
      const posting = FAKE_POSTINGS.find(p => p.id === id)
      return Promise.resolve({ data: posting || null })
    }
    return api.get(`/clinical/postings/${id}`)
  },
  createPosting: (data: any) => api.post('/clinical/postings', data),
  updatePosting: (id: string, data: any) => api.put(`/clinical/postings/${id}`, data),

  // Logbooks
  getMyLogbooks: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_LOGBOOKS })
    }
    return api.get('/clinical/logbooks/me')
  },
  getLogbook: async (id: string) => {
    if (USE_STATIC_DATA) {
      const logbook = FAKE_LOGBOOKS.find(l => l.id === id)
      return Promise.resolve({ data: logbook || null })
    }
    return api.get(`/clinical/logbooks/${id}`)
  },
  createLogbook: (data: any) => api.post('/clinical/logbooks', data),
  updateLogbook: (id: string, data: any) => api.put(`/clinical/logbooks/${id}`, data),

  // OPD Sessions
  getOPDSession: (id: string) => api.get(`/clinical/opd-sessions/${id}`),
  createOPDSession: (data: any) => api.post('/clinical/opd-sessions', data),
  updateOPDSession: (id: string, data: any) => api.put(`/clinical/opd-sessions/${id}`, data),
}



