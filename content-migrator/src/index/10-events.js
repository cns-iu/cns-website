import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import { BASE_URL, formatDate, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

const PEOPLE_FIELDS = ['organizers', 'attendees', 'presenters', 'instructors'];

export function writeEventsIndex() {
  const events = readIndex('events');
  const peopleLookup = readIndex('people').reduce((acc, item) => ((acc[item.slug] = item), acc), {});
  const entries = events.map((item) => {
    if (item.mediaUrl && !item.mediaUrl?.startsWith('http')) {
      item.image = `${BASE_URL}/events/${item.slug}/${item.mediaUrl}`;
    }
    if (item.link && !item.link?.startsWith('http')) {
      item.link = `${BASE_URL}/events/${item.slug}/${item.link}`;
    }
    item.dateStart = item.dateStart ?? '1979-01-01';
    item.dateEnd = !item.dateEnd && item.dateStart ? item.dateStart : (item.dateEnd ?? '1979-01-01');

    const people = PEOPLE_FIELDS.reduce((acc, field) => (acc.push(item[field] ?? []), acc), []).flat();
    const peopleString = people
      .map((person) => peopleLookup[person]?.name ?? person)
      .join(', ')
      .trim();

    const description = [
      peopleString ? `${peopleString}.` : '',
      item.dateStart !== '1979-01-01' ? `${formatDate(item.dateStart)}\\.` : '',
      item.link ? `“[${item.title}](${item.link.replaceAll(' ', '%20')}).”` : `“${item.title}.”`,
      item.description ? `${item.description}.` : '',
      item.location ? `${item.location}.` : '',
    ]
      .filter((s) => s?.trim().length > 0)
      .join(' ');

    return {
      slug: item.slug,
      category: 'event',
      type: item.type,
      people: Array.from(new Set(people)).sort(),
      image: item.image,
      link: item.link,
      title: item.title,
      description,
      tags: item.tags ?? [],
      dateStart: formatDate(item.dateStart),
      dateEnd: formatDate(item.dateEnd),
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-events.json'), entries.filter((item) => item.dateStart !== '1979-01-01'));
}

export function writeEventTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const coll = config.collections.find((c) => c.name === 'event');
  const types = coll.fields.find((f) => f.name === 'type');
  writeMinifiedJSON(join(INDEXES, 'app-event-types.json'), types.options);
}

index('events/**/data.yaml', 'events.json');
writeEventsIndex();
writeEventTypesIndex();
