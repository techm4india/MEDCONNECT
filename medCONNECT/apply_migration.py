"""
Apply migration to make password_hash nullable
Run this script to fix the password_hash constraint issue
"""
from app.db.supabase import supabase_client
from loguru import logger

def apply_migration():
    """Apply migration to make password_hash nullable"""
    try:
        client = supabase_client.get_client()
        
        # Run the ALTER TABLE command
        migration_sql = """
        ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
        """
        
        logger.info("Applying migration: Make password_hash nullable...")
        
        # Execute the migration
        result = client.rpc('exec_sql', {'sql': migration_sql}).execute()
        
        logger.success("Migration applied successfully!")
        logger.info("password_hash column is now nullable")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to apply migration: {e}")
        logger.warning("\n" + "="*60)
        logger.warning("MANUAL MIGRATION REQUIRED:")
        logger.warning("="*60)
        logger.warning("Please run this SQL in Supabase SQL Editor:")
        logger.warning("")
        logger.warning("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;")
        logger.warning("")
        logger.warning("="*60)
        return False

if __name__ == "__main__":
    print("Applying password_hash migration...")
    print("=" * 60)
    success = apply_migration()
    if success:
        print("\n✅ Migration completed successfully!")
    else:
        print("\n⚠️  Please run the SQL manually in Supabase SQL Editor")



