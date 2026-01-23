# API Documentation

Complete API reference for the Premium Portfolio Website backend.

## Base URL

```
http://localhost:5000/api
```

For production, replace with your actual domain.

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Obtain the token by logging in via `/api/auth/login`.

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

## Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
```

**Description:** Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing username or password
- `401 Unauthorized` - Invalid credentials
- `429 Too Many Requests` - Rate limit exceeded (5 attempts/15 min)

---

#### Verify Token
```http
GET /api/auth/verify
```

**Description:** Verify if the current JWT token is valid.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired token

---

#### Logout
```http
POST /api/auth/logout
```

**Description:** Logout user (client should remove token).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Qualifications

#### Get All Qualifications
```http
GET /api/qualifications
```

**Description:** Retrieve all qualifications (public endpoint).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Bachelor of Science in Computer Science",
    "description": "Graduated with honors...",
    "date": "2020-05-15T00:00:00.000Z",
    "skills": ["JavaScript", "Python", "Java", "SQL"],
    "created_at": "2024-01-20T10:00:00.000Z",
    "updated_at": "2024-01-20T10:00:00.000Z"
  }
]
```

---

#### Get Single Qualification
```http
GET /api/qualifications/:id
```

**Description:** Retrieve a specific qualification by ID (public endpoint).

**Parameters:**
- `id` (path parameter) - Qualification ID

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Bachelor of Science in Computer Science",
  "description": "Graduated with honors...",
  "date": "2020-05-15T00:00:00.000Z",
  "skills": ["JavaScript", "Python", "Java", "SQL"],
  "created_at": "2024-01-20T10:00:00.000Z",
  "updated_at": "2024-01-20T10:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Qualification not found

---

#### Create Qualification
```http
POST /api/qualifications
```

**Description:** Create a new qualification (protected - requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "AWS Certified Solutions Architect",
  "description": "Professional certification for designing distributed systems",
  "date": "2022-03-10",
  "skills": ["AWS", "Cloud Architecture", "DevOps"]
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "AWS Certified Solutions Architect",
  "description": "Professional certification for designing distributed systems",
  "date": "2022-03-10T00:00:00.000Z",
  "skills": ["AWS", "Cloud Architecture", "DevOps"],
  "created_at": "2024-01-23T15:30:00.000Z",
  "updated_at": "2024-01-23T15:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields (title, date)
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded

---

#### Update Qualification
```http
PUT /api/qualifications/:id
```

**Description:** Update an existing qualification (protected - requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` (path parameter) - Qualification ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2022-03-10",
  "skills": ["Updated", "Skills"]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2022-03-10T00:00:00.000Z",
  "skills": ["Updated", "Skills"],
  "created_at": "2024-01-20T10:00:00.000Z",
  "updated_at": "2024-01-23T15:35:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Qualification not found
- `429 Too Many Requests` - Rate limit exceeded

---

#### Delete Qualification
```http
DELETE /api/qualifications/:id
```

**Description:** Delete a qualification (protected - requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` (path parameter) - Qualification ID

**Response (200 OK):**
```json
{
  "message": "Qualification deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Qualification not found
- `429 Too Many Requests` - Rate limit exceeded

---

### Projects

#### Get All Projects
```http
GET /api/projects
```

**Description:** Retrieve all projects (public endpoint).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce platform...",
    "date": "2023-06-15T00:00:00.000Z",
    "skills": ["React", "Node.js", "PostgreSQL", "Stripe"],
    "image_url": "https://example.com/image.jpg",
    "project_url": "https://example.com",
    "github_url": "https://github.com/username/repo",
    "featured": true,
    "created_at": "2024-01-20T10:00:00.000Z",
    "updated_at": "2024-01-20T10:00:00.000Z"
  }
]
```

---

#### Get Featured Projects
```http
GET /api/projects/featured
```

**Description:** Retrieve only featured projects (public endpoint).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "E-Commerce Platform",
    "featured": true,
    ...
  }
]
```

---

#### Get Single Project
```http
GET /api/projects/:id
```

**Description:** Retrieve a specific project by ID (public endpoint).

**Parameters:**
- `id` (path parameter) - Project ID

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "E-Commerce Platform",
  "description": "A full-stack e-commerce platform...",
  "date": "2023-06-15T00:00:00.000Z",
  "skills": ["React", "Node.js", "PostgreSQL", "Stripe"],
  "image_url": "https://example.com/image.jpg",
  "project_url": "https://example.com",
  "github_url": "https://github.com/username/repo",
  "featured": true,
  "created_at": "2024-01-20T10:00:00.000Z",
  "updated_at": "2024-01-20T10:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Project not found

---

#### Create Project
```http
POST /api/projects
```

**Description:** Create a new project (protected - requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "Portfolio CMS",
  "description": "Custom content management system...",
  "date": "2024-01-20",
  "skills": ["Next.js", "Express", "PostgreSQL", "JWT"],
  "image_url": "https://example.com/image.jpg",
  "project_url": "https://example.com",
  "github_url": "https://github.com/username/repo",
  "featured": true
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "Portfolio CMS",
  "description": "Custom content management system...",
  "date": "2024-01-20T00:00:00.000Z",
  "skills": ["Next.js", "Express", "PostgreSQL", "JWT"],
  "image_url": "https://example.com/image.jpg",
  "project_url": "https://example.com",
  "github_url": "https://github.com/username/repo",
  "featured": true,
  "created_at": "2024-01-23T15:40:00.000Z",
  "updated_at": "2024-01-23T15:40:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields (title, date)
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded

---

#### Update Project
```http
PUT /api/projects/:id
```

**Description:** Update an existing project (protected - requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` (path parameter) - Project ID

**Request Body:** (same as Create Project)

**Response (200 OK):** (same structure as Create Project)

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Project not found
- `429 Too Many Requests` - Rate limit exceeded

---

#### Delete Project
```http
DELETE /api/projects/:id
```

**Description:** Delete a project (protected - requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` (path parameter) - Project ID

**Response (200 OK):**
```json
{
  "message": "Project deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Project not found
- `429 Too Many Requests` - Rate limit exceeded

---

## Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 attempts | 15 minutes |
| CMS Operations | 50 requests | 15 minutes |

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Too many requests, please try again later"
}
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

### Get Qualifications (Public)
```bash
curl http://localhost:5000/api/qualifications
```

### Create Qualification (Protected)
```bash
curl -X POST http://localhost:5000/api/qualifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"New Qualification",
    "description":"Description here",
    "date":"2024-01-01",
    "skills":["Skill1","Skill2"]
  }'
```

### Update Project (Protected)
```bash
curl -X PUT http://localhost:5000/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"Updated Title",
    "description":"Updated description",
    "date":"2024-01-01",
    "skills":["React","Node.js"],
    "featured":true
  }'
```

### Delete (Protected)
```bash
curl -X DELETE http://localhost:5000/api/qualifications/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with Postman

1. Import the collection or create requests manually
2. Set base URL: `http://localhost:5000/api`
3. For protected endpoints:
   - Add header `Authorization: Bearer {{token}}`
   - Create an environment variable `token` with your JWT

## Errors & Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## WebSocket Support

Not currently implemented. All operations use REST API.

## Versioning

Current version: v1 (implicit in base path `/api`)

Future versions may be accessed via: `/api/v2/...`

## Support

For API issues:
- Check server logs
- Verify authentication token
- Ensure rate limits not exceeded
- Review request format

---

Last updated: January 2024
