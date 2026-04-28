import { globIterate } from 'glob';
import { CONTENT, copyFields, DEFAULT_DATE, isEmpty, readYaml, writeYaml } from './utils.js';

const DEFAULT_FIELD_VALUE_GENERATORS = {
  slug: () => {
    throw new Error('Missing required field: slug');
  },
  type: () => {
    throw new Error('Missing required field: type');
  },
  title: () => {
    throw new Error('Missing required field: title');
  },
  link: () => null,
  dateStart: () => DEFAULT_DATE,
  dateEnd: () => null,
  thumbnail: () => null,
  location: () => null,
  presenters: () => [],
  instructors: () => [],
  organizers: () => [],
  attendees: () => [],
  featured: () => false,
  projects: () => [],
  media: () => [],
};

const DEFAULT_LOCATION_FIELD_VALUE_GENERATORS = {
  venue: () => undefined,
  street: () => undefined,
  city: () => undefined,
  state: () => undefined,
  postcode: () => undefined,
  country: () => undefined,
};

const FIELDS = Object.keys(DEFAULT_FIELD_VALUE_GENERATORS);
const LOCATION_FIELDS = Object.keys(DEFAULT_LOCATION_FIELD_VALUE_GENERATORS);

const TAG_TO_PROJECT = {
  hra: 'human-reference-atlas',
  amatria: 'amatria',
  'whole-person-physiome': 'whole-person-physiome',
};

function renormalizeDate(content, field, defaultValue = DEFAULT_DATE) {
  return content[field] || defaultValue;
}

function renormalizeLocation(content) {
  const result = {};
  copyFields(content, result, LOCATION_FIELDS, DEFAULT_LOCATION_FIELD_VALUE_GENERATORS);

  if (isEmpty(result) && content.location) {
    // Too many different formats to parse. Move to `raw` and let AI fix it later...
    result.raw = content.location;
  }

  return !isEmpty(result) ? result : null;
}

function renormalizeProjects(content) {
  // Map tags to projects if not already listed
  const projects = [...(content.projects ?? [])];
  for (const tag of content.tags ?? []) {
    if (tag in TAG_TO_PROJECT && !projects.includes(TAG_TO_PROJECT[tag])) {
      projects.push(TAG_TO_PROJECT[tag]);
    }
  }

  return projects;
}

function renormalizeMedia(content) {
  const { mediaUrl, mediaType } = content;
  const media = [...(content.media ?? [])];
  if (mediaUrl && mediaUrl !== content.link && mediaUrl !== content.thumbnail) {
    media.push({
      type: mediaType,
      url: mediaUrl,
    });
  }

  return media;
}

async function renormalize(path) {
  const content = await readYaml(path);
  const result = {};

  copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);

  result.dateStart = renormalizeDate(content, 'dateStart');
  result.dateEnd = renormalizeDate(content, 'dateEnd', result.dateStart);
  result.location = renormalizeLocation(content);
  result.projects = renormalizeProjects(content);
  result.media = renormalizeMedia(content);

  await writeYaml(path, result);
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
