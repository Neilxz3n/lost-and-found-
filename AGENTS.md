# AGENTS.md

## Cursor Cloud specific instructions

### Architecture Overview
Campus Lost and Found Management System with three layers:
- **Backend**: Node.js/Express REST API on port 3000 (`/workspace/backend`)
- **Frontend**: Angular 21 + Angular Material on port 4200 (`/workspace/frontend`)
- **Database**: MySQL 8.0 (`campus_lost_and_found` database)

### Starting Services

1. **MySQL** must be started first (it does not auto-start):
   ```
   sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld
   sudo mysqld --user=mysql --datadir=/var/lib/mysql --socket=/var/run/mysqld/mysqld.sock --port=3306 &
   ```
   Wait ~5 seconds for it to be ready.

2. **Backend** (Express API):
   ```
   cd /workspace/backend && node src/server.js
   ```
   Runs on http://localhost:3000. Health check: `GET /api/health`

3. **Frontend** (Angular dev server):
   ```
   cd /workspace/frontend && npx ng serve --host 0.0.0.0 --port 4200
   ```
   Runs on http://localhost:4200. If prompted about analytics, answer `N`.

### Test Credentials
- **Admin**: `admin@campus.edu` / `password123`
- **User**: `maria.santos@campus.edu` / `password123`

### Lint & Build Commands
- Backend lint: `cd /workspace/backend && npx eslint src/`
- Frontend lint: `cd /workspace/frontend && npx ng lint`
- Frontend build: `cd /workspace/frontend && npx ng build`
- Backend tests: `cd /workspace/backend && npm test`

### Key Gotchas
- MySQL socket directory `/var/run/mysqld` may not exist after VM restart; create it before starting mysqld.
- The `zone.js` import is required in `frontend/src/main.ts` for Angular to bootstrap correctly.
- Frontend uses Angular 21 standalone components with lazy-loaded routes.
- Backend uses `mysql2/promise` with connection pooling.
- All API routes (except `/api/health`, `/api/login`, `/api/register`) require JWT Bearer token in Authorization header.
- File uploads go to `/workspace/backend/uploads/` directory.
- Database schema and seed data are in `/workspace/database/`.
