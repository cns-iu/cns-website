import { index } from './utils.js';

index('tags/**/data.yaml', 'tags.json');
index('tags/**/data.yaml', 'app-tags.json', true);
