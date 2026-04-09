import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import { index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writeCategoryTagsIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const tags = config.collections.map((c) => {
    return {
      slug: c.name,
      name: c.label,
      description: '',
    };
  });

  writeMinifiedJSON(join(INDEXES, 'app-category-tags.json'), tags);
}

export function writeDisplayTagsIndex() {
  const tags = readIndex('tags');
  const categoryTags = readIndex('app-category-tags');
  const displayTags = categoryTags.concat(tags).filter((tag) => !tag.hidden);
  writeMinifiedJSON(join(INDEXES, 'app-display-tags.json'), displayTags);
}

index('tags/**/data.yaml', 'tags.json');
index('tags/**/data.yaml', 'app-tags.json', true);
writeCategoryTagsIndex();
writeDisplayTagsIndex();
