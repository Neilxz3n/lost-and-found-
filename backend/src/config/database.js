const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'lostfound',
  password: process.env.DB_PASSWORD || 'lostfound123',
  database: process.env.DB_NAME || 'campus_lost_and_found',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
