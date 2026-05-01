import { join } from 'path';
import {
  formatDate,
  formatMarkdownLink,
  formatUrl,
  index,
  INDEXES,
  readIndex,
  removeNullishProps,
  writeMinifiedJSON,
} from './utils.js';

function buildDescription(item) {
  const { slug, title, link, date, description: itemDescription } = item;
  const linkUrl = formatUrl(slug, 'visualizations', link);
  const description = [
    formatDate(date.split('-')[0]),
    '. “',
    formatMarkdownLink(title, linkUrl),
    '.” ',
    itemDescription,
  ];

  return description.flat(10).join('').trim();
}

export function writeVisualizationsIndex() {
  const visualizations = readIndex('visualizations');
  const entries = visualizations.map((item) => {
    if (!item.date) {
      return undefined;
    }

    const { slug, title, link, date, thumbnail, people, featured, projects } = item;

    return removeNullishProps({
      slug,
      category: 'visualization',
      type: 'visualization',
      title,
      link: formatUrl(slug, 'visualizations', link),
      dateStart: formatDate(date),
      dateEnd: formatDate(date),
      thumbnail: formatUrl(slug, 'visualizations', thumbnail),
      description: buildDescription(item),
      people,
      featured,
      projects,
    });
  });

  writeMinifiedJSON(
    join(INDEXES, 'app-visualizations.json'),
    entries.filter((item) => !!item),
  );
}

index('visualizations/**/data.yaml', 'visualizations.json');
writeVisualizationsIndex();
