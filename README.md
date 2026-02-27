# CivicEye - Smart City Issue Reporting Platform

![CivicEye Logo](Frontend/Public/img/Logo.png)

**Transform citizen complaints into actionable urban insights**

---

## 📋 Overview

CivicEye is a comprehensive smart city solution that bridges the gap between citizens and municipal authorities. It enables efficient civic issue management and resolution with role-based access control, real-time tracking, and gamification.

### Key Features

- 🔐 **Secure Authentication**: Role-based access control (Citizen, Government, Admin)
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🌓 **Dark Mode**: Beautiful light and dark themes
- 📍 **Geolocation**: GPS-based issue reporting
- 🗺️ **Interactive Maps**: Visualize issues on map
- 🏆 **Gamification**: Points and leaderboards
- 📊 **Analytics**: Real-time dashboards

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **React Leaflet** for maps
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB Atlas** (Cloud Database)
- **JWT** authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- npm v7+
- MongoDB Atlas account

### 1. Clone Repository
```bash
git clone <repository-url>
cd civiceye
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civiceye?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
```

Seed admin account:
```bash
npm run seed
```

Start backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🔐 Default Credentials

### Admin Login
```
Email: admin@civiceye.com
Password: Admin@123
```

⚠️ **Change these credentials in production!**

---

## 🚀 Usage

### Citizen Flow
1. Sign up as citizen
2. Login to dashboard
3. Report issues with photos
4. Track complaint status
5. Earn points and climb leaderboard

### Government Flow
1. Admin generates invite link
2. Register using invite link
3. Wait for admin approval
4. Login after approval
5. View and resolve issues

### Admin Flow
1. Login with admin credentials
2. Generate invite links for government users
3. Approve/reject government registrations
4. Monitor system statistics

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/citizen/signup` - Citizen registration
- `POST /api/auth/citizen/login` - Citizen login
- `POST /api/auth/government/signup` - Government registration (requires invite)
- `POST /api/auth/government/login` - Government login
- `POST /api/auth/admin/login` - Admin login

### Admin (Protected)
- `POST /api/admin/invite/generate` - Generate invite link
- `GET /api/admin/users/pending` - Get pending approvals
- `POST /api/admin/users/:id/approve` - Approve user
- `POST /api/admin/users/:id/reject` - Reject user
- `GET /api/admin/invite/list` - List all invites
- `GET /api/admin/stats` - Get system statistics

### Issues (Protected)
- `POST /api/issues/report` - Report new issue
- `GET /api/issues/my-complaints` - Get user's complaints
- `GET /api/issues/all` - Get all issues (Gov/Admin)
- `POST /api/issues/:id/resolve` - Mark as resolved

### Leaderboard
- `GET /api/leaderboard` - Get citizen leaderboard

---

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'citizen' | 'government' | 'admin',
  status: 'pending' | 'active' | 'rejected',
  city: String,
  ward: String,
  department: String,
  assignedArea: String,
  points: Number,
  createdAt: Date
}
```

### Issue Model
```javascript
{
  userId: ObjectId,
  category: String,
  description: String,
  imageUrl: String,
  latitude: Number,
  longitude: Number,
  severity: String,
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved',
  createdAt: Date
}
```

### InviteToken Model
```javascript
{
  token: String (unique),
  email: String,
  department: String,
  assignedArea: String,
  used: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

---

## 🎨 Features Implemented

### ✅ Authentication System
- Citizen self-registration
- Government invite-only registration
- Admin pre-created account
- JWT token-based auth
- Password hashing with bcrypt

### ✅ Dashboards
- **Citizen Dashboard**: Report issues, view stats, leaderboard, profile
- **Government Dashboard**: View all issues, map view, resolve issues
- **Admin Dashboard**: User management, invite generation, system stats

### ✅ Issue Management
- Report issues with image upload
- GPS location tagging
- Category and severity selection
- Status tracking
- Resolution workflow

### ✅ Gamification
- Points system
- Leaderboard
- User rankings

### ✅ UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Modern gradient designs
- Smooth animations
- Toast notifications

---

## 📱 Mobile Responsive

The application is fully responsive and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

Features:
- Adaptive layouts
- Touch-friendly buttons
- Optimized navigation
- Responsive images

---

## 🌓 Dark Mode

Toggle between light and dark themes:
- Click the Sun/Moon icon in header
- Theme preference saved in localStorage
- All components styled for both modes
- Smooth transitions

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Secure invite tokens

---

## 📂 Project Structure

```
civiceye/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── Public/
│   │   └── img/
│   │       └── Logo.png
│   ├── Src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── citizen/
│   │   │   ├── government/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── SETUP_INSTRUCTIONS.md
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
1. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
2. Verify connection string in `.env`
3. Ensure database name is included in URI

### Theme Toggle Not Working
1. Restart frontend dev server
2. Clear browser localStorage: `localStorage.clear()`
3. Hard refresh (Ctrl+Shift+R)

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

---

## 📝 License

MIT License - feel free to use this project for learning and development.

---

## 👥 Contributors

Built with ❤️ for Smart Cities

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check SETUP_INSTRUCTIONS.md for detailed setup

---

**Made with React, Node.js, and MongoDB**

[⬆ Back to Top](#-civiceye---smart-city-issue-reporting-platform)
