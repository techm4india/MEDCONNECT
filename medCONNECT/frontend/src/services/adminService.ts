import api from '@/lib/api'

// Static fake data for MVP
const FAKE_EVENTS = [
  {
    id: '1',
    title: 'Medical Conference 2024',
    description: 'Annual medical conference with keynote speakers',
    start_date: '2024-12-05',
    end_date: '2024-12-07',
    location: 'Main Auditorium',
    event_type: 'conference',
    college_id: 'college-1',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Workshop on Clinical Skills',
    description: 'Hands-on workshop for clinical examination techniques',
    start_date: '2024-12-10',
    end_date: '2024-12-10',
    location: 'Skills Lab',
    event_type: 'workshop',
    college_id: 'college-1',
    created_at: '2024-11-05T00:00:00Z',
    updated_at: '2024-11-05T00:00:00Z',
  },
  {
    id: '3',
    title: 'CME Program - Cardiology',
    description: 'Continuing Medical Education program on latest cardiology advances',
    start_date: '2024-12-15',
    end_date: '2024-12-15',
    location: 'Lecture Hall 1',
    event_type: 'cme',
    college_id: 'college-1',
    created_at: '2024-11-10T00:00:00Z',
    updated_at: '2024-11-10T00:00:00Z',
  },
]

const FAKE_CERTIFICATES = [
  {
    id: '1',
    student_id: 'student-1',
    certificate_type: 'bonafide',
    purpose: 'Bank account opening',
    status: 'approved',
    approved_by: 'admin-1',
    approved_at: '2024-11-16T10:00:00Z',
    file_url: null,
    college_id: 'college-1',
    created_at: '2024-11-15T08:00:00Z',
    updated_at: '2024-11-16T10:00:00Z',
  },
  {
    id: '2',
    student_id: 'student-1',
    certificate_type: 'study_certificate',
    purpose: 'Scholarship application',
    status: 'pending',
    approved_by: null,
    approved_at: null,
    file_url: null,
    college_id: 'college-1',
    created_at: '2024-11-20T14:00:00Z',
    updated_at: '2024-11-20T14:00:00Z',
  },
  {
    id: '3',
    student_id: 'student-1',
    certificate_type: 'conduct',
    purpose: 'Character certificate',
    status: 'approved',
    approved_by: 'admin-1',
    approved_at: '2024-11-12T09:00:00Z',
    file_url: null,
    college_id: 'college-1',
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-12T09:00:00Z',
  },
  {
    id: '4',
    student_id: 'student-1',
    certificate_type: 'fee_statement',
    purpose: 'Fee payment proof',
    status: 'approved',
    approved_by: 'admin-1',
    approved_at: '2024-11-18T11:00:00Z',
    file_url: null,
    college_id: 'college-1',
    created_at: '2024-11-17T15:00:00Z',
    updated_at: '2024-11-18T11:00:00Z',
  },
]

const FAKE_NOTICES = [
  {
    id: '1',
    title: 'Important: End Semester Examination Schedule',
    content: 'The end semester examinations will commence from December 15, 2024. All students are required to check their examination schedules on the portal.',
    priority: 'urgent',
    department: 'Examination Cell',
    created_by: 'admin-1',
    college_id: 'college-1',
    created_at: '2024-11-25T09:00:00Z',
    updated_at: '2024-11-25T09:00:00Z',
  },
  {
    id: '2',
    title: 'Library Hours Extended During Exam Period',
    content: 'The library will remain open until 10 PM from December 1 to December 20, 2024 to support students during the examination period.',
    priority: 'high',
    department: 'Library',
    created_by: 'admin-1',
    college_id: 'college-1',
    created_at: '2024-11-24T14:00:00Z',
    updated_at: '2024-11-24T14:00:00Z',
  },
  {
    id: '3',
    title: 'Hostel Mess Menu Update',
    content: 'New menu items have been added to the hostel mess. Please check the notice board for the updated menu.',
    priority: 'normal',
    department: 'Hostel Administration',
    created_by: 'admin-1',
    college_id: 'college-1',
    created_at: '2024-11-23T10:00:00Z',
    updated_at: '2024-11-23T10:00:00Z',
  },
]

const FAKE_ATTENDANCE = [
  {
    id: '1',
    student_id: 'student-1',
    session_id: 'session-1',
    attendance_date: '2024-11-25',
    status: 'present',
    check_in_time: '2024-11-25T09:00:00Z',
    check_out_time: '2024-11-25T17:00:00Z',
    location: 'College Campus',
    college_id: 'college-1',
    created_at: '2024-11-25T09:05:00Z',
    updated_at: '2024-11-25T17:00:00Z',
  },
  {
    id: '2',
    student_id: 'student-1',
    session_id: 'session-2',
    attendance_date: '2024-11-24',
    status: 'present',
    check_in_time: '2024-11-24T09:00:00Z',
    check_out_time: '2024-11-24T17:00:00Z',
    location: 'College Campus',
    college_id: 'college-1',
    created_at: '2024-11-24T09:03:00Z',
    updated_at: '2024-11-24T17:00:00Z',
  },
  {
    id: '3',
    student_id: 'student-1',
    session_id: 'session-3',
    attendance_date: '2024-11-23',
    status: 'late',
    check_in_time: '2024-11-23T09:15:00Z',
    check_out_time: '2024-11-23T17:00:00Z',
    location: 'College Campus',
    college_id: 'college-1',
    created_at: '2024-11-23T09:15:00Z',
    updated_at: '2024-11-23T17:00:00Z',
  },
  {
    id: '4',
    student_id: 'student-1',
    session_id: 'session-4',
    attendance_date: '2024-11-22',
    status: 'present',
    check_in_time: '2024-11-22T09:00:00Z',
    check_out_time: '2024-11-22T17:00:00Z',
    location: 'College Campus',
    college_id: 'college-1',
    created_at: '2024-11-22T09:02:00Z',
    updated_at: '2024-11-22T17:00:00Z',
  },
]

// Use static data for MVP (bypass API calls)
const USE_STATIC_DATA = true

export const adminService = {
  // Attendance
  getMyAttendance: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_ATTENDANCE })
    }
    return api.get('/admin/attendance/me')
  },
  createAttendance: (data: any) => api.post('/admin/attendance', data),
  updateAttendance: (id: string, data: any) => api.put(`/admin/attendance/${id}`, data),

  // Attendance Sessions
  getAttendanceSession: (id: string) => api.get(`/admin/attendance-sessions/${id}`),
  createAttendanceSession: (data: any) => api.post('/admin/attendance-sessions', data),

  // Certificates
  getMyCertificates: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_CERTIFICATES })
    }
    return api.get('/admin/certificates/me')
  },
  getCertificate: async (id: string) => {
    if (USE_STATIC_DATA) {
      const cert = FAKE_CERTIFICATES.find(c => c.id === id)
      return Promise.resolve({ data: cert || null })
    }
    return api.get(`/admin/certificates/${id}`)
  },
  createCertificate: async (data: any) => {
    if (USE_STATIC_DATA) {
      const newCert = {
        id: `new-${Date.now()}`,
        student_id: 'student-1',
        ...data,
        status: 'pending',
        approved_by: null,
        approved_at: null,
        file_url: null,
        college_id: 'college-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      FAKE_CERTIFICATES.push(newCert)
      return Promise.resolve({ data: newCert })
    }
    return api.post('/admin/certificates', data)
  },
  updateCertificate: (id: string, data: any) => api.put(`/admin/certificates/${id}`, data),

  // Notices
  getNotices: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_NOTICES })
    }
    return api.get('/admin/notices')
  },
  getNotice: async (id: string) => {
    if (USE_STATIC_DATA) {
      const notice = FAKE_NOTICES.find(n => n.id === id)
      return Promise.resolve({ data: notice || null })
    }
    return api.get(`/admin/notices/${id}`)
  },
  createNotice: (data: any) => api.post('/admin/notices', data),
  updateNotice: (id: string, data: any) => api.put(`/admin/notices/${id}`, data),

  // Events
  getEvents: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_EVENTS })
    }
    return api.get('/admin/events')
  },
  getEvent: async (id: string) => {
    if (USE_STATIC_DATA) {
      const event = FAKE_EVENTS.find(e => e.id === id)
      return Promise.resolve({ data: event || null })
    }
    return api.get(`/admin/events/${id}`)
  },
  createEvent: (data: any) => api.post('/admin/events', data),
  updateEvent: (id: string, data: any) => api.put(`/admin/events/${id}`, data),
  registerForEvent: (eventId: string) => api.post(`/admin/events/${eventId}/register`),

  // Fees
  getMyFees: () => api.get('/admin/fees/me'),
  getFee: (id: string) => api.get(`/admin/fees/${id}`),
  createFee: (data: any) => api.post('/admin/fees', data),
  updateFee: (id: string, data: any) => api.put(`/admin/fees/${id}`, data),
}



