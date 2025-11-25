"""
Simple migration using Supabase URL and Service Role Key
"""
import sys
from urllib.parse import urlparse
from app.core.config import settings
from loguru import logger

try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
except ImportError:
    logger.error("psycopg2-binary required: pip install psycopg2-binary")
    sys.exit(1)


def get_connection():
    """Get DB connection from Supabase URL and Service Role Key"""
    if not settings.SUPABASE_URL:
        logger.error("SUPABASE_URL not set in .env")
        sys.exit(1)
    
    if not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.error("SUPABASE_SERVICE_ROLE_KEY not set in .env")
        sys.exit(1)
    
    # Extract project ref from URL: https://xxxxx.supabase.co
    parsed = urlparse(settings.SUPABASE_URL)
    project_ref = parsed.hostname.replace('.supabase.co', '')
    
    # Direct connection using service role key as password
    # Supabase allows using service role key for direct DB access
    conn_str = f"postgresql://postgres.{project_ref}:{settings.SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
    
    try:
        conn = psycopg2.connect(conn_str)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        logger.info("✓ Connected to database")
        return conn
    except Exception as e:
        # Try alternative connection method
        logger.info("Trying alternative connection...")
        db_host = f"db.{project_ref}.supabase.co"
        try:
            # Use service role key as password (works for some Supabase setups)
            conn = psycopg2.connect(
                host=db_host,
                port=5432,
                database="postgres",
                user=f"postgres.{project_ref}",
                password=settings.SUPABASE_SERVICE_ROLE_KEY,
                sslmode="require"
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            logger.info("✓ Connected to database")
            return conn
        except Exception as e2:
            logger.error(f"Connection failed: {e2}")
            logger.info("\nYou need the actual database password, not the service role key.")
            logger.info("Get it from: Supabase Dashboard > Settings > Database")
            logger.info("Add to .env: SUPABASE_DB_PASSWORD=your_password")
            sys.exit(1)


def execute(conn, sql, desc):
    """Execute SQL"""
    try:
        cur = conn.cursor()
        cur.execute(sql)
        cur.close()
        logger.info(f"✓ {desc}")
        return True
    except Exception as e:
        if "already exists" in str(e).lower():
            logger.info(f"ℹ {desc} (already exists)")
            return True
        logger.error(f"✗ {desc}: {e}")
        return False


def migrate():
    """Run all migrations"""
    logger.info("=" * 60)
    logger.info("MedConnect Migration")
    logger.info("=" * 60)
    
    conn = get_connection()
    
    # Faculty attendance
    logger.info("\n1. Creating faculty_attendance table...")
    execute(conn, """
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
    """, "Created faculty_attendance table")
    
    execute(conn, "CREATE INDEX IF NOT EXISTS idx_faculty_attendance_faculty_id ON faculty_attendance(faculty_id);", "Index on faculty_id")
    execute(conn, "CREATE INDEX IF NOT EXISTS idx_faculty_attendance_session_id ON faculty_attendance(session_id);", "Index on session_id")
    execute(conn, "CREATE INDEX IF NOT EXISTS idx_faculty_attendance_date ON faculty_attendance(attendance_date);", "Index on date")
    execute(conn, "ALTER TABLE faculty_attendance ENABLE ROW LEVEL SECURITY;", "Enabled RLS")
    
    # NMC fields
    logger.info("\n2. Adding NMC fields...")
    execute(conn, "ALTER TABLE curriculum_modules ADD COLUMN IF NOT EXISTS nmc_aligned BOOLEAN DEFAULT TRUE;", "Added nmc_aligned")
    execute(conn, "ALTER TABLE curriculum_modules ADD COLUMN IF NOT EXISTS nmc_competency_codes TEXT[] DEFAULT '{}';", "Added nmc_competency_codes")
    execute(conn, "CREATE INDEX IF NOT EXISTS idx_curriculum_modules_nmc_aligned ON curriculum_modules(nmc_aligned);", "Index on nmc_aligned")
    
    # 3D fields
    logger.info("\n3. Adding 3D fields...")
    execute(conn, "ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS viewer_type TEXT CHECK (viewer_type IN ('anatomy', 'physiology', 'pathology', 'pharmacology', NULL));", "Added viewer_type")
    execute(conn, "ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS interactive BOOLEAN DEFAULT FALSE;", "Added interactive")
    execute(conn, "ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS embed_code TEXT;", "Added embed_code")
    execute(conn, "CREATE INDEX IF NOT EXISTS idx_learning_resources_3d ON learning_resources(resource_type) WHERE resource_type = '3d';", "Index for 3D")
    
    conn.close()
    logger.info("\n" + "=" * 60)
    logger.info("✓ Migration complete!")
    logger.info("=" * 60)


if __name__ == "__main__":
    try:
        migrate()
    except KeyboardInterrupt:
        logger.info("\nMigration cancelled")
        sys.exit(1)
    except Exception as e:
        logger.error(f"\n✗ Migration failed: {e}")
        sys.exit(1)


