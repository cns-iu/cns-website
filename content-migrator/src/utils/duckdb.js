import duckdb from 'duckdb';

// Embedded UDFs factory — uses html-entities and slugify packages
async function embeddedUdfsFactory() {
  const { decode } = await import('html-entities');
  const { slugify } = await import('./slugify.js');
  const { nanoid } = await import('./nanoid.js');

  return {
    html_decode: {
      fn: (s) => (s == null ? null : decode(String(s))),
      returnType: 'VARCHAR',
      args: 1,
    },
    slugify: {
      fn: (s) => slugify(String(s)),
      returnType: 'VARCHAR',
      args: 1,
    },
    nanoid: {
      fn: (_s) => nanoid(),
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

export async function duckdbConnect(path) {
  // Create DB and connection
  const db = new duckdb.Database(path);
  const conn = db.connect();

  // Register UDFs (DB-level registration)
  try {
    const udfs = await embeddedUdfsFactory();
    registerUdfsOnDb(db, udfs);
  } catch (e) {
    console.error('UDF registration error:', e.message || e);
    process.exit(3);
  }

  return conn;
}

export async function query(sql, conn) {
  return new Promise((resolve, reject) => {
    conn.all(sql, (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve (rows);
      }
    });
  });
}
