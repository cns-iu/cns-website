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

export function readLookupIndex(indexName, keyField = 'slug') {
  return readIndex(indexName).reduce((acc, item) => ((acc[item[keyField]] = item), acc), {});
}

export function index(globString, path, minified = false) {
  const data = readFiles(join(CONTENT, globString));
  if (minified) {
    writeMinifiedJSON(join(INDEXES, path), data);
  } else {
    writeJSON(join(INDEXES, path), data);
  }
}

export function formatDate(dateTimeString) {
  if (typeof dateTimeString !== 'string' || !dateTimeString) {
    return dateTimeString;
  }

  return dateTimeString.split('T')[0];
}

export function formatUrl(slug, subdir, url) {
  if (url && !url.startsWith('http')) {
    return `${BASE_URL}/${subdir}/${slug}/${url}`;
  }

  return url;
}

export function formatMarkdownLink(text, url) {
  return url ? `[${text}](${url.replaceAll(' ', '%20')})` : text;
}

export function formatPeople(people, peopleLookup, label = '', terminator = '. ') {
  if (!people || people.length === 0) {
    return '';
  }

  const names = people
    .map((person) => peopleLookup[person]?.name ?? person)
    .join(', ')
    .trim();
  return [label, names, terminator];
}

export function removeNullishProps(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
