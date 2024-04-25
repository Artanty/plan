require('dotenv').config({ path: '../.env.local' });
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// const mysql = require('mysql');
const mysql = require('mysql2/promise');
const BaseCRUD = require('./base-crud')
const express = require('express');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.get('/', function (req, res) {
// 	res.send('Main page')
// });

// app.get('/about', function (req, res) {
// 	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
// });
// Create a MySQL connection pool
const pool = mysql.createPool({
  database: process.env.DB_DATABASE,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Define a route that makes a query to the database
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM your_table');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


// Database connection
// const db = mysql.createConnection({
// 	database: process.env.DB_DATABASE,
// 	user: process.env.DB_USERNAME,
// 	password: process.env.DB_PASSWORD,
// 	host: process.env.DB_HOST,
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to database');
// });

// Users CRUD operations extending the base class
class UsersCRUD extends BaseCRUD {
  constructor(tableName) {
    super(tableName); // Pass the table name to the base class
  }

  // You can add additional methods specific to Users here if needed
}

const usersCRUD = new UsersCRUD('Users');

// Express.js routes using the UsersCRUD API functions
app.post('/users', (req, res) => usersCRUD.createAPI(req, res));
app.get('/users/:id', (req, res) => usersCRUD.readAPI(req, res));
app.put('/users/:id', (req, res) => usersCRUD.updateAPI(req, res));
app.delete('/users/:id', (req, res) => usersCRUD.deleteAPI(req, res));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
