import { readFile, writeFile } from 'fs/promises';
import { dump as dumpYaml, load as loadYaml } from 'js-yaml';

export const CONTENT = '../content';
export const TAG_TO_PROJECT = {
  hra: 'human-reference-atlas',
  amatria: 'amatria',
  'whole-person-physiome': 'whole-person-physiome',
};

export const undefGen = () => undefined;
export const nullGen = () => null;
export const reqFieldGen = (content, field) => {
  console.error(`${content.slug}: Missing required field: ${field}`);
  return null;
};

export function isEmptyObject(object) {
  return Object.keys(object).length === 0;
}

export function copyFields(source, target, fields, defaultGenerators) {
  for (const field of fields) {
    const value = source[field] ?? defaultGenerators[field](source, field);
    if (value !== undefined) {
      target[field] = value;
    }
  }
}

export function deleteEmptyFields(object, fields) {
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

export function renormalizeProjects(content) {
  // Map tags to projects if not already listed
  const projects = [...(content.projects ?? [])];
  for (const tag of content.tags ?? []) {
    if (tag in TAG_TO_PROJECT && !projects.includes(TAG_TO_PROJECT[tag])) {
      projects.push(TAG_TO_PROJECT[tag]);
    }
  }

  return projects.length > 0 ? projects : undefined;
}

export function normalizeOptionalString(value) {
  return typeof value === 'string' && value.trim() === '' ? undefined : value;
}

export function normalizeStringFields(content, fields) {
  for (const field of fields) {
    content[field] = normalizeOptionalString(content[field]);
  }
}

export async function readYaml(path) {
  return loadYaml(await readFile(path, 'utf8'));
}

export async function writeYaml(path, data) {
  return await writeFile(path, dumpYaml(data), 'utf8');
}

const FIX_CACHE = new Map();

export async function tryFixBadMediaUrl(url, type, subdir) {
  const BASE_URL = 'https://cns.iu.edu/docs/';
  if (typeof url !== 'string') {
    return undefined;
  }

  let fullUrl = url;
  if (!fullUrl.startsWith('http')) {
    fullUrl = `${BASE_URL}${subdir}/${url}`;
  }

  if (!fullUrl.startsWith(BASE_URL) || !fullUrl.endsWith('.html')) {
    return { url, type };
  }

  if (FIX_CACHE.has(fullUrl)) {
    return { type, ...FIX_CACHE.get(fullUrl) };
  }

  try {
    const response = await fetch(fullUrl, { method: 'HEAD' });
    if (response.ok) {
      FIX_CACHE.set(fullUrl, { url: fullUrl });
      return { url: fullUrl, type };
    }

    fullUrl = fullUrl.replace(/\.html$/, '.pdf');
    const pdfResponse = await fetch(fullUrl, { method: 'HEAD' });
    if (pdfResponse.ok) {
      FIX_CACHE.set(fullUrl, { url: fullUrl, type: 'pdf' });
      return { url: fullUrl, type: 'pdf' };
    }
  } catch (error) {
    console.error('Failure when trying to fix media URL:', url, error);
  }

  FIX_CACHE.set(url, { url });
  return { url, type };
}
