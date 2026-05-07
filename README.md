# Campus Lost and Found Management System

A modern web-based Lost and Found Management System for campuses. Students, faculty, and administrators can report lost items, upload found items, request ownership claims, and monitor item status through a centralized web application.

## Tech Stack

- **Frontend**: Angular 21, Angular Material, TypeScript, Reactive Forms
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MySQL 8.0
- **API**: RESTful

## Quick Start

### Prerequisites
- Node.js 22+
- MySQL 8.0

### 1. Start MySQL
```bash
sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld
sudo mysqld --user=mysql --datadir=/var/lib/mysql --socket=/var/run/mysqld/mysqld.sock --port=3306 &
```

### 2. Setup Database
```bash
mysql -u root -ppassword123 < database/schema.sql
mysql -u root -ppassword123 < database/seed.sql
```

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Start Backend
```bash
cd backend && npm run dev
```
API runs on http://localhost:3000

### 5. Start Frontend
```bash
cd frontend && npx ng serve
```
App runs on http://localhost:4200

## Default Credentials

| Role  | Email                    | Password    |
|-------|--------------------------|-------------|
| Admin | admin@campus.edu         | password123 |
| User  | maria.santos@campus.edu  | password123 |
| User  | juan.delacruz@campus.edu | password123 |

## Features

- User Registration & JWT Authentication
- Role-based Access (Admin/User)
- Lost Item Reporting with CRUD
- Found Item Reporting with CRUD
- Ownership Claim Management
- Admin Dashboard with Analytics
- Notifications System
- Search & Filter
- Responsive Material Design UI

## API Endpoints

- `POST /api/register` - Register user
- `POST /api/login` - Login
- `GET/POST /api/lost-items` - Lost items CRUD
- `GET/POST /api/found-items` - Found items CRUD
- `GET/POST /api/claims` - Claims management
- `GET /api/users` - User management (admin)
- `GET /api/reports/stats` - Dashboard statistics
- `GET /api/notifications` - User notifications

## Project Structure

```
/backend        - Express.js REST API
/frontend       - Angular 21 application
/database       - MySQL schema and seed data
/uploads        - File upload directory
```
