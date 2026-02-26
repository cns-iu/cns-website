import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image) {
      person.image = `${BASE_URL}/people/${person.slug}/${person.image}`;
    }
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

index('people/**/data.yaml', 'people.json');
writePeopleIndex();
