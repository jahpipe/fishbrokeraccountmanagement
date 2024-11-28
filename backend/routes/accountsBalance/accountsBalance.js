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


router.get('/extended/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('Received request for user ID:', userId);

  try {
    const query = `
      SELECT 
        ar.id AS account_id, 
        ar.invoice_id, 
        ar.user_id, 
        ar.invoice_date, 
        ar.due_date, 
        ar.total_amount, 
        ar.paid_amount, 
        ar.outstanding_balance,
        t.transaction_date, 
        t.particulars, 
        t.credit_amount, 
        t.debit_amount, 
        t.balance
      FROM 
        accounts_receivable ar
      LEFT JOIN 
        ar_transactions t 
      ON 
        ar.id = t.ar_id
      WHERE 
        ar.user_id = ?;
    `; // Your SQL query remains the same

    const [results] = await db.query(query, [userId]);

    console.log('Data fetched:', results);

    if (results.length === 0) {
      console.warn('No records found for user ID:', userId);
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching data:', error.message || error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions/:userId', async (req, res) => {
  const userId = req.params.userId; // Extracting userId from request parameters
  console.log('Received request for transaction history for user ID:', userId); // Log user ID for transaction history request

  try {
    const [transactions] = await db.query(`
      SELECT t.*, p.product_name
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      WHERE t.user_id = ?
    `, [userId]);
    
    console.log('Transaction history data retrieved:', transactions); // Log retrieved transaction data
    
    if (transactions.length === 0) {
      console.warn(`No transaction history found for user ID: ${userId}`); // Log if no transaction data found
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transaction history:', error); // Log the error
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
