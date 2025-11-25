-- Migration: Add Faculty Attendance Table
-- Run this in your Supabase SQL Editor

-- Faculty Attendance Table
CREATE TABLE IF NOT EXISTS faculty_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    attendance_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'on_leave')),
    location_latitude FLOAT,
    location_longitude FLOAT,
    qr_code TEXT,
    verified_by UUID REFERENCES users(id),
    remarks TEXT,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_faculty_id ON faculty_attendance(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_session_id ON faculty_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_date ON faculty_attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_college_id ON faculty_attendance(college_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_status ON faculty_attendance(status);

-- Enable Row Level Security
ALTER TABLE faculty_attendance ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (adjust based on your security requirements)
-- Allow faculty to view their own attendance
CREATE POLICY "Faculty can view own attendance"
    ON faculty_attendance FOR SELECT
    USING (auth.uid() = faculty_id);

-- Allow admins/HODs to view all attendance in their college
CREATE POLICY "Admins can view all faculty attendance"
    ON faculty_attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'hod', 'principal', 'dme')
            AND users.college_id = faculty_attendance.college_id
        )
    );

-- Allow faculty to create their own attendance
CREATE POLICY "Faculty can create own attendance"
    ON faculty_attendance FOR INSERT
    WITH CHECK (auth.uid() = faculty_id);

-- Allow admins/HODs to create attendance for any faculty
CREATE POLICY "Admins can create faculty attendance"
    ON faculty_attendance FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'hod', 'principal')
            AND users.college_id = faculty_attendance.college_id
        )
    );

-- Allow admins/HODs to update attendance
CREATE POLICY "Admins can update faculty attendance"
    ON faculty_attendance FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'hod', 'principal')
            AND users.college_id = faculty_attendance.college_id
        )
    );


