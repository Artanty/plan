require('dotenv').config();
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
const pool = require('./../core/db_connection')
const getAuthenticatedUser = require ('./../external/getAuthenticatedUser')
const validateCreateTaskData = require('./../validators/createTask')
const getNextExternalTaskId = require('../functions/getNextExternalTaskId')
const getFirstExternalTaskId = require('../functions/getFirstExternalTaskId')
// app.get('/', function (req, res) {
// 	res.send('Main page')
// });

// app.get('/about', function (req, res) {
// 	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
// });

app.get('/users2', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/get-creds', async (req, res) => {
  try {
    const rows = {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});




// Users CRUD operations extending the base class
class UsersCRUD extends BaseCRUD {
  constructor(tableName, app) {
    super(tableName, app); // Pass the table name to the base class
  }

  async userExternals(userId) {
    const sql = `
        SELECT e.*, ue.access_token, ue.refresh_token
        FROM UserExternals ue
        JOIN Externals e ON ue.service_id = e.id
        WHERE ue.user_id = ?
    `;
    const [records] = await pool.query(sql, [userId]);
    
    if (!records.length) {
      throw new Error('No external services found for the user');
    }

    return records;
  }

  userExternalsAPI(req, res) {
    this.userExternals(req.params.id)
      .then(record => res.json(record))
      .catch(error => this.handleError(res, error));
  }
  
}

const usersCRUD = new UsersCRUD('Users');

app.post('/users', (req, res) => usersCRUD.createAPI(req, res));
app.get('/users/', (req, res) => usersCRUD.readAllAPI(req, res));
app.get('/users/:id', (req, res) => usersCRUD.readAPI(req, res));
app.put('/users/:id', (req, res) => usersCRUD.updateAPI(req, res));
app.delete('/users/:id', (req, res) => usersCRUD.deleteAPI(req, res));
app.get('/userExternals', (req, res) => usersCRUD.userExternalsAPI({ params: { id: getAuthenticatedUser() } }, res));

// const externalsCRUD = new UsersCRUD('Externals');

// app.post('/externals', (req, res) => externalsCRUD.createAPI(req, res));
// app.get('/externals/', (req, res) => externalsCRUD.readAllAPI(req, res));
// app.get('/externals/:id', (req, res) => externalsCRUD.readAPI(req, res));
// app.put('/externals/:id', (req, res) => externalsCRUD.updateAPI(req, res));
// app.delete('/externals/:id', (req, res) => externalsCRUD.deleteAPI(req, res));

class TasksCRUD extends BaseCRUD {
  constructor(tableName, app) {
    super(tableName, app); // Pass the table name to the base class
  }

  async getLastTaskOfServiceAndUser(userId, externalServiceId) {
    const sql = `
    SELECT te.*
    FROM TaskExternals te
    JOIN UserExternals ue ON te.service_id = ue.service_id
    WHERE ue.user_id = ? AND ue.service_id = ?
    ORDER BY te.created_at DESC
    LIMIT 1
  `;
    const [rows] = await pool.query(sql, [userId, externalServiceId]);
    return rows[0]; // Return the first element of the rows array
  }

  async getLastTaskIdAPI(externalServiceId) {
    return this.getLastTaskOfServiceAndUser(getAuthenticatedUser(), externalServiceId)
  }

  async createTaskAndExternalTask (taskData, nextExternalTaskId) {
    let connection;
    try { 
      // Start a transaction
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Insert the task into the Tasks table
      const taskInsertQuery = 'INSERT INTO Tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)';
      const taskInsertValues = [getAuthenticatedUser(), taskData.title, taskData.description, taskData.status, taskData.due_date];
      const [taskResult] = await connection.query(taskInsertQuery, taskInsertValues);

      // Retrieve the ID of the newly created task
      const taskId = taskResult.insertId;

      // Insert the TaskExternal record into the TaskExternals table
      const taskExternalInsertQuery = 'INSERT INTO TaskExternals (task_id, service_id, external_task_id) VALUES (?, ?, ?)';
      const taskExternalInsertValues = [taskId, taskData.externalServiceId, nextExternalTaskId];
      await connection.query(taskExternalInsertQuery, taskExternalInsertValues);

      // Commit the transaction
      await connection.commit();

      // Send a response
      console.log('return ')
      return { message: 'Task and TaskExternal created successfully', taskId }
    } catch (error) {
      // Rollback the transaction in case of any error
      if (connection) {
        await connection.rollback();
      }
      throw new Error('Error creating task and TaskExternal: ' + error);
      
    } finally {
      console.log('finally')
      // Release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  }

  async getNextIdAndCreate(req, res) {
    new Promise((resolve, reject) => {
      const validationResult = validateCreateTaskData(req.body)
      if (validationResult.isValid) {
        console.log('Data is valid.');
        resolve(res)
      } else {
        reject('Data validation error:' + validationResult.error);
      }
    })
    .then(() => this.getLastTaskIdAPI(req.body.externalServiceId))
    .then((lastTask) => {
      const nextExternalTaskId = lastTask
        ? getNextExternalTaskId(lastTask.external_task_id)
        : getFirstExternalTaskId(req.body.externalServiceName)
      return this.createTaskAndExternalTask(req.body, nextExternalTaskId)
    })
    .then(resp => res.status(201).json(resp))
    .catch(error => {
      this.handleError(res, error)
    });  
  }

  async readByService (serviceId) {
    const query = `
      SELECT t.*, te.external_task_id
      FROM Tasks t
      JOIN TaskExternals te ON t.id = te.task_id
      WHERE te.service_id = ?
    `;
    const [rows] = await pool.query(query, [serviceId]);

    return rows
  }
  
  readByServiceAPI (req, res) {
    this.readByService(req.params.serviceId)
      .then(records => res.json(records))
      .catch(error => this.handleError(res, error));
  }
}

const tasksCRUD = new TasksCRUD('Externals');

app.post('/tasks', (req, res) => tasksCRUD.getNextIdAndCreate(req, res));
app.get('/tasks/', (req, res) => tasksCRUD.readAllAPI(req, res));
app.get('/tasks/by-service/:serviceId', (req, res) => tasksCRUD.readByServiceAPI(req, res));
app.get('/tasks/:id', (req, res) => tasksCRUD.readAPI(req, res));
app.put('/tasks/:id', (req, res) => tasksCRUD.updateAPI(req, res));
app.delete('/tasks/:id', (req, res) => tasksCRUD.deleteAPI(req, res));
// app.get('/getLast', (req, res) => usersCRUD.userExternalsAPI({ params: { id: getAuthenticatedUser() } }, res));


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
