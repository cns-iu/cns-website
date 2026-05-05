import { globIterate } from 'glob';
import {
  CONTENT,
  copyFields,
  deleteEmptyFields,
  linkTypeFromUrl,
  normalizeOptionalString,
  normalizeStringFields,
  readYaml,
  renormalizeProjects,
  reqFieldGen,
  undefGen,
  writeYaml,
} from './utils.js';

const DEFAULT_FIELD_VALUE_GENERATORS = {
  slug: () => {
    throw new Error('Missing required field: slug');
  },
  type: reqFieldGen,
  title: reqFieldGen,
  date: reqFieldGen,
  doi: undefGen,
  authors: undefGen,
  editors: undefGen,
  thumbnail: undefGen,
  pmid: undefGen,
  publisher: undefGen,
  venue: undefGen,
  volume: undefGen,
  issue: undefGen,
  pages: undefGen,
  chapter: undefGen,
  featured: undefGen,
  projects: undefGen,
  media: undefGen,
};

const FIELDS = Object.keys(DEFAULT_FIELD_VALUE_GENERATORS);

function normalizeLinkList(content) {
  const links = content.links ?? [];
  const doi = normalizeOptionalString(content.doi);
  const canonicalDoiLink = doi ? `https://doi.org/${doi}` : undefined;
  const seen = new Set();
  const result = [];

  if (canonicalDoiLink) {
    seen.add(canonicalDoiLink);
  }

  for (const rawLink of links) {
    const link = normalizeOptionalString(rawLink)?.trim();
    if (!link || seen.has(link)) {
      continue;
    }

    seen.add(link);
    result.push(link);
  }

  return result;
}

function renormalizeMedia(content) {
  const media = [...(content.media ?? [])];
  const seenUrls = new Set(media.map((item) => item.url));

  const mediaUrl = normalizeOptionalString(content.mediaUrl);
  if (mediaUrl && mediaUrl !== content.thumbnail && !seenUrls.has(mediaUrl)) {
    seenUrls.add(mediaUrl);
    media.push({
      type: linkTypeFromUrl(mediaUrl),
      url: mediaUrl,
    });
  }

  for (const link of normalizeLinkList(content)) {
    if (seenUrls.has(link)) {
      continue;
    }

    seenUrls.add(link);
    media.push({
      type: linkTypeFromUrl(link),
      url: link,
    });
  }

  return media.length > 0 ? media : undefined;
}

async function renormalize(path) {
  try {
    const content = await readYaml(path);
    const result = {};

    normalizeStringFields(content, ['doi', 'pmid', 'publisher', 'venue', 'volume', 'issue', 'pages', 'chapter']);
    copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);

    result.featured ??= content.tags?.includes('featured') || undefined;
    result.projects = renormalizeProjects(content);
    result.media = renormalizeMedia(content);

    deleteEmptyFields(result, ['authors', 'editors', 'projects', 'media']);

    await writeYaml(path, result);
  } catch (error) {
    console.error(`Error processing ${path}:`, error);
  }
}

async function migrate() {
  const promises = [];
  for await (const path of globIterate(`${CONTENT}/publications/*/data.yaml`)) {
    promises.push(renormalize(path));
  }

  await Promise.all(promises);
}

// Run the migration
await migrate();
