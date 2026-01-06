import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import YAML from 'js-yaml';
import { basename, dirname, join } from 'path';

export const CONTENT = '../content';
export const INDEXES = '../assets/indexes';
export const BASE_URL = 'https://cns-iu.github.io/cns-website/content';

export function readFiles(globString) {
  return globSync(globString).map(readYAMLWithSlug);
}
export function readYAMLWithSlug(path) {
  const data = YAML.load(readFileSync(path));
  data.slug = basename(dirname(path));
  return data;
}
export function readJSON(path) {
  return JSON.parse(readFileSync(path));
}
export function writeMinifiedJSON(path, data) {
  writeFileSync(path, JSON.stringify(data));
}
export function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}
export function readIndex(indexName) {
  return readJSON(join(INDEXES, indexName + '.json'));
}
export function index(globString, path, minified = false) {
  const data = readFiles(join(CONTENT, globString));
  if (minified) {
    writeMinifiedJSON(join(INDEXES, path), data);
  } else {
    writeJSON(join(INDEXES, path), data);
  }
}
