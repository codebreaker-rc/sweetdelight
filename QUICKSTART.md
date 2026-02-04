# Quick Start Guide - Using Local PostgreSQL

Since you have PostgreSQL running locally, follow these steps:

---

## Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cakeshop;

# Exit
\q
```

---

## Step 2: Setup Backend

```bash
cd /home/rchandra/WebProjects/nextjsapp/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cakeshop?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=4000
```

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

**Backend will run at:** http://localhost:4000/graphql

---

## Step 3: Setup Frontend

Open a **new terminal**:

```bash
cd /home/rchandra/WebProjects/nextjsapp/frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

**Edit `frontend/.env.local`:**
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

```bash
# Start frontend server
npm run dev
```

**Frontend will run at:** http://localhost:3000

---

## Step 4: Access Application

Open your browser:
- **Frontend:** http://localhost:3000
- **Backend GraphQL Playground:** http://localhost:4000/graphql

**Demo Login:**
- Email: `demo@cakeshop.com`
- Password: `password123`

---

## Alternative: Using Docker with Local PostgreSQL

If you want to run only backend and frontend in Docker (using your local PostgreSQL):

```bash
cd /home/rchandra/WebProjects/nextjsapp

# First, create the database in your local PostgreSQL
psql -U postgres -c "CREATE DATABASE cakeshop;"

# Run with docker-compose
docker-compose -f docker-compose.local.yml up --build
```

This will:
- Use your local PostgreSQL at `host.docker.internal:5432`
- Run backend in Docker on port 4000
- Run frontend in Docker on port 3000

---

## Summary of Commands

```bash
# Terminal 1 - Backend (without Docker)
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Terminal 2 - Frontend (without Docker)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**OR with Docker:**

```bash
# Create database first
psql -U postgres -c "CREATE DATABASE cakeshop;"

# Run everything
docker-compose -f docker-compose.local.yml up --build
```

---

## Troubleshooting

### Database connection error
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

### Port already in use
```bash
# Find and kill process on port 4000
sudo lsof -i :4000
sudo kill -9 <PID>

# Find and kill process on port 3000
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Prisma migration issues
```bash
# Reset database (WARNING: deletes all data)
cd backend
npm run prisma:migrate reset
```
