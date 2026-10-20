const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 3000,
    application_name: 'nexus-local-migrations',
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const directory = path.join(__dirname, '..', 'src', 'database', 'migrations');
    const files = (await readdir(directory))
      .filter((name) => /^\d{3}_[a-z0-9_]+\.sql$/.test(name))
      .sort();

    for (const file of files) {
      const version = file.slice(0, file.length - 4);
      const exists = await pool.query(
        'SELECT 1 FROM schema_migrations WHERE version = $1',
        [version],
      );
      if (exists.rowCount) {
        process.stdout.write(`skip ${version}\n`);
        continue;
      }

      const sql = await readFile(path.join(directory, file), 'utf8');
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [version],
        );
        await client.query('COMMIT');
        process.stdout.write(`applied ${version}\n`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  process.stderr.write(`migration failed: ${error.message}\n`);
  process.exitCode = 1;
});
