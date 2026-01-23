# Quick Start Guide

Get your premium portfolio website up and running in 5 minutes!

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js (v18+) installed: `node --version`
- ✅ PostgreSQL (v14+) installed: `psql --version`
- ✅ Git installed: `git --version`

## Step-by-Step Setup

### 1. Clone & Navigate
```bash
git clone https://github.com/Chrisdinakin/nexus.git
cd nexus
```

### 2. Database Setup
```bash
# Create the database
createdb portfolio_db

# Or using psql
psql -U postgres
CREATE DATABASE portfolio_db;
\q
```

### 3. Backend Configuration
```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Required changes:
# - DB_PASSWORD=your_postgres_password
# - JWT_SECRET=generate_a_random_secret_key
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Backend Installation
```bash
# Install dependencies
npm install

# Initialize database (creates tables & admin user)
node scripts/initDb.js

# Start backend server
npm run dev
```

You should see: `Server running on port 5000` ✅

### 5. Frontend Configuration (New Terminal)
```bash
# Open new terminal window
cd frontend

# Copy environment file
cp .env.example .env.local

# No changes needed if backend runs on localhost:5000
```

### 6. Frontend Installation
```bash
# Install dependencies
npm install

# Start frontend server
npm run dev
```

You should see: `ready - started server on 0.0.0.0:3000` ✅

## Access Your Application

- **Portfolio Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **Backend API:** http://localhost:5000/api

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `Admin@123`

⚠️ **IMPORTANT:** Change these credentials after first login!

## Common Issues & Solutions

### Issue: Database connection refused
**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list               # macOS

# Start PostgreSQL if needed
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

### Issue: Port already in use
**Solution:**
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill

# Frontend (port 3000)
lsof -ti:3000 | xargs kill
```

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Cannot access admin page
**Solution:**
1. Check backend is running on port 5000
2. Open browser console (F12) to see errors
3. Clear browser localStorage
4. Try login again

## Next Steps

1. **Update Content**
   - Log into admin panel
   - Add your own projects and qualifications
   - Customize the portfolio

2. **Customize Design**
   - Edit colors in `frontend/tailwind.config.js`
   - Modify components in `frontend/components/`
   - Update Hero section with your info

3. **Security Setup (Before Production)**
   - Change admin password
   - Update JWT secret
   - Review database credentials
   - Enable HTTPS

4. **Deploy**
   - See README.md for deployment options
   - Configure production environment variables
   - Set up CI/CD pipeline

## Helpful Commands

### Backend
```bash
cd backend
npm run dev      # Development server with auto-reload
npm start        # Production server
```

### Frontend
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm start        # Serve production build
npm run lint     # Check code quality
```

### Database
```bash
# Access database
psql -U postgres -d portfolio_db

# Common queries
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM qualifications;

# Reset database (caution!)
node scripts/initDb.js
```

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🐛 Found a bug? Open an issue on GitHub
- 💬 Questions? Check the troubleshooting section in README

---

Happy coding! 🚀
