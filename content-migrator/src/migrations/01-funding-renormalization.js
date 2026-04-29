import { globIterate } from 'glob';
import { CONTENT, copyFields, isEmptyObject, nullGen, readYaml, reqFieldGen, undefGen, writeYaml } from './utils.js';

const DEFAULT_FIELD_VALUE_GENERATORS = {
  slug: () => {
    throw new Error('Missing required field: slug');
  },
  type: reqFieldGen,
  title: reqFieldGen,
  name: reqFieldGen,
  funder: reqFieldGen,
  amount: reqFieldGen,
  dateStart: nullGen,
  dateEnd: nullGen,
  thumbnail: undefGen,
  link: undefGen,
  featured: undefGen,
  projects: undefGen,
  investigators: undefGen,
  receivedAmount: undefGen,
};

const FIELDS = Object.keys(DEFAULT_FIELD_VALUE_GENERATORS);

const TAG_TO_PROJECT = {
  hra: 'human-reference-atlas',
  amatria: 'amatria',
  'whole-person-physiome': 'whole-person-physiome',
};

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

function deleteEmptyFields(object, fields) {
  for (const field of fields) {
    const value = object[field];
    if (typeof value !== 'object' || value === null) {
      continue;
    }

    if ((Array.isArray(value) && value.length === 0) || (!Array.isArray(value) && isEmptyObject(value))) {
      delete object[field];
    }
  }
}

async function renormalize(path) {
  try {
    const content = await readYaml(path);
    const result = {};

    copyFields(content, result, FIELDS, DEFAULT_FIELD_VALUE_GENERATORS);

    result.dateStart = content.dateStart || null;
    result.dateEnd = content.dateEnd || null;
    result.featured ??= content.tags?.includes('featured') || undefined;
    result.projects = renormalizeProjects(content);

    deleteEmptyFields(result, ['investigators', 'projects']);

    await writeYaml(path, result);
  } catch (error) {
    console.error(`Error processing ${path}:`, error);
  }
}

async function migrate() {
  const promises = [];
  for await (const path of globIterate(`${CONTENT}/funding/*/data.yaml`)) {
    promises.push(renormalize(path));
  }

  await Promise.all(promises);
}

// Run the migration
await migrate();
