# 📡 CivicEye API Documentation

Complete REST API documentation for the CivicEye platform.

---

## 📋 Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Codes](#error-codes)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Issue Management Endpoints](#issue-management-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Leaderboard Endpoints](#leaderboard-endpoints)
9. [Rate Limiting](#rate-limiting)
10. [Postman Collection](#postman-collection)

---

## 🌐 Base URL

```
Development: http://localhost:5000/api
Production:  https://your-backend-url.com/api
```

---

## 🔐 Authentication

Most endpoints require authentication using JWT tokens.

### How to Authenticate

1. **Login** to get a JWT token
2. **Include token** in request headers:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Expiration

- Tokens expire after **7 days**
- Refresh by logging in again

---

## 📦 Response Format

### Success Response

```json
{
  "message": "Success message",
  "data": { }
}
```

### Error Response

```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email required"
    }
  ]
}
```

---

## ⚠️ Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔑 Authentication Endpoints

### 1. Citizen Signup

Register a new citizen account.

**Endpoint:** `POST /api/auth/citizen/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "city": "New Delhi",
  "ward": "Ward 15"
}
```

**Validation Rules:**
- `fullName`: Minimum 2 characters
- `email`: Valid email format
- `password`: Minimum 6 characters
- `phone`: Valid mobile number (optional)

**Success Response (201):**
```json
{
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "status": "active",
    "points": 0,
    "level": "Newcomer"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already registered"
}
```

---

### 2. Citizen Login

Login with citizen credentials.

**Endpoint:** `POST /api/auth/citizen/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "points": 150,
    "level": "Active Citizen"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. Government Signup

Register a government official (requires invite token).

**Endpoint:** `POST /api/auth/government/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@gov.in",
  "password": "password123",
  "phone": "+1234567890",
  "inviteToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (201):**
```json
{
  "message": "Registration submitted. Awaiting admin approval.",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith",
    "email": "jane@gov.in",
    "role": "government",
    "status": "pending",
    "department": "Public Works"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid invite token"
}
```

---

### 4. Government Login

Login with government credentials.

**Endpoint:** `POST /api/auth/government/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "jane@gov.in",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith",
    "email": "jane@gov.in",
    "role": "government",
    "status": "active",
    "department": "Public Works"
  }
}
```

**Error Response (403):**
```json
{
  "message": "Your account is pending admin approval"
}
```

---

### 5. Admin Login

Login with admin credentials.

**Endpoint:** `POST /api/auth/admin/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "admin@civiceye.com",
  "password": "Admin@123"
}
```

**Success Response (200):**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439013",
    "fullName": "Admin User",
    "email": "admin@civiceye.com",
    "role": "admin"
  }
}
```

---

### 6. Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Headers:**
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "points": 150,
    "level": "Active Citizen",
    "city": "New Delhi",
    "ward": "Ward 15"
  }
}
```

---

### 7. Update Profile

Update user profile information.

**Endpoint:** `PUT /api/auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "fullName": "John Updated",
  "phone": "+9876543210",
  "city": "Mumbai",
  "ward": "Ward 20",
  "address": "123 Main Street"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Updated",
    "phone": "+9876543210",
    "city": "Mumbai"
  }
}
```

---

## 📋 Issue Management Endpoints

### 1. Report New Issue

Report a civic issue (citizens only).

**Endpoint:** `POST /api/issues/report`

**Authentication:** Required (Citizen role)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
title: "Large pothole on Main Street"
description: "Dangerous pothole causing traffic issues"
category: "pothole"
severity: "high"
latitude: 28.6139
longitude: 77.2090
address: "Main Street, Sector 15"
city: "New Delhi"
area: "Sector 15"
image: [File]
```

**Categories:**
- `pothole`
- `garbage`
- `streetlight`
- `water_supply`
- `drainage`
- `road_damage`
- `public_property`
- `other`

**Severity Levels:**
- `low`
- `medium`
- `high`
- `critical`

**Success Response (201):**
```json
{
  "message": "Issue reported successfully! You earned 10 points.",
  "issue": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Large pothole on Main Street",
    "description": "Dangerous pothole causing traffic issues",
    "category": "pothole",
    "severity": "high",
    "status": "reported",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "address": "Main Street, Sector 15",
      "city": "New Delhi",
      "area": "Sector 15"
    },
    "imageUrl": "/uploads/1234567890-pothole.jpg",
    "reportedBy": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "upvotes": 0,
    "createdAt": "2026-02-26T10:30:00.000Z"
  }
}
```

---

### 2. Get My Complaints

Get citizen's own reported issues.

**Endpoint:** `GET /api/issues/my-complaints`

**Authentication:** Required (Citizen role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Example Request:**
```
GET /api/issues/my-complaints?page=1&limit=10&status=reported
```

**Success Response (200):**
```json
{
  "issues": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Large pothole on Main Street",
      "category": "pothole",
      "severity": "high",
      "status": "in_progress",
      "location": {
        "address": "Main Street, Sector 15"
      },
      "imageUrl": "/uploads/1234567890-pothole.jpg",
      "upvotes": 5,
      "createdAt": "2026-02-26T10:30:00.000Z",
      "assignedTo": {
        "fullName": "Jane Smith",
        "department": "Public Works"
      }
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 2
}
```

---

### 3. Get All Issues

Get all reported issues (government/admin only).

**Endpoint:** `GET /api/issues/all`

**Authentication:** Required (Government or Admin role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status
- `category` (optional): Filter by category
- `severity` (optional): Filter by severity

**Example Request:**
```
GET /api/issues/all?page=1&limit=20&status=reported&category=pothole&severity=high
```

**Success Response (200):**
```json
{
  "issues": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Large pothole on Main Street",
      "description": "Dangerous pothole causing traffic issues",
      "category": "pothole",
      "severity": "high",
      "status": "reported",
      "location": {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "address": "Main Street, Sector 15",
        "city": "New Delhi"
      },
      "imageUrl": "/uploads/1234567890-pothole.jpg",
      "reportedBy": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "city": "New Delhi"
      },
      "upvotes": 5,
      "createdAt": "2026-02-26T10:30:00.000Z"
    }
  ],
  "total": 247,
  "page": 1,
  "pages": 13
}
```

---

### 4. Get Issue Statistics

Get statistics about issues.

**Endpoint:** `GET /api/issues/stats`

**Authentication:** Required

**Success Response (200):**
```json
{
  "total": 247,
  "reported": 42,
  "assigned": 35,
  "inProgress": 85,
  "resolved": 85,
  "categoryStats": [
    {
      "_id": "pothole",
      "count": 89
    },
    {
      "_id": "garbage",
      "count": 67
    },
    {
      "_id": "streetlight",
      "count": 45
    }
  ]
}
```

---

### 5. Get Single Issue

Get detailed information about a specific issue.

**Endpoint:** `GET /api/issues/:id`

**Authentication:** Required

**Example Request:**
```
GET /api/issues/507f1f77bcf86cd799439014
```

**Success Response (200):**
```json
{
  "issue": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Large pothole on Main Street",
    "description": "Dangerous pothole causing traffic issues",
    "category": "pothole",
    "severity": "high",
    "status": "in_progress",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "address": "Main Street, Sector 15",
      "city": "New Delhi",
      "area": "Sector 15"
    },
    "imageUrl": "/uploads/1234567890-pothole.jpg",
    "reportedBy": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "city": "New Delhi"
    },
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Jane Smith",
      "department": "Public Works"
    },
    "upvotes": 5,
    "comments": [
      {
        "userId": "507f1f77bcf86cd799439012",
        "userName": "Jane Smith",
        "comment": "Work has started on this issue",
        "createdAt": "2026-02-26T11:00:00.000Z"
      }
    ],
    "reportedAt": "2026-02-26T10:30:00.000Z",
    "assignedAt": "2026-02-26T10:45:00.000Z",
    "createdAt": "2026-02-26T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Issue not found"
}
```

---

### 6. Resolve Issue

Mark an issue as resolved (government/admin only).

**Endpoint:** `POST /api/issues/:id/resolve`

**Authentication:** Required (Government or Admin role)

**Example Request:**
```
POST /api/issues/507f1f77bcf86cd799439014/resolve
```

**Success Response (200):**
```json
{
  "message": "Issue resolved! Reporter awarded 25 bonus points.",
  "issue": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "resolved",
    "resolvedAt": "2026-02-26T15:00:00.000Z",
    "assignedTo": "507f1f77bcf86cd799439012"
  }
}
```

**Note:** This automatically awards 25 bonus points to the citizen who reported the issue.

---

### 7. Update Issue Status

Update the status of an issue (government/admin only).

**Endpoint:** `PUT /api/issues/:id/status`

**Authentication:** Required (Government or Admin role)

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Valid Status Values:**
- `reported`
- `assigned`
- `in_progress`
- `resolved`
- `closed`

**Success Response (200):**
```json
{
  "message": "Status updated",
  "issue": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "in_progress",
    "assignedTo": {
      "fullName": "Jane Smith",
      "department": "Public Works"
    }
  }
}
```

---

### 8. Upvote Issue

Upvote or remove upvote from an issue (citizens only).

**Endpoint:** `POST /api/issues/:id/upvote`

**Authentication:** Required (Citizen role)

**Example Request:**
```
POST /api/issues/507f1f77bcf86cd799439014/upvote
```

**Success Response (200):**
```json
{
  "message": "Issue upvoted",
  "upvotes": 6
}
```

**Note:** Calling this endpoint again will remove the upvote.

---

### 9. Add Comment

Add a comment to an issue.

**Endpoint:** `POST /api/issues/:id/comment`

**Authentication:** Required

**Request Body:**
```json
{
  "comment": "This issue is affecting many residents"
}
```

**Success Response (200):**
```json
{
  "message": "Comment added",
  "comments": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "userName": "John Doe",
      "comment": "This issue is affecting many residents",
      "createdAt": "2026-02-26T12:00:00.000Z"
    }
  ]
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require admin role authentication.

### 1. Get System Statistics

Get platform-wide statistics.

**Endpoint:** `GET /api/admin/stats`

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "stats": {
    "totalUsers": 1247,
    "totalCitizens": 1200,
    "totalGovt": 47,
    "totalIssues": 5234,
    "resolvedIssues": 4187,
    "pendingApprovals": 5,
    "resolutionRate": 80
  },
  "recentIssues": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Large pothole on Main Street",
      "category": "pothole",
      "severity": "high",
      "reportedBy": {
        "fullName": "John Doe",
        "city": "New Delhi"
      },
      "createdAt": "2026-02-26T10:30:00.000Z"
    }
  ],
  "categoryStats": [
    {
      "_id": "pothole",
      "count": 1523
    },
    {
      "_id": "garbage",
      "count": 1245
    },
    {
      "_id": "streetlight",
      "count": 987
    }
  ]
}
```

---

### 2. Get Pending Approvals

Get government users awaiting approval.

**Endpoint:** `GET /api/admin/users/pending`

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "fullName": "Rajesh Kumar",
      "email": "rajesh@gov.in",
      "role": "government",
      "status": "pending",
      "department": "Public Works",
      "position": "Engineer",
      "assignedArea": "Sector 15-20",
      "createdAt": "2026-02-26T09:00:00.000Z"
    }
  ]
}
```

---

### 3. Get All Users

Get all users with optional filtering.

**Endpoint:** `GET /api/admin/users`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `role` (optional): Filter by role (citizen, government, admin)
- `status` (optional): Filter by status (active, pending, rejected)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example Request:**
```
GET /api/admin/users?role=government&status=active&page=1&limit=20
```

**Success Response (200):**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Jane Smith",
      "email": "jane@gov.in",
      "role": "government",
      "status": "active",
      "department": "Public Works",
      "createdAt": "2026-02-20T10:00:00.000Z"
    }
  ],
  "total": 47,
  "page": 1,
  "pages": 3
}
```

---

### 4. Approve Government User

Approve a pending government user.

**Endpoint:** `POST /api/admin/users/:id/approve`

**Authentication:** Required (Admin role)

**Example Request:**
```
POST /api/admin/users/507f1f77bcf86cd799439015/approve
```

**Success Response (200):**
```json
{
  "message": "Rajesh Kumar has been approved",
  "user": {
    "_id": "507f1f77bcf86cd799439015",
    "fullName": "Rajesh Kumar",
    "email": "rajesh@gov.in",
    "status": "active"
  }
}
```

---

### 5. Reject Government User

Reject a pending government user.

**Endpoint:** `POST /api/admin/users/:id/reject`

**Authentication:** Required (Admin role)

**Example Request:**
```
POST /api/admin/users/507f1f77bcf86cd799439015/reject
```

**Success Response (200):**
```json
{
  "message": "Rajesh Kumar has been rejected",
  "user": {
    "_id": "507f1f77bcf86cd799439015",
    "fullName": "Rajesh Kumar",
    "email": "rajesh@gov.in",
    "status": "rejected"
  }
}
```

---

### 6. Generate Invite Link

Generate an invite link for government official registration.

**Endpoint:** `POST /api/admin/invite/generate`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "email": "newofficial@gov.in",
  "department": "Sanitation",
  "position": "Supervisor",
  "assignedArea": "Sector 21-25"
}
```

**Success Response (201):**
```json
{
  "message": "Invite generated successfully",
  "invite": {
    "_id": "507f1f77bcf86cd799439016",
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newofficial@gov.in",
    "department": "Sanitation",
    "position": "Supervisor",
    "assignedArea": "Sector 21-25",
    "isUsed": false,
    "expiresAt": "2026-03-26T10:00:00.000Z",
    "createdAt": "2026-02-26T10:00:00.000Z"
  },
  "inviteLink": "https://civiceye.com/register/government?token=550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400):**
```json
{
  "message": "An active invite already exists for this email"
}
```

---

### 7. List All Invites

Get all invite tokens with their status.

**Endpoint:** `GET /api/admin/invite/list`

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "invites": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "email": "newofficial@gov.in",
      "department": "Sanitation",
      "position": "Supervisor",
      "assignedArea": "Sector 21-25",
      "isUsed": false,
      "expiresAt": "2026-03-26T10:00:00.000Z",
      "createdBy": {
        "fullName": "Admin User"
      },
      "createdAt": "2026-02-26T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "token": "660e8400-e29b-41d4-a716-446655440001",
      "email": "jane@gov.in",
      "department": "Public Works",
      "isUsed": true,
      "usedBy": {
        "fullName": "Jane Smith",
        "email": "jane@gov.in"
      },
      "expiresAt": "2026-03-20T10:00:00.000Z",
      "createdAt": "2026-02-20T10:00:00.000Z"
    }
  ]
}
```

---

## 🏆 Leaderboard Endpoints

### 1. Get Leaderboard

Get citizen leaderboard ranked by points.

**Endpoint:** `GET /api/leaderboard`

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of top citizens to return (default: 20)

**Example Request:**
```
GET /api/leaderboard?limit=10
```

**Success Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "_id": "507f1f77bcf86cd799439018",
      "fullName": "Alice Champion",
      "points": 850,
      "level": "Champion",
      "city": "New Delhi",
      "badges": ["First Report", "10 Reports", "50 Reports"],
      "createdAt": "2025-12-01T10:00:00.000Z"
    },
    {
      "rank": 2,
      "_id": "507f1f77bcf86cd799439019",
      "fullName": "Bob Expert",
      "points": 720,
      "level": "Expert",
      "city": "Mumbai",
      "badges": ["First Report", "10 Reports"],
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "currentUserRank": 24
}
```

---

## ⚡ Rate Limiting

To prevent abuse, the API implements rate limiting:

| Endpoint Type | Rate Limit |
|--------------|------------|
| Authentication | 5 requests per 15 minutes |
| Issue Reporting | 10 requests per hour |
| General API | 100 requests per hour |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614556800
```

**Rate Limit Exceeded Response (429):**
```json
{
  "message": "Too many requests, please try again later"
}
```

---

## 📮 Postman Collection

### Import Collection

1. Download the Postman collection: [CivicEye API Collection](./postman_collection.json)
2. Open Postman
3. Click "Import" → Select file
4. Collection will be imported with all endpoints

### Environment Variables

Set these variables in Postman:

```
BASE_URL: http://localhost:5000/api
TOKEN: (will be set after login)
```

### Quick Start

1. **Login** using citizen/government/admin login endpoint
2. **Copy token** from response
3. **Set token** in environment variables
4. **Make requests** to protected endpoints

---

## 🔧 Testing with cURL

### Example: Citizen Signup
```bash
curl -X POST http://localhost:5000/api/auth/citizen/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "city": "New Delhi"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/citizen/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Get Issues (with auth)
```bash
curl -X GET http://localhost:5000/api/issues/my-complaints \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example: Report Issue (with file upload)
```bash
curl -X POST http://localhost:5000/api/issues/report \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Pothole on Main St" \
  -F "description=Large pothole" \
  -F "category=pothole" \
  -F "severity=high" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "address=Main Street" \
  -F "city=New Delhi" \
  -F "image=@/path/to/image.jpg"
```

---

## 📊 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String, // 'citizen', 'government', 'admin'
  status: String, // 'active', 'pending', 'rejected'
  city: String,
  ward: String,
  address: String,
  department: String, // government only
  position: String, // government only
  assignedArea: String, // government only
  points: Number, // citizen only
  level: String, // citizen only
  badges: [String], // citizen only
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  severity: String,
  status: String, // 'reported', 'assigned', 'in_progress', 'resolved', 'closed'
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    area: String
  },
  imageUrl: String,
  reportedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  upvotes: Number,
  upvotedBy: [ObjectId],
  comments: [{
    userId: ObjectId,
    userName: String,
    comment: String,
    createdAt: Date
  }],
  reportedAt: Date,
  assignedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### InviteToken Model
```javascript
{
  _id: ObjectId,
  token: String (unique, UUID),
  email: String,
  department: String,
  position: String,
  assignedArea: String,
  createdBy: ObjectId (ref: User),
  isUsed: Boolean,
  usedBy: ObjectId (ref: User),
  expiresAt: Date,
  createdAt: Date
}
```

---

## 🎯 Best Practices

### 1. Always Include Authorization Header
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 2. Handle Errors Gracefully
```javascript
try {
  const response = await fetch('/api/issues/report', options);
  if (!response.ok) {
    const error = await response.json();
    console.error(error.message);
  }
} catch (err) {
  console.error('Network error:', err);
}
```

### 3. Use Pagination
```javascript
// Always use pagination for list endpoints
const response = await fetch('/api/issues/all?page=1&limit=20');
```

### 4. Validate Input Client-Side
```javascript
// Validate before sending to API
if (!email || !password) {
  return { error: 'Email and password required' };
}
```

### 5. Store Token Securely
```javascript
// Use httpOnly cookies or secure localStorage
localStorage.setItem('token', token);
```

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Check if token is valid and included in headers

### Issue: 403 Forbidden
**Solution:** Verify user has required role for the endpoint

### Issue: 400 Bad Request
**Solution:** Check request body matches required format

### Issue: 500 Internal Server Error
**Solution:** Check server logs for detailed error message

---

## 📞 Support

For API support:
- Email: api-support@civiceye.com
- Documentation: https://docs.civiceye.com
- GitHub Issues: https://github.com/your-repo/issues

---

**API Version:** 1.0  
**Last Updated:** February 26, 2026  
**Status:** Production Ready

---

**Happy Coding! 🚀**
