const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection
const db = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12747617',
  password: 'fIPYqIUP1s',
  database: 'sql12747617',  // Ensure the correct database name is provided
  port: '3306'
});

// Convert date to string in 'YYYY-MM-DD' format before sending
router.get('/', async (req, res) => {
  try {
    // Join stockin with products table to get product_name
    const [results] = await db.query(`
      SELECT stockin.*, products.product_name 
      FROM stockin 
      JOIN products ON stockin.product_id = products.product_id
    `);

    // Format the date
    const formattedResults = results.map(item => ({
      ...item,
      date: new Date(item.date.getTime() - (item.date.getTimezoneOffset() * 60000))
        .toISOString().slice(0, 10)
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching stock in records:', error);
    res.status(500).json({ error: 'Failed to fetch stock in records' });
  }
});

// Add a new stock in record
router.post('/', async (req, res) => {
  const { product_id, date, weight, price, arrival_time } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO stockin (product_id, date, weight, price, arrival_time) VALUES (?, ?, ?, ?, ?)',
      [product_id, date, weight, price, arrival_time]
    );
    res.status(201).json({ id: result.insertId, product_id, date, weight, price, arrival_time });
  } catch (error) {
    console.error('Error adding stock in record:', error);
    res.status(500).json({ error: 'Failed to add stock in record' });
  }
});

// Update a stock in record
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { product_id, date, weight, price, arrival_time } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE stockin SET product_id = ?, date = ?, weight = ?, price = ?, arrival_time = ? WHERE id = ?',
      [product_id, date, weight, price, arrival_time, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Stock in record not found' });
    }
    res.json({ id, product_id, date, weight, price, arrival_time });
  } catch (error) {
    console.error('Error updating stock in record:', error);
    res.status(500).json({ error: 'Failed to update stock in record' });
  }
});

// Delete a stock in record
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM stockin WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Stock in record not found' });
    }
    res.json({ message: 'Stock in record deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock in record:', error);
    res.status(500).json({ error: 'Failed to delete stock in record' });
  }
});

module.exports = router;
