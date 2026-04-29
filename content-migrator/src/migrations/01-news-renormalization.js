import { globIterate } from 'glob';
import {
  CONTENT,
  copyFields,
  deleteEmptyFields,
  readYaml,
  renormalizeProjects,
  reqFieldGen,
  undefGen,
  writeYaml,
} from './utils.js';

const MEDIA_BASE_URL = 'https://cns.iu.edu/docs/news/';

const DEFAULT_FIELD_VALUE_GENERATORS = {
  slug: () => {
    throw new Error('Missing required field: slug');
  },
  title: reqFieldGen,
  date: reqFieldGen,
  link: reqFieldGen,
  thumbnail: undefGen,
  featured: undefGen,
  projects: undefGen,
  description: undefGen,
  publisher: undefGen,
  reporter: undefGen,
  media: undefGen,
};

const FIELDS = Object.keys(DEFAULT_FIELD_VALUE_GENERATORS);

function normalizeOptionalString(value) {
  return typeof value === 'string' && value.trim() === '' ? undefined : value;
}

function renormalizeMediaType(mediaType) {
  if (mediaType === 'document') {
    return 'pdf';
  }

  return mediaType ?? 'other';
}

function fixMediaUrl(url) {
  // Fix media URLs that were incorrectly prefixed with the MEDIA_BASE_URL twice
  if (url && url.startsWith(MEDIA_BASE_URL + MEDIA_BASE_URL)) {
    return url.slice(MEDIA_BASE_URL.length);
  }

  return url;
}

function renormalizeMedia(content) {
  const mediaType = renormalizeMediaType(content.mediaType);
  const mediaUrl = fixMediaUrl(normalizeOptionalString(content.mediaUrl));
  const description = normalizeOptionalString(content.caption);
  const media = [...(content.media ?? [])];

  if (mediaUrl && ((mediaUrl !== content.link && mediaUrl !== content.thumbnail) || description !== undefined)) {
    media.push({
      type: mediaType,
      url: mediaUrl,
      description,
    });
  }

  return media.length > 0 ? media : undefined;
}

async function renormalize(path) {
  try {
    const content = await readYaml(path);
    const result = {};

    // Treat empty strings as missing values for optional strings and required link.
    content.link = normalizeOptionalString(content.link);
    content.description = normalizeOptionalString(content.description);
    content.publisher = normalizeOptionalString(content.publisher);
    content.reporter = normalizeOptionalString(content.reporter);

    copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);

    result.featured ??= content.tags?.includes('featured') || undefined;
    result.projects = renormalizeProjects(content);
    result.media = renormalizeMedia(content);

    deleteEmptyFields(result, ['projects', 'media']);

    await writeYaml(path, result);
  } catch (error) {
    console.error(`Error processing ${path}:`, error);
  }
}

async function migrate() {
  const promises = [];
  for await (const path of globIterate(`${CONTENT}/news/*/data.yaml`)) {
    promises.push(renormalize(path));
  }

  await Promise.all(promises);
}

// Run the migration
await migrate();
