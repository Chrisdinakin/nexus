import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

dotenv.config();

const { Pool } = pg;

// Create database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Initialize database with schema and default admin user
 */
const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database initialization...');
    
    // Read and execute schema
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const schemaPath = __dirname + '/../../database/schema.sql';
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema by semicolons and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim() && !statement.includes('INSERT INTO users')) {
        await client.query(statement);
      }
    }
    
    console.log('Schema created successfully');
    
    // Create default admin user with hashed password
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await client.query(
      `INSERT INTO users (username, password_hash, email) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (username) DO NOTHING`,
      [
        process.env.ADMIN_USERNAME || 'admin',
        hashedPassword,
        process.env.ADMIN_EMAIL || 'admin@example.com'
      ]
    );
    
    console.log('Default admin user created');
    console.log('Username:', process.env.ADMIN_USERNAME || 'admin');
    console.log('Password:', adminPassword);
    console.log('⚠️  IMPORTANT: Change the default password in production!');
    
    // Add sample data
    await client.query(
      `INSERT INTO qualifications (title, description, date, skills)
       VALUES 
       ($1, $2, $3, $4),
       ($5, $6, $7, $8)
       ON CONFLICT DO NOTHING`,
      [
        'Bachelor of Science in Computer Science',
        'Graduated with honors, specializing in software engineering and artificial intelligence.',
        '2020-05-15',
        ['JavaScript', 'Python', 'Java', 'SQL'],
        'AWS Certified Solutions Architect',
        'Professional certification for designing distributed systems on AWS.',
        '2022-03-10',
        ['AWS', 'Cloud Architecture', 'DevOps']
      ]
    );
    
    await client.query(
      `INSERT INTO projects (title, description, date, skills, featured)
       VALUES 
       ($1, $2, $3, $4, $5),
       ($6, $7, $8, $9, $10)
       ON CONFLICT DO NOTHING`,
      [
        'E-Commerce Platform',
        'A full-stack e-commerce platform with payment integration, inventory management, and admin dashboard.',
        '2023-06-15',
        ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        true,
        'Portfolio CMS',
        'Custom content management system for managing portfolio projects and qualifications.',
        '2024-01-20',
        ['Next.js', 'Express', 'PostgreSQL', 'JWT'],
        true
      ]
    );
    
    console.log('Sample data added successfully');
    console.log('\n✅ Database initialization complete!');
    
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run initialization
initializeDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
