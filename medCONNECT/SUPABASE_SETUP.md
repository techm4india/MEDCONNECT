# Supabase Setup Guide for MedConnect

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: MedConnect (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

### Step 2: Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (this is your `SUPABASE_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`)

3. Add these to your `.env` file:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Run the Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

You should see:
- ✅ All tables created
- ✅ All indexes created
- ✅ All triggers created
- ✅ RLS enabled on all tables

### Step 4: Verify Tables

1. Go to **Table Editor** in Supabase Dashboard
2. You should see all tables listed:
   - colleges
   - departments
   - users
   - student_profiles
   - faculty_profiles
   - subjects
   - curriculum_modules
   - learning_resources
   - student_module_progress
   - postings
   - clinical_logbooks
   - hostels
   - rooms
   - attendance
   - certificates
   - notices
   - events
   - and more...

### Step 5: Create Your First College

You can do this via SQL or through the API:

**Option A: Via SQL Editor**
```sql
INSERT INTO colleges (name, code, city, state)
VALUES ('Your Medical College', 'YMC001', 'Your City', 'Your State')
RETURNING id, name, code;
```

**Option B: Via API** (after backend is running)
```bash
POST /api/v1/colleges
{
  "name": "Your Medical College",
  "code": "YMC001",
  "city": "Your City",
  "state": "Your State"
}
```

### Step 6: Configure Row Level Security (RLS)

The schema includes basic RLS policies, but you may need to customize them:

1. Go to **Authentication** → **Policies** in Supabase
2. Review and adjust policies based on your security requirements
3. For development, you might want to temporarily disable RLS on some tables:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ **Only do this for development!**

### Step 7: Set Up Storage Buckets (Optional)

For file uploads (certificates, resources, etc.):

1. Go to **Storage** in Supabase Dashboard
2. Create buckets:
   - `certificates` - for generated certificates
   - `learning-resources` - for academic content
   - `notices` - for notice attachments
   - `profile-pictures` - for user avatars

3. Set bucket policies:
   ```sql
   -- Example: Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload"
   ON STORAGE.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'certificates');
   ```

## 🔐 Security Best Practices

### 1. Service Role Key
- ⚠️ **NEVER** expose service_role key in frontend
- Only use in backend/server-side code
- Keep it in `.env` file (never commit to git)

### 2. RLS Policies
- Always enable RLS on production
- Create specific policies for each table
- Test policies thoroughly

### 3. Database Password
- Use a strong password
- Store it securely
- Don't share it

## 🧪 Testing the Connection

### Test 1: Check Connection
```python
# In Python shell or test script
from app.db.supabase import supabase_client
client = supabase_client.get_client()
print("✅ Supabase connection successful!")
```

### Test 2: Insert Test Data
```sql
-- Insert a test college
INSERT INTO colleges (name, code)
VALUES ('Test College', 'TEST001')
RETURNING *;
```

### Test 3: Query Data
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 📊 Database Management

### Viewing Data
- Use **Table Editor** in Supabase Dashboard
- Or use SQL Editor for complex queries

### Backing Up
- Supabase automatically backs up your database
- You can also export via SQL Editor

### Monitoring
- Check **Database** → **Usage** for:
  - Database size
  - API requests
  - Storage usage

## 🐛 Troubleshooting

### Issue: "relation does not exist"
- **Solution**: Make sure you ran the entire `supabase_schema.sql` file
- Check if tables were created in Table Editor

### Issue: "permission denied"
- **Solution**: Check RLS policies
- Verify you're using the correct API key (anon vs service_role)

### Issue: "connection timeout"
- **Solution**: Check your Supabase project is active
- Verify SUPABASE_URL is correct

### Issue: "foreign key constraint"
- **Solution**: Make sure parent records exist
- Check data integrity

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ First college created
3. ⬜ Create first admin user (via API)
4. ⬜ Set up storage buckets
5. ⬜ Configure RLS policies
6. ⬜ Test API endpoints
7. ⬜ Deploy to production

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?**
- Check Supabase logs in Dashboard
- Review error messages in API responses
- Consult Supabase community forums

