import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image) {
      person.image = `${BASE_URL}/people/${person.slug}/${person.image}`;
    }
    for (const role of person?.roles ?? []) {
      role.dateStart = role.dateStart ? role.dateStart.split('T')[0] : '';
      role.dateEnd = role.dateEnd ? role.dateEnd.split('T')[0] : '';
    }
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

index('people/**/data.yaml', 'people.json');
writePeopleIndex();
