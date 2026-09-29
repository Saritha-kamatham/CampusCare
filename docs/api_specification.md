# CampusCare REST API Specification

Comprehensive documentation of all backend REST endpoints for the **CampusCare – Smart Campus Service & Issue Management Platform**.

**Base URL**: `http://localhost:8080/api`  
**Authentication**: Bearer Token via `Authorization: Bearer <JWT>` header for all protected endpoints.

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Student
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Maya Lin",
  "email": "maya@campuscare.com",
  "password": "Password123",
  "department": "Computer Science & Engineering",
  "phone": "+1 (555) 018-2938"
}
```
- **Response**: `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 10,
  "name": "Maya Lin",
  "email": "maya@campuscare.com",
  "role": "ROLE_STUDENT",
  "department": "Computer Science & Engineering",
  "phone": "+1 (555) 018-2938"
}
```

### 1.2 Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@campuscare.com",
  "password": "admin123"
}
```
- **Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "Dr. Evelyn Reed",
  "email": "admin@campuscare.com",
  "role": "ROLE_ADMIN",
  "department": "Campus Administration"
}
```

### 1.3 Current User Info
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated

---

## 2. Issues Endpoints (`/api/issues`)

### 2.1 Create Issue
- **Endpoint**: `POST /api/issues`
- **Access**: `ROLE_STUDENT`, `ROLE_ADMIN`
- **Request Body**:
```json
{
  "title": "Wi-Fi not working in CSE Lab 2",
  "description": "Students are unable to connect to the campus Wi-Fi network 'CampusCare-Secure' in lab 2.",
  "category": "WIFI_INTERNET",
  "priority": "HIGH",
  "location": "CSE Lab 2, 2nd Floor Turing Block",
  "imageUrl": "/uploads/example.png"
}
```
- **Response**: `201 Created` (Issue Detail DTO)

### 2.2 List & Filter Issues
- **Endpoint**: `GET /api/issues`
- **Access**: Authenticated
- **Query Parameters**:
  - `page` (default `0`)
  - `size` (default `10`)
  - `search` (keyword across ID, title, description, location)
  - `category` (e.g. `WIFI_INTERNET`, `ELECTRICAL`, `CLASSROOM`)
  - `priority` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
  - `status` (`REPORTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
  - `sortBy` (default `createdAt`)
  - `direction` (`asc` / `desc`)
- **Response**: `200 OK` (Spring Page with `content`, `totalPages`, `totalElements`)

### 2.3 Get Issue Details
- **Endpoint**: `GET /api/issues/{id}`
- **Access**: Authenticated
- **Response**: `200 OK` (Includes full timeline milestones, assignments, audit history log, and comments)

### 2.4 Assign Issue to Staff
- **Endpoint**: `POST /api/issues/{id}/assign`
- **Access**: `ROLE_ADMIN`
- **Request Body**:
```json
{
  "staffId": 3,
  "note": "Inspect access point power supply urgently"
}
```
- **Response**: `200 OK`

### 2.5 Staff Accept Issue
- **Endpoint**: `PUT /api/issues/{id}/accept`
- **Access**: `ROLE_STAFF` (Must be the assigned staff personnel)
- **Response**: `200 OK` (Status transitions to `IN_PROGRESS`)

### 2.6 Update Issue Status / Mark Resolved
- **Endpoint**: `PUT /api/issues/{id}/status`
- **Access**: Authenticated (Role-scoped)
- **Request Body**:
```json
{
  "status": "RESOLVED",
  "notes": "Replaced bad PoE switch port and verified 250Mbps throughput.",
  "resolutionImageUrl": "/uploads/proof-9912.png"
}
```
- **Response**: `200 OK`

### 2.7 Update Issue Priority
- **Endpoint**: `PUT /api/issues/{id}/priority?priority=CRITICAL`
- **Access**: `ROLE_ADMIN`

---

## 3. Comments Endpoints (`/api/issues/{id}/comments`)

### 3.1 Post Comment
- **Endpoint**: `POST /api/issues/{id}/comments`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "content": "Parts ordered from vendor. Estimated delivery by 2:00 PM."
}
```

### 3.2 List Comments
- **Endpoint**: `GET /api/issues/{id}/comments`
- **Access**: Authenticated

---

## 4. Notifications Endpoints (`/api/notifications`)

- `GET /api/notifications`: Retrieve current user's notifications
- `GET /api/notifications/unread-count`: Retrieve unread notification count
- `PUT /api/notifications/{id}/read`: Mark single notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read

---

## 5. Admin & Analytics Endpoints (`/api/admin`)

- `GET /api/admin/dashboard`: Global system counters and critical issue summaries
- `GET /api/admin/analytics`: Recharts data studio aggregates (category distribution, priority breakdowns, status funnel, daily velocity, staff workload)
- `GET /api/admin/users`: Search and filter all users with pagination
- `POST /api/admin/staff`: Create new staff member
- `PUT /api/admin/users/{id}/toggle-active`: Toggle account active/suspended status

---

## 6. File Upload (`/api/upload`)

- **Endpoint**: `POST /api/upload`
- **Access**: Authenticated
- **Form Data**: `file` (Multipart file, up to 10MB; JPG, JPEG, PNG, WEBP)
- **Response**: `200 OK`
```json
{
  "imageUrl": "/uploads/3c0b1717-3801-443b-87b6-c6fe29b6f84d.jpg"
}
```
