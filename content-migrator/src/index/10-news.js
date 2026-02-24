import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writeNewsIndex() {
  const news = readIndex('news');
  const entries = news.map((item) => {
    if (item.mediaUrl && !item.mediaUrl?.startsWith('http')) {
      item.mediaUrl = `${BASE_URL}/news/${item.slug}/${item.mediaUrl}`;
    }
    if (item.link && !item.link?.startsWith('http')) {
      item.link = `${BASE_URL}/news/${item.slug}/${item.link}`;
    }

    const description = [
      item.reporter ? `${item.reporter}.` : '',
      `${item.date.split('-')[0]}\\.`,
      item.link ? `“[${item.title}](${item.link}).”` : item.title,
      item.publisher ? `_${item.publisher}_.` : '',
      item.mediaType !== 'IMAGE' && item.mediaUrl !== item.link ? `([archive](${item.mediaUrl}))` : '',
    ]
      .filter((s) => s?.trim().length > 0)
      .join(' ');

    return {
      slug: item.slug,
      category: 'news',
      type: 'news',
      people: item.people || [],
      image: item.mediaUrl && item.mediaType === 'IMAGE' ? item.mediaUrl : undefined,
      link: item.link,
      title: item.title,
      description,
      tags: item.tags ?? [],
      dateStart: item.date,
      dateEnd: item.date,
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-news.json'), entries);
}

index('news/**/data.yaml', 'news.json');
writeNewsIndex();
