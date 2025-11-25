"""
Database Migration Script
Applies all pending migrations to the Supabase database
"""
import sys
from pathlib import Path
from app.core.config import settings
from app.db.supabase import supabase_client
from loguru import logger

def migrate_faculty_attendance():
    """Add faculty_attendance table"""
    logger.info("Creating faculty_attendance table...")
    
    try:
        # Check if table exists
        result = supabase_client.get_client().table("faculty_attendance").select("id").limit(1).execute()
        logger.info("faculty_attendance table already exists")
        return True
    except Exception:
        # Table doesn't exist, create it
        pass
    
    try:
        # Create table using raw SQL
        create_table_sql = """
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
        """
        
        # Execute using Supabase RPC or direct SQL
        client = supabase_client.get_client()
        # Note: Supabase Python client doesn't support raw SQL directly
        # We'll use the REST API or check if we can use postgrest
        logger.warning("Direct SQL execution not available via Python client")
        logger.info("Please run the SQL migration manually or use Supabase dashboard")
        return False
        
    except Exception as e:
        logger.error(f"Error creating faculty_attendance table: {e}")
        return False


def migrate_nmc_and_3d_features():
    """Add NMC alignment and 3D features to existing tables"""
    logger.info("Adding NMC and 3D features...")
    
    client = supabase_client.get_client()
    
    # Check and add NMC fields to curriculum_modules
    try:
        # Try to select nmc_aligned to check if column exists
        test_result = client.table("curriculum_modules").select("nmc_aligned").limit(1).execute()
        logger.info("NMC fields already exist in curriculum_modules")
    except Exception:
        logger.warning("NMC fields need to be added - please run SQL migration")
    
    # Check and add 3D fields to learning_resources
    try:
        test_result = client.table("learning_resources").select("viewer_type").limit(1).execute()
        logger.info("3D fields already exist in learning_resources")
    except Exception:
        logger.warning("3D fields need to be added - please run SQL migration")
    
    return True


def check_table_exists(table_name: str) -> bool:
    """Check if a table exists"""
    try:
        client = supabase_client.get_client()
        result = client.table(table_name).select("id").limit(1).execute()
        return True
    except Exception:
        return False


def add_column_if_not_exists(table_name: str, column_name: str, column_type: str, default_value: str = None):
    """Add a column to a table if it doesn't exist"""
    # Note: Supabase Python client doesn't support ALTER TABLE directly
    # This is a placeholder that logs what needs to be done
    logger.info(f"Column {column_name} needs to be added to {table_name} via SQL")
    logger.info(f"SQL: ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {column_name} {column_type}" + 
                (f" DEFAULT {default_value}" if default_value else ""))


def run_migrations():
    """Run all migrations"""
    logger.info("Starting database migrations...")
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.error("Supabase credentials not configured!")
        logger.error("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file")
        return False
    
    try:
        # Test connection
        client = supabase_client.get_client()
        logger.info("✓ Connected to Supabase")
        
        # Check if core tables exist
        required_tables = ["users", "colleges", "curriculum_modules", "learning_resources", "attendance_sessions"]
        for table in required_tables:
            if check_table_exists(table):
                logger.info(f"✓ Table '{table}' exists")
            else:
                logger.error(f"✗ Table '{table}' does not exist - please run initial schema first")
                return False
        
        # Migration 1: Faculty Attendance
        logger.info("\n--- Migration 1: Faculty Attendance ---")
        if check_table_exists("faculty_attendance"):
            logger.info("✓ faculty_attendance table already exists")
        else:
            logger.warning("⚠ faculty_attendance table needs to be created")
            logger.info("Please run this SQL in Supabase SQL Editor:")
            logger.info("""
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
            """)
        
        # Migration 2: NMC Alignment Fields
        logger.info("\n--- Migration 2: NMC Alignment Fields ---")
        try:
            client.table("curriculum_modules").select("nmc_aligned").limit(1).execute()
            logger.info("✓ NMC fields already exist in curriculum_modules")
        except Exception:
            logger.warning("⚠ NMC fields need to be added to curriculum_modules")
            logger.info("Please run this SQL in Supabase SQL Editor:")
            logger.info("""
ALTER TABLE curriculum_modules 
ADD COLUMN IF NOT EXISTS nmc_aligned BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS nmc_competency_codes TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_curriculum_modules_nmc_aligned ON curriculum_modules(nmc_aligned);
            """)
        
        # Migration 3: 3D Curriculum Tools
        logger.info("\n--- Migration 3: 3D Curriculum Tools ---")
        try:
            client.table("learning_resources").select("viewer_type").limit(1).execute()
            logger.info("✓ 3D fields already exist in learning_resources")
        except Exception:
            logger.warning("⚠ 3D fields need to be added to learning_resources")
            logger.info("Please run this SQL in Supabase SQL Editor:")
            logger.info("""
ALTER TABLE learning_resources
ADD COLUMN IF NOT EXISTS viewer_type TEXT CHECK (viewer_type IN ('anatomy', 'physiology', 'pathology', 'pharmacology', NULL)),
ADD COLUMN IF NOT EXISTS interactive BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS embed_code TEXT;

CREATE INDEX IF NOT EXISTS idx_learning_resources_3d ON learning_resources(resource_type) WHERE resource_type = '3d';
            """)
        
        logger.info("\n✓ Migration check complete!")
        logger.info("Note: Supabase Python client doesn't support DDL operations directly.")
        logger.info("Please run the SQL statements shown above in your Supabase SQL Editor.")
        
        return True
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("MedConnect Database Migration Script")
    logger.info("=" * 60)
    
    success = run_migrations()
    
    if success:
        logger.info("\n✓ Migration process completed!")
        sys.exit(0)
    else:
        logger.error("\n✗ Migration process failed!")
        sys.exit(1)


