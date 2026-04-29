import { globIterate } from 'glob';
import {
  CONTENT,
  copyFields,
  deleteEmptyFields,
  normalizeOptionalString,
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
  title: reqFieldGen,
  date: reqFieldGen,
  link: reqFieldGen,
  thumbnail: undefGen,
  authors: undefGen,
  description: undefGen,
  featured: undefGen,
  projects: undefGen,
  media: undefGen,
};

const FIELDS = Object.keys(DEFAULT_FIELD_VALUE_GENERATORS);

function renormalizeMediaType(mediaType) {
  if (mediaType === 'document') {
    return 'pdf';
  }

  return mediaType ?? 'other';
}

function renormalizeMedia(content) {
  const mediaType = renormalizeMediaType(content.mediaType);
  const mediaUrl = normalizeOptionalString(content.mediaUrl);
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

    copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);

    result.featured ??= content.tags?.includes('featured') || undefined;
    result.projects = renormalizeProjects(content);
    result.media = renormalizeMedia(content);

    deleteEmptyFields(result, ['authors', 'projects', 'media']);

    await writeYaml(path, result);
  } catch (error) {
    console.error(`Error processing ${path}:`, error);
  }
}

async function migrate() {
  const promises = [];
  for await (const path of globIterate(`${CONTENT}/visualizations/*/data.yaml`)) {
    promises.push(renormalize(path));
  }

  await Promise.all(promises);
}

// Run the migration
await migrate();