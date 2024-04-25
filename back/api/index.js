require('dotenv').config({ path: '../.env.local' });

const path = require('path');
const mysql = require('mysql');
const BaseCRUD = require('./base-crud')
const express = require('express');
const app = express();

app.get('/', function (req, res) {
	res.send('Main page')
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});


// Database connection
const db = mysql.createConnection({
	database: process.env.DB_DATABASE,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Users CRUD operations extending the base class
class UsersCRUD extends BaseCRUD {
  constructor() {
    super('Users'); // Pass the table name to the base class
  }

  // You can add additional methods specific to Users here if needed
}

const usersCRUD = new UsersCRUD();

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
