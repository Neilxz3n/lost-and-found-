const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all found items with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { keyword, category, status, location, date_from, date_to } = req.query;
    let query = `
      SELECT fi.*, u.full_name as finder_name, c.category_name
      FROM found_items fi
      LEFT JOIN users u ON fi.user_id = u.id
      LEFT JOIN categories c ON fi.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (keyword) {
      query += ' AND (fi.item_name LIKE ? OR fi.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (category) {
      query += ' AND fi.category_id = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND fi.status = ?';
      params.push(status);
    }
    if (location) {
      query += ' AND fi.location_found LIKE ?';
      params.push(`%${location}%`);
    }
    if (date_from) {
      query += ' AND fi.date_found >= ?';
      params.push(date_from);
    }
    if (date_to) {
      query += ' AND fi.date_found <= ?';
      params.push(date_to);
    }

    query += ' ORDER BY fi.created_at DESC';
    const [items] = await pool.query(query, params);
    res.json(items);
  } catch (error) {
    console.error('Get found items error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get single found item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT fi.*, u.full_name as finder_name, c.category_name
      FROM found_items fi
      LEFT JOIN users u ON fi.user_id = u.id
      LEFT JOIN categories c ON fi.category_id = c.id
      WHERE fi.id = ?
    `, [req.params.id]);

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json(items[0]);
  } catch (error) {
    console.error('Get found item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create found item report
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { item_name, category_id, description, location_found, date_found } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      'INSERT INTO found_items (user_id, category_id, item_name, description, location_found, date_found, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id || null, item_name, description, location_found, date_found, image]
    );

    await pool.query('INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)',
      [req.user.id, `Reported found item: ${item_name}`]);

    res.status(201).json({ message: 'Found item reported successfully.', id: result.insertId });
  } catch (error) {
    console.error('Create found item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update found item
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { item_name, category_id, description, location_found, date_found, status } = req.body;

    const [existing] = await pool.query('SELECT * FROM found_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item.' });
    }

    const image = req.file ? req.file.filename : existing[0]?.image || null;
    await pool.query(
      'UPDATE found_items SET item_name = ?, category_id = ?, description = ?, location_found = ?, date_found = ?, image = ?, status = ? WHERE id = ?',
      [item_name, category_id, description, location_found, date_found, image, status || 'pending', req.params.id]
    );

    res.json({ message: 'Found item updated successfully.' });
  } catch (error) {
    console.error('Update found item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete found item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM found_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item.' });
    }

    await pool.query('DELETE FROM found_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Found item deleted successfully.' });
  } catch (error) {
    console.error('Delete found item error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
