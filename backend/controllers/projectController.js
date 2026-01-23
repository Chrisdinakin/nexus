import { query } from '../config/database.js';

/**
 * Get all projects
 */
export const getAllProjects = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects ORDER BY date DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get featured projects
 */
export const getFeaturedProjects = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE featured = true ORDER BY date DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get single project by ID
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create new project
 */
export const createProject = async (req, res) => {
  try {
    const { title, description, date, skills, image_url, project_url, github_url, featured } = req.body;
    
    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    // Insert using prepared statement
    const result = await query(
      'INSERT INTO projects (title, description, date, skills, image_url, project_url, github_url, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, date, skills || [], image_url, project_url, github_url, featured || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update project
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, skills, image_url, project_url, github_url, featured } = req.body;
    
    // Check if project exists
    const checkResult = await query(
      'SELECT id FROM projects WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Update using prepared statement
    const result = await query(
      'UPDATE projects SET title = $1, description = $2, date = $3, skills = $4, image_url = $5, project_url = $6, github_url = $7, featured = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [title, description, date, skills || [], image_url, project_url, github_url, featured || false, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete using prepared statement
    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
