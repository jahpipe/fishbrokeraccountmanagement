const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12747617',
  password: 'fIPYqIUP1s',
  database: 'sql12747617',  // Ensure the correct database name is provided
  port: '3306'
});

router.post('/', async (req, res) => {
  try {
      const { username, password, role } = req.body;
      const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
      const [results] = await db.query(query, [username, role]);

      if (results.length === 0) {
          console.log('No user found with the provided username and role');
          return res.status(401).json({ message: 'Invalid username or role' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
          res.status(200).json({
              message: 'Login successful',
              user: {
                  id: user.id,
                  fullName: user.fullName,
                  role: user.role,
              },
          });
      } else {
          console.log('Invalid password attempt');
          res.status(401).json({ message: 'Invalid password' });
      }
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
