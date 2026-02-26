import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

const PEOPLE_FIELDS = ['organizers', 'attendees', 'presenters', 'instructors'];

export function writeEventsIndex() {
  const events = readIndex('events');
  const peopleLookup = readIndex('people').reduce((acc, item) => ((acc[item.slug] = item), acc), {});
  const entries = events.map((item) => {
    if (item.image) {
      item.image = `${BASE_URL}/events/${item.slug}/${item.image}`;
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
      item.dateStart !== '1979-01-01' ? `${item.dateStart.split('-')[0].split('T')[0]}\\.` : '',
      item.link ? `“[${item.title}](${item.link}).”` : `“${item.title}.”`,
      item.description,
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
      dateStart: item.dateStart,
      dateEnd: item.dateEnd,
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-events.json'), entries.filter((item) => item.dateStart !== '1979-01-01'));
}

export function writeEventTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const coll = config.collections.find((c) => c.name === 'events');
  const types = coll.fields.find((f) => f.name === 'type');
  writeMinifiedJSON(join(INDEXES, 'app-event-types.json'), types.options);
}

index('events/**/data.yaml', 'events.json');
writeEventsIndex();
writeEventTypesIndex();
