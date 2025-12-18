import { default as scopedSlugify } from 'slugify';

export function slugify(str) {
  return str == null ? null : scopedSlugify(String(str), { lower: true, strict: true });
}
