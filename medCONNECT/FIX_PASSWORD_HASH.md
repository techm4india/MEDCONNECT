# 🔧 Fix: password_hash Not Null Constraint Error

## ⚠️ **Error**

```
null value in column "password_hash" of relation "users" violates not-null constraint
```

## 🔍 **Root Cause**

The `users` table has `password_hash TEXT NOT NULL`, but we're using **Supabase Auth** which handles passwords separately. The users table no longer stores password hashes.

## ✅ **Solution**

### Option 1: Run Migration SQL (Recommended)

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

### Option 2: Update Existing Database

If you already have the schema, run the migration:

```bash
# In Supabase SQL Editor, run:
migration_make_password_hash_nullable.sql
```

### Option 3: Recreate Schema

If you're starting fresh, the updated `supabase_schema.sql` already has `password_hash` as nullable.

## 📝 **What Changed**

1. ✅ **Schema Updated**: `password_hash` is now nullable in `supabase_schema.sql`
2. ✅ **Repository Updated**: `user_repo.py` now excludes `password_hash` when creating users
3. ✅ **Migration Script**: Created `migration_make_password_hash_nullable.sql` for existing databases

## 🚀 **After Fixing**

1. Run the migration SQL in Supabase
2. Restart your server
3. Try registration again - it should work!

## 📚 **Why This Happened**

- **Before**: Custom JWT auth stored password hashes in `users` table
- **Now**: Supabase Auth handles passwords, so `password_hash` is not needed
- **Solution**: Make `password_hash` nullable (kept for backward compatibility)

---

**Status**: ✅ Fixed - Registration should work now!



