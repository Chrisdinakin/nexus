-- Premium Portfolio Website Database Schema
-- Database: PostgreSQL

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create qualifications table
CREATE TABLE IF NOT EXISTS qualifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    skills TEXT[], -- Array of skills
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    skills TEXT[], -- Array of skills
    image_url VARCHAR(500),
    project_url VARCHAR(500),
    github_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create index on sessions expire for cleanup
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Insert default admin user (password: Admin@123 - CHANGE THIS IN PRODUCTION!)
-- Password hash generated with bcrypt for 'Admin@123'
INSERT INTO users (username, password_hash, email) 
VALUES ('admin', '$2b$10$YourHashWillBeGeneratedByBcrypt', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;
