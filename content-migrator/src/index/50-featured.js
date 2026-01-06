import { join } from 'path';
import { INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

function reverseDateSort(itemA, itemB) {
  return new Date(itemB.dateEnd) - new Date(itemA.dateEnd);
}

export function writeFeaturedIndex() {
  const news = readIndex('app-news').sort(reverseDateSort);
  const publications = readIndex('app-publications').sort(reverseDateSort);
  const featured = [...news, ...publications].filter((item) => item.tags?.includes('featured')).sort(reverseDateSort);

  const index = {
    featured,
    news: news.slice(0, 8),
    publications: publications.slice(0, 8),
  };

  // If less than 8 featured items, fill up with recent news and pubs
  if (featured.length < 8) {
    const candidates = [...index.news, ...index.publications].sort(reverseDateSort);
    index.featured = [...index.featured, ...candidates].slice(0, 8);
  }

  writeMinifiedJSON(join(INDEXES, 'app-featured.json'), index);
}

writeFeaturedIndex();
