# Database Migration Guide

## Quick Start

### Option 1: Python Migration Script (Recommended)

1. **Set up environment variables** in your `.env` file:
```env
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PASSWORD=your_database_password
SUPABASE_DB_USER=postgres
SUPABASE_DB_NAME=postgres
SUPABASE_DB_PORT=5432
```

2. **Find your database connection details**:
   - Go to Supabase Dashboard
   - Settings → Database
   - Copy the connection string or individual values

3. **Run the migration**:
```bash
python apply_all_migrations.py
```

### Option 2: SQL File (Alternative)

If you prefer to run SQL directly:

1. **Generate the SQL file**:
```bash
python migrate_with_sql.py
```

2. **Run in Supabase SQL Editor**:
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Copy contents of `complete_migration.sql`
   - Click "Run"

## What Gets Migrated

### 1. Faculty Attendance Table
- Creates `faculty_attendance` table
- Adds indexes for performance
- Sets up Row Level Security (RLS)

### 2. NMC Alignment Fields
- Adds `nmc_aligned` to `curriculum_modules`
- Adds `nmc_competency_codes` array to `curriculum_modules`
- Creates index for NMC-aligned modules

### 3. 3D Curriculum Tools
- Adds `viewer_type` to `learning_resources`
- Adds `interactive` flag to `learning_resources`
- Adds `embed_code` to `learning_resources`
- Creates index for 3D resources

## Troubleshooting

### Error: "psycopg2 not installed"
```bash
pip install psycopg2-binary
```

### Error: "Database connection details missing"
- Make sure you've set all required environment variables
- Check Supabase Dashboard → Settings → Database for correct values

### Error: "Connection refused"
- Verify your database host and port
- Check if your IP is allowed in Supabase (Settings → Database → Connection Pooling)

### Error: "Table already exists"
- This is normal if you've run migrations before
- The script uses `IF NOT EXISTS` so it's safe to run multiple times

## Verification

After migration, verify by checking:

1. **Faculty Attendance**:
```sql
SELECT * FROM faculty_attendance LIMIT 1;
```

2. **NMC Fields**:
```sql
SELECT nmc_aligned, nmc_competency_codes FROM curriculum_modules LIMIT 1;
```

3. **3D Fields**:
```sql
SELECT viewer_type, interactive, embed_code FROM learning_resources WHERE resource_type = '3d' LIMIT 1;
```

## Rollback

If you need to rollback (not recommended in production):

```sql
-- Remove 3D fields
ALTER TABLE learning_resources DROP COLUMN IF EXISTS viewer_type;
ALTER TABLE learning_resources DROP COLUMN IF EXISTS interactive;
ALTER TABLE learning_resources DROP COLUMN IF EXISTS embed_code;

-- Remove NMC fields
ALTER TABLE curriculum_modules DROP COLUMN IF EXISTS nmc_aligned;
ALTER TABLE curriculum_modules DROP COLUMN IF EXISTS nmc_competency_codes;

-- Drop faculty attendance table
DROP TABLE IF EXISTS faculty_attendance CASCADE;
```


