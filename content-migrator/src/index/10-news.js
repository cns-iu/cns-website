import { join } from 'path';
import { BASE_URL, formatDate, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png']);
function isImageUrl(url) {
  const extension = url?.split('.').slice(-1)[0].toLowerCase();
  return IMAGE_EXTENSIONS.has(extension);
}

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
      `${formatDate(item.date.split('-')[0])}\\.`,
      item.link ? `“[${item.title}](${item.link.replaceAll(' ', '%20')}).”` : `“${item.title}.”`,
      item.publisher ? `_${item.publisher}_.` : '',
      item.mediaType?.toLowerCase() !== 'image' && item.mediaUrl !== item.link ? `([archive](${item.mediaUrl}))` : '',
    ]
      .filter((s) => s?.trim().length > 0)
      .join(' ');

    return {
      slug: item.slug,
      category: 'news',
      type: 'news',
      people: item.people || [],
      image: item.mediaUrl && item.mediaType?.toLowerCase() === 'image' && isImageUrl(item.mediaUrl) ? item.mediaUrl : undefined,
      link: item.link,
      title: item.title,
      description,
      tags: item.tags ?? [],
      dateStart: formatDate(item.date),
      dateEnd: formatDate(item.date),
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-news.json'), entries);
}

index('news/**/data.yaml', 'news.json');
writeNewsIndex();
