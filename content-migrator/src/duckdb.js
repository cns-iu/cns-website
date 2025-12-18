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
import fs from 'fs';
import Papa from 'papaparse';
import { duckdbConnect, query } from './utils/duckdb.js';

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

  const conn = await duckdbConnect(opts.db);
  const rows = await query(sql, conn);

  const fmt = (opts.format || 'csv').toLowerCase();
  if (fmt === 'json') printAsJson(rows);
  else if (fmt === 'csv') printAsCsv(rows);
  else {
    console.error('Unsupported format:', fmt);
    process.exit(5);
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(99);
});
