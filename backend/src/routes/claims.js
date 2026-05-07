const express = require('express');
const pool = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all claims (admin sees all, users see their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT c.*, fi.item_name, fi.image as item_image, u.full_name as claimant_name
      FROM claims c
      LEFT JOIN found_items fi ON c.found_item_id = fi.id
      LEFT JOIN users u ON c.claimant_id = u.id
    `;

    if (req.user.role !== 'admin') {
      query += ' WHERE c.claimant_id = ?';
      const [claims] = await pool.query(query + ' ORDER BY c.created_at DESC', [req.user.id]);
      return res.json(claims);
    }

    const [claims] = await pool.query(query + ' ORDER BY c.created_at DESC');
    res.json(claims);
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Submit a claim
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { found_item_id, proof_of_ownership } = req.body;

    if (!found_item_id || !proof_of_ownership) {
      return res.status(400).json({ message: 'Found item ID and proof of ownership are required.' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM claims WHERE found_item_id = ? AND claimant_id = ?',
      [found_item_id, req.user.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already submitted a claim for this item.' });
    }

    const [result] = await pool.query(
      'INSERT INTO claims (found_item_id, claimant_id, proof_of_ownership) VALUES (?, ?, ?)',
      [found_item_id, req.user.id, proof_of_ownership]
    );

    await pool.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)',
      [req.user.id, 'Your claim has been submitted and is pending review.']);

    await pool.query('INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)',
      [req.user.id, `Submitted claim for found item #${found_item_id}`]);

    res.status(201).json({ message: 'Claim submitted successfully.', id: result.insertId });
  } catch (error) {
    console.error('Submit claim error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Approve or reject claim (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { claim_status, admin_remark } = req.body;

    if (!['approved', 'rejected'].includes(claim_status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }

    const [claims] = await pool.query('SELECT * FROM claims WHERE id = ?', [req.params.id]);
    if (claims.length === 0) {
      return res.status(404).json({ message: 'Claim not found.' });
    }

    await pool.query(
      'UPDATE claims SET claim_status = ?, admin_remark = ? WHERE id = ?',
      [claim_status, admin_remark || null, req.params.id]
    );

    // Update found item status if approved
    if (claim_status === 'approved') {
      await pool.query('UPDATE found_items SET status = ? WHERE id = ?',
        ['claimed', claims[0].found_item_id]);
    }

    // Notify the claimant
    const statusMsg = claim_status === 'approved'
      ? 'Your claim has been approved!'
      : 'Your claim has been rejected.';
    await pool.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)',
      [claims[0].claimant_id, statusMsg]);

    await pool.query('INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)',
      [req.user.id, `Admin ${claim_status} claim #${req.params.id}`]);

    res.json({ message: `Claim ${claim_status} successfully.` });
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
