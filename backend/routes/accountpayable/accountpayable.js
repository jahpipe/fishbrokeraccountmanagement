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

// Helper function to format the date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Endpoint to fetch account payable entries with product name and supplier name
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ap.*, 
             CONCAT(s.SupplierFirstName, ' ', s.SupplierLastName) AS supplier_name,
             p.product_name
      FROM account_payable ap
      JOIN supplier s ON ap.supplier_id = s.SupplierID
      JOIN products p ON ap.product_id = p.product_id
    `);

    // Format payable_date before sending the response
    const formattedRows = rows.map((row) => ({
      ...row,
      payable_date: formatDate(row.payable_date), // Format the payable_date
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching account payable entries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to add a new account payable entry
router.post('/', async (req, res) => {
  const { product_id, kilo, total_price, deduction, final_payable, payable_date, supplier_id, status } = req.body;

  // Validate required fields
  if (!product_id || !kilo || !total_price || !supplier_id || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO account_payable (product_id, kilo, total_price, deduction, final_payable, payable_date, supplier_id, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [product_id, kilo, total_price, deduction, final_payable, payable_date, supplier_id, status]);

    res.status(201).json({ 
      id: result.insertId, 
      product_id, 
      kilo, 
      total_price, 
      deduction, 
      final_payable, 
      payable_date, 
      supplier_id, 
      status 
    });
  } catch (error) {
    console.error('Error adding account payable entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to update the status of an account payable entry to 'paid'
router.patch('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`
      UPDATE account_payable
      SET status = 'paid'
      WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Account payable entry not found.' });
    }

    res.status(200).json({ message: 'Payment successfully processed.' });
  } catch (error) {
    console.error('Error updating account payable status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export the router
module.exports = router;
