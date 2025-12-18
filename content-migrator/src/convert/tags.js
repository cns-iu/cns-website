import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { mkdirpSync } from 'mkdirp';
import { join } from 'path';

const STAGING_DIR = 'old-website/staging';
const OUTPUT_DIR = '../content/tags';

const BASE_JSON = 'tags.json';

function readJson(file, baseDir = STAGING_DIR) {
  const path = join(baseDir, file);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const data = readJson(BASE_JSON);

for (const entry of data) {
  const dir = join(OUTPUT_DIR, entry.slug);
  mkdirpSync(dir);
  writeFileSync(join(dir, 'data.yaml'), dump(entry));
}
