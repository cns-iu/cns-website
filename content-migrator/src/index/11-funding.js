import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import {
  formatDate,
  formatMarkdownLink,
  formatPeople,
  formatUrl,
  index,
  INDEXES,
  readIndex,
  readLookupIndex,
  removeNullishProps,
  writeMinifiedJSON,
} from './utils.js';

function buildDescription(item, peopleLookup) {
  const { slug, title, link, name, dateStart, dateEnd, investigators, amount } = item;
  const linkUrl = formatUrl(slug, 'funding', link);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const hasPeople = investigators?.length > 0;
  const hasAmount = typeof amount === 'number';

  const description = [
    formatMarkdownLink(title, linkUrl),
    '\n\n',
    dateEnd && dateEnd !== dateStart ? [formatDate(dateStart, dateOptions), ' - ', formatDate(dateEnd, dateOptions)] : formatDate(dateStart, dateOptions),
    name ? [' | ', name] : '',
    hasAmount ? [' | ', '$', Number(amount).toLocaleString()] : '',
    hasPeople ? [' | ', formatPeople(investigators, peopleLookup)] : '',
  ];

  return description.flat(10).join('').trim();
}

export function writeFundingIndex() {
  const funding = readIndex('funding');
  const peopleLookup = readLookupIndex('people');
  const entries = funding.map((item) => {
    if (!item.dateStart) {
      return undefined;
    }

    const { slug, type, title, link, dateStart, dateEnd, thumbnail, investigators, featured, projects } = item;
    return removeNullishProps({
      slug,
      category: 'funding',
      type: type || 'funding',
      title,
      link: formatUrl(slug, 'funding', link) || undefined,
      dateStart: formatDate(dateStart),
      dateEnd: formatDate(dateEnd ?? dateStart),
      thumbnail: formatUrl(slug, 'funding', thumbnail) || undefined,
      description: buildDescription(item, peopleLookup),
      people: investigators,
      featured,
      projects,
    });
  });

  writeMinifiedJSON(
    join(INDEXES, 'app-funding.json'),
    entries.filter((item) => !!item),
  );
}

export function writeFundingTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const coll = config.collections.find((c) => c.name === 'funding');
  const types = coll.fields.find((f) => f.name === 'type');
  writeMinifiedJSON(join(INDEXES, 'app-funding-types.json'), types.options);
}

index('funding/**/data.yaml', 'funding.json');
writeFundingIndex();
writeFundingTypesIndex();
