const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Create a PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // This is required if connecting to a Vercel PostgreSQL database
  },
});

app.use(bodyParser.json());
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(__dirname));

// Create tables in the PostgreSQL database
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    companyName TEXT,
    companyType TEXT,
    serviceType TEXT,
    techProblems TEXT,
    securityAudit TEXT,
    contactEmail TEXT,
    contactNumber TEXT
  )
`);

pool.query(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE
  )
`);

// Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, companyName, companyType, serviceType, techProblems, securityAudit, contactEmail, contactNumber } = req.body;

  try {
    // Insert data into the contact form database using parameterized query
    await pool.query(`
      INSERT INTO contacts (name, companyName, companyType, serviceType, techProblems, securityAudit, contactEmail, contactNumber)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [name, companyName, companyType, serviceType, techProblems, securityAudit, contactEmail, contactNumber]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error saving contact form data to the database. ${err.message}` });
  }
});

// Endpoint to handle subscribed emails
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    // Insert data into the subscribers database using parameterized query
    await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error saving subscribed email to the database. ${err.message}` });
  }
});

// Export the app and pool objects
module.exports = {
  app,
  pool,
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
