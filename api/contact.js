// /api/contact
import { pool } from '../app';  // Update the path accordingly

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { name, companyName, companyType, serviceType, techProblems, securityAudit, contactEmail, contactNumber } = req.body;

  try {
    console.log('Inserting contact data:', { name, companyName, companyType, serviceType, techProblems, securityAudit, contactEmail, contactNumber });
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
}
