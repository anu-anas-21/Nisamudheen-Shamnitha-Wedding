const { sql } = require('@vercel/postgres');

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      guests INTEGER NOT NULL DEFAULT 1,
      attending TEXT NOT NULL DEFAULT 'yes',
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

module.exports = { sql, ensureTable };
