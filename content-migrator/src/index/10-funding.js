import { join } from 'path';
import { BASE_URL, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writeFundingIndex() {
  const funding = readIndex('funding');
  const peopleLookup = readIndex('people').reduce((acc, item) => ((acc[item.slug] = item), acc), {});
  const entries = funding.map((item) => {
    item.category = 'funding';
    if (item.image && !item.image.startsWith('http')) {
      item.image = `${BASE_URL}/funding/${item.slug}/${item.image}`;
    }

    const addAndIndex = item.investigators.length > 1 ? item.investigators.length - 1 : -1;
    const peopleString = item.investigators
      .map((person, index) => (index === addAndIndex ? 'and ' : '') + (peopleLookup[person]?.name ?? person))
      .join(', ')
      .trim();

    const description = [
      item.link ? `“[**${item.title}**](${item.link}).”` : `**${item.title}**.`,
      item.name ? `${item.name}` : '',
      `(${peopleString}${item.amount ? ', \$' + Number(item.amount).toLocaleString() : ''})`,
      `${item.dateStart.replaceAll('-', '.')} - ${item.dateEnd.replaceAll('-', '.')}.`,
    ]
      .filter((s) => s?.trim().length > 0)
      .join(' ');

    return {
      slug: item.slug,
      category: 'funding',
      type: item.type || 'funding',
      people: item.investigators || [],
      link: item.link,
      title: item.title,
      description,
      tags: item.tags ?? [],
      dateStart: item.dateStart,
      dateEnd: item.dateEnd,
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-funding.json'), entries);
}

index('funding/**/data.yaml', 'funding.json');
writeFundingIndex();
