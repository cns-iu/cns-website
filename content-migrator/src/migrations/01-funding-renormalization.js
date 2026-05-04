import { globIterate } from 'glob';
import {
  CONTENT,
  copyFields,
  deleteEmptyFields,
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
