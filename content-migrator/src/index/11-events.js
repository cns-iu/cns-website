import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import { formatDate, formatMarkdownLink, formatUrl, index, INDEXES, readIndex, readLookupIndex, removeNullishProps, writeMinifiedJSON } from './utils.js';

const PEOPLE_FIELDS = ['organizers', 'attendees', 'presenters', 'instructors'];

function getTypeOptions(config) {
  const collection = config.collections.find((c) => c.name === 'event');
  const typeField = collection.fields.find((f) => f.name === 'type');
  return typeField.options;
}

function formatLocation(location) {
  if (!location) {
    return '';
  }

  const { venue, street, city, state, postcode, country, raw } = location;
  const parts = [];
  if (venue) {
    parts.push(venue, ', ');
  }
  if (street) {
    parts.push(street, ', ');
  }
  if (city) {
    parts.push(city, ', ');
  }
  if (state) {
    parts.push(state);
    if (postcode) {
      parts.push(' ', postcode);
    }
    parts.push(', ');
  }
  if (country) {
    parts.push(country);
  }

  if (parts.length === 0 && raw) {
    parts.push(raw);
  } else if (parts[parts.length - 1] === ', ') {
    parts.pop();
  }

  return parts;
}

function buildDescription(item) {
  const { slug, title, link, dateStart, dateEnd, location } = item;
  const linkUrl = formatUrl(slug, 'events', link);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  const description = [
    formatMarkdownLink(title, linkUrl),
    '\n\n',
    dateEnd && dateEnd !== dateStart ? [formatDate(dateStart, dateOptions), ' - ', formatDate(dateEnd, dateOptions)] : formatDate(dateStart, dateOptions),
    location ? [' | ', formatLocation(location)] : '',
  ];

  return description.flat(10).join('').trim();
}

export function writeEventsIndex() {
  const events = readIndex('events');
  const peopleLookup = readLookupIndex('people');

  const entries = events.map((item) => {
    if (!item.dateStart) {
      return undefined;
    }

    const { slug, type, title, link, dateStart, dateEnd, thumbnail, featured, projects, organizedByCns } = item;
    const people = PEOPLE_FIELDS.flatMap((field) => item[field] ?? []);

    return removeNullishProps({
      slug,
      category: 'event',
      type,
      title,
      link: formatUrl(slug, 'events', link) || undefined,
      dateStart: formatDate(dateStart),
      dateEnd: formatDate(dateEnd ?? dateStart),
      thumbnail: formatUrl(slug, 'events', thumbnail) || undefined,
      description: buildDescription(item, peopleLookup),
      people: people.length > 0 ? people : undefined,
      featured,
      projects,
      organizedByCns,
    });
  });

  writeMinifiedJSON(
    join(INDEXES, 'app-events.json'),
    entries.filter((item) => !!item),
  );
}

export function writeEventTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  writeMinifiedJSON(join(INDEXES, 'app-event-types.json'), getTypeOptions(config));
}

index('events/**/data.yaml', 'events.json');
writeEventsIndex();
writeEventTypesIndex();
