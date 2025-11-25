# MedConnect Frontend

Modern React frontend for MedConnect Digital Medical Education System.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Radix UI** - Accessible components

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/        # Base UI components
│   │   └── layout/    # Layout components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── store/         # State management
│   ├── lib/           # Utilities
│   └── App.tsx        # Main app component
├── public/            # Static assets
└── package.json
```

## 🔐 Authentication

The app uses JWT authentication with automatic token refresh. Tokens are stored in localStorage and Zustand store.

## 🎨 Styling

- Tailwind CSS for utility classes
- Dark mode support
- Responsive design
- Custom color scheme

## 📱 Features

- ✅ Authentication & Authorization
- ✅ Role-based navigation
- ✅ Dashboard with analytics
- ✅ Responsive design
- ✅ Dark mode
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🚀 Deployment

Build the app:

```bash
npm run build
```

The `dist` folder contains the production build ready to deploy.




