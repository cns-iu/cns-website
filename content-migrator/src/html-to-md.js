#!/usr/bin/env node

/**
 * CLI tool to convert HTML files to Markdown using Turndown
 *
 * Usage:
 *   node html2md.js input.html output.md
 *
 * If no output file is provided, the Markdown will be printed to stdout.
 */

import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';

// Parse CLI arguments
const [, , inputFile, outputFile] = process.argv;

if (!inputFile) {
  console.error('Usage: html2md <input.html> [output.md]');
  process.exit(1);
}

// Read HTML file
let html;
try {
  html = fs.readFileSync(inputFile, 'utf-8');
} catch (err) {
  console.error(`Error reading file "${inputFile}":`, err.message);
  process.exit(1);
}

// Convert to Markdown
const turndownService = new TurndownService();
const markdown = turndownService.keep(['style', 'script']).turndown(html);

// Write to file or stdout
if (outputFile) {
  try {
    fs.writeFileSync(outputFile, markdown, 'utf-8');
    console.log(`Converted HTML to Markdown: ${path.resolve(outputFile)}`);
  } catch (err) {
    console.error(`Error writing file "${outputFile}":`, err.message);
    process.exit(1);
  }
} else {
  console.log(markdown);
}
