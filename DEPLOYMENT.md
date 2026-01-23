# Deployment Guide

This guide covers deploying the Premium Portfolio Website with CMS to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Deployment](#database-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Platform-Specific Guides](#platform-specific-guides)
7. [Post-Deployment](#post-deployment)

## Pre-Deployment Checklist

### Security
- [ ] Change default admin credentials
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Use strong database password
- [ ] Review all environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up SSL for database connections

### Configuration
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins to production URLs
- [ ] Configure proper error logging
- [ ] Set up monitoring and alerts
- [ ] Configure backups

### Code
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Test all features in staging environment
- [ ] Create production build
- [ ] Verify all environment variables are set

## Environment Setup

### Generate Secure Secrets

```bash
# Generate JWT secret (use this in production)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate database password
openssl rand -base64 32
```

### Environment Variables

Create production `.env` files:

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=your-strong-password-here

# JWT
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=https://yourdomain.com

# Admin (for initial setup only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_EMAIL=admin@yourdomain.com
```

**Frontend (.env.local or .env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Database Deployment

### Option 1: Managed PostgreSQL (Recommended)

**Popular providers:**
- **Heroku Postgres:** Easy setup, free tier available
- **AWS RDS:** Scalable, reliable
- **DigitalOcean Managed Databases:** Simple and affordable
- **Supabase:** PostgreSQL with additional features
- **Railway:** Modern deployment platform

**Example: DigitalOcean Managed Database**

1. Create a managed PostgreSQL database
2. Get connection details
3. Enable SSL connection
4. Add your server's IP to allowed connections
5. Update backend .env with connection details

### Option 2: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q

# Initialize database
cd backend
node scripts/initDb.js
```

### Enable SSL for Database

In `backend/config/database.js`, add:
```javascript
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Use true with proper certificates
  },
});
```

## Backend Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login and create app
heroku login
heroku create your-app-name-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-here
heroku config:set FRONTEND_URL=https://yourdomain.com

# Deploy
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name-api
git push heroku main

# Initialize database
heroku run node scripts/initDb.js
```

### Option 2: DigitalOcean App Platform

1. Create a new app
2. Connect your GitHub repository
3. Select the backend directory
4. Add environment variables in the dashboard
5. Deploy

### Option 3: VPS (Ubuntu)

```bash
# Connect to your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/nexus.git
cd nexus/backend

# Install dependencies
npm ci --production

# Create .env file
nano .env
# (paste your environment variables)

# Initialize database
node scripts/initDb.js

# Start with PM2
pm2 start server.js --name portfolio-api
pm2 save
pm2 startup

# Configure nginx as reverse proxy
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/portfolio-api
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site and restart nginx
sudo ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# Add: NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Deploy to production
vercel --prod
```

### Option 2: Netlify

1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/.next`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

### Option 3: VPS (Static Export)

```bash
# On your VPS
cd nexus/frontend

# Install dependencies
npm ci --production

# Build the application
npm run build

# Use PM2 to serve
pm2 start npm --name "portfolio-frontend" -- start

# Or export as static site
npm run build
# Copy .next to your web server directory
```

**Nginx configuration for frontend:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 4: Docker

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Dockerfile (Frontend):**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: portfolio_db
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=portfolio_db
      - DB_USER=portfolio_user
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    ports:
      - "5000:5000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Platform-Specific Guides

### AWS (EC2 + RDS)

1. **Create RDS PostgreSQL Instance**
   - Choose PostgreSQL 14
   - Select appropriate instance size
   - Enable automatic backups
   - Configure security group to allow EC2 access

2. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro or larger
   - Configure security group (HTTP, HTTPS, SSH)

3. **Deploy Application**
   - Follow VPS deployment steps above
   - Use RDS endpoint for database connection

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up

# Set environment variables in Railway dashboard
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Test backend
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com

# Test API endpoints
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 2. Monitor Application

**Set up monitoring:**
- Application: PM2, New Relic, DataDog
- Server: CloudWatch, Grafana
- Errors: Sentry
- Uptime: UptimeRobot, Pingdom

**PM2 Monitoring:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Configure Backups

**Database Backup (cron job):**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -U portfolio_user portfolio_db | gzip > /backup/portfolio_$(date +\%Y\%m\%d).sql.gz
```

**Automated backups with managed services:**
- Enable automatic backups in your database provider
- Set retention period (7-30 days)
- Test restore procedure

### 4. Set Up SSL Certificate Renewal

```bash
# Certbot auto-renewal (already set up with certbot)
sudo certbot renew --dry-run

# Check renewal cron
sudo systemctl status certbot.timer
```

### 5. Security Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Keep system updated
sudo apt-get update
sudo apt-get upgrade

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 6. Performance Optimization

**Enable Gzip in Nginx:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

**Add caching headers:**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 7. Documentation Updates

- Update README with production URLs
- Document deployment process
- Create runbook for common issues
- Document rollback procedure

## Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check database is running
systemctl status postgresql

# Check connection
psql -U portfolio_user -d portfolio_db -h localhost

# Verify firewall allows connection
sudo ufw status
```

**CORS Errors:**
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in server.js
- Ensure frontend is using correct API URL

**502 Bad Gateway:**
- Check if backend is running: `pm2 status`
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify proxy_pass in nginx config

**Module Not Found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Rollback Procedure

```bash
# With PM2
pm2 stop portfolio-api
git checkout previous-commit-hash
npm install
pm2 restart portfolio-api

# With Docker
docker-compose down
git checkout previous-commit-hash
docker-compose up -d --build
```

## Support

For deployment issues:
1. Check application logs: `pm2 logs portfolio-api`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Review DEPLOYMENT.md
4. Open an issue on GitHub

---

**Last Updated:** January 2024  
**Maintained By:** Development Team
