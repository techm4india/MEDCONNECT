# Quick Migration Guide

## Step 1: Get Your Database Password

1. Go to **Supabase Dashboard**
2. Click **Settings** → **Database**
3. Scroll down to **Connection string** or **Database password**
4. Copy your database password

## Step 2: Add to .env File

Add this line to your `.env` file:

```env
SUPABASE_DB_PASSWORD=your_database_password_here
```

**Important**: This is your **database password**, NOT your API key. It's the password you set when creating the Supabase project.

## Step 3: Run Migration

```bash
python apply_all_migrations.py
```

That's it! The script will:
- Extract database host from your SUPABASE_URL
- Connect using the password
- Run all migrations automatically

## Troubleshooting

### "Database password authentication failed"
- Double-check your password in Supabase Dashboard
- Make sure you're using the **database password**, not the API key

### "Could not resolve database host"
- Verify your `SUPABASE_URL` in `.env` is correct
- Format should be: `https://xxxxx.supabase.co`

### "SUPABASE_DB_PASSWORD not configured"
- Add `SUPABASE_DB_PASSWORD=your_password` to your `.env` file
- Restart your terminal/IDE after adding it

## Alternative: Manual SQL

If you prefer to run SQL manually:

1. Run: `python migrate_with_sql.py`
2. This creates `complete_migration.sql`
3. Copy the SQL file content
4. Paste in Supabase Dashboard → SQL Editor
5. Click "Run"


