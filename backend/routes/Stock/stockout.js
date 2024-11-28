const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Use promise-based version

// MySQL connection
const db = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12747617',
  password: 'fIPYqIUP1s',
  database: 'sql12747617',  // Ensure the correct database name is provided
  port: '3306'
});

// Helper function to format date to 'YYYY-MM-DD'
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Get the date part without any time zone adjustment
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
};


// Route to create stockout records
router.post('/stockout', async (req, res) => {
  const { stockout_date, product_name, quantity, unit_price, invoice_id } = req.body;

  // Validate incoming data
  if (!stockout_date || !product_name || !quantity || !unit_price || !invoice_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert new stockout record
    const result = await db.query(
      'INSERT INTO stockout (stockout_date, product_name, quantity, unit_price, invoice_id) VALUES (?, ?, ?, ?, ?)',
      [formatDate(stockout_date), product_name, quantity, unit_price, invoice_id]
    );
    res.status(201).json({ id: result[0].insertId });
  } catch (error) {
    console.error('Error creating stockout record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all stockout records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stockout');
    
    // Format the date before sending to the frontend
    const formattedRows = rows.map(row => ({
      ...row,
      stockout_date: formatDate(row.stockout_date)
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error fetching stockout records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get available stock for a product
router.get('/stock/:productName', async (req, res) => {
  const { productName } = req.params;

  try {
    // Query to calculate available stock
    const queryStockin = `
      SELECT SUM(weight) as total_in 
      FROM stockin 
      WHERE product_id = (
        SELECT product_id FROM products WHERE product_name = ?
      )
    `;

    const queryStockout = `
      SELECT SUM(quantity) as total_out 
      FROM stockout 
      WHERE product_name = ?
    `;

    const [stockinResults] = await db.query(queryStockin, [productName]);
    const [stockoutResults] = await db.query(queryStockout, [productName]);

    const totalIn = stockinResults[0]?.total_in || 0;
    const totalOut = stockoutResults[0]?.total_out || 0;
    const availableStock = totalIn - totalOut;

    res.status(200).json({ available_stock: availableStock });
  } catch (error) {
    console.error('Error fetching available stock:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
