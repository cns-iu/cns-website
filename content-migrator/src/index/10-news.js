import { join } from 'path';
import { formatDate, formatMarkdownLink, formatUrl, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

function buildDescription(item) {
  const { slug, title, link, date, reporter, publisher, media } = item;
  const linkUrl = formatUrl(slug, 'news', link);
  const mediaEntry = media?.find((m) => m.type !== 'image' && m.url !== link);
  const mediaUrl = mediaEntry ? formatUrl(slug, 'news', mediaEntry.url) : undefined;

  const description = [
    reporter ? [reporter, '. '] : '',
    formatDate(date.split('-')[0]),
    '. “',
    formatMarkdownLink(title, linkUrl),
    '.” ',
    publisher ? ['_', publisher, '_. '] : '',
    mediaUrl ? ['(', formatMarkdownLink('archive', mediaUrl), ')'] : '',
  ];

  return description.flat(10).join('').trim();
}

export function writeNewsIndex() {
  const news = readIndex('news');
  const entries = news.map((item) => {
    if (!item.date) {
      return undefined;
    }

    const { slug, title, link, date, thumbnail, featured, projects, media } = item;
    const image = media?.find((m) => m.type === 'image');

    return {
      slug,
      category: 'news',
      type: 'news',
      title,
      link: formatUrl(slug, 'news', link) ?? undefined,
      dateStart: formatDate(date),
      dateEnd: formatDate(date),
      thumbnail: formatUrl(slug, 'news', thumbnail ?? image?.url),
      description: buildDescription(item),
      featured,
      projects,
    };
  });

  writeMinifiedJSON(
    join(INDEXES, 'app-news.json'),
    entries.filter((item) => !!item),
  );
}

index('news/**/data.yaml', 'news.json');
writeNewsIndex();
