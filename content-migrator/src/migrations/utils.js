import { readFile, writeFile } from 'fs/promises';
import { dump as dumpYaml, load as loadYaml } from 'js-yaml';

export const CONTENT = '../content';

export const undefGen = () => undefined;
export const nullGen = () => null;
export const reqFieldGen = (content, field) => {
  console.error(`${content.slug}: Missing required field: ${field}`);
  return null;
}

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

export async function readYaml(path) {
  return loadYaml(await readFile(path, 'utf8'));
}

export async function writeYaml(path, data) {
  return await writeFile(path, dumpYaml(data), 'utf8');
}
