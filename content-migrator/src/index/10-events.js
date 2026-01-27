import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writeEventsIndex() {
  const events = readIndex('events');
  for (const event of events) {
    if (event.image) {
      event.image = `${BASE_URL}/events/${event.slug}/${event.image}`;
    }
    event.links = event.links?.filter((e) => e?.trim().length > 0) ?? [];
  }
  writeMinifiedJSON(join(INDEXES, 'app-events.json'), events);
}

index('events/**/data.yaml', 'events.json');
writeEventsIndex();
