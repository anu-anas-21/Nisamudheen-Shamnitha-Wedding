const { sql, ensureTable } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const guests = Math.max(1, Math.min(10, parseInt(body.guests, 10) || 1));
    const attending = body.attending === 'no' ? 'no' : 'yes';

    await ensureTable();
    await sql`
      INSERT INTO rsvps (name, guests, attending)
      VALUES (${name}, ${guests}, ${attending})
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('RSVP save failed', err);
    return res.status(500).json({ error: 'Could not save RSVP' });
  }
};
