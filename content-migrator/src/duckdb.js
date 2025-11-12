#!/usr/bin/env node
/**
 * Usage:
 *   duckdb.js --db <path> --query "<SQL>"
 *   duckdb.js --file query.sql
 *   echo "SELECT 1" | duckdb.js
 *
 * Options:
 *   -d, --db <path>     DuckDB file path (default ":memory:")
 *   -q, --query <sql>   SQL to run
 *   -f, --file <path>   SQL file to run
 *   -F, --format <fmt>  Output format: csv|json (default csv)
 */

import { Command } from 'commander';
import duckdb from 'duckdb';
import fs from 'fs';
import Papa from 'papaparse';

const program = new Command();

program
  .name('duckdb-js')
  .description('DuckDB CLI (Node-only) with built-in UDFs — CSV/JSON output')
  .option('-d, --db <path>', 'DuckDB file path (default ":memory:")', ':memory:')
  .option('-q, --query <sql>', 'SQL statement to run')
  .option('-f, --file <path>', 'Path to SQL file to run')
  .option('-F, --format <fmt>', 'Output format: csv|json (default csv)', 'csv')
  .parse(process.argv);

const opts = program.opts();

async function readSQL() {
  if (opts.query) return opts.query;
  if (opts.file) return fs.promises.readFile(opts.file, 'utf8');
  if (process.stdin.isTTY) return '';
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').trim();
}

// Embedded UDFs factory — uses html-entities and slugify packages
async function embeddedUdfsFactory() {
  const { decode } = await import('html-entities');
  const { default: slugify } = await import('slugify');

  return {
    html_decode: {
      fn: (s) => (s == null ? null : decode(String(s))),
      returnType: 'VARCHAR',
      args: 1,
    },
    slugify: {
      fn: (s) => (s == null ? null : slugify(String(s), { lower: true, strict: true })),
      returnType: 'VARCHAR',
      args: 1,
    },
    str_reverse: {
      fn: (s) => (s == null ? null : String(s).split('').reverse().join('')),
      returnType: 'VARCHAR',
      args: 1,
    },
    lower_case: {
      fn: (s) => (s == null ? null : String(s).toLowerCase()),
      returnType: 'VARCHAR',
      args: 1,
    },
  };
}

/**
 * Register UDFs on the Database object using db.register_udf(name, returnType, fn)
 * Throws if db.register_udf is not available or if registration fails.
 */
function registerUdfsOnDb(db, udfs) {
  if (typeof db.register_udf !== 'function') {
    throw new Error('db.register_udf is not available — ensure you are using the Node.js native duckdb package.');
  }

  for (const [name, def] of Object.entries(udfs)) {
    if (!def || typeof def.fn !== 'function') {
      console.error(`Skipping UDF ${name}: invalid definition`);
      continue;
    }
    const returnType = def.returnType ?? 'VARCHAR';
    try {
      db.register_udf(name, returnType, def.fn);
      // log to stderr to avoid interfering with stdout results
      // console.error(`Registered UDF: ${name} -> ${returnType}`);
    } catch (e) {
      throw new Error(`Failed to register UDF "${name}": ${e.message || e}`);
    }
  }
}

// Output: CSV (papaparse) or JSON
function printAsCsv(rows) {
  // papaparse expects an array of objects or an array of arrays with headers
  // convert null -> empty string so CSV cells are blank rather than "null"
  const normalized = (rows ?? []).map((row) => {
    const out = {};
    for (const k of Object.keys(row || {})) {
      out[k] = row[k] === null ? '' : row[k];
    }
    return out;
  });
  // papaparse unparse will add header row automatically
  const csv = Papa.unparse(normalized, { header: true });
  process.stdout.write(csv + '\n');
}

function printAsJson(rows) {
  process.stdout.write(JSON.stringify(rows ?? null, null, 2) + '\n');
}

// Main flow
async function main() {
  const sql = await readSQL();
  if (!sql) {
    console.error('No SQL provided (use --query, --file, or pipe SQL into stdin).');
    process.exit(2);
  }

  // Create DB and connection
  const db = new duckdb.Database(opts.db);
  const conn = db.connect();

  // Register UDFs (DB-level registration)
  try {
    const udfs = await embeddedUdfsFactory();
    registerUdfsOnDb(db, udfs);
  } catch (e) {
    console.error('UDF registration error:', e.message || e);
    process.exit(3);
  }

  // Execute SQL and print results
  conn.all(sql, (err, rows) => {
    if (err) {
      console.error('SQL error:', err.message || err);
      process.exit(4);
    }

    const fmt = (opts.format || 'csv').toLowerCase();
    if (fmt === 'json') printAsJson(rows);
    else if (fmt === 'csv') printAsCsv(rows);
    else {
      console.error('Unsupported format:', fmt);
      process.exit(5);
    }

    process.exit(0);
  });
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(99);
});
