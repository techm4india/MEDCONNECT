# MedConnect Frontend - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 What's Included

### ✅ Core Features Implemented

1. **Authentication System**
   - Login page with college selection
   - JWT token management
   - Automatic token refresh
   - Protected routes

2. **Layout Components**
   - Responsive sidebar navigation
   - Header with user info
   - Role-based menu items
   - Dark mode toggle

3. **Dashboard**
   - Statistics cards
   - Charts and analytics
   - Recent activity feed

4. **UI Components**
   - Button (with loading states)
   - Input fields
   - Cards
   - Form validation

### 🎨 Design Features

- ✅ Modern, clean UI
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Accessible components
- ✅ Smooth animations
- ✅ Professional color scheme

## 🏗️ Architecture

### State Management
- **Zustand** for global state (auth, user data)
- **React Query** for server state (API data, caching)

### Routing
- **React Router v6** for navigation
- Protected routes with authentication check

### Styling
- **Tailwind CSS** for utility-first styling
- Custom design system with CSS variables
- Dark mode via class toggle

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Base components (Button, Input, Card)
│   │   └── layout/          # Layout components (Sidebar, Header)
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services/            # API services
│   │   └── authService.ts
│   ├── store/               # Zustand stores
│   │   └── authStore.ts
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # Axios setup
│   │   └── utils.ts        # Helper functions
│   ├── App.tsx              # Main app
│   └── main.tsx            # Entry point
├── public/                  # Static assets
└── package.json
```

## 🔧 Next Steps - Add More Pages

To add more pages, follow this pattern:

1. **Create the page component** in `src/pages/`
2. **Add route** in `src/App.tsx`
3. **Add menu item** in `src/components/layout/Sidebar.tsx`
4. **Create API service** in `src/services/` if needed

### Example: Adding Academic Page

```tsx
// src/pages/Academic.tsx
export function Academic() {
  return <div>Academic Content</div>
}

// src/App.tsx - Add route
<Route
  path="/academic"
  element={
    <ProtectedRoute>
      <Academic />
    </ProtectedRoute>
  }
/>
```

## 🎯 Features to Add

### High Priority
- [ ] Academic module pages (subjects, modules, resources)
- [ ] Clinical module pages (postings, logbooks)
- [ ] Hostel management pages
- [ ] Admin pages (attendance, certificates, notices)
- [ ] Governance/analytics pages
- [ ] Profile page
- [ ] Settings page

### Medium Priority
- [ ] Notifications page
- [ ] Events page
- [ ] File upload components
- [ ] Data tables with pagination
- [ ] Form components (select, datepicker, etc.)
- [ ] Modal/Dialog components

### Nice to Have
- [ ] PDF viewer for certificates
- [ ] QR code scanner for attendance
- [ ] Real-time notifications
- [ ] Advanced charts
- [ ] Export functionality

## 🐛 Troubleshooting

### Issue: Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: API connection errors
- Check `.env` file has correct `VITE_API_URL`
- Ensure backend is running on port 8000
- Check CORS settings in backend

### Issue: TypeScript errors
```bash
# Restart TypeScript server in VS Code
# Or run type check
npm run build
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)

---

**The frontend foundation is ready! Start building your pages! 🚀**




