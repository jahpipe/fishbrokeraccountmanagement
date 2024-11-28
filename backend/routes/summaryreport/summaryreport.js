const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection pool
const db = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12747617',
  password: 'fIPYqIUP1s',
  database: 'sql12747617',  // Ensure the correct database name is provided
  port: '3306'
});

// New endpoint for summary report
router.get('/', async (req, res) => { 
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10); // Use the provided date or default to today

    // SQL query to filter by the specified date and sum the final_payable
    const [summary] = await db.query(`
      SELECT 
        SUM(final_payable) AS total_amount,
        SUM(CASE WHEN status = 'paid' THEN final_payable ELSE 0 END) AS total_paid,
        SUM(CASE WHEN status = 'unpaid' THEN final_payable ELSE 0 END) AS total_unpaid,
        COUNT(*) AS total_entries
      FROM account_payable
      WHERE DATE(payable_date) = ?`, [date]
    );

    res.json({
      sales_tracking_summary: {
        total_amount: summary[0].total_amount || 0,
        total_paid: summary[0].total_paid || 0,
        total_unpaid: summary[0].total_unpaid || 0,
        total_entries: summary[0].total_entries || 0,
      },
      payable_summary: {
        final_payable: summary[0].total_amount || 0, // Update to use final_payable
        total_paid: summary[0].total_paid || 0,
        total_unpaid: summary[0].total_unpaid || 0,
        total_entries: summary[0].total_entries || 0,
      }
    });
  } catch (error) {
    console.error('Error fetching summary report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export the router
module.exports = router;
