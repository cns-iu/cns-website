import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import TurndownService from 'turndown';
import { formatCitation } from '../utils/csl-formatter.js';
import { BASE_URL, formatDate, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

const turndownService = new TurndownService();

export function writePublicationIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const publications = readIndex('publications');
  const people = readIndex('people').reduce((acc, item) => ((acc[item.slug] = item), acc), {});
  const cslStyleXml = readFileSync('src/csl-styles/chicago-author-date.csl', 'utf-8');
  // const cslStyleXml = readFileSync('src/csl-styles/nature-with-doi.csl', 'utf-8');
  const localeXml = readFileSync('src/csl-styles/locales-en-US.xml', 'utf-8');

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

  const cslFields = config.collections.find((c) => c.name === 'publication').fields.filter((f) => f.csl_name);
  const cslData = publications.map((pub, index) => {
    const cslEntry = {
      author: pub.authors.map((person) => ({ literal: people[person]?.name ?? person })),
      editor: pub.editors.map((person) => ({ literal: people[person]?.name ?? person })),
      'available-date': { raw: formatDate(pub.date) },
      issued: { raw: formatDate(pub.date) },
      URL: links[index],
    };

    for (const field of cslFields) {
      if (!(field.csl_name in cslEntry)) {
        cslEntry[field.csl_name] = pub[field.name];
      }
    }

    return cslEntry;
  });

  const bib = formatCitation(cslData, cslStyleXml, { localeXml });
  const markdown = Object.entries(bib.entries).reduce((acc, [slug, html]) => {
    const md = turndownService.turndown(html).replace(/^[0-9]\.\n\n/, '');
    acc[slug] = md;
    return acc;
  }, {});

  const images = publications.map((pub) => {
    if (pub.mediaUrl?.length > 0) {
      const link = pub.mediaUrl;
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
    image: images[index],
    link: links[index],
    title: pub.title,
    description: links[index]
      ? markdown[pub.slug]
          .replaceAll(links[index], formatLink(links[index]))
          .replace(new RegExp(pub.title, 'gi'), `[${pub.title}](${links[index]})`)
      : markdown[pub.slug],
    tags: pub.tags ?? [],
    dateStart: formatDate(pub.date),
    dateEnd: formatDate(pub.date),
  }));

  writeMinifiedJSON(join(INDEXES, 'app-publications.json'), entries);
  writeMinifiedJSON(
    join(INDEXES, 'app-hra-publications.json'),
    entries.filter((entry) => entry.tags.includes('hra')),
  );
}

export function writePublicationTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const coll = config.collections.find((c) => c.name === 'publication');
  const types = coll.fields.find((f) => f.name === 'type');
  writeMinifiedJSON(join(INDEXES, 'app-publication-types.json'), types.options);
}

function formatLink(link) {
  const linkName = link.replace(/http[s]\:\/\//, '').replace(/\/(?![^()]*\))/g, '/<wbr>');
  const linkUrl = link.replaceAll(' ', '%20');
  return `[${linkName}](${linkUrl})`;
}

index('publications/**/data.yaml', 'publications.json');

writePublicationIndex();
writePublicationTypesIndex();
