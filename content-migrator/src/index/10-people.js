import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image) {
      person.image = `${BASE_URL}/people/${person.slug}/${person.image}`;
    }
    person.dateStart = person.dateStart ? person.dateStart.split('T')[0] : '';
    person.dateEnd = person.dateEnd ? person.dateEnd.split('T')[0] : '';
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

index('people/**/data.yaml', 'people.json');
writePeopleIndex();
