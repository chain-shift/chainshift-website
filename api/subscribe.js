// /api/subscribe
import { pool } from '../app';  // Update the path accordingly

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email } = req.body;

  try {
    console.log('Inserting email:', email);
    // Insert data into the subscribers database using parameterized query
    await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error inserting email:', email, err);
    res.status(500).json({ error: `Error saving subscribed email to the database. ${err.message}` });
  }
}
