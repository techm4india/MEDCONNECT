"""
Database Migration Script using Supabase SQL Execution
This script uses Supabase's REST API to execute SQL migrations
"""
import sys
import httpx
from app.core.config import settings
from loguru import logger


def execute_sql(sql: str) -> bool:
    """Execute SQL using Supabase REST API"""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.error("Supabase credentials not configured!")
        return False
    
    try:
        # Supabase REST API endpoint for SQL execution
        # Note: Supabase doesn't have a direct SQL execution endpoint via REST
        # We'll use the PostgREST API which requires different approach
        
        # Alternative: Use Supabase Management API or direct PostgreSQL connection
        logger.warning("Direct SQL execution via REST API is not available")
        logger.info("Please use one of these methods:")
        logger.info("1. Supabase Dashboard SQL Editor")
        logger.info("2. psql command line tool")
        logger.info("3. Python psycopg2 library (requires direct DB access)")
        
        return False
        
    except Exception as e:
        logger.error(f"Error executing SQL: {e}")
        return False


def generate_migration_sql() -> str:
    """Generate complete migration SQL"""
    return """
-- =====================================================
-- MedConnect Database Migrations
-- Run this in Supabase SQL Editor
-- =====================================================

-- Migration 1: Faculty Attendance Table
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

-- Indexes for faculty_attendance
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_faculty_id ON faculty_attendance(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_session_id ON faculty_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_date ON faculty_attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_college_id ON faculty_attendance(college_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_status ON faculty_attendance(status);

-- Enable Row Level Security
ALTER TABLE faculty_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for faculty_attendance
CREATE POLICY IF NOT EXISTS "Faculty can view own attendance"
    ON faculty_attendance FOR SELECT
    USING (auth.uid() = faculty_id);

CREATE POLICY IF NOT EXISTS "Admins can view all faculty attendance"
    ON faculty_attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'hod', 'principal', 'dme')
            AND users.college_id = faculty_attendance.college_id
        )
    );

CREATE POLICY IF NOT EXISTS "Faculty can create own attendance"
    ON faculty_attendance FOR INSERT
    WITH CHECK (auth.uid() = faculty_id);

CREATE POLICY IF NOT EXISTS "Admins can create faculty attendance"
    ON faculty_attendance FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'hod', 'principal')
            AND users.college_id = faculty_attendance.college_id
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can update faculty attendance"
    ON faculty_attendance FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'hod', 'principal')
            AND users.college_id = faculty_attendance.college_id
        )
    );

-- Migration 2: NMC Alignment Fields
ALTER TABLE curriculum_modules 
ADD COLUMN IF NOT EXISTS nmc_aligned BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS nmc_competency_codes TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_curriculum_modules_nmc_aligned ON curriculum_modules(nmc_aligned);

-- Migration 3: 3D Curriculum Tools
ALTER TABLE learning_resources
ADD COLUMN IF NOT EXISTS viewer_type TEXT CHECK (viewer_type IN ('anatomy', 'physiology', 'pathology', 'pharmacology', NULL)),
ADD COLUMN IF NOT EXISTS interactive BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS embed_code TEXT;

CREATE INDEX IF NOT EXISTS idx_learning_resources_3d ON learning_resources(resource_type) WHERE resource_type = '3d';

-- Add comments for documentation
COMMENT ON COLUMN curriculum_modules.nmc_aligned IS 'Indicates if module is aligned with NMC (National Medical Commission) curriculum standards';
COMMENT ON COLUMN curriculum_modules.nmc_competency_codes IS 'Array of NMC competency codes this module addresses';
COMMENT ON COLUMN learning_resources.viewer_type IS 'Type of 3D viewer: anatomy, physiology, pathology, or pharmacology';
COMMENT ON COLUMN learning_resources.interactive IS 'Whether the 3D resource is interactive';
COMMENT ON COLUMN learning_resources.embed_code IS 'Embed code for 3D viewers or external interactive content';

-- =====================================================
-- Migration Complete!
-- =====================================================
"""


def save_migration_file():
    """Save migration SQL to a file"""
    sql = generate_migration_sql()
    file_path = "complete_migration.sql"
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(sql)
        logger.info(f"✓ Migration SQL saved to: {file_path}")
        logger.info(f"You can now run this file in Supabase SQL Editor")
        return file_path
    except Exception as e:
        logger.error(f"Error saving migration file: {e}")
        return None


if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("MedConnect Database Migration SQL Generator")
    logger.info("=" * 60)
    
    file_path = save_migration_file()
    
    if file_path:
        logger.info(f"\n✓ Migration SQL file created: {file_path}")
        logger.info("\nNext steps:")
        logger.info("1. Open Supabase Dashboard")
        logger.info("2. Go to SQL Editor")
        logger.info(f"3. Copy and paste contents of {file_path}")
        logger.info("4. Click 'Run' to execute the migration")
        sys.exit(0)
    else:
        logger.error("\n✗ Failed to create migration file!")
        sys.exit(1)


