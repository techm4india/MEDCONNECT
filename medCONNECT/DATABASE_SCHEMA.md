# Database Schema Reference

This document outlines the database schema for MedConnect. The system uses Supabase (PostgreSQL) with Row Level Security (RLS) for multi-college support.

## Core Tables

### users
Stores user accounts for all roles.

```sql
- id (uuid, primary key)
- email (text, unique)
- password_hash (text)
- full_name (text)
- phone (text, nullable)
- role (text) -- student, faculty, admin, hod, principal, etc.
- college_id (uuid, foreign key -> colleges.id)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

### colleges
Stores college information.

```sql
- id (uuid, primary key)
- name (text)
- code (text, unique)
- address (text, nullable)
- city (text, nullable)
- state (text, nullable)
- pincode (text, nullable)
- phone (text, nullable)
- email (text, nullable)
- principal_id (uuid, nullable, foreign key -> users.id)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

### departments
Stores department information.

```sql
- id (uuid, primary key)
- college_id (uuid, foreign key -> colleges.id)
- name (text)
- code (text)
- department_type (text) -- academic, clinical, both
- hod_id (uuid, nullable, foreign key -> users.id)
- description (text, nullable)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

### student_profiles
Student-specific profile data.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id, unique)
- enrollment_number (text, unique)
- admission_year (integer)
- current_year (integer)
- department_id (uuid, nullable, foreign key -> departments.id)
- batch_id (uuid, nullable)
- hostel_id (uuid, nullable, foreign key -> hostels.id)
- room_number (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### faculty_profiles
Faculty-specific profile data.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id, unique)
- employee_id (text, unique)
- department_id (uuid, foreign key -> departments.id)
- designation (text)
- specialization (text, nullable)
- qualification (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

## Academic Tables

### subjects
Academic subjects.

```sql
- id (uuid, primary key)
- name (text)
- code (text)
- description (text, nullable)
- year (integer)
- semester (integer, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### curriculum_modules
Curriculum modules within subjects.

```sql
- id (uuid, primary key)
- subject_id (uuid, foreign key -> subjects.id)
- title (text)
- description (text, nullable)
- module_number (integer)
- topics (text[]) -- array of topic names
- learning_objectives (text[]) -- array of objectives
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### learning_resources
Learning resources (videos, PDFs, etc.).

```sql
- id (uuid, primary key)
- module_id (uuid, foreign key -> curriculum_modules.id)
- title (text)
- resource_type (text) -- video, pdf, image, diagram, pyq, 3d, audio, document
- file_url (text, nullable)
- external_url (text, nullable)
- description (text, nullable)
- order_index (integer, default 0)
- is_bookmarked (boolean, default false)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### student_module_progress
Student progress tracking.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- module_id (uuid, foreign key -> curriculum_modules.id)
- completion_percentage (float, 0-100)
- time_spent_minutes (integer, default 0)
- last_accessed_at (timestamp, nullable)
- resources_completed (uuid[]) -- array of resource IDs
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
- unique(student_id, module_id)
```

### topic_allocations
Topic allocations to batches by faculty.

```sql
- id (uuid, primary key)
- module_id (uuid, foreign key -> curriculum_modules.id)
- batch_id (uuid)
- faculty_id (uuid, foreign key -> users.id)
- allocated_date (timestamp)
- due_date (timestamp, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

## Clinical Tables

### postings
Clinical postings/rotations.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- department_id (uuid, foreign key -> departments.id)
- start_date (timestamp)
- end_date (timestamp)
- status (text) -- scheduled, active, completed, cancelled
- supervisor_id (uuid, nullable, foreign key -> users.id)
- notes (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### clinical_logbooks
Clinical logbook entries.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- posting_id (uuid, foreign key -> postings.id)
- case_type (text)
- patient_age (integer, nullable)
- patient_gender (text, nullable)
- chief_complaint (text)
- diagnosis (text)
- procedures_performed (text[])
- skills_demonstrated (text[])
- learning_points (text, nullable)
- faculty_notes (text, nullable)
- status (text) -- draft, submitted, verified, rejected
- verified_by (uuid, nullable, foreign key -> users.id)
- verified_at (timestamp, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### opd_sessions
OPD session records.

```sql
- id (uuid, primary key)
- department_id (uuid, foreign key -> departments.id)
- session_date (timestamp)
- total_patients (integer, default 0)
- students_present (uuid[]) -- array of user IDs
- faculty_id (uuid, foreign key -> users.id)
- notes (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### opd_student_involvement
Student involvement in OPD sessions.

```sql
- id (uuid, primary key)
- session_id (uuid, foreign key -> opd_sessions.id)
- student_id (uuid, foreign key -> users.id)
- cases_observed (integer, default 0)
- cases_assisted (integer, default 0)
- skills_practiced (text[])
- notes (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

## Hostel Tables

### hostels
Hostel information.

```sql
- id (uuid, primary key)
- name (text)
- address (text, nullable)
- capacity (integer)
- gender (text) -- male, female, mixed
- warden_id (uuid, nullable, foreign key -> users.id)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### rooms
Room information.

```sql
- id (uuid, primary key)
- hostel_id (uuid, foreign key -> hostels.id)
- room_number (text)
- floor (integer)
- capacity (integer)
- current_occupancy (integer, default 0)
- status (text) -- available, occupied, maintenance, reserved
- amenities (text[])
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### hostel_allocations
Hostel room allocations.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- room_id (uuid, foreign key -> rooms.id)
- hostel_id (uuid, foreign key -> hostels.id)
- allocation_date (timestamp)
- deallocation_date (timestamp, nullable)
- is_active (boolean, default true)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### visitor_logs
Visitor log entries.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- visitor_name (text)
- visitor_phone (text)
- visitor_relation (text)
- visit_date (timestamp)
- entry_time (timestamp, nullable)
- exit_time (timestamp, nullable)
- status (text) -- pending, approved, rejected, completed
- approved_by (uuid, nullable, foreign key -> users.id)
- notes (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### movement_logs
Student movement logs.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- movement_type (text) -- entry, exit
- timestamp (timestamp)
- location (text, nullable)
- reason (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
```

### mess_attendance
Mess attendance records.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- meal_type (text) -- breakfast, lunch, dinner
- attendance_date (timestamp)
- present (boolean, default true)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
```

## Admin Tables

### attendance
Attendance records.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- session_id (uuid, foreign key -> attendance_sessions.id)
- attendance_date (timestamp)
- status (text) -- present, absent, late, excused
- location_latitude (float, nullable)
- location_longitude (float, nullable)
- qr_code (text, nullable)
- verified_by (uuid, nullable, foreign key -> users.id)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### attendance_sessions
Attendance QR sessions.

```sql
- id (uuid, primary key)
- name (text)
- qr_code (text, unique)
- location_latitude (float)
- location_longitude (float)
- start_time (timestamp)
- end_time (timestamp)
- created_by (uuid, foreign key -> users.id)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### certificates
Certificate requests.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- certificate_type (text) -- bonafide, study_certificate, fee_statement, conduct, internship, attendance
- purpose (text, nullable)
- status (text) -- pending, generated, approved, rejected
- generated_file_url (text, nullable)
- approved_by (uuid, nullable, foreign key -> users.id)
- approved_at (timestamp, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### notices
Digital notice board.

```sql
- id (uuid, primary key)
- title (text)
- content (text)
- category (text)
- priority (text, default 'normal') -- low, normal, high, urgent
- target_audience (text[]) -- roles or 'all'
- attachments (text[]) -- file URLs
- published_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- created_by (uuid, foreign key -> users.id)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### events
Events and CMEs.

```sql
- id (uuid, primary key)
- title (text)
- description (text, nullable)
- event_type (text) -- cme, workshop, seminar, conference, other
- start_date (timestamp)
- end_date (timestamp)
- location (text, nullable)
- max_participants (integer, nullable)
- registration_required (boolean, default false)
- registration_deadline (timestamp, nullable)
- created_by (uuid, foreign key -> users.id)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### event_registrations
Event registrations.

```sql
- id (uuid, primary key)
- event_id (uuid, foreign key -> events.id)
- user_id (uuid, foreign key -> users.id)
- registration_date (timestamp)
- attendance_confirmed (boolean, default false)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- unique(event_id, user_id)
```

### fees
Fee records.

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key -> users.id)
- fee_type (text)
- amount (float)
- due_date (timestamp)
- paid_amount (float, default 0.0)
- payment_status (text) -- pending, completed, failed, refunded
- payment_date (timestamp, nullable)
- transaction_id (text, nullable)
- college_id (uuid, foreign key -> colleges.id)
- created_at (timestamp)
- updated_at (timestamp)
```

## Governance Tables

### governance_snapshots
Governance analytics snapshots.

```sql
- id (uuid, primary key)
- college_id (uuid, foreign key -> colleges.id)
- snapshot_type (text) -- daily, weekly, monthly
- snapshot_date (timestamp)
- metrics (jsonb) -- flexible metrics storage
- attendance_summary (jsonb)
- academic_summary (jsonb)
- clinical_summary (jsonb)
- department_summary (jsonb)
- alerts (jsonb[]) -- array of alert objects
- created_by (uuid, nullable, foreign key -> users.id)
- created_at (timestamp)
- updated_at (timestamp)
```

## Notifications Table

### notifications
In-app notifications.

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- title (text)
- message (text)
- type (text) -- info, warning, error, success
- is_read (boolean, default false)
- link (text, nullable)
- college_id (uuid, nullable, foreign key -> colleges.id)
- created_at (timestamp)
```

## Row Level Security (RLS)

All tables should have RLS policies to ensure:
1. Users can only access data from their college
2. Role-based access control is enforced
3. Students can only see their own data
4. Faculty can see data for their department
5. Admins can see all data for their college

Example RLS policy for users table:

```sql
CREATE POLICY "Users can view their own college data"
ON users FOR SELECT
USING (college_id = current_setting('app.current_college_id')::uuid);
```

## Indexes

Recommended indexes for performance:

```sql
-- Users
CREATE INDEX idx_users_college_id ON users(college_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Academic
CREATE INDEX idx_subjects_college_id ON subjects(college_id);
CREATE INDEX idx_modules_subject_id ON curriculum_modules(subject_id);
CREATE INDEX idx_progress_student_id ON student_module_progress(student_id);

-- Clinical
CREATE INDEX idx_postings_student_id ON postings(student_id);
CREATE INDEX idx_logbooks_student_id ON clinical_logbooks(student_id);

-- Admin
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
```

