import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { mkdirpSync } from 'mkdirp';
import { join } from 'path';

const STAGING_DIR = 'old-website/staging';
const OUTPUT_DIR = '../content/publications';
const DOCS_DIR = 'old-website/docs/publications';

const BASE_JSON = 'publications.json';

function readJson(file, baseDir = STAGING_DIR) {
  const path = join(baseDir, file);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const data = readJson(BASE_JSON);

for (const entry of data) {
  const dir = join(OUTPUT_DIR, entry.slug);
  mkdirpSync(dir);

  for (let i = 0; i < entry.links?.length; i++) {
    let link = entry.links[i];
    if (link && !link.startsWith('http')) {
      link = `https://cns.iu.edu/docs/publications/${link}`;
      entry.links[i] = link;
    }
  }

  writeFileSync(join(dir, 'data.yaml'), dump(entry));
}
