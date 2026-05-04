import { join } from 'path';
import { INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

function reverseDateSort(itemA, itemB) {
  return new Date(itemB.dateEnd) - new Date(itemA.dateEnd);
}

export function writeFeaturedIndex() {
  const news = readIndex('app-news').sort(reverseDateSort);
  const publications = readIndex('app-publications').sort(reverseDateSort);
  const research = readIndex('app-research').sort(reverseDateSort);
  const featured = research.filter((item) => item.featured).sort(reverseDateSort);

  const index = {
    featured: [...featured, ...research].slice(0, 8),
    news: news.slice(0, 8),
    publications: publications.slice(0, 8),
  };

  writeMinifiedJSON(join(INDEXES, 'app-featured.json'), index);
}

writeFeaturedIndex();
