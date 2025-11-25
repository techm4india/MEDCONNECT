# 🔧 Supabase Setup Guide

## ⚠️ **Error You're Seeing**

```
ValueError: Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file
```

## ✅ **Solution: Add Supabase Credentials**

You need to add your Supabase credentials to the `.env` file in the root directory.

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com
2. Sign in or create an account
3. Create a new project (or select existing)
4. Wait for the project to be ready
5. Go to **Project Settings** → **API**
6. Copy these values:
   - **Project URL** → This is your `SUPABASE_URL`
   - **service_role key** (secret) → This is your `SUPABASE_SERVICE_ROLE_KEY`
   - **anon public key** → This is your `SUPABASE_KEY` (optional but recommended)

### Step 2: Update `.env` File

Open `.env` file in the root directory (`C:\medCONNECT\.env`) and add/update:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT (for development)
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters
```

### Step 3: Example `.env` File

Here's a complete example:

```env
# Application
APP_NAME=MedConnect
APP_ENV=development
DEBUG=True
API_V1_PREFIX=/api/v1

# Server
HOST=0.0.0.0
PORT=8000

# Supabase (REQUIRED - Get from Supabase Dashboard)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzIwMCwiZXhwIjoxOTU0NTQzMjAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjAwLCJleHAiOjE5NTQ1NDMyMDB9.example

# JWT
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

### Step 4: Run Database Schema

After adding credentials, you need to run the database schema:

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy the contents of `supabase_schema.sql`
3. Paste and run it in the SQL Editor
4. This will create all necessary tables, indexes, and RLS policies

### Step 5: Restart Server

After updating `.env`, restart the server:

```bash
uvicorn app.main:app --reload
```

## 🔍 **Quick Check**

To verify your credentials are correct, you can test:

```python
python -c "from app.db.supabase import supabase_client; print('Supabase connected!' if supabase_client.get_client() else 'Not connected')"
```

## 📝 **Important Notes**

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use service_role key carefully** - It bypasses RLS policies
3. **Keep anon key for frontend** - Use this in your frontend code
4. **Project URL format** - `https://[project-id].supabase.co`

## 🆘 **Troubleshooting**

### Error: "Supabase client not initialized"
- ✅ Make sure `.env` file exists in root directory
- ✅ Check file name is exactly `.env` (not `.env.txt`)
- ✅ Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
- ✅ Restart the server after updating `.env`

### Error: "Connection refused"
- ✅ Check Supabase project is active (not paused)
- ✅ Verify SUPABASE_URL is correct
- ✅ Check your internet connection

### Error: "Invalid API key"
- ✅ Make sure you copied the full key (they're long!)
- ✅ Verify you're using service_role key (not anon key) for backend
- ✅ Check for extra spaces or newlines in `.env`

---

## 🚀 **Next Steps After Setup**

1. ✅ Add Supabase credentials to `.env`
2. ✅ Run database schema (`supabase_schema.sql`)
3. ✅ Restart server
4. ✅ Test registration/login endpoints
5. ✅ Start using the application!



