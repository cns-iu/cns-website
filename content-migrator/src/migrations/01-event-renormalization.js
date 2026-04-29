import { globIterate } from 'glob';
import {
  CONTENT,
  copyFields,
  deleteEmptyFields,
  isEmptyObject,
  normalizeOptionalString,
  nullGen,
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
  link: reqFieldGen,
  dateStart: nullGen,
  dateEnd: nullGen,
  thumbnail: undefGen,
  location: undefGen,
  presenters: undefGen,
  instructors: undefGen,
  organizers: undefGen,
  attendees: undefGen,
  presentations: undefGen,
  event: undefGen,
  featured: undefGen,
  projects: undefGen,
  media: undefGen,
};

const DEFAULT_LOCATION_FIELD_VALUE_GENERATORS = {
  venue: undefGen,
  street: undefGen,
  city: undefGen,
  state: undefGen,
  postcode: undefGen,
  country: undefGen,
};

const FIELDS = Object.keys(DEFAULT_FIELD_VALUE_GENERATORS);
const LOCATION_FIELDS = Object.keys(DEFAULT_LOCATION_FIELD_VALUE_GENERATORS);

function renormalizeLocation(content) {
  if (typeof content.location === 'object' && content.location !== null) {
    return content.location;
  }

  const result = {};
  copyFields(content, result, LOCATION_FIELDS, DEFAULT_LOCATION_FIELD_VALUE_GENERATORS);

  if (content.location) {
    // Too many different formats to parse. Move to `raw` and fix it later...
    result.raw = content.location;
  }

  return !isEmptyObject(result) ? result : undefined;
}

function renormalizeMedia(content) {
  const { mediaUrl, mediaType } = content;
  const media = [...(content.media ?? [])];
  if (mediaUrl && mediaUrl !== content.link && mediaUrl !== content.thumbnail) {
    media.push({
      type: mediaType ?? 'other',
      url: mediaUrl,
    });
  }

  return media.length > 0 ? media : undefined;
}

async function renormalize(path) {
  try {
    const content = await readYaml(path);
    const result = {};

    // Treat the empty string for link as a missing value
    content.link = normalizeOptionalString(content.link);

    copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);

    result.dateStart = content.dateStart || null;
    result.dateEnd = content.dateEnd || null;
    result.location = renormalizeLocation(content);
    result.projects = renormalizeProjects(content);
    result.media = renormalizeMedia(content);

    deleteEmptyFields(result, [
      'location',
      'presenters',
      'instructors',
      'organizers',
      'attendees',
      'presentations',
      'projects',
      'media',
    ]);

    await writeYaml(path, result);
  } catch (error) {
    console.error(`Error processing ${path}:`, error);
  }
}

async function migrate() {
  const promises = [];
  for await (const path of globIterate(`${CONTENT}/events/*/data.yaml`)) {
    promises.push(renormalize(path));
  }

  await Promise.all(promises);
}

// Run the migration
await migrate();
