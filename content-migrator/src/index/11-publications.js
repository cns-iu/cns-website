import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import TurndownService from 'turndown';
import { formatCitation } from '../utils/csl-formatter.js';
import {
  formatDate,
  formatUrl,
  index,
  INDEXES,
  readIndex,
  readLookupIndex,
  removeNullishProps,
  writeMinifiedJSON,
} from './utils.js';

const turndownService = new TurndownService();
const permittedLinkFormats = ['pdf', 'poster', 'slides', 'website'];

function selectLink(item) {
  if (item.doi?.length > 0) {
    return `https://doi.org/${item.doi}`;
  }

  const entry = item.media?.find((e) => permittedLinkFormats.includes(e.type));
  return entry?.url;
}

function formatLink(link) {
  const linkName = link.replace(/https?\:\/\//, '').replace(/\/(?![^()]*\))/g, '/<wbr>');
  const linkUrl = link.replaceAll(' ', '%20');
  return `[${linkName}](${linkUrl})`;
}

function buildCslData(item, link, peopleLookup, cslFields) {
  const { date, authors, editors } = item;
  const authorLiterals = authors?.map((p) => ({ literal: peopleLookup[p]?.name ?? p }));
  const editorLiterals = editors?.map((p) => ({ literal: peopleLookup[p]?.name ?? p }));
  const result = {
    author: authorLiterals ?? [],
    editor: editorLiterals ?? [],
    'available-date': { raw: formatDate(date) },
    issued: { raw: formatDate(date) },
    URL: link,
  };

  for (const field of cslFields) {
    if (!(field.csl_name in result)) {
      result[field.csl_name] = item[field.name];
    }
  }

  return result;
}

function buildDescription(item, link, markdown) {
  if (!link) {
    return markdown;
  }

  const { title } = item;
  return markdown.replaceAll(link, formatLink(link)).replace(new RegExp(title, 'gi'), `[${title}](${link})`);
}

export function writePublicationIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const publications = readIndex('publications');
  const people = readLookupIndex('people');
  const cslStyleXml = readFileSync('src/csl-styles/chicago-author-date.csl', 'utf-8');
  // const cslStyleXml = readFileSync('src/csl-styles/nature-with-doi.csl', 'utf-8');
  const localeXml = readFileSync('src/csl-styles/locales-en-US.xml', 'utf-8');
  const cslFields = config.collections.find((c) => c.name === 'publication').fields.filter((f) => f.csl_name);

  const links = publications.map((item) => formatUrl(item.slug, 'publications', selectLink(item)));
  const cslData = publications.map((item, index) => buildCslData(item, links[index], people, cslFields));
  const bib = formatCitation(cslData, cslStyleXml, { localeXml });
  const markdown = Object.entries(bib.entries).reduce((acc, [slug, html]) => {
    const md = turndownService.turndown(html).replace(/^[0-9]\.\n\n/, '');
    acc[slug] = md;
    return acc;
  }, {});

  const entries = publications.map((item, index) => {
    if (!item.date) {
      return undefined;
    }

    const { slug, type, title, date, thumbnail, featured, projects } = item;
    const people = ['authors', 'editors'].flatMap((field) => item[field] ?? []);

    return removeNullishProps({
      slug,
      category: 'publication',
      type: type,
      title,
      link: links[index],
      dateStart: formatDate(date),
      dateEnd: formatDate(date),
      thumbnail: formatUrl(slug, 'publications', thumbnail),
      description: buildDescription(item, links[index], markdown[slug]),
      people: people.length > 0 ? people : undefined,
      featured,
      projects,
    });
  });

  writeMinifiedJSON(
    join(INDEXES, 'app-publications.json'),
    entries.filter((item) => !!item),
  );
  writeMinifiedJSON(
    join(INDEXES, 'app-hra-publications.json'),
    entries.filter((entry) => entry.projects?.includes('human-reference-atlas')),
  );
}

export function writePublicationTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const coll = config.collections.find((c) => c.name === 'publication');
  const types = coll.fields.find((f) => f.name === 'type');
  writeMinifiedJSON(join(INDEXES, 'app-publication-types.json'), types.options);
}

index('publications/**/data.yaml', 'publications.json');

writePublicationIndex();
writePublicationTypesIndex();
