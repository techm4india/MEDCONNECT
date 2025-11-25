-- =====================================================
-- Migration: Make password_hash nullable for Supabase Auth
-- =====================================================
-- Since we're using Supabase Auth, passwords are stored in Supabase Auth
-- and not in the users table. Make password_hash nullable.
-- =====================================================

-- Make password_hash nullable
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN users.password_hash IS 'Deprecated: Passwords are now managed by Supabase Auth. This field is kept for backward compatibility.';



