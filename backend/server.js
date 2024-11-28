const express = require('express')
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt



const router = express.Router();
const accountBalanceRouter = require('./routes/accountsBalance/accountsBalance');
const salesRouter = require('./routes/Sales/Sales');
const stockoutRouter = require('./routes/Stock/stockout');
const loginRouter = require('./routes/login/login');
const supplierRouter = require('./routes/Supplier/Supplier')
const accountPayableRoutes = require('./routes/accountpayable/accountpayable');
const stockinRoutes = require('./routes/stockin/stockin');
const summaryRoutes = require('./routes/summaryreport/summaryreport');
const salesreportRoutes = require('./routes/salesreport/SalesReport');


// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12747617',
  password: 'fIPYqIUP1s',
  database: 'sql12747617',  // Ensure the correct database name is provided
  port: '3306'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL using environment variables');
});


app.use('/api/account-payable', accountPayableRoutes);


app.use('/api/supplier', supplierRouter);

app.use('/api/login', loginRouter);

app.use('/api/account-balance', accountBalanceRouter);


app.use('/api/sales', salesRouter);

app.use('/api/stockout', stockoutRouter);

app.use('/api/stockin', stockinRoutes);

app.use('/api/summaryreport', summaryRoutes);

app.use('/api/salesreport', salesreportRoutes);

app.use('/uploads', express.static('uploads'));


// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directly into uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});


// Initialize multer with the storage configuration
const upload = multer({ storage });


// User registration (hashing password before saving)
app.post('/register', async (req, res) => {
  const { fullName, lastName, contact, username, password, role } = req.body;

  // Server-side validation (optional)
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const query = 'INSERT INTO users (fullName, lastName, contact, username, password, role) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [fullName, lastName, contact, username, hashedPassword, role], (err, results) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Fetch all users (no password exposed)
app.get('/users', (req, res) => {
  const query = 'SELECT id, fullName, lastName, contact, username, role FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Edit (update) user by ID, conditionally update password if provided
app.put('/users/:id', async (req, res) => {
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

  db.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'User updated successfully' });
  });
});

// DELETE user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
});

// API for categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});


app.post('/api/stockin', async (req, res) => {
  const { product_name, quantity, price } = req.body;

  if (!product_name || !quantity || !price) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      const result = await db.query(
          'INSERT INTO stockin (product_name, quantity, price) VALUES (?, ?, ?)',
          [product_name, quantity, price]
      );

      res.status(201).json({ id: result[0].insertId, product_name, quantity, price });
  } catch (error) {
      console.error('Error adding stockin record:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example endpoint to fetch stockin data
app.get('/api/stockin', (req, res) => {
  const query = 'SELECT * FROM stockin'; // Adjust to your actual stockin table structure

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching stockin records:', err);
          return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json(results); // Send back stockin records
  });
});


  
// POST: Add a new product
app.post('/api/products', upload.single('image'), (req, res) => {
  const { product_name, category, kilo, description, current_price, arrival_date, arrival_time, supplier_id } = req.body;
  const photo = req.file ? req.file.filename : null;

  // Validate required fields
  if (!product_name || !category || !kilo || !current_price || !arrival_time || !supplier_id || isNaN(current_price) || isNaN(kilo)) {
      return res.status(400).json({ message: 'Missing required fields or current_price/kilo is not a number' });
  }

  // Handle arrival_date
  const finalArrivalDate = arrival_date && arrival_date !== 'null' ? arrival_date : new Date().toISOString().split('T')[0];

  // Log incoming data
  console.log({
      product_name,
      category,
      kilo,
      description,
      current_price,
      arrival_date: finalArrivalDate,
      arrival_time,
      supplier_id,
      photo,
  });

  // SQL query to insert new product
  const query = `
      INSERT INTO products (product_name, category, kilo, description, current_price, arrival_date, arrival_time, photo, supplier_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(query, [product_name, category, kilo, description, current_price, finalArrivalDate, arrival_time, photo, supplier_id], (err, results) => {
      if (err) {
          console.error('Error adding product:', err);
          return res.status(500).json({ message: 'Server error', error: err.message });
      }

      // Calculate total price and deductions
      const total_price = kilo * current_price; 
      const deduction = total_price * 0.07; 
      const final_payable = total_price - deduction; 
      const payable_date = new Date().toISOString().split('T')[0]; 

      // Insert into account_payable table
      const accountPayableQuery = `
          INSERT INTO account_payable (product_id, kilo, total_price, deduction, final_payable, payable_date, supplier_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(accountPayableQuery, [results.insertId, kilo, total_price, deduction, final_payable, payable_date, supplier_id], (err) => {
          if (err) {
              console.error('Error adding to account_payable:', err);
              return res.status(500).json({ message: 'Server error', error: err.message });
          }

          // Return success response
          res.status(201).json({
              id: results.insertId,
              product_name,
              category,
              kilo,
              description,
              current_price,
              arrival_date: finalArrivalDate,
              arrival_time,
              photo,
              supplier_id,
              total_price,
              deduction,
              final_payable,
          }); 
      });
  });
});


  // API to get the current price of a specific product by ID
  app.get('/api/products/:id/price', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT current_price FROM products WHERE product_id = ?';

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching product price:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ current_price: results[0].current_price });
    });
  });

  // Fetch all products
  app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products'; // Fetch all products

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json(results); // Return the list of products
    });
  });

  // Fetch single product by ID
  app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM products WHERE product_id = ?';

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching product:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(results[0]);
    });
  });

 
  // PUT: Update product by ID
  app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { product_name, category, kilo, description, current_price, arrival_date, arrival_time, supplier_id } = req.body;

    // Validate required fields
    if (!product_name || !category || !kilo || !current_price || !arrival_date || !supplier_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const photo = req.file ? req.file.filename : null;

    // Build the SQL query
    let query = 'UPDATE products SET product_name = ?, category = ?, kilo = ?, description = ?, current_price = ?, arrival_date = ?, arrival_time = ?, supplier_id = ?';
    const params = [product_name, category, kilo, description, current_price, arrival_date, arrival_time, supplier_id];

    if (photo) {
        query += ', photo = ?';
        params.push(photo);
    }

    query += ' WHERE product_id = ?';
    params.push(id);

    // Execute the query
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the updated product details
        res.status(200).json({
            message: 'Product updated successfully',
            updatedProduct: { id, product_name, category, kilo, description, current_price, arrival_date, arrival_time, supplier_id, photo },
        });
    });
  });



// Get transactions by invoice ID
app.get('/transactions', async (req, res) => {
  const { invoiceId } = req.query;

  try {
    const [transactions] = await db.promise().query(
      'SELECT * FROM transactions WHERE invoice_id = ?',
      [invoiceId]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this invoice.' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});



app.put('/transactions/:id/close', async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  try {
    console.log(`Closing transaction for ID: ${transactionId}`);

    // Update the transaction to set it as inactive
    const [result] = await db.promise().query(
      'UPDATE transactions SET is_active = ? WHERE id = ?',
      [false, transactionId]
    );

    // Check if the transaction was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction closed successfully' });
  } catch (error) {
    console.error('Error closing transaction:', error.message);
    res.status(500).json({ message: 'Error closing transaction', error: error.message });
  }
});

// Endpoint to close an invoice
app.put('/invoices/:id/close', async (req, res) => {
  const invoiceId = parseInt(req.params.id, 10);

  try {
    console.log(`Checking if invoice ID ${invoiceId} can be closed`);

    // Check if all transactions related to this invoice are closed (inactive)
    const [transactions] = await db.promise().query(
      'SELECT COUNT(*) AS openTransactions FROM transactions WHERE invoice_id = ? AND is_active = ?',
      [invoiceId, true]  // Checking for active (open) transactions
    );

    if (transactions[0].openTransactions > 0) {
      return res.status(400).json({ message: 'Cannot close invoice, there are open transactions.' });
    }

    // Check if the invoice has an outstanding balance
    const [invoice] = await db.promise().query(
      'SELECT outstanding_balance FROM accounts_receivable WHERE invoice_id = ?',
      [invoiceId]
    );

    if (invoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice[0].outstanding_balance > 0) {
      return res.status(400).json({ message: 'Cannot close invoice, there is an outstanding balance.' });
    }

    // If no open transactions and no outstanding balance, close the invoice
    const [result] = await db.promise().query(
      'UPDATE invoices SET status = ?, is_active = ? WHERE id = ?',
      ['closed', false, invoiceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice closed successfully.' });
  } catch (error) {
    console.error('Error closing invoice:', error.message);
    res.status(500).json({ message: 'Error closing invoice', error: error.message });
  }
});



// Fetch transaction details by user ID including invoices
app.get('/transaction-details/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT u.fullName, u.lastName, u.contact, i.invoice_date, i.total_amount, i.status, i.due_date
    FROM invoices i
    INNER JOIN users u ON u.id = i.user_id
    WHERE u.id = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching transaction details:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No transaction details found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(results);
  });
});


app.get('/api/transactions', async (req, res) => {
  const userId = req.query.userId; // Get userId from query parameters
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [transactions] = await db.promise().query(`
      SELECT
        t.id,
        t.invoice_id,
        DATE_FORMAT(t.transaction_date, '%Y-%m-%d') AS transaction_date,
        COALESCE(p.product_name, 'Unknown Item') AS item,
        t.quantity,
        t.total_amount,
        t.down_payment,
        t.outstanding_balance
      FROM transactions t
      LEFT JOIN invoice_items ii ON t.invoice_id = ii.invoice_id  -- Join with invoice_items to get product_id
      LEFT JOIN products p ON ii.product_id = p.product_id  -- Join with products table to get product_name
      WHERE t.user_id = ?
    `, [userId]);

    console.log('Transactions:', transactions); // Log the transactions for debugging
    res.status(200).json(transactions); // Send transactions as response
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/invoices', async (req, res) => {
  const { userId, invoiceDate, dueDate, items, adminId, downPayment } = req.body;

  if (!userId || !invoiceDate || !dueDate || !items || !items.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Start transaction
    await db.promise().beginTransaction();

    const invoiceIds = [];

    // Convert invoiceDate and dueDate to Manila timezone
    const formattedInvoiceDate = new Date(new Date(invoiceDate).toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    const formattedDueDate = new Date(new Date(dueDate).toLocaleString("en-US", { timeZone: "Asia/Manila" }));

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const totalAmount = item.quantity * item.unitPrice;

      // Create invoice
      const invoiceQuery = `
        INSERT INTO invoices (user_id, invoice_date, due_date, total_amount, status, paid_amount, admin_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [invoiceResult] = await db.promise().query(invoiceQuery, [
        userId,
        formattedInvoiceDate,
        formattedDueDate,
        totalAmount,
        'pending',
        downPayment || 0, // Set paid_amount to downPayment or default to 0
        adminId
      ]);

      const invoiceId = invoiceResult.insertId;
      invoiceIds.push(invoiceId);

      // Retrieve product name before inserting into stockout
      const [productResult] = await db.promise().query('SELECT product_name FROM products WHERE product_id = ?', [item.productId]);
      const productName = productResult.length > 0 ? productResult[0].product_name : null;

      if (!productName) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Insert invoice item
      const itemsQuery = `
        INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?)
      `;

      await db.promise().query(itemsQuery, [
        invoiceId,
        item.productId,
        item.quantity,
        item.unitPrice,
        totalAmount
      ]);

      // Insert transaction for this item
      const transactionQuery = `
        INSERT INTO transactions (user_id, invoice_id, transaction_date, item_purchased, quantity, total_amount, down_payment, outstanding_balance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const transactionDate = new Date(); // Use current date for transaction_date
      const outstandingBalance = totalAmount - (downPayment || 0); // Calculate outstanding balance after down payment

      await db.promise().query(transactionQuery, [
        userId,
        invoiceId,
        transactionDate,
        productName, // Use the retrieved product name
        item.quantity,
        totalAmount,
        downPayment || 0, // Use downPayment from request or default to 0
        outstandingBalance
      ]);

      // Insert into accounts_receivable
      const arQuery = `
        INSERT INTO accounts_receivable (user_id, invoice_id, invoice_date, due_date, total_amount, paid_amount, outstanding_balance)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await db.promise().query(arQuery, [
        userId,
        invoiceId,
        formattedInvoiceDate,
        formattedDueDate,
        totalAmount,
        downPayment || 0, // Set initial paid_amount to downPayment or default to 0
        outstandingBalance // Set outstanding balance
      ]);

      // Insert into stockout
      const stockOutQuery = `
        INSERT INTO stockout (stockout_date, product_name, quantity, unit_price, invoice_id) 
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.promise().query(stockOutQuery, [
        new Date(),
        productName, // Use the retrieved product name
        item.quantity,
        item.unitPrice,
        invoiceId
      ]);
    }

    // Commit transaction
    await db.promise().commit();

    res.status(201).json({ message: 'Invoices, items, transactions, accounts receivable, and stockout created successfully', invoiceIds });
  } catch (error) {
    console.error('Error creating invoices:', error);
    await db.promise().rollback();
    res.status(500).json({ message: 'Server error' });
  }
});




// Submit payment
app.post('/submit-payment', async (req, res) => {
  const { invoiceId, paymentAmount } = req.body;

  if (!invoiceId || !paymentAmount) {
    return res.status(400).json({ message: 'Invoice ID and payment amount are required' });
  }

  try {
    await db.promise().beginTransaction();

    // Fetch the current invoice details
    const [invoiceResult] = await db.promise().query('SELECT total_amount, paid_amount, user_id FROM invoices WHERE id = ?', [invoiceId]);
    if (invoiceResult.length === 0) {
      throw new Error('Invoice not found');
    }

    const { total_amount, paid_amount, user_id } = invoiceResult[0];
    const totalAmountNum = parseFloat(total_amount);
    const paidAmountNum = parseFloat(paid_amount);
    const newPaidAmount = paidAmountNum + parseFloat(paymentAmount);
    const outstandingBalance = totalAmountNum - newPaidAmount;

    // Determine the status based on whether the total amount has been paid
    const status = newPaidAmount >= totalAmountNum ? 'Paid' : 'Pending';

    // Update the invoice's paid_amount and status
    await db.promise().query('UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?', [newPaidAmount, status, invoiceId]);

    // Update or insert into accounts_receivable
    const [arExists] = await db.promise().query('SELECT id, paid_amount FROM accounts_receivable WHERE invoice_id = ?', [invoiceId]);
    if (arExists.length === 0) {
      // Insert into accounts_receivable if it does not exist
      await db.promise().query('INSERT INTO accounts_receivable (invoice_id, user_id, total_amount, paid_amount, outstanding_balance) VALUES (?, ?, ?, ?, ?)', [
        invoiceId,
        user_id,
        totalAmountNum,
        newPaidAmount,
        outstandingBalance
      ]);
    } else {
      // Update existing accounts_receivable
      const arId = arExists[0].id;
      const updatedPaidAmount = parseFloat(arExists[0].paid_amount) + parseFloat(paymentAmount);
      const updatedOutstandingBalance = totalAmountNum - updatedPaidAmount;

      await db.promise().query('UPDATE accounts_receivable SET paid_amount = ?, outstanding_balance = ? WHERE id = ?', [
        updatedPaidAmount,
        updatedOutstandingBalance,
        arId
      ]);
    }

    // Insert into ar_transactions
    const [arResult] = await db.promise().query('SELECT id FROM accounts_receivable WHERE invoice_id = ?', [invoiceId]);
    const arId = arResult[0]?.id;

    // Check how many transactions exist for this ar_id
    const [transactionCount] = await db.promise().query('SELECT COUNT(*) AS count FROM ar_transactions WHERE ar_id = ?', [arId]);
    const isFirstTransaction = transactionCount[0].count === 0; // True if no transactions exist

    // Get last balance from ar_transactions
    const [lastTransaction] = await db.promise().query('SELECT balance FROM ar_transactions WHERE ar_id = ? ORDER BY transaction_date DESC LIMIT 1', [arId]);
    const previousBalance = lastTransaction.length > 0 ? lastTransaction[0].balance : totalAmountNum; // Use totalAmountNum for first balance

    // Calculate new balance
    const newBalance = previousBalance - parseFloat(paymentAmount);

    // Insert a new transaction with the payment amount as debit and credit_amount set to total_amount for the first transaction
    await db.promise().query('INSERT INTO ar_transactions (ar_id, transaction_date, particulars, debit_amount, credit_amount, balance) VALUES (?, ?, ?, ?, ?, ?)', [
      arId,
      new Date(),
      'Payment Received',
      paymentAmount,         // Debit amount is the payment amount
      isFirstTransaction ? totalAmountNum : null, // Credit amount is the total_amount only for the first transaction
      newBalance             // Updated balance after payment
    ]);

    await db.promise().commit();
    res.status(200).json({ message: 'Payment processed successfully' });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error processing payment:', error.message);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
});


app.put('/update-invoice-status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [invoice] = await db.promise().query('SELECT total_amount, paid_amount FROM invoices WHERE id = ?', [id]);

    if (invoice.length > 0) {
      const { total_amount, paid_amount } = invoice[0];
      const status = paid_amount >= total_amount ? 'Paid' : 'Pending';

      await db.promise().query('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'Invoice status updated successfully' });
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


 // Fetch invoices
app.post('/api/invoices', async (req, res) => {
  const { userId, invoiceDate, dueDate, totalAmount, status, createdBy, items, initialPayment } = req.body;

  // Validation
  if (!userId || !invoiceDate || !dueDate || !totalAmount || !status || !items || !items.length) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      await db.promise().beginTransaction();

      // Create invoice record
      const [invoiceResult] = await db.promise().query(
          'INSERT INTO invoices (user_id, invoice_date, due_date, total_amount, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, invoiceDate, dueDate, totalAmount, status, createdBy]
      );
      const invoiceId = invoiceResult.insertId;

      // Process items
      const itemsData = items.map(item => [
          invoiceId,
          item.productId,       // Ensure item.productId matches your invoice_items schema
          item.quantity,
          item.unitPrice,
          item.lineTotal
      ]);

      // Insert invoice items
      const itemsQuery = 'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, line_total) VALUES ?';
      await db.promise().query(itemsQuery, [itemsData]);

      // Commit transaction
      await db.promise().commit();
      res.status(200).json({ message: 'Invoice processed', invoiceIds: [invoiceId] });

  } catch (error) {
      console.error('Error processing invoice:', error);
      await db.promise().rollback();
      res.status(500).json({ message: 'Error processing invoice', error: error.message });
  }
});


// Get all invoices
app.get('/invoices', (req, res) => {
  const query = 'SELECT * FROM invoices';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json(results);
  });
});

app.get('/invoices/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM invoices WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching invoice:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(results[0]);
  });
});

app.put('/invoices/:id', async (req, res) => {
  const invoiceId = parseInt(req.params.id, 10);
  const { paid_amount } = req.body;

  if (typeof paid_amount !== 'number' || isNaN(paid_amount)) {
    return res.status(400).json({ message: 'Invalid data: paid_amount must be a number' });
  }

  try {
    // Fetch the current `paid_amount` and `total_amount`
    const [currentInvoice] = await db.promise().query('SELECT paid_amount, total_amount, is_active FROM invoices WHERE id = ?', [invoiceId]);

    if (currentInvoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const currentPaidAmount = parseFloat(currentInvoice[0].paid_amount);
    const totalAmount = parseFloat(currentInvoice[0].total_amount);

    // Calculate the new payment (difference between new and current paid amount)
    const newPayment = paid_amount - currentPaidAmount;

    // Update the `paid_amount` in the `invoices` table
    await db.promise().query('UPDATE invoices SET paid_amount = ? WHERE id = ?', [paid_amount, invoiceId]);

    // Get the AR ID
    const [arResult] = await db.promise().query('SELECT id FROM accounts_receivable WHERE invoice_id = ?', [invoiceId]);
    const arId = arResult[0]?.id;

    if (arId) {
      // Fetch existing transactions to determine credit amount
      const [existingTransactions] = await db.promise().query('SELECT * FROM ar_transactions WHERE ar_id = ? ORDER BY transaction_date ASC', [arId]);

      const creditAmount = existingTransactions.length === 0 ? totalAmount : null;
      const newBalance = totalAmount - paid_amount; // total_amount - new paid_amount

      // Insert a new transaction reflecting the new payment
      await db.promise().query(
        'INSERT INTO ar_transactions (ar_id, transaction_date, particulars, debit_amount, credit_amount, balance) VALUES (?, ?, ?, ?, ?, ?)', 
        [
          arId,
          new Date(),
          'Payment Updated',
          newPayment,         // Debit the new payment (difference)
          creditAmount,       // Credit only for the first transaction
          newBalance          // Balance = total_amount - total paid so far
        ]
      );
    } else {
      console.log('No accounts_receivable found for this invoice ID');
    }

    // Update the status based on the new paid amount
    const status = paid_amount >= totalAmount ? 'Paid' : 'Pending';

    // If the invoice is paid, set is_active to false
    const isActive = paid_amount >= totalAmount ? false : true; // Set is_active based on paid_amount
    await db.promise().query('UPDATE invoices SET status = ?, is_active = ? WHERE id = ?', [status, isActive, invoiceId]);

    res.status(200).json({ message: 'Invoice updated successfully' });
  } catch (error) {
    console.error('Error updating invoice:', error.message);
    res.status(500).json({ message: 'Error updating invoice', error: error.message });
  }
});


// Delete invoice
app.delete('/invoices/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM invoices WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting invoice:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  });
});


// Update accounts_receivable for a specific invoice ID
app.put('/accounts_receivable/:invoice_id', async (req, res) => {
  const { invoice_id } = req.params;
  const { paid_amount, outstanding_balance } = req.body;

  try {
    // Check if accounts_receivable entry exists for the given invoice
    const [accountResult] = await db.promise().query('SELECT id FROM accounts_receivable WHERE invoice_id = ?', [invoice_id]);
    
    if (accountResult.length === 0) {
      return res.status(404).json({ message: 'Account receivable not found for this invoice' });
    }

    // Update paid_amount and outstanding_balance
    const updateResult = await db.promise().query(
      'UPDATE accounts_receivable SET paid_amount = ?, outstanding_balance = ? WHERE invoice_id = ?',
      [paid_amount, outstanding_balance, invoice_id]
    );

    if (updateResult[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Failed to update accounts_receivable, no rows affected' });
    }

    res.status(200).json({ message: 'Account receivable updated successfully' });
  } catch (error) {
    console.error('Error updating account receivable:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



app.get('/accounts_receivable', async (req, res) => {
  try {
    const [accountsReceivable] = await db.promise().query('SELECT * FROM accounts_receivable');
    res.status(200).json(accountsReceivable);
  } catch (error) {
    console.error('Error fetching accounts receivable:', error.message);
    res.status(500).json({ message: 'Error fetching accounts receivable', error: error.message });
  }
});

app.get('/api/ar-transactions', async (req, res) => {
  const userId = req.query.userId; // Expecting userId as a query parameter
  const invoiceId = req.query.invoiceId; // If filtering by invoice as well

  const query = `
    SELECT
      at.transaction_date,
      at.particulars,
      at.debit_amount,
      at.credit_amount,
      at.balance,
      ar.invoice_id,
      u.fullName AS customerName
    FROM ar_transactions at
    JOIN accounts_receivable ar ON at.ar_id = ar.id
    JOIN invoices i ON ar.invoice_id = i.id
    JOIN users u ON ar.user_id = u.id
    WHERE 1=1
    ${userId ? 'AND ar.user_id = ?' : ''}
    ${invoiceId ? 'AND ar.invoice_id = ?' : ''}
    ORDER BY at.transaction_date ASC
  `;

  const params = [];
  if (userId) params.push(userId); 
  if (invoiceId) params.push(invoiceId); 

  try {
    const [results] = await db.promise().query(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error fetching AR transactions:', error);
    res.status(500).json({ message: 'Error fetching AR transactions', error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is running and ready to handle requests!');
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
