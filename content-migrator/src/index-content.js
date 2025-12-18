import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import YAML from 'js-yaml';
import { basename, dirname, join } from 'path';
import TurndownService from 'turndown';
import { formatCitation } from './utils/csl-formatter.js';

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
function index(globString, path, minified = false) {
  const data = readFiles(join(CONTENT, globString));
  if (minified) {
    writeMinifiedJSON(join(INDEXES, path), data);
  } else {
    writeJSON(join(INDEXES, path), data);
  }
}

index('people/**/data.yaml', 'people.json');
index('publications/**/data.yaml', 'publications.json');
index('tags/**/data.yaml', 'tags.json');
index('tags/**/data.yaml', 'app-tags.json', true);

function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image) {
      person.image = `${BASE_URL}/people/${person.slug}/${person.image}`;
    }
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

const turndownService = new TurndownService();

function writePublicationIndex() {
  const publications = readIndex('publications');
  const people = readIndex('people').reduce((acc, item) => ((acc[item.slug] = item), acc), {});
  const cslStyleXml = readFileSync('src/csl-styles/chicago-author-date.csl', 'utf-8');
  // const cslStyleXml = readFileSync('src/csl-styles/nature-with-doi.csl', 'utf-8');
  const localeXml = readFileSync('src/csl-styles/locales-en-US.xml', 'utf-8');

  const cslData = publications.map((pub) => ({
    id: pub.slug,
    ...pub,
    slug: undefined,
    DOI: pub.doi,
    'container-title': pub.venue,
    'chapter-number': pub.chapter,
    author: pub.authors.map((person) => ({ literal: people[person]?.name ?? person })),
    editor: pub.editors.map((person) => ({ literal: people[person]?.name ?? person })),
    issued: { raw: pub.date },
  }));

  const bib = formatCitation(cslData, cslStyleXml, { localeXml });
  const markdown = Object.entries(bib.entries).reduce((acc, [slug, html]) => {
    const md = turndownService.turndown(html).replace(/^[0-9]\.\n\n/, '');
    acc[slug] = md;
    return acc;
  }, {});

  const links = publications.map((pub) => {
    if (pub.doi?.length > 0) {
      return `https://doi.org/${pub.doi}`;
    } else if (pub.links?.length > 0) {
      const link = pub.links[0];
      if (!link.startsWith('http:') && !link.startsWith('https:')) {
        return `${BASE_URL}/publications/${pub.slug}/${link}`;
      } else {
        return link;
      }
    } else {
      return undefined;
    }
  });

  const entries = publications.map((pub, index) => ({
    slug: pub.slug,
    category: 'publication',
    type: pub.type,
    people: [...(pub.authors ?? []), ...(pub.editors ?? [])],
    // projects: [],
    // image: images[index],
    link: links[index],
    title: pub.title,
    description: links[index]
      ? markdown[pub.slug].replaceAll(pub.title, `[${pub.title}](${links[index]})`)
      : markdown[pub.slug],
    tags: pub.tags ?? [],
    startDate: pub.date,
    endDate: pub.date,
  }));

  writeMinifiedJSON(join(INDEXES, 'app-publications.json'), entries);
}

writePublicationIndex();

writePeopleIndex();
