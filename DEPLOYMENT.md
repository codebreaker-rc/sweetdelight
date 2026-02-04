# Deployment Guide: Dockerize → Git → VPS

Complete step-by-step guide to deploy the Cake Shop application to a VPS using Docker.

---

## Phase 1: Dockerize Application (Local)

### 1. Verify Docker Files Created

Ensure these files exist:
- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `docker-compose.yml` (development)
- `docker-compose.prod.yml` (production)
- `nginx.conf`
- `.env.production.example`
- `.gitignore`

### 2. Test Docker Build Locally

```bash
# Navigate to project root
cd /home/rchandra/WebProjects/nextjsapp

# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

**Verify:**
- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4000/graphql
- PostgreSQL: localhost:5432

### 3. Test Application

```bash
# View logs
docker-compose logs -f

# Check running containers
docker ps

# Stop containers
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

---

## Phase 2: Push to Git

### 1. Initialize Git Repository

```bash
cd /home/rchandra/WebProjects/nextjsapp

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Dockerized cake shop application"
```

### 2. Create GitHub/GitLab Repository

**On GitHub:**
1. Go to https://github.com/new
2. Create repository (e.g., `cake-shop-ecommerce`)
3. Don't initialize with README (we already have files)

### 3. Push to Remote

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/cake-shop-ecommerce.git

# Push to main branch
git branch -M main
git push -u origin main
```

**Verify:** Check your repository on GitHub/GitLab

---

## Phase 3: VPS Setup

### 1. Connect to VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### 2. Install Docker on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group (optional)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

### 3. Install Git (if not installed)

```bash
sudo apt install git -y
git --version
```

---

## Phase 4: Deploy to VPS

### 1. Clone Repository on VPS

```bash
# Navigate to desired directory
cd /var/www  # or /home/your-user/apps

# Clone your repository
git clone https://github.com/YOUR_USERNAME/cake-shop-ecommerce.git

# Navigate to project
cd cake-shop-ecommerce
```

### 2. Configure Production Environment

```bash
# Copy production environment template
cp .env.production.example .env.production

# Edit with production values
nano .env.production
```

**Set these values:**
```env
POSTGRES_USER=cakeshop
POSTGRES_PASSWORD=SuperSecurePassword123!
POSTGRES_DB=cakeshop

DATABASE_URL=postgresql://cakeshop:SuperSecurePassword123!@postgres:5432/cakeshop?schema=public
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-random-string

NEXT_PUBLIC_GRAPHQL_URL=https://your-domain.com/graphql
# Or if using IP: http://your-vps-ip/graphql
```

### 3. Build and Run with Docker Compose

```bash
# Build images
docker-compose -f docker-compose.prod.yml --env-file .env.production build

# Start services
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Verify Deployment

```bash
# Check running containers
docker ps

# Test backend
curl http://localhost:4000/graphql

# Test frontend
curl http://localhost:3000
```

**Access from browser:**
- http://your-vps-ip (frontend via Nginx)
- http://your-vps-ip/graphql (backend API)

---

## Phase 5: Domain & SSL (Optional but Recommended)

### 1. Point Domain to VPS

In your domain registrar (GoDaddy, Namecheap, etc.):
- Add A record: `@` → `your-vps-ip`
- Add A record: `www` → `your-vps-ip`

### 2. Install Certbot for SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop Nginx container temporarily
docker-compose -f docker-compose.prod.yml stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Certificates will be in: /etc/letsencrypt/live/your-domain.com/
```

### 3. Update Nginx Configuration

```bash
# Edit nginx.conf to add SSL
nano nginx.conf
```

Add SSL server block:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... rest of configuration
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. Update docker-compose.prod.yml

Add SSL volume mount:
```yaml
nginx:
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt/live/your-domain.com:/etc/nginx/ssl:ro
```

### 5. Restart Services

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

---

## Phase 6: Maintenance Commands

### Update Application

```bash
# On VPS
cd /var/www/cake-shop-ecommerce

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Database Backup

```bash
# Backup
docker exec cakeshop-db pg_dump -U cakeshop cakeshop > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i cakeshop-db psql -U cakeshop cakeshop < backup_20260204.sql
```

### Stop/Start Services

```bash
# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Clean Up

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

---

## Complete Command Summary

### Local Testing
```bash
docker-compose up --build
```

### Git Push
```bash
git add .
git commit -m "Your message"
git push origin main
```

### VPS Deployment
```bash
# First time
git clone <repo-url>
cd cake-shop-ecommerce
cp .env.production.example .env.production
nano .env.production
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Updates
git pull origin main
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## Troubleshooting

### Container won't start
```bash
docker-compose -f docker-compose.prod.yml logs <service-name>
```

### Database connection issues
```bash
# Check if postgres is running
docker ps | grep postgres

# Check database logs
docker logs cakeshop-db
```

### Port already in use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>
```

### Reset everything
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## Security Checklist

- ✅ Change default passwords in `.env.production`
- ✅ Use strong JWT secret (32+ characters)
- ✅ Enable firewall (UFW)
- ✅ Install SSL certificate
- ✅ Regular backups
- ✅ Keep Docker images updated
- ✅ Don't commit `.env.production` to Git
- ✅ Use non-root user for Docker
- ✅ Enable fail2ban for SSH protection

---

## Support

For issues, check:
1. Container logs: `docker-compose logs -f`
2. Application logs inside containers
3. Network connectivity
4. Environment variables
5. Database migrations
