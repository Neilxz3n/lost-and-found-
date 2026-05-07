const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all lost items with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { keyword, category, status, location, date_from, date_to } = req.query;
    let query = `
      SELECT li.*, u.full_name as reporter_name, c.category_name
      FROM lost_items li
      LEFT JOIN users u ON li.user_id = u.id
      LEFT JOIN categories c ON li.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (keyword) {
      query += ' AND (li.item_name LIKE ? OR li.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (category) {
      query += ' AND li.category_id = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND li.status = ?';
      params.push(status);
    }
    if (location) {
      query += ' AND li.location_lost LIKE ?';
      params.push(`%${location}%`);
    }
    if (date_from) {
      query += ' AND li.date_lost >= ?';
      params.push(date_from);
    }
    if (date_to) {
      query += ' AND li.date_lost <= ?';
      params.push(date_to);
    }

    query += ' ORDER BY li.created_at DESC';
    const [items] = await pool.query(query, params);
    res.json(items);
  } catch (error) {
    console.error('Get lost items error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get single lost item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT li.*, u.full_name as reporter_name, c.category_name
      FROM lost_items li
      LEFT JOIN users u ON li.user_id = u.id
      LEFT JOIN categories c ON li.category_id = c.id
      WHERE li.id = ?
    `, [req.params.id]);

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json(items[0]);
  } catch (error) {
    console.error('Get lost item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create lost item report
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { item_name, category_id, description, location_lost, date_lost } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      'INSERT INTO lost_items (user_id, category_id, item_name, description, location_lost, date_lost, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id || null, item_name, description, location_lost, date_lost, image]
    );

    await pool.query('INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)',
      [req.user.id, `Reported lost item: ${item_name}`]);

    res.status(201).json({ message: 'Lost item reported successfully.', id: result.insertId });
  } catch (error) {
    console.error('Create lost item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update lost item
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { item_name, category_id, description, location_lost, date_lost, status } = req.body;

    const [existing] = await pool.query('SELECT * FROM lost_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item.' });
    }

    const image = req.file ? req.file.filename : existing[0]?.image || null;
    await pool.query(
      'UPDATE lost_items SET item_name = ?, category_id = ?, description = ?, location_lost = ?, date_lost = ?, image = ?, status = ? WHERE id = ?',
      [item_name, category_id, description, location_lost, date_lost, image, status || 'pending', req.params.id]
    );

    res.json({ message: 'Lost item updated successfully.' });
  } catch (error) {
    console.error('Update lost item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete lost item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM lost_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item.' });
    }

    await pool.query('DELETE FROM lost_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lost item deleted successfully.' });
  } catch (error) {
    console.error('Delete lost item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get user's lost items
router.get('/user/my-items', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT li.*, c.category_name
      FROM lost_items li
      LEFT JOIN categories c ON li.category_id = c.id
      WHERE li.user_id = ?
      ORDER BY li.created_at DESC
    `, [req.user.id]);
    res.json(items);
  } catch (error) {
    console.error('Get user lost items error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
