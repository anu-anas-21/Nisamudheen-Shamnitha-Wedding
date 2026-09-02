const { sql, ensureTable } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  try {
    await ensureTable();
    const { rows } = await sql`
      SELECT name, guests, attending, submitted_at
      FROM rsvps
      ORDER BY submitted_at DESC
      LIMIT 500
    `;
    return res.status(200).json({ rows });
  } catch (err) {
    console.error('RSVP list failed', err);
    return res.status(500).json({ error: 'Could not load RSVPs' });
  }
};
