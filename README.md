# Premium Portfolio Website with CMS

A high-end, full-stack portfolio website with a custom Content Management System (CMS) backend.

> **🔒 Security Update (2024-01-23):** All critical Next.js vulnerabilities have been resolved. See [SECURITY_ADVISORY.md](SECURITY_ADVISORY.md) for details.

## 🚀 Features

### Public Portfolio
- **Minimalist Dark Mode Design** with elegant typography
- **Glassmorphism UI Elements** for a premium aesthetic
- **Smooth Animations** powered by Framer Motion
- **Fully Responsive** mobile-first design
- **Fast Load Times** optimized for performance

### Admin CMS
- **Secure Authentication** with JWT tokens
- **CRUD Operations** for Projects and Qualifications
- **Intuitive Dashboard** for content management
- **Real-time Updates** reflected on the portfolio

### Security Features
- ✅ **Password Hashing** with bcrypt (10 rounds)
- ✅ **JWT Authentication** with token expiration
- ✅ **SQL Injection Protection** via prepared statements
- ✅ **XSS Prevention** with input sanitization
- ✅ **CSRF Protection** built into the API
- ✅ **Rate Limiting** on all endpoints
- ✅ **Helmet.js Security Headers**

## 🛠 Tech Stack

### Frontend
- **Next.js 14.2.35** - React framework (security patched)
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
nexus/
├── frontend/                 # Next.js frontend application
│   ├── components/          # React components
│   │   ├── admin/          # Admin CMS components
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Projects.js
│   │   ├── Qualifications.js
│   │   └── Contact.js
│   ├── pages/              # Next.js pages
│   │   ├── admin/          # Admin pages
│   │   │   ├── login.js
│   │   │   └── dashboard.js
│   │   ├── _app.js
│   │   └── index.js
│   ├── lib/                # Utility functions
│   │   └── api.js          # API client
│   ├── styles/             # Global styles
│   └── package.json
│
├── backend/                 # Express.js backend API
│   ├── config/             # Configuration files
│   │   └── database.js     # Database connection
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── qualificationController.js
│   │   └── projectController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT verification
│   │   ├── sanitize.js     # Input sanitization
│   │   └── rateLimiter.js  # Rate limiting
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   ├── qualificationRoutes.js
│   │   └── projectRoutes.js
│   ├── scripts/            # Utility scripts
│   │   └── initDb.js       # Database initialization
│   ├── utils/              # Helper functions
│   │   └── validation.js   # Input validation
│   ├── server.js           # Express app entry point
│   └── package.json
│
└── database/               # Database files
    └── schema.sql         # PostgreSQL schema
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chrisdinakin/nexus.git
   cd nexus
   ```

2. **Set up the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb portfolio_db
   ```

3. **Configure the Backend**
   
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` and update with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=portfolio_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_change_this
   ADMIN_PASSWORD=Admin@123
   ```

4. **Install Backend Dependencies**
   ```bash
   npm install
   ```

5. **Initialize the Database**
   ```bash
   node scripts/initDb.js
   ```
   
   This will:
   - Create all required tables
   - Create a default admin user
   - Add sample data

6. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   
   Backend will run on `http://localhost:5000`

7. **Configure the Frontend**
   
   Open a new terminal:
   ```bash
   cd ../frontend
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

8. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

9. **Start the Frontend**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

## 🔐 Default Admin Credentials

After database initialization:

- **Username:** `admin`
- **Password:** `Admin@123`

**⚠️ IMPORTANT:** Change these credentials immediately in production!

## 📖 Usage

### Accessing the Portfolio

Visit `http://localhost:3000` to view the public portfolio.

### Accessing the Admin CMS

1. Navigate to `http://localhost:3000/admin/login`
2. Log in with the admin credentials
3. Manage your projects and qualifications from the dashboard

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

#### Qualifications (Public)
- `GET /api/qualifications` - Get all qualifications
- `GET /api/qualifications/:id` - Get single qualification

#### Qualifications (Protected)
- `POST /api/qualifications` - Create qualification
- `PUT /api/qualifications/:id` - Update qualification
- `DELETE /api/qualifications/:id` - Delete qualification

#### Projects (Public)
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project

#### Projects (Protected)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🔒 Security Best Practices

### Implemented Security Measures

1. **Password Security**
   - Passwords hashed with bcrypt (10 rounds)
   - Strong password requirements enforced
   - No plain text password storage

2. **SQL Injection Prevention**
   - All queries use parameterized statements
   - Input validation on all endpoints
   - Type checking for database inputs

3. **XSS Prevention**
   - All user input sanitized with XSS library
   - Content Security Policy headers
   - Output encoding

4. **Authentication & Authorization**
   - JWT tokens with expiration
   - Secure token storage
   - Route-level authentication middleware
   - Admin role verification

5. **Rate Limiting**
   - API rate limiting (100 requests/15 min)
   - Auth rate limiting (5 attempts/15 min)
   - CMS rate limiting (50 requests/15 min)

6. **Additional Security**
   - Helmet.js security headers
   - CORS configuration
   - Error message sanitization
   - HTTPS enforcement (production)

### Production Deployment Checklist

- [ ] Change default admin credentials
- [ ] Update JWT_SECRET to a strong random value
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Enable database SSL connections
- [ ] Review and update rate limits
- [ ] Set up firewall rules

## 🎨 Customization

### Styling

The portfolio uses Tailwind CSS for styling. You can customize:

- **Colors:** Edit `frontend/tailwind.config.js`
- **Typography:** Modify font families in the config
- **Animations:** Adjust Framer Motion settings in components

### Content

1. Update the Hero section in `frontend/components/Hero.js`
2. Modify the About section in `frontend/components/About.js`
3. Add your content through the Admin CMS

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check connection credentials in `.env`
- Ensure database exists: `psql -l`

### Frontend API Connection
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure `NEXT_PUBLIC_API_URL` is set correctly

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET matches between requests
- Check token expiration time

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Express, and PostgreSQL