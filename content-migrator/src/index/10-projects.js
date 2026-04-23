import { index } from './utils.js';

index('projects/**/data.yaml', 'projects.json');
index('projects/**/data.yaml', 'app-projects.json', true);
