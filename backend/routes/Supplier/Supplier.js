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

// POST endpoint to add a new supplier
router.post('/suppliers', async (req, res) => {
    const { firstName, lastName, address, city, phoneNumber } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO supplier (SupplierFirstName, SupplierLastName, Address, City, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, address, city, phoneNumber]
        );

        res.status(201).json({ message: 'Supplier added successfully!', supplierId: result.insertId });
    } catch (error) {
        console.error('Error adding supplier:', error);
        res.status(500).json({ message: 'Failed to add supplier.' });
    }
});

// GET endpoint to fetch all suppliers
router.get('/suppliers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM supplier'); // Get all suppliers from the database
        res.status(200).json(rows); // Send the rows back as a response
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Failed to fetch suppliers.' });
    }
});

// PUT endpoint to update a supplier
router.put('/suppliers/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, address, city, phoneNumber } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Supplier SET SupplierFirstName = ?, SupplierLastName = ?, Address = ?, City = ?, PhoneNumber = ? WHERE SupplierID = ?',
            [firstName, lastName, address, city, phoneNumber, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        res.status(200).json({ message: 'Supplier updated successfully!' });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Failed to update supplier.' });
    }
});

// DELETE endpoint to delete a supplier
router.delete('/suppliers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM Supplier WHERE SupplierID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        res.status(200).json({ message: 'Supplier deleted successfully!' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'Failed to delete supplier.' });
    }
});

module.exports = router;
