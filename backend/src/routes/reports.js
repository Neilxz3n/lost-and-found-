const express = require('express');
const pool = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [lostCount] = await pool.query('SELECT COUNT(*) as count FROM lost_items');
    const [foundCount] = await pool.query('SELECT COUNT(*) as count FROM found_items');
    const [pendingClaims] = await pool.query("SELECT COUNT(*) as count FROM claims WHERE claim_status = 'pending'");
    const [approvedClaims] = await pool.query("SELECT COUNT(*) as count FROM claims WHERE claim_status = 'approved'");
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');

    // Per-user stats
    const [userLost] = await pool.query('SELECT COUNT(*) as count FROM lost_items WHERE user_id = ?', [req.user.id]);
    const [userFound] = await pool.query('SELECT COUNT(*) as count FROM found_items WHERE user_id = ?', [req.user.id]);
    const [userClaims] = await pool.query('SELECT COUNT(*) as count FROM claims WHERE claimant_id = ?', [req.user.id]);

    res.json({
      total_lost: lostCount[0].count,
      total_found: foundCount[0].count,
      pending_claims: pendingClaims[0].count,
      approved_claims: approvedClaims[0].count,
      total_users: totalUsers[0].count,
      user_lost: userLost[0].count,
      user_found: userFound[0].count,
      user_claims: userClaims[0].count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get recent activity logs (admin)
router.get('/activity', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT al.*, u.full_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 50
    `);
    res.json(logs);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY category_name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
