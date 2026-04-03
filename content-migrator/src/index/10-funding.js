import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import { join } from 'path';
import { BASE_URL, formatDate, index, INDEXES, readIndex, writeMinifiedJSON } from './utils.js';

export function writeFundingIndex() {
  const funding = readIndex('funding');
  const peopleLookup = readIndex('people').reduce((acc, item) => ((acc[item.slug] = item), acc), {});
  const entries = funding.map((item) => {
    item.category = 'funding';
    if (item.mediaUrl && !item.mediaUrl?.startsWith('http')) {
      item.image = `${BASE_URL}/funding/${item.slug}/${item.mediaUrl}`;
    }

    const addAndIndex = item.investigators.length > 1 ? item.investigators.length - 1 : -1;
    const peopleString = item.investigators
      .map((person, index) => (index === addAndIndex ? 'and ' : '') + (peopleLookup[person]?.name ?? person))
      .join(', ')
      .trim();

    const description = [
      item.link ? `“[**${item.title}**](${item.link.replaceAll(' ', '%20')}).”` : `“**${item.title}**.”`,
      item.name ? `${item.name}` : '',
      `(${peopleString}${item.amount ? ', \$' + Number(item.amount).toLocaleString() : ''})`,
      `${formatDate(item.dateStart.replaceAll('-', '.'))} - ${formatDate(item.dateEnd.replaceAll('-', '.'))}.`,
    ]
      .filter((s) => s?.trim().length > 0)
      .join(' ');

    return {
      slug: item.slug,
      category: 'funding',
      type: item.type || 'funding',
      people: item.investigators || [],
      image: item.image,
      link: item.link,
      title: item.title,
      description,
      tags: item.tags ?? [],
      dateStart: formatDate(item.dateStart),
      dateEnd: formatDate(item.dateEnd),
    };
  });
  writeMinifiedJSON(join(INDEXES, 'app-funding.json'), entries);
}

export function writeFundingTypesIndex() {
  const config = YAML.load(readFileSync('../admin/config.yml', 'utf-8'));
  const coll = config.collections.find((c) => c.name === 'funding');
  const types = coll.fields.find((f) => f.name === 'type');
  writeMinifiedJSON(join(INDEXES, 'app-funding-types.json'), types.options);
}

index('funding/**/data.yaml', 'funding.json');
writeFundingIndex();
writeFundingTypesIndex();
