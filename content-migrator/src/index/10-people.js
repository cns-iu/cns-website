import { join } from 'path';
import { BASE_URL, formatDate, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image && !person.image?.startsWith('http')) {
      person.image = `${BASE_URL}/people/${person.slug}/${person.image}`;
    }

    for (const role of person.roles ?? []) {
      role.startDate = formatDate(role.startDate);
      role.endDate = formatDate(role.endDate);
    }
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

index('people/**/data.yaml', 'people.json');
writePeopleIndex();
