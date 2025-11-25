import api from '@/lib/api'

// Static fake data for MVP
const FAKE_HOSTELS = [
  {
    id: '1',
    name: 'Boys Hostel A',
    type: 'boys',
    capacity: 200,
    occupied: 180,
    address: 'Block A, College Campus',
    warden_name: 'Dr. Ramesh Kumar',
    warden_contact: '+91-9876543210',
    facilities: ['WiFi', 'Mess', 'Laundry', 'Gym', 'Library'],
    college_id: 'college-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Girls Hostel B',
    type: 'girls',
    capacity: 150,
    occupied: 142,
    address: 'Block B, College Campus',
    warden_name: 'Dr. Sunita Sharma',
    warden_contact: '+91-9876543211',
    facilities: ['WiFi', 'Mess', 'Laundry', 'Gym', 'Library', 'Security'],
    college_id: 'college-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
  },
]

const FAKE_ALLOCATION = {
  id: '1',
  student_id: 'student-1',
  hostel_id: '1',
  hostel_name: 'Boys Hostel A',
  room_id: '101',
  room_number: '101',
  room_type: 'double',
  floor: 1,
  block: 'A',
  allocation_date: '2024-06-01',
  status: 'active',
  college_id: 'college-1',
  created_at: '2024-05-15T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
}

const FAKE_VISITORS = [
  {
    id: '1',
    student_id: 'student-1',
    visitor_name: 'Rajesh Kumar',
    visitor_relation: 'Father',
    visitor_phone: '+91-9876543210',
    visit_date: '2024-11-25',
    visit_time: '14:00',
    purpose: 'Parent Meeting',
    status: 'approved',
    approved_by: 'warden-1',
    entry_time: '14:05',
    exit_time: '16:30',
    college_id: 'college-1',
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-25T16:30:00Z',
  },
  {
    id: '2',
    student_id: 'student-1',
    visitor_name: 'Priya Sharma',
    visitor_relation: 'Sister',
    visitor_phone: '+91-9876543211',
    visit_date: '2024-12-05',
    visit_time: '10:00',
    purpose: 'Personal Visit',
    status: 'pending',
    approved_by: null,
    entry_time: null,
    exit_time: null,
    college_id: 'college-1',
    created_at: '2024-11-28T08:00:00Z',
    updated_at: '2024-11-28T08:00:00Z',
  },
]

// Use static data for MVP (bypass API calls)
const USE_STATIC_DATA = true

export const hostelService = {
  // Hostels
  getHostels: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_HOSTELS })
    }
    return api.get('/hostel/hostels')
  },
  // Note: GET /hostel/hostels/{id} and PUT /hostel/hostels/{id} not in backend
  createHostel: (data: any) => api.post('/hostel/hostels', data),

  // Rooms
  getRooms: (hostelId: string) => api.get(`/hostel/rooms/hostel/${hostelId}`),
  // Note: GET /hostel/rooms/{id} and PUT /hostel/rooms/{id} not in backend
  createRoom: (data: any) => api.post('/hostel/rooms', data),

  // Allocations
  getMyAllocation: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_ALLOCATION })
    }
    return api.get('/hostel/allocations/me')
  },
  createAllocation: (data: any) => api.post('/hostel/allocations', data),
  // Note: PUT /hostel/allocations/{id} not in backend

  // Visitors
  getMyVisitors: async () => {
    if (USE_STATIC_DATA) {
      return Promise.resolve({ data: FAKE_VISITORS })
    }
    return api.get('/hostel/visitors/me')
  },
  createVisitor: (data: any) => api.post('/hostel/visitors', data),
  // Note: PUT /hostel/visitors/{id} not in backend
}

