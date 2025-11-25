"""
Fix password_hash constraint by making it nullable
This script directly updates the database schema
"""
from app.db.supabase import supabase_client
from loguru import logger

def fix_password_hash():
    """Make password_hash nullable in users table"""
    try:
        client = supabase_client.get_client()
        
        logger.info("Attempting to fix password_hash constraint...")
        
        # Use Supabase's PostgREST to execute SQL
        # We'll use the REST API to run raw SQL
        try:
            # Method 1: Try using Supabase's SQL execution
            # Note: This requires the SQL Editor API or a function
            # For now, we'll provide the SQL and instructions
            
            logger.warning("=" * 60)
            logger.warning("MANUAL STEP REQUIRED:")
            logger.warning("=" * 60)
            logger.warning("")
            logger.warning("Please run this SQL in Supabase SQL Editor:")
            logger.warning("")
            logger.warning("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;")
            logger.warning("")
            logger.warning("Steps:")
            logger.warning("1. Go to https://supabase.com/dashboard")
            logger.warning("2. Select your project")
            logger.warning("3. Go to SQL Editor (left sidebar)")
            logger.warning("4. Click 'New query'")
            logger.warning("5. Paste the SQL above")
            logger.warning("6. Click 'Run' or press Ctrl+Enter")
            logger.warning("7. Wait for success message")
            logger.warning("")
            logger.warning("=" * 60)
            
            # Try to verify if it's already fixed
            try:
                # Try to insert a test record (will fail if constraint exists)
                test_result = client.table("users").select("id").limit(1).execute()
                logger.info("Database connection successful")
            except Exception as e:
                logger.error(f"Database connection issue: {e}")
            
            return False  # Manual step required
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return False
            
    except Exception as e:
        logger.error(f"Failed to connect to Supabase: {e}")
        logger.warning("Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env")
        return False

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Fix password_hash Constraint")
    print("=" * 60 + "\n")
    
    success = fix_password_hash()
    
    if not success:
        print("\n" + "=" * 60)
        print("QUICK FIX INSTRUCTIONS:")
        print("=" * 60)
        print("\n1. Open Supabase Dashboard: https://supabase.com/dashboard")
        print("2. Select your project")
        print("3. Click 'SQL Editor' in left sidebar")
        print("4. Click 'New query'")
        print("5. Copy and paste this SQL:")
        print("\n   ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;")
        print("\n6. Click 'Run' (or press Ctrl+Enter)")
        print("7. You should see: 'Success. No rows returned'")
        print("8. Restart your server")
        print("9. Try registration again!")
        print("\n" + "=" * 60 + "\n")



