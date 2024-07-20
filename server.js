const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testdb'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// User Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (first_name, last_name, mobile_number, password, created_by, updated_by, created_date, updated_date)
                   VALUES (?, ?, ?, ?, 'admin', 'admin', UTC_TIMESTAMP(), UTC_TIMESTAMP())`;
    db.query(query, [firstName, lastName, mobileNumber, hashedPassword], (err, results) => {
      if (err) {
        console.error('Registration Error:', err);
        return res.status(500).json({ success: false, message: 'Error registering user' });
      }
      res.status(200).json({ success: true, message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// User Login Endpoint
app.post('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;
  if (!password || !mobileNumber) {
    return res.status(400).json({ success: false, message: 'Mobile number and password are required' });
  }

  const query = `SELECT * FROM users WHERE mobile_number = ?`;

  db.query(query, [mobileNumber], async (err, results) => {
    if (err) {
      console.error('Login Error:', err);
      return res.status(500).json({ success: false, message: 'Error logging in' });
    }
    
    if (results.length > 0) {
      const user = results[0];
      console.log('Retrieved User:', user); // Log retrieved user data
      console.log('Stored Password Hash:', user.password); // Log stored hashed password

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Input Password:', password); // Log input password
        console.log('Password Match:', isMatch); // Log result of password comparison
        
        if (isMatch) {
          const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
          res.json({ success: true, token, user: { firstName: user.first_name, lastName: user.last_name } });
        } else {
          res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
      } catch (compareErr) {
        console.error('Comparison Error:', compareErr);
        res.status(500).json({ success: false, message: 'Error comparing passwords' });
      }
    } else {
      res.status(400).json({ success: false, message: 'User not found' });
    }
  });
});


// Get User Details by ID
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT id, first_name, last_name, mobile_number FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ success: false, message: 'Error retrieving user' });
    }
    if (results.length > 0) {
      res.status(200).json({ success: true, user: results[0] });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

// Update User Details by ID
app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, mobileNumber, password } = req.body;
  let hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const query = `UPDATE users SET 
                    first_name = ?, 
                    last_name = ?, 
                    mobile_number = ?, 
                    password = ?, 
                    updated_by = 'admin', 
                    updated_date = UTC_TIMESTAMP()
                 WHERE id = ?`;
  
  db.query(query, [firstName, lastName, mobileNumber, hashedPassword, userId], (err, results) => {
    if (err) {
      console.error('Update Error:', err);
      return res.status(500).json({ success: false, message: 'Error updating user' });
    }
    if (results.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'User updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

// Delete User by ID
app.delete('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Delete Error:', err);
      return res.status(500).json({ success: false, message: 'Error deleting user' });
    }
    if (results.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server started on port 3000');
});







// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'testdb'
// });
 
// db.connect(err => {
//   if (err) throw err;
//   console.log('MySQL Connected...');
// });

// // User Registration Endpoint
// app.post('/register', async (req, res) => {
//   try {
//     const { firstName, lastName, mobileNumber, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const query = `INSERT INTO users (first_name, last_name, mobile_number, password, created_by, updated_by, created_date, updated_date)
//                    VALUES (?, ?, ?, ?, 'admin', 'admin', UTC_TIMESTAMP(), UTC_TIMESTAMP())`;
//     db.query(query, [firstName, lastName, mobileNumber, hashedPassword], (err, results) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ success: false, message: 'Error registering user' });
//       }
//       res.status(200).json({ success: true, message: 'User registered successfully' });
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // User Login Endpoint
// app.post('/login', async (req, res) => {
//   const { mobileNumber, password } = req.body;
//   const query = `SELECT * FROM users WHERE mobile_number = ?`;
  
//   db.query(query, [mobileNumber], async (err, results) => {
//     if (err) {
//       console.error('Error:', err);
//       return res.status(500).json({ success: false, message: 'Error logging in' });
//     }
//     if (results.length > 0) {
//       const user = results[0];
//       console.log('Stored Password Hash:', user.password);

//       try {
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('Password Match:', password);
        
//         if (isMatch) {
//           const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
//           res.json({ success: true, token, user: { firstName: user.first_name, lastName: user.last_name } });
//         } else {
//           res.status(400).json({ success: false, message: 'Invalid credentials' });
//         }
//       } catch (compareErr) {
//         console.error('Comparison Error:', compareErr);
//         res.status(500).json({ success: false, message: 'Error comparing passwords' });
//       }
//     } else {
//       res.status(400).json({ success: false, message: 'User not found' });
//     }
//   });
// });


// app.listen(3000, '0.0.0.0', () => {
//   console.log('Server started on port 3000');
// });
