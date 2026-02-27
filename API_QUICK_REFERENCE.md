# ⚡ CivicEye API Quick Reference

Quick reference guide for CivicEye API endpoints.

---

## 🔗 Base URL

```
Local:  http://localhost:5000/api
Prod:   https://your-backend.onrender.com/api
```

---

## 🔑 Authentication

Include JWT token in headers:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📍 Endpoints Summary

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/citizen/signup` | ❌ | Register citizen |
| POST | `/auth/citizen/login` | ❌ | Login citizen |
| POST | `/auth/government/signup` | ❌ | Register government (needs invite) |
| POST | `/auth/government/login` | ❌ | Login government |
| POST | `/auth/admin/login` | ❌ | Login admin |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/profile` | ✅ | Update profile |

### Issues
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/issues/report` | ✅ | Citizen | Report new issue |
| GET | `/issues/my-complaints` | ✅ | Citizen | Get my issues |
| GET | `/issues/all` | ✅ | Gov/Admin | Get all issues |
| GET | `/issues/stats` | ✅ | All | Get statistics |
| GET | `/issues/:id` | ✅ | All | Get single issue |
| POST | `/issues/:id/resolve` | ✅ | Gov/Admin | Mark resolved |
| PUT | `/issues/:id/status` | ✅ | Gov/Admin | Update status |
| POST | `/issues/:id/upvote` | ✅ | Citizen | Upvote issue |
| POST | `/issues/:id/comment` | ✅ | All | Add comment |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | ✅ Admin | System statistics |
| GET | `/admin/users/pending` | ✅ Admin | Pending approvals |
| GET | `/admin/users` | ✅ Admin | All users |
| POST | `/admin/users/:id/approve` | ✅ Admin | Approve user |
| POST | `/admin/users/:id/reject` | ✅ Admin | Reject user |
| POST | `/admin/invite/generate` | ✅ Admin | Generate invite |
| GET | `/admin/invite/list` | ✅ Admin | List invites |

### Leaderboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | ✅ | Get top citizens |

---

## 📝 Common Request Examples

### Login
```bash
POST /api/auth/citizen/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Report Issue
```bash
POST /api/issues/report
Content-Type: multipart/form-data

title: "Pothole on Main St"
description: "Large pothole"
category: "pothole"
severity: "high"
latitude: 28.6139
longitude: 77.2090
address: "Main Street"
city: "New Delhi"
image: [File]
```

### Get Issues (with filters)
```bash
GET /api/issues/all?page=1&limit=20&status=reported&category=pothole
```

### Update Status
```bash
PUT /api/issues/:id/status
{
  "status": "in_progress"
}
```

---

## 🎯 Issue Categories

- `pothole`
- `garbage`
- `streetlight`
- `water_supply`
- `drainage`
- `road_damage`
- `public_property`
- `other`

---

## ⚠️ Severity Levels

- `low`
- `medium`
- `high`
- `critical`

---

## 📊 Issue Status Flow

```
reported → assigned → in_progress → resolved → closed
```

---

## 🏆 Gamification Points

| Action | Points |
|--------|--------|
| Report Issue | +10 |
| Issue Resolved | +25 |

### Levels
- Newcomer: 0-50 points
- Active Citizen: 51-150 points
- Advanced: 151-300 points
- Expert: 301-500 points
- Champion: 500+ points

---

## 🔐 User Roles

- `citizen` - Report and track issues
- `government` - Manage and resolve issues
- `admin` - Full system access

---

## ⚠️ Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧪 Test Credentials

**Admin:**
```
Email: admin@civiceye.com
Password: Admin@123
```

**Citizen (after signup):**
```
Email: your-email@example.com
Password: your-password
```

---

## 📦 Response Format

**Success:**
```json
{
  "message": "Success message",
  "data": { }
}
```

**Error:**
```json
{
  "message": "Error message",
  "errors": [ ]
}
```

---

## 🚀 Quick Start

1. **Login** to get token
2. **Save token** in environment
3. **Include token** in Authorization header
4. **Make requests** to protected endpoints

---

## 📚 Full Documentation

See `API_DOCUMENTATION.md` for complete details.

---

**Happy Coding! 🎉**
