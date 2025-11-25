# MedConnect Backend - Quick Start Guide

## 🚀 Quick Setup

### 1. Prerequisites
- Python 3.10 or higher
- Supabase account and project
- Redis (optional, for caching)
- OpenAI API key (optional, for AI services)

### 2. Installation Steps

```bash
# Clone or navigate to the project
cd medCONNECT

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file in the root directory:

```env
# Application
APP_NAME=MedConnect
APP_ENV=development
DEBUG=True
API_V1_PREFIX=/api/v1

# Server
HOST=0.0.0.0
PORT=8000

# Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT (REQUIRED - Change in production!)
SECRET_KEY=your-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# OpenAI (Optional, for AI services)
OPENAI_API_KEY=your-openai-api-key

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

### 4. Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `DATABASE_SCHEMA.md` in your Supabase SQL editor
3. Set up Row Level Security (RLS) policies as described in the schema document

### 5. Run the Application

```bash
# Development mode with auto-reload
python app/main.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 First Steps

### 1. Create a College

First, you need to create a college record in the database. You can do this via Supabase dashboard or create an admin endpoint.

### 2. Register First Admin User

```bash
POST /api/v1/auth/register
{
  "email": "admin@college.edu",
  "password": "securepassword123",
  "full_name": "Admin User",
  "role": "admin",
  "college_id": "your-college-uuid"
}
```

### 3. Login

```bash
POST /api/v1/auth/login
{
  "email": "admin@college.edu",
  "password": "securepassword123",
  "college_id": "your-college-uuid"
}
```

Response will include `access_token` and `refresh_token`.

### 4. Use the Token

Include the token in subsequent requests:

```
Authorization: Bearer <access_token>
```

## 🧪 Testing the API

### Using Swagger UI

1. Navigate to http://localhost:8000/docs
2. Click "Authorize" button
3. Enter: `Bearer <your-access-token>`
4. Test endpoints directly from the UI

### Using cURL

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.edu",
    "password": "securepassword123",
    "college_id": "your-college-uuid"
  }'

# Get current user (with token)
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer <access_token>"
```

## 📚 API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users` - Get all users (admin only)

### Academic
- `POST /api/v1/academic/subjects` - Create subject
- `GET /api/v1/academic/subjects` - Get subjects
- `POST /api/v1/academic/modules` - Create module
- `GET /api/v1/academic/modules/subject/{subject_id}` - Get modules
- `POST /api/v1/academic/resources` - Create resource
- `POST /api/v1/academic/progress` - Track progress

### Clinical
- `POST /api/v1/clinical/postings` - Create posting
- `GET /api/v1/clinical/postings/me` - Get my postings
- `POST /api/v1/clinical/logbooks` - Create logbook entry
- `GET /api/v1/clinical/logbooks/me` - Get my logbooks

### Hostel
- `POST /api/v1/hostel/hostels` - Create hostel
- `GET /api/v1/hostel/hostels` - Get hostels
- `POST /api/v1/hostel/allocations` - Allocate room
- `GET /api/v1/hostel/allocations/me` - Get my allocation

### Admin
- `POST /api/v1/admin/attendance` - Mark attendance
- `POST /api/v1/admin/certificates` - Request certificate
- `POST /api/v1/admin/notices` - Create notice
- `GET /api/v1/admin/notices` - Get notices
- `POST /api/v1/admin/events` - Create event

### Governance
- `GET /api/v1/governance/dashboard` - Dashboard metrics
- `GET /api/v1/governance/attendance-analytics` - Attendance analytics
- `GET /api/v1/governance/clinical-analytics` - Clinical analytics

### AI Services
- `POST /api/v1/ai/academic/query` - Academic AI assistant
- `POST /api/v1/ai/governance/query` - Governance AI assistant

## 🔧 Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

2. **Database Connection Errors**
   - Verify Supabase URL and keys in `.env`
   - Check Supabase project is active

3. **Authentication Errors**
   - Verify `SECRET_KEY` is set in `.env`
   - Check token expiration settings

4. **CORS Errors**
   - Update `CORS_ORIGINS` in `.env` with your frontend URL

## 📦 Production Deployment

### Using Docker

```bash
# Build image
docker build -t medconnect .

# Run container
docker run -p 8000:8000 --env-file .env medconnect
```

### Environment Variables for Production

- Set `DEBUG=False`
- Use strong `SECRET_KEY` (generate with: `openssl rand -hex 32`)
- Configure proper `CORS_ORIGINS`
- Set up proper database connection pooling
- Enable Redis for caching
- Configure logging and monitoring

## 🆘 Support

For issues:
1. Check the logs
2. Verify environment variables
3. Check database connectivity
4. Review API documentation at `/docs`

---

**Next Steps:**
1. Set up your Supabase database
2. Create your first college and admin user
3. Start building your frontend integration
4. Customize the system for your specific needs





