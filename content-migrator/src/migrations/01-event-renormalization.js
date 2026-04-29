import { globIterate } from 'glob';
import { CONTENT, copyFields, isEmptyObject, nullGen, readYaml, reqFieldGen, undefGen, writeYaml } from './utils.js';

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

const TAG_TO_PROJECT = {
  hra: 'human-reference-atlas',
  amatria: 'amatria',
  'whole-person-physiome': 'whole-person-physiome',
};

function renormalizeLocation(content) {
  if (typeof content.location === 'object' && content.location !== null) {
    return content.location;
  }

  const result = {};
  copyFields(content, result, LOCATION_FIELDS, DEFAULT_LOCATION_FIELD_VALUE_GENERATORS);

  if (isEmptyObject(result) && content.location) {
    // Too many different formats to parse. Move to `raw` and let AI fix it later...
    result.raw = content.location;
  }

  return !isEmptyObject(result) ? result : undefined;
}

function renormalizeProjects(content) {
  // Map tags to projects if not already listed
  const projects = [...(content.projects ?? [])];
  for (const tag of content.tags ?? []) {
    if (tag in TAG_TO_PROJECT && !projects.includes(TAG_TO_PROJECT[tag])) {
      projects.push(TAG_TO_PROJECT[tag]);
    }
  }

  return projects.length > 0 ? projects : undefined;
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
  
    copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);
  
    result.dateStart = content.dateStart || null;
    result.dateEnd = content.dateEnd || null;
    result.location = renormalizeLocation(content);
    result.projects = renormalizeProjects(content);
    result.media = renormalizeMedia(content);
  
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
