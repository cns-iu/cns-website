import { readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { mkdirpSync } from 'mkdirp';
import { join } from 'path';
import { getWaybackUrl } from '../utils/wayback-machine.js';

const STAGING_DIR = 'old-website/staging';
const OUTPUT_DIR = '../content/events';

const EVENT_JSONS = ['events.json', 'presentations.json', 'tutorials.json', 'workshops.json'];

function readJson(file, baseDir = STAGING_DIR) {
  const path = join(baseDir, file);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

for (const jsonFile of EVENT_JSONS) {
  const data = readJson(jsonFile);

  for (const entry of data) {
    const dir = join(OUTPUT_DIR, entry.slug);
    mkdirpSync(dir);

    for (let i = 0; i < entry.links.length; i++) {
      let link = entry.links[i];
      if (link) {
        if (jsonFile === 'workshops.json') {
          if (!link.startsWith('http')) {
            link = await getWaybackUrl(`https://cns.iu.edu/${link}`);
          }
        } else if ((jsonFile === 'tutorials.json' || jsonFile === 'presentations.json') && !link.startsWith('http')) {
          link = `https://cns.iu.edu/docs/presentations/${link}`;
        }
      } else {
        link = undefined;
      }
      entry.links[i] = link;
    }
    entry.links = entry.links.filter((e) => !!e);

    writeFileSync(join(dir, 'data.yaml'), dump(entry));
  }
}
