import { join } from 'path';
import { INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

const DB_ITEMS = ['app-events', 'app-funding', 'app-news', 'app-publications', 'app-visualizations'];

function reverseDateSort(itemA, itemB) {
  return new Date(itemB.dateEnd) - new Date(itemA.dateEnd);
}

export function writeResearchIndex() {
  const db = DB_ITEMS.map(readIndex).flat().sort(reverseDateSort);
  writeMinifiedJSON(join(INDEXES, 'app-research.json'), db);
}

writeResearchIndex();
