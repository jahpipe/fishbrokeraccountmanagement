const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Use promise-based version

// MySQL connection pool
const db = mysql.createPool({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12747617',
    password: 'fIPYqIUP1s',
    database: 'sql12747617',  // Ensure the correct database name is provided
    port: '3306'
});

// Endpoint to fetch sales data
router.get('/', async (req, res) => {
    const { start_date, end_date, limit = 25 } = req.query; // Get date parameters from query
    try {
        // SQL query to fetch sales data
        const transactionsQuery = `
            SELECT 
                i.id AS invoice_id,
                u.fullName AS customer_name,
                i.invoice_date AS date_purchase,
                i.due_date,
                p.product_name AS product_name,
                ii.quantity,
                ii.line_total AS sale_total,
                ar.paid_amount,
                (ar.total_amount - ar.paid_amount) AS outstanding_balance
            FROM 
                invoices i
            JOIN 
                users u ON i.user_id = u.id
            JOIN 
                invoice_items ii ON i.id = ii.invoice_id
            JOIN 
                products p ON ii.product_id = p.product_id
            LEFT JOIN 
                accounts_receivable ar ON i.id = ar.invoice_id
            WHERE 
                ar.invoice_id IS NOT NULL 
                AND (i.invoice_date BETWEEN ? AND ?)
            LIMIT ?;`;

        // Execute the query
        const [salesData] = await db.query(transactionsQuery, [
            start_date || '1970-01-01', // Default to a far past date if no start date
            end_date || '9999-12-31',    // Default to a far future date if no end date
            Number(limit) // Convert limit to a number
        ]);

        console.log(salesData); // Log sales data for debugging
        res.json(salesData); // Return valid JSON
    } catch (error) {
        console.error("Error fetching sales data:", error); // Log full error message
        res.status(500).json({ error: "Server error", details: error.message }); // Return JSON error response with details
    }
});

module.exports = router;
