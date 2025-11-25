"""
Generate and optionally execute migration SQL
Uses Supabase URL and Service Role Key to generate SQL
Then you can run it in Supabase Dashboard SQL Editor
"""
from app.core.config import settings
from loguru import logger

SQL = """
-- MedConnect Database Migration
-- Copy and paste this into Supabase Dashboard > SQL Editor > Run

-- 1. Faculty Attendance Table
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

CREATE INDEX IF NOT EXISTS idx_faculty_attendance_faculty_id ON faculty_attendance(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_session_id ON faculty_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_date ON faculty_attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_faculty_attendance_college_id ON faculty_attendance(college_id);
ALTER TABLE faculty_attendance ENABLE ROW LEVEL SECURITY;

-- 2. NMC Fields
ALTER TABLE curriculum_modules ADD COLUMN IF NOT EXISTS nmc_aligned BOOLEAN DEFAULT TRUE;
ALTER TABLE curriculum_modules ADD COLUMN IF NOT EXISTS nmc_competency_codes TEXT[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_nmc_aligned ON curriculum_modules(nmc_aligned);

-- 3. 3D Fields
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS viewer_type TEXT CHECK (viewer_type IN ('anatomy', 'physiology', 'pathology', 'pharmacology', NULL));
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS interactive BOOLEAN DEFAULT FALSE;
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS embed_code TEXT;
CREATE INDEX IF NOT EXISTS idx_learning_resources_3d ON learning_resources(resource_type) WHERE resource_type = '3d';
"""

def main():
    logger.info("=" * 60)
    logger.info("MedConnect Migration SQL Generator")
    logger.info("=" * 60)
    
    # Save to file
    with open("migration.sql", "w") as f:
        f.write(SQL)
    
    logger.info("\n✓ SQL saved to: migration.sql")
    logger.info("\nNext steps:")
    logger.info("1. Open Supabase Dashboard")
    logger.info("2. Go to SQL Editor")
    logger.info("3. Copy contents of migration.sql")
    logger.info("4. Paste and click 'Run'")
    logger.info("\n" + "=" * 60)
    logger.info("SQL Preview:")
    logger.info("=" * 60)
    print(SQL)

if __name__ == "__main__":
    main()


