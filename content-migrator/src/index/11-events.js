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

  if (parts.length > 0) {
    parts.push('. ');
  }

  return parts;
}

function formatMedia(urls, text) {
  if (!urls || urls.length === 0) {
    return '';
  } else if (urls.length === 1) {
    return [formatMarkdownLink(text, urls[0]), ' '];
  }

  const result = [];
  for (let index = 0; index < urls.length; index++) {
    result.push(formatMarkdownLink(`${text} ${index + 1}`, urls[index]), ' ');
  }

  return result;
}

function buildDescription(item, typeLookup, peopleLookup) {
  const { slug, type, title, link, dateStart, dateEnd, location, presenters, instructors, organizers, attendees } =
    item;
  const linkUrl = formatUrl(slug, 'events', link);
  const mediaByType = (item.media ?? []).reduce((acc, mediaItem) => {
    acc[mediaItem.type] ??= [];
    acc[mediaItem.type].push(formatUrl(slug, 'events', mediaItem.url));
    return acc;
  }, {});

  const description = [
    formatDate(dateStart),
    dateEnd && dateEnd !== dateStart ? [' to ', formatDate(dateEnd)] : [],
    '. ',
    typeLookup[type] ?? type,
    ': “',
    formatMarkdownLink(title, linkUrl),
    '.” ',
    formatLocation(location),
    formatPeople(presenters, peopleLookup, 'Presented by '),
    formatPeople(instructors, peopleLookup, 'Instructors: '),
    formatPeople(organizers, peopleLookup, 'Organizers: '),
    formatPeople(attendees, peopleLookup, 'Attendees: '),
    formatMedia(mediaByType['image'], 'Image'),
    formatMedia(mediaByType['pdf'], 'PDF'),
    formatMedia(mediaByType['photo-gallery'], 'Photo gallery'),
    formatMedia(mediaByType['slides'], 'Slides'),
    formatMedia(mediaByType['website'], 'Website'),
    formatMedia(mediaByType['video'], 'Video'),
    formatMedia(mediaByType['video-playlist'], 'YouTube playlist'),
  ];

  return description.flat(10).join('').trim();
}

export function writeEventsIndex() {
  const events = readIndex('events');
  const peopleLookup = readLookupIndex('people');
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const typeLookup = getTypeOptions(config).reduce((acc, type) => {
    acc[type.value] = type.label;
    return acc;
  }, {});

  const entries = events.map((item) => {
    if (!item.dateStart) {
      return undefined;
    }

    const { slug, type, title, link, dateStart, dateEnd, thumbnail, featured, projects } = item;
    const people = PEOPLE_FIELDS.flatMap((field) => item[field] ?? []);

    return removeNullishProps({
      slug,
      category: 'event',
      type,
      title,
      link: formatUrl(slug, 'events', link),
      dateStart: formatDate(dateStart),
      dateEnd: formatDate(dateEnd ?? dateStart),
      thumbnail: formatUrl(slug, 'events', thumbnail),
      description: buildDescription(item, typeLookup, peopleLookup),
      people: people.length > 0 ? people : undefined,
      featured,
      projects,
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
