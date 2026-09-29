# CampusCare – Smart Campus Service & Issue Management Platform

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)
![Spring Security](https://img.shields.io/badge/Security-JWT%20%2B%20BCrypt-blue.svg)
![WebSocket](https://img.shields.io/badge/Real--Time-STOMP%20%2F%20SockJS-yellow.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)

**CampusCare** is a production-style, enterprise Java Full Stack web application designed to centralize and automate campus service management. Built with a modern Google Stitch-inspired UI, role-based security, live WebSocket push events, and analytical dashboards, it replaces chaotic, informal reporting channels (such as WhatsApp, phone calls, and verbal complaints) with an auditable, transparent operational workflow.

---

## Table of Contents
1. [Problem Statement & Solution](#problem-statement--solution)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture Overview](#architecture-overview)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Issue Lifecycle & Visual Timeline](#issue-lifecycle--visual-timeline)
7. [Database Schema & Entity Relationships](#database-schema--entity-relationships)
8. [Demo Credentials](#demo-credentials)
9. [Installation & Setup Guide](#installation--setup-guide)
10. [REST API Documentation](#rest-api-documentation)
11. [Real-Time WebSocket Integration](#real-time-websocket-integration)
12. [Automated Testing & Quality Verification](#automated-testing--quality-verification)
13. [Future Enhancements](#future-enhancements)

---

## 1. Problem Statement & Solution

### The Problem
Universities and colleges face constant facility breakdowns—Wi-Fi dropouts, blown projector bulbs, hostel water leaks, lab equipment calibration failures, and electrical faults. Typically, students report these issues informally through WhatsApp messages, emails, or hallway conversations with faculty. As a result:
- Tickets lack accountability and frequently get lost.
- Students receive no status transparency.
- Staff workload cannot be tracked or balanced.
- Campus administrators have no quantitative metrics regarding turnaround times or recurring defect hotspots.

### The CampusCare Solution
CampusCare standardizes campus maintenance into a unified enterprise operations hub:
1. **Student Reports Issue**: Submits category, priority, location, and optional photo attachment.
2. **Admin Receives & Triages**: Receives instantaneous notification, reviews the ticket, and assigns it to appropriate staff.
3. **Staff Accepts & Resolves**: Staff personnel receives real-time alert, accepts the ticket into `IN_PROGRESS`, executes repairs, and logs resolution details with proof photos.
4. **Student Tracks Timeline**: Complete milestone progression (`REPORTED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`) with user timestamps and an immutable audit log.
5. **Admin Analytics Studio**: Interactive Recharts visualizations tracking issue categories, priority distribution, resolution velocity, and staff workloads.

---

- **Multi-Role Self-Registration**: Any new user can sign up directly as a **Student**, specialized **Staff Technician**, or **Campus Administrator**, selecting their department / operational specialization.
- **Smart Department-Based Routing & Targeted Alerts**: Automated issue routing matching ticket categories (Wi-Fi, Electrical, Hostel, Lab Equipment, Classroom AV, etc.) directly to staff specialists with real-time push notifications (`🎯 Matches Your Department`).
- **1-Click Self-Claiming**: Staff members can claim unassigned open issues directly from their department queue into `IN_PROGRESS`.
- **Dark Operations Center Theme**: High-contrast, sleek cyber-industrial UI with emerald, amber, and cyan accents built for mission-critical campus operations.
- **Role-Based Access Control (RBAC)**: Enforced via Spring Security 6, BCrypt hashing, and stateless JWT tokens.
- **Real-Time Push Notifications**: Spring Boot WebSocket STOMP broker pushing live events to `/topic/notifications/{userId}`, `/topic/admin/notifications`, and `/topic/staff/notifications`.
- **Visual Status Progression**: Vertical and horizontal multi-step timeline indicators tracking every transition (`REPORTED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`).
- **Full Audit Trail**: Chronological `issue_history` records tracking actors, old statuses, new statuses, notes, and exact timestamps.
- **Search & Filtering Engine**: Instant multi-criteria filtering across categories, priorities, statuses, and free-text search with pagination.
- **Analytics Studio**: Recharts visualizations for Category Breakdown, Priority Matrix, 7-Day Resolution Velocity, and Staff Workload.
- **Interactive Discussion Thread**: Issue comment stream linking students and maintenance staff.
- **Automated Database Seeding**: Pre-loaded with 1 Admin, 3 Staff, 5 Students, and 18 complete campus issues with audit histories and comments.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 (Vite build system)
- **Styling**: Tailwind CSS 3.4 & PostCSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts 2.x
- **HTTP Client**: Axios with Bearer token interceptor
- **Routing**: React Router DOM v6
- **Real-Time Client**: `@stomp/stompjs` + `sockjs-client`

### Backend
- **Language**: Java 17 (Eclipse Temurin OpenJDK)
- **Framework**: Spring Boot 3.2.3
- **Web Layer**: Spring MVC (RESTful architecture)
- **Security**: Spring Security 6 with JWT (io.jsonwebtoken JJWT 0.11.5) & BCrypt
- **Persistence**: Spring Data JPA & Hibernate ORM
- **Real-Time**: Spring WebSocket with STOMP Simple Broker
- **Validation**: Jakarta Validation (`spring-boot-starter-validation`)
- **Build Tool**: Apache Maven 3.9+

### Database
- **Primary**: MySQL Server 8.0+
- **In-Memory Fallback**: H2 Database (`--spring.profiles.active=h2`) for offline instant startup

---

## 4. Architecture Overview

```
                          React 18 Frontend
                     (Vite + Tailwind + Recharts)
                       |                      |
            REST APIs (Axios)        STOMP over WebSocket
                       |                      |
                       v                      v
               Spring Boot 3.2.3 REST     Spring Boot WebSocket
               Controllers & Security        Message Broker
                       |                      |
                       +-----------+----------+
                                   |
                             Service Layer
                        (Issue, User, Notify)
                                   |
                            Spring Data JPA
                                   |
                          MySQL 8.0 Database
```

---

## 5. User Roles & Permissions

| Feature | Student | Staff | Admin |
| :--- | :---: | :---: | :---: |
| Self-Registration & Login | Yes | No (Admin adds) | Yes |
| Report New Campus Issue | Yes | No | Yes |
| Attach Photo Evidence | Yes | Yes (Resolution) | Yes |
| View Own Reported Tickets | Yes | No | Yes |
| View Assigned Work Queue | No | Yes | Yes |
| Accept Issue / Start Work | No | Yes | Yes |
| Mark Resolved + Proof Notes | No | Yes | Yes |
| Close Resolved Ticket | Yes | No | Yes |
| Reassign / Assign Staff | No | No | Yes |
| Change Ticket Priority | No | No | Yes |
| Manage Staff Roster & Users | No | No | Yes |
| Access Analytics Studio | No | No | Yes |
| Real-Time WebSocket Alerts | Yes | Yes | Yes |
| Post Discussion Comments | Yes | Yes | Yes |

---

## 6. Issue Lifecycle & Visual Timeline

Every campus ticket follows a strict 5-stage progression:

```
  [ REPORTED ] ──(Admin Assigns)──> [ ASSIGNED ] ──(Staff Accepts)──> [ IN_PROGRESS ]
                                                                             │
  [ CLOSED ] <──(Student Confirms)── [ RESOLVED ] <──(Staff Submits Proof)───┘
```

1. **REPORTED**: Student registers issue. Automatic notification dispatched to all campus administrators.
2. **ASSIGNED**: Administrator dispatches ticket to a specialized staff technician. Staff member receives a push alert.
3. **IN_PROGRESS**: Staff accepts the ticket, initiating active diagnostics. Student receives a notification that work has commenced.
4. **RESOLVED**: Staff marks work complete, attaching technical notes and optional repair photos. Student receives an alert.
5. **CLOSED**: Student verifies the fix and closes the ticket.

---

## 7. Database Schema & Entity Relationships

- **`users`**: Stores credentials, role (`ROLE_STUDENT`, `ROLE_STAFF`, `ROLE_ADMIN`), department, and active status.
- **`issues`**: Core ticket record with `issue_code`, category, priority, status, location, image URLs, and foreign keys to reporter and assigned staff.
- **`assignments`**: Tracks which administrator assigned the issue to which staff technician, including assignment timestamp and instructions.
- **`issue_history`**: Immutable audit log capturing `old_status`, `new_status`, `changed_by_user_id`, notes, and timestamp.
- **`notifications`**: User alert entries delivered in real-time over WebSocket.
- **`comments`**: Interactive threaded discussion comments between students and staff.

---

## 8. Demo Credentials

The database auto-seeds on first launch with the following accounts:

| Role | Email | Password | Name & Department |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campuscare.com` | `admin123` | Dr. Evelyn Reed (Campus Administration) |
| **Staff (IT)** | `staff2@campuscare.com` | `staff123` | Priya Sharma (IT & Networks) |
| **Staff (Electrical)** | `staff1@campuscare.com` | `staff123` | Marcus Vance (Electrical & Hardware) |
| **Staff (Facilities)** | `staff3@campuscare.com` | `staff123` | David Chen (Facilities & Hostel) |
| **Student** | `student1@campuscare.com` | `student123` | Alex Rivera (Computer Science) |
| **Student** | `student2@campuscare.com` | `student123` | Samantha Brooke (Electrical Eng.) |

> **Tip**: The login page includes **One-Click Demo Fill Buttons** to immediately log in as Admin, Staff, or Student without manual typing.

---

## 9. Installation & Setup Guide

### Prerequisites
- **Java**: OpenJDK 17 or higher
- **Node.js**: v18+ (Node 20 or 24 LTS recommended)
- **MySQL**: MySQL Server 8.0+ running on port 3306 (or run with H2 profile)

### Step 1: Clone or Navigate to Project
```bash
cd C:\Users\cool\.gemini\antigravity\scratch\campuscare
```

### Step 2: Configure Database (MySQL)
Ensure MySQL is running. Create the database:
```sql
CREATE DATABASE campuscare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Verify or update credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campuscare_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```
*(Optional zero-config)*: If running without MySQL, start with the H2 profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

### Step 3: Run the Spring Boot Backend
```bash
cd backend
mvn clean compile spring-boot:run
```
Backend will start on `http://localhost:8080`.  
The database seeder will automatically insert sample users and 18 realistic campus issues!

### Step 4: Run the React Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`. Open in your browser!

---

## 10. REST API Documentation

A complete Postman collection is available at `docs/postman_collection.json`.

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student account | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `GET` | `/api/auth/me` | Get authenticated user info | Authenticated |
| `POST` | `/api/issues` | Create new issue ticket | Student / Admin |
| `GET` | `/api/issues` | Search & filter issues | Authenticated |
| `GET` | `/api/issues/{id}` | Detailed ticket info with timeline & history | Authenticated |
| `POST` | `/api/issues/{id}/assign` | Assign issue to staff | Admin |
| `PUT` | `/api/issues/{id}/accept` | Accept assignment (moves to IN_PROGRESS) | Staff |
| `PUT` | `/api/issues/{id}/status` | Transition status / Mark Resolved | Authenticated |
| `PUT` | `/api/issues/{id}/priority` | Change priority level | Admin |
| `POST` | `/api/issues/{id}/comments` | Add comment to issue | Authenticated |
| `GET` | `/api/issues/{id}/comments` | List issue comments | Authenticated |
| `GET` | `/api/notifications` | Get user notifications | Authenticated |
| `PUT` | `/api/notifications/{id}/read`| Mark notification as read | Authenticated |
| `PUT` | `/api/notifications/read-all`| Mark all notifications read | Authenticated |
| `GET` | `/api/admin/dashboard` | Administrative overview metrics | Admin |
| `GET` | `/api/admin/analytics` | Recharts aggregated chart datasets | Admin |
| `GET` | `/api/admin/users` | User directory with filters | Admin |
| `POST` | `/api/admin/staff` | Create new staff member | Admin |
| `POST` | `/api/upload` | Multipart photo upload | Authenticated |

---

## 11. Real-Time WebSocket Integration

CampusCare uses **STOMP over WebSocket** with SockJS fallback (`/ws`).
- **Endpoint**: `http://localhost:8080/ws`
- **User Topic**: `/topic/notifications/{userId}`
- **Admin Broadcast**: `/topic/admin/notifications`
- **Staff Broadcast**: `/topic/staff/notifications`

### Live Event Triggers:
1. **Student submits ticket** → Admin immediately receives notification without reloading.
2. **Admin assigns staff** → Staff technician receives immediate push alert and notification counter badge.
3. **Staff begins work** → Student receives live update: *"Your issue is now being worked on"*.
4. **Staff resolves issue** → Student receives live update: *"Issue #CCxxx has been resolved"*.

---

## 12. Automated Testing & Quality Verification

Run the automated backend test suite:
```bash
cd backend
mvn test
```
The test suite validates:
- Spring Boot application context and JPA schema generation.
- Full issue lifecycle creation, assignment, progression to in-progress, and resolution.
- Verification that audit history logs are created at every transition.

---

---

## 13. Smart Department-Based Issue Routing Matrix

CampusCare automatically matches reported issue categories to designated departmental staff queues and pushes real-time WebSocket notifications directly to relevant personnel:

| Issue Category | Designated Department Specialists | Notification Scope |
| :--- | :--- | :--- |
| `WIFI_INTERNET` | IT Infrastructure & Networks | Real-time push to all IT specialists |
| `ELECTRICAL` | Electrical & Power Systems | Real-time push to all electrical technicians |
| `CLASSROOM` | AV & Media Support / IT / Electrical | Media & IT technicians |
| `LABORATORY` | Laboratory & Equipment Support | Lab managers & instrument engineers |
| `HOSTEL` | Facilities & Hostel Operations | Residence wardens & facility staff |
| `CLEANING` | General Maintenance & Cleaning | Housekeeping supervisors |
| `LIBRARY` | Library & Information Services | Library staff & digital resources desk |
| `TRANSPORT` | Transport & Fleet Management | Campus shuttle dispatch |
| `SECURITY` | Campus Security & Safety | Campus security team |

---

## 14. Pushing to GitHub

To push this complete repository to your personal or organization GitHub account:

### 1. Initialize Git & Add Files
```bash
git init
git add .
git commit -m "feat: complete CampusCare platform with multi-role registration, dark operations center UI, and smart department routing"
```

### 2. Rename Branch & Add Remote
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
```

### 3. Push to GitHub
```bash
git push -u origin main
```

---

## 15. Future Enhancements

- **Mobile Companion App**: React Native or Flutter mobile client for on-field maintenance staff.
- **SMS / Email Alerts**: Twilio or SendGrid integration for critical emergency notifications.
- **QR Code Scanning**: Print QR codes on laboratory equipment and classroom doors for 1-click issue reporting.
- **Automated AI Triage**: LLM auto-categorization and priority assignment based on reported issue descriptions.
- **Service Level Agreements (SLAs)**: Configurable response deadlines with automatic escalation alerts.
