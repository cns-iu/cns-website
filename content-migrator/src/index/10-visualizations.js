import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writeVisualizationsIndex() {
  const visualizations = readIndex('visualizations');
  const entries = visualizations.map((item) => {
    item.category = 'visualizations';
    if (item.image && !item.image.startsWith('http')) {
      item.image = `${BASE_URL}/visualizations/${item.slug}/${item.image}`;
    }

    const description = [
      item.date !== '1979-01-01' ? `${item.date.split('-')[0]}.` : '',
      item.link ? `“[${item.title}](${item.link}).”` : item.title,
      item.description,
    ]
      .filter((s) => s?.trim().length > 0)
      .join(' ');

    return {
      slug: item.slug,
      category: 'visualization',
      type: 'visualization',
      people: item.authors || [],
      image: item.mediaUrl && item.mediaType === 'image' ? item.mediaUrl : undefined,
      link: item.link,
      title: item.title,
      description,
      tags: item.tags ?? [],
      dateStart: item.date,
      dateEnd: item.date,
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-visualizations.json'), entries);
}

index('visualizations/**/data.yaml', 'visualizations.json');
writeVisualizationsIndex();
