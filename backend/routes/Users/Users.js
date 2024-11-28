// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// MySQL connection pool
const db = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12747617',
  password: 'fIPYqIUP1s',
  database: 'sql12747617',  // Ensure the correct database name is provided
  port: '3306'
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, lastName, contact, username, password, role } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (fullName, lastName, contact, username, password, role) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(query, [fullName, lastName, contact, username, hashedPassword, role]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Edit (update) user by ID, conditionally update password if provided
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, lastName, contact, username, role, password } = req.body;

    let updateQuery = `UPDATE users SET fullName = ?, lastName = ?, contact = ?, username = ?, role = ?`;
    const queryParams = [fullName, lastName, contact, username, role];

    // If password is provided, hash it and add to the update query
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = ?`;
      queryParams.push(hashedPassword);
    }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(id);

    await db.query(updateQuery, queryParams);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
