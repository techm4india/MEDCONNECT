# PowerShell script to create .env file with template

$envContent = @"
# Application
APP_NAME=MedConnect
APP_ENV=development
DEBUG=True
API_V1_PREFIX=/api/v1

# Server
HOST=0.0.0.0
PORT=8000

# Supabase (REQUIRED - Get from Supabase Dashboard)
# Go to: https://supabase.com → Your Project → Settings → API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# JWT (REQUIRED - Generate a secure key)
# For development, you can use the default below
# For production, generate: python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters
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
"@

if (-not (Test-Path .env)) {
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ .env file created successfully!" -ForegroundColor Green
    Write-Host "⚠️  Please update SUPABASE_URL, SUPABASE_KEY, and SUPABASE_SERVICE_ROLE_KEY with your actual values" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  .env file already exists. Not overwriting." -ForegroundColor Yellow
    Write-Host "If you want to recreate it, delete .env first and run this script again." -ForegroundColor Yellow
}

