# Environment Setup Guide

## ⚠️ **IMPORTANT: Create .env File**

The application requires environment variables to run. Follow these steps:

### 1. Create `.env` File

Create a `.env` file in the root directory (`C:\medCONNECT\.env`)

### 2. Copy Template

Copy the following template and fill in your values:

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
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# JWT (REQUIRED - Generate a secure key)
SECRET_KEY=your-secret-key-minimum-32-characters-long-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis (Optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# OpenAI (Optional - for AI services)
OPENAI_API_KEY=

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]

# File Upload
MAX_UPLOAD_SIZE=10485760
ALLOWED_EXTENSIONS=["pdf","jpg","jpeg","png","mp4","mp3","docx"]

# Email (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```

### 3. Get Supabase Credentials

1. Go to https://supabase.com
2. Create a project or use existing
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Generate SECRET_KEY

For development, you can use:
```
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters
```

For production, generate a secure key:
```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or using OpenSSL
openssl rand -hex 32
```

### 5. Quick Start (Development)

For quick testing, create `.env` with minimal config:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters
```

### 6. Verify Setup

After creating `.env`, try running:

```bash
uvicorn app.main:app --reload
```

If you see the server start successfully, you're good to go!

---

## 🔧 **Troubleshooting**

### Error: "Field required"
- **Solution**: Make sure `.env` file exists in the root directory
- Check file name is exactly `.env` (not `.env.txt`)

### Error: "SUPABASE_URL is required"
- **Solution**: Add your Supabase credentials to `.env`

### Error: Connection refused
- **Solution**: Check Supabase project is active
- Verify credentials are correct

---

## 📝 **Next Steps**

1. ✅ Create `.env` file
2. ✅ Add Supabase credentials
3. ✅ Add SECRET_KEY
4. ✅ Run database schema (see `supabase_schema.sql`)
5. ✅ Start server: `uvicorn app.main:app --reload`



