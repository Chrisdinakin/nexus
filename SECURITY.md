# Security Documentation

This document outlines the security measures implemented in the Premium Portfolio Website with CMS.

## Overview

Security is a critical aspect of this application. We've implemented multiple layers of protection to ensure the safety of user data and prevent common web vulnerabilities.

## Security Features Implemented

### 1. Authentication & Authorization

#### JWT (JSON Web Tokens)
- **Implementation:** Token-based authentication
- **Expiration:** Configurable (default 24 hours)
- **Storage:** Client-side in localStorage (secure context)
- **Transmission:** Via Authorization header as Bearer token

**Code Location:** `backend/middleware/auth.js`

```javascript
// Token verification middleware
export const verifyToken = (req, res, next) => {
  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

#### Session Management
- Tokens expire after configured time
- Invalid tokens automatically cleared
- Logout functionality implemented
- Token refresh not implemented (can be added)

### 2. Password Security

#### Bcrypt Hashing
- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Implementation:** All passwords hashed before storage
- **Verification:** Constant-time comparison

**Code Location:** `backend/controllers/authController.js`

```javascript
// Password hashing on user creation
const hashedPassword = await bcrypt.hash(adminPassword, 10);

// Password verification on login
const isValid = await bcrypt.compare(password, user.password_hash);
```

#### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Code Location:** `backend/utils/validation.js`

### 3. SQL Injection Prevention

#### Parameterized Queries
**All** database queries use prepared statements with parameterized inputs.

**Code Location:** All controller files

```javascript
// Example: Safe query with parameters
const result = await query(
  'SELECT * FROM qualifications WHERE id = $1',
  [id]
);

// NEVER do this (vulnerable):
// const result = await query(`SELECT * FROM qualifications WHERE id = ${id}`);
```

#### Database Configuration
- Connection pooling with limits
- Timeout configurations
- Error handling without information leakage

**Code Location:** `backend/config/database.js`

### 4. Cross-Site Scripting (XSS) Prevention

#### Input Sanitization
- All user inputs sanitized using the `xss` library
- Applied at middleware level
- Recursive sanitization for nested objects

**Code Location:** `backend/middleware/sanitize.js`

```javascript
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input);
  }
  // Handles objects and arrays recursively
};
```

#### Content Security Policy (CSP)
Implemented via Helmet.js:
- Restricts script sources
- Prevents inline script execution
- Controls resource loading

**Code Location:** `backend/server.js`

### 5. Cross-Site Request Forgery (CSRF) Protection

#### Token-Based Protection
- JWT tokens serve as CSRF tokens
- Origin checking via CORS configuration
- Custom headers required for state-changing operations

#### CORS Configuration
- Strict origin allowlist
- Credentials allowed only from trusted origins
- Pre-flight request handling

**Code Location:** `backend/server.js`

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### 6. Rate Limiting

#### Multiple Rate Limiters

1. **General API Limiter**
   - 100 requests per 15 minutes
   - Applies to all API endpoints

2. **Authentication Limiter**
   - 5 login attempts per 15 minutes
   - Prevents brute force attacks
   - Skips successful requests

3. **CMS Operations Limiter**
   - 50 requests per 15 minutes
   - Protects admin endpoints

**Code Location:** `backend/middleware/rateLimiter.js`

### 7. Security Headers (Helmet.js)

Implemented security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- Content Security Policy
- And more...

**Code Location:** `backend/server.js`

### 8. Input Validation

#### Server-Side Validation
All inputs validated on the server:
- Type checking
- Format validation
- Length restrictions
- Email format validation
- URL format validation

**Code Location:** `backend/utils/validation.js`

#### Client-Side Validation
Form validation on frontend:
- Required field checking
- Format validation
- Real-time feedback

**Code Location:** Form components in `frontend/components/admin/`

### 9. Error Handling

#### Secure Error Messages
- Production errors don't leak sensitive information
- Stack traces hidden in production
- Generic error messages to users
- Detailed logs for debugging (server-side only)

**Code Location:** `backend/server.js`

```javascript
const message = process.env.NODE_ENV === 'production' 
  ? 'Internal server error' 
  : err.message;
```

## Security Best Practices for Deployment

### Pre-Deployment Checklist

1. **Environment Variables**
   - [ ] Generate strong JWT_SECRET (32+ characters)
   - [ ] Change default admin credentials
   - [ ] Use strong database password
   - [ ] Set NODE_ENV=production

2. **HTTPS/SSL**
   - [ ] Obtain SSL certificate (Let's Encrypt recommended)
   - [ ] Configure HTTPS redirect
   - [ ] Enable HSTS header
   - [ ] Update CORS to use https:// URLs

3. **Database Security**
   - [ ] Enable SSL for database connections
   - [ ] Use principle of least privilege for DB user
   - [ ] Regular backups configured
   - [ ] Audit logging enabled

4. **Server Configuration**
   - [ ] Firewall configured (allow only 80, 443)
   - [ ] SSH key authentication only
   - [ ] Keep system packages updated
   - [ ] Configure reverse proxy (nginx/Apache)

5. **Application Security**
   - [ ] Review and update rate limits
   - [ ] Enable production error logging
   - [ ] Set up monitoring alerts
   - [ ] Regular dependency updates

### Recommended Tools

- **Dependency Scanning:** `npm audit`
- **SAST:** SonarQube, ESLint Security Plugin
- **Secret Scanning:** GitGuardian, TruffleHog
- **Monitoring:** Sentry, DataDog, New Relic
- **WAF:** Cloudflare, AWS WAF

## Security Testing

### Manual Testing

1. **SQL Injection Testing**
   ```bash
   # Try common SQL injection patterns
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin'\'' OR 1=1--","password":"test"}'
   ```

2. **XSS Testing**
   ```bash
   # Try injecting scripts
   curl -X POST http://localhost:5000/api/qualifications \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"<script>alert(1)</script>","date":"2024-01-01"}'
   ```

3. **Rate Limiting Testing**
   ```bash
   # Try exceeding rate limits
   for i in {1..10}; do
     curl -X POST http://localhost:5000/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"username":"test","password":"test"}'
   done
   ```

### Automated Testing

```bash
# Dependency vulnerability scan
cd backend && npm audit
cd frontend && npm audit

# Fix vulnerabilities
npm audit fix
```

## Incident Response

### If You Suspect a Security Breach

1. **Immediate Actions**
   - Change all passwords immediately
   - Revoke all JWT tokens (change JWT_SECRET)
   - Review recent database changes
   - Check server logs for suspicious activity

2. **Investigation**
   - Review access logs
   - Check for unauthorized data modifications
   - Identify attack vector
   - Document findings

3. **Remediation**
   - Patch identified vulnerabilities
   - Restore from clean backup if needed
   - Update security measures
   - Notify affected users if applicable

4. **Post-Incident**
   - Conduct security review
   - Update security procedures
   - Implement additional monitoring
   - Document lessons learned

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: [Your Email]
3. Provide detailed information:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.

## Regular Maintenance

### Weekly
- Review application logs
- Check for failed login attempts
- Monitor rate limiting hits

### Monthly
- Run `npm audit` and fix vulnerabilities
- Review and update dependencies
- Check for security updates in frameworks
- Review user access logs

### Quarterly
- Full security audit
- Penetration testing (if possible)
- Review and update security policies
- Security training for team

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Remember:** Security is an ongoing process, not a one-time implementation. Stay vigilant and keep your dependencies updated!
