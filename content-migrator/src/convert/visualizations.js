import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { mkdirpSync } from 'mkdirp';
import { join } from 'path';
import TurndownService from 'turndown';

const STAGING_DIR = 'old-website/staging';
const OUTPUT_DIR = '../content/visualizations';
const DOCS_DIR = 'old-website/docs/visualizations';

const BASE_JSON = 'visualizations.json';

function readJson(file, baseDir = STAGING_DIR) {
  const path = join(baseDir, file);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const turndownService = new TurndownService();
const data = readJson(BASE_JSON).map((item) => {
  item.title = turndownService.turndown(item.title);
  item.description = turndownService.turndown(item.description);
  return item;
});

for (const entry of data) {
  const dir = join(OUTPUT_DIR, entry.slug);
  mkdirpSync(dir);

  if (entry.link && !entry.link.startsWith('http')) {
    entry.link = `https://cns.iu.edu/${entry.link.replace('/docs/', 'docs/')}`;
  }
  if (entry.mediaUrl && !entry.mediaUrl.startsWith('http')) {
    entry.mediaUrl = `https://cns.iu.edu/${entry.mediaUrl.replace('/docs/', 'docs/')}`;
  }
  
  writeFileSync(join(dir, 'data.yaml'), dump(entry));
}
