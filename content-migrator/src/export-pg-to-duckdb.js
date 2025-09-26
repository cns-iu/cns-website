import duckdb from 'duckdb';
import { promisify } from 'util';

// CLI: node export-pg-to-duckdb.js /path/to/output.duckdb
const duckdbFile = process.argv[2];
if (!duckdbFile) {
  console.error('Usage: node export-pg-to-duckdb.js <output.duckdb>');
  process.exit(1);
}

// Build Postgres connection string from environment
const postgresConn = [
  process.env.PGDATABASE ? `dbname=${process.env.PGDATABASE}` : null,
  process.env.PGUSER ? `user=${process.env.PGUSER}` : null,
  process.env.PGPASSWORD ? `password=${process.env.PGPASSWORD}` : null,
  process.env.PGHOST ? `host=${process.env.PGHOST}` : null,
  process.env.PGPORT ? `port=${process.env.PGPORT}` : null,
]
  .filter(Boolean)
  .join(' ');

async function exportPostgres() {
  const db = new duckdb.Database(duckdbFile);
  const con = db.connect();

  // Promisify DuckDB methods
  const run = promisify(con.run.bind(con));
  const all = promisify(con.all.bind(con));

  await run('INSTALL postgres;');
  await run('LOAD postgres;');

  // Attach using env-driven connection string
  await run(`ATTACH '${postgresConn}' AS pg (TYPE POSTGRES);`);

  // Fetch tables + views
  const tables = await all(`
    SELECT table_schema, table_name, 'table' AS kind
    FROM pg.information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog','information_schema')
      AND table_type = 'BASE TABLE'
    UNION ALL
    SELECT table_schema, table_name, 'view' AS kind
    FROM pg.information_schema.views
    WHERE table_schema NOT IN ('pg_catalog','information_schema');
  `);

  for (const { table_schema, table_name, kind } of tables) {
    const numRows = (
      await all(`
          SELECT COUNT(*) as count FROM pg."${table_schema}"."${table_name}"
        `).catch((err) => {
        console.error('❌ Error exporting:', err);
        return [{ count: 0 }];
      })
    )[0].count;

    if (numRows > 0) {
      console.log(`Exporting ${kind}: ${table_schema}.${table_name} -> ${table_name}`);
      await run(`
          CREATE TABLE "${table_name}" AS
            SELECT * FROM pg."${table_schema}"."${table_name}";
        `).catch((err) => {
        console.error('❌ Error exporting:', err);
      });

      await run(`
        COPY "${table_name}" TO 'data/tables/${table_name}.json' (ARRAY);
      `).catch((err) => {
        console.error('❌ Error exporting to JSON:', err);
      });
    } else {
      console.error(`❌ Skipping empty or bad table: ${table_name}`);
    }
  }

  console.log(`✅ Export complete! Tables & views are stored in ${duckdbFile}`);
  con.close();
}

exportPostgres().catch((err) => {
  console.error('❌ Error exporting:', err);
  process.exit(1);
});
