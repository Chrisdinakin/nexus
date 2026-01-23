import { query } from '../config/database.js';

/**
 * Get all qualifications
 */
export const getAllQualifications = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM qualifications ORDER BY date DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get qualifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get single qualification by ID
 */
export const getQualificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM qualifications WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get qualification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create new qualification
 */
export const createQualification = async (req, res) => {
  try {
    const { title, description, date, skills } = req.body;
    
    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    // Insert using prepared statement
    const result = await query(
      'INSERT INTO qualifications (title, description, date, skills) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, date, skills || []]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create qualification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update qualification
 */
export const updateQualification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, skills } = req.body;
    
    // Check if qualification exists
    const checkResult = await query(
      'SELECT id FROM qualifications WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    
    // Update using prepared statement
    const result = await query(
      'UPDATE qualifications SET title = $1, description = $2, date = $3, skills = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, description, date, skills || [], id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update qualification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete qualification
 */
export const deleteQualification = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete using prepared statement
    const result = await query(
      'DELETE FROM qualifications WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    
    res.json({ message: 'Qualification deleted successfully' });
  } catch (error) {
    console.error('Delete qualification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
