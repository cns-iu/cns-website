import { customAlphabet } from 'nanoid';

const NANOID_SIZE = 21;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
export const nanoid = customAlphabet(ALPHABET, NANOID_SIZE);
