# Quick Fix for uvicorn Error

## 🔴 **Error You're Seeing**

```
ValidationError: 4 validation errors for Settings
SUPABASE_URL - Field required
SUPABASE_KEY - Field required
SUPABASE_SERVICE_ROLE_KEY - Field required
SECRET_KEY - Field required
```

## ✅ **Solution**

I've updated the config to have default values for development. Now you need to:

### Option 1: Add Values to .env File

Open `.env` file and add these lines (replace with your actual values):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters
```

### Option 2: Use the Setup Script

Run the PowerShell script I created:

```powershell
.\create_env.ps1
```

Then edit `.env` and add your Supabase credentials.

### Option 3: Quick Test (Development Only)

For quick testing without Supabase, the config now has defaults. Just make sure `.env` exists (even if empty) and the server should start.

---

## 🚀 **After Adding Values**

Try running again:

```bash
uvicorn app.main:app --reload
```

The server should start successfully!

---

## 📝 **Get Supabase Credentials**

1. Go to https://supabase.com
2. Sign in / Create account
3. Create a new project
4. Go to **Settings** → **API**
5. Copy:
   - Project URL → `SUPABASE_URL`
   - anon public key → `SUPABASE_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## ⚡ **Quick Start Command**

```powershell
# Create .env with template
.\create_env.ps1

# Then edit .env and add your Supabase credentials
# Then run:
uvicorn app.main:app --reload
```



