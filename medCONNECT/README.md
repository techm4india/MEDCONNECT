# MedConnect - Digital Medical Education Workflow System

A comprehensive FastAPI-based backend system for digitizing medical education workflows in Government Medical Colleges.

## 🎯 Overview

MedConnect is a unified digital medical campus ecosystem designed to replace manual, paper-based processes with a modern, centralized, AI-powered system. It supports students, faculty, administrators, hostel management, clinical departments, and college leadership.

## 🏗️ Architecture

The backend follows a clean, layered architecture:

```
API Routers (app/api/v1) 
    ↓
Services (app/services)
    ↓
Repositories (app/repositories)
    ↓
Supabase Database
```

## 📦 Features

### Core Modules

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Multi-college user management with student/faculty profiles
- **Academic Module**: Subjects, curriculum modules, learning resources, progress tracking
- **Clinical Module**: Postings, clinical logbooks, OPD sessions
- **Hostel Management**: Room allocation, visitor logs, movement tracking, mess attendance
- **Admin Module**: Certificates, attendance (QR + GPS), notices, events, finance
- **Governance**: Dashboards and analytics for leadership
- **AI Services**: Academic and governance assistants
- **Notifications**: In-app, email, and push notifications

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Supabase account and project
- Redis (optional, for caching)
- OpenAI API key (optional, for AI services)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd medCONNECT
```

2. **Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SECRET_KEY=your-secret-key-change-in-production
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your-openai-api-key
```

5. **Run the application**

```bash
python -m uvicorn app.main:app --reload
```

Or use the main file:

```bash
python app/main.py
```

The API will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📁 Project Structure

```
medCONNECT/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py          # Authentication routes
│   │       ├── users.py         # User management routes
│   │       ├── academic.py      # Academic module routes
│   │       ├── clinical.py      # Clinical module routes
│   │       ├── hostel.py        # Hostel management routes
│   │       ├── admin.py         # Admin module routes
│   │       ├── governance.py    # Governance routes
│   │       └── ai.py            # AI service routes
│   ├── core/
│   │   ├── config.py            # Application configuration
│   │   ├── security.py          # Security utilities (JWT, password hashing)
│   │   ├── dependencies.py      # FastAPI dependencies
│   │   ├── exceptions.py        # Custom exceptions
│   │   └── middleware.py        # Custom middleware
│   ├── db/
│   │   ├── supabase.py          # Supabase client wrapper
│   │   └── redis_client.py      # Redis client wrapper
│   ├── models/
│   │   ├── user.py              # User models
│   │   ├── academic.py          # Academic models
│   │   ├── clinical.py          # Clinical models
│   │   ├── hostel.py            # Hostel models
│   │   ├── admin.py             # Admin models
│   │   ├── governance.py        # Governance models
│   │   └── college.py           # College/Department models
│   ├── repositories/
│   │   ├── user_repo.py         # User repository
│   │   ├── academic_repo.py     # Academic repository
│   │   ├── clinical_repo.py     # Clinical repository
│   │   └── ...                  # Other repositories
│   ├── services/
│   │   ├── auth_service.py      # Authentication service
│   │   ├── academic_service.py  # Academic service
│   │   └── ...                  # Other services
│   └── main.py                  # FastAPI application
├── tests/                        # Test files
├── requirements.txt              # Python dependencies
├── pyproject.toml               # Project configuration
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## 🔐 Authentication

The API uses **Supabase Auth** for authentication. To authenticate:

1. **Register/Login** to get access and refresh tokens:

```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password",
  "college_id": "uuid-here"
}
```

2. **Use the access token** in subsequent requests:

```
Authorization: Bearer <access_token>
```

3. **Refresh the token** when it expires:

```bash
POST /api/v1/auth/refresh
{
  "refresh_token": "<refresh_token>"
}
```

**Note**: All authentication is handled by Supabase Auth. Tokens are JWT tokens signed by Supabase and automatically validated.

## 👥 User Roles

- `student`: Medical students
- `faculty`: Teaching faculty
- `admin`: Administrative staff
- `hod`: Head of Department
- `principal`: College Principal
- `superintendent`: Hospital Superintendent
- `dme`: Directorate of Medical Education
- `hostel_warden`: Hostel warden
- `clinical_coordinator`: Clinical coordinator

## 🗄️ Database Schema

The system uses Supabase (PostgreSQL) with Row Level Security for multi-college support. All tables include a `college_id` field for data isolation.

### Key Tables

- `users`: User accounts
- `student_profiles`: Student-specific data
- `faculty_profiles`: Faculty-specific data
- `colleges`: College information
- `departments`: Department information
- `subjects`: Academic subjects
- `curriculum_modules`: Curriculum modules
- `learning_resources`: Learning materials
- `student_module_progress`: Student progress tracking
- `postings`: Clinical postings
- `clinical_logbooks`: Clinical logbook entries
- `hostels`, `rooms`, `hostel_allocations`: Hostel management
- `attendance`, `attendance_sessions`: Attendance tracking
- `certificates`: Certificate requests
- `notices`, `events`: Communication

## 🧪 Testing

```bash
pytest
```

## 🐳 Docker Deployment

```bash
docker build -t medconnect .
docker run -p 8000:8000 --env-file .env medconnect
```

## 📝 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔧 Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Your License Here]

## 🆘 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using FastAPI, Supabase, and Python



