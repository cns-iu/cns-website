import { join } from 'path';
import { BASE_URL, formatDate, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writePeopleIndex() {
  const people = readIndex('people');
  for (const person of people) {
    if (person.image && !person.image?.startsWith('http')) {
      person.image = `${BASE_URL}/people/${person.slug}/${person.image}`;
    }

    person.roles ??= [];
    for (const role of person.roles) {
      role.dateStart = formatDate(role.dateStart);
      role.dateEnd = formatDate(role.dateEnd);

      if ('displayOrder' in role && role.displayOrder === undefined) {
        delete role.displayOrder;
      }
    }
  }
  writeMinifiedJSON(join(INDEXES, 'app-people.json'), people);
}

index('people/**/data.yaml', 'people.json');
writePeopleIndex();
