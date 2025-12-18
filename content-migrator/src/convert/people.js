import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { mkdirpSync } from 'mkdirp';
import { join } from 'path';

const STAGING_DIR = 'old-website/staging';
const OUTPUT_DIR = '../content/people';
const IMAGES_DIR = 'old-website/images/people';

const NOIMAGES = new Set(['noimage.png', 'no-image-man.png', 'no-image-woman.png']);

const BASE_JSON = 'people.json';
const ROLE_JSONs = ['members.json', 'students.json', 'collaborators.json'];

function readJson(file, baseDir = STAGING_DIR) {
  const path = join(baseDir, file);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// Read and index people
const people = readJson(BASE_JSON);
const index = people.reduce((acc, person) => {
  // TEMPORARY FIX
  if (person.name == 'Tenzin Choeden') {
    person.lastName = 'Choedin';
  }
  acc[person.slug] = person;
  person.roles = [];
  return acc;
}, {});

// Add roles to each person object
for (const roleFile of ROLE_JSONs) {
  const roles = readJson(roleFile);
  for (const role of roles) {
    const person = index[role.slug];
    person.roles.push(role);
    delete role.slug;
  }
}

// Sort roles by reverse start date
for (const person of people) {
  person.roles.sort((a, b) => b - a);
}

for (const person of people) {
  const personDir = join(OUTPUT_DIR, person.slug);
  mkdirpSync(personDir);

  const image = join(IMAGES_DIR, person.image || 'undefined');
  if (person.image && !NOIMAGES.has(person.image) && existsSync(image)) {
    const destImage = `image.${image.split('.').slice(-1)[0]}`;
    cpSync(image, join(personDir, destImage));
    person.image = destImage;
  } else {
    person.image = undefined;
  }

  writeFileSync(join(personDir, 'data.yaml'), dump(person));
}
