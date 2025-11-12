import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import YAML from 'js-yaml';
import { basename, dirname, join } from 'path';

const CONTENT = '../content';
const INDEXES = '../assets/indexes';
const BASE_URL = 'https://cns-iu.github.io/cns-website/content';

function readFiles(globString) {
  return globSync(globString).map(readYAMLWithSlug);
}
function readYAMLWithSlug(path) {
  const data = YAML.load(readFileSync(path));
  data.slug = basename(dirname(path));
  return data;
}
function readJSON(path) {
  return JSON.parse(readFileSync(path));
}
function writeMinifiedJSON(path, data) {
  writeFileSync(path, JSON.stringify(data));
}
function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}
function readIndex(indexName) {
  return readJSON(join(INDEXES, indexName + '.json'));
}
function index(globString, path) {
  const data = readFiles(join(CONTENT, globString));
  writeJSON(join(INDEXES, path), data);
}

index('person/**/data.yaml', 'people.json');

function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image) {
      person.image = `${BASE_URL}/person/${person.slug}/${person.image}`;
    }
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

writePeopleIndex();
