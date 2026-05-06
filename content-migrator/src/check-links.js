import { readFile } from 'fs/promises';
import { Command } from 'commander';
import { globIterate } from 'glob';

const URL_REGEX = /https?:\/\/[^\s"'<>()[\]{}]+/gi;
const MARKDOWN_LINK_REGEX = /\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/gi;

function trimTrailingPunctuation(url) {
  return url.replace(/[.,;:!?]+$/g, '');
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split('\n').length;
}

function collectUrlsFromText(text, filePath, urlMap) {
  const links = [];
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  URL_REGEX.lastIndex = 0;

  let markdownMatch;
  while ((markdownMatch = MARKDOWN_LINK_REGEX.exec(text)) !== null) {
    links.push({ url: trimTrailingPunctuation(markdownMatch[1]), index: markdownMatch.index });
  }

  let urlMatch;
  while ((urlMatch = URL_REGEX.exec(text)) !== null) {
    links.push({ url: trimTrailingPunctuation(urlMatch[0]), index: urlMatch.index });
  }

  for (const link of links) {
    if (!urlMap.has(link.url)) {
      urlMap.set(link.url, []);
    }

    const occurrences = urlMap.get(link.url);
    if (occurrences.length < 5) {
      occurrences.push({
        file: filePath,
        line: lineNumberForIndex(text, link.index),
      });
    }
  }
}

async function collectUrls(contentGlob) {
  const urlMap = new Map();
  const files = [];

  for await (const filePath of globIterate(contentGlob)) {
    files.push(filePath);

    try {
      const content = await readFile(filePath, 'utf8');
      collectUrlsFromText(content, filePath, urlMap);
    } catch (error) {
      console.error(`Failed to read ${filePath}: ${error.message}`);
    }
  }

  return { urlMap, files };
}

async function runFetch(url, timeoutSeconds) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutSeconds * 1000);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });

    return {
      url,
      exitCode: 0,
      statusCode: response.status,
      error: '',
    };
  } catch (error) {
    return {
      url,
      exitCode: 1,
      statusCode: null,
      error: error?.message ?? String(error),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function validateUrl(url, timeoutSeconds, retries) {
  let attempt = 0;
  let lastResult = null;

  while (attempt <= retries) {
    attempt += 1;
    lastResult = await runFetch(url, timeoutSeconds);

    if (lastResult.exitCode === 0) {
      return { ...lastResult, attempts: attempt };
    }
  }

  return { ...lastResult, attempts: attempt };
}

function isValidStatus(statusCode) {
  return statusCode !== null && statusCode >= 200 && statusCode < 400;
}

function isRestrictedStatus(statusCode) {
  return statusCode === 401 || statusCode === 403;
}

async function checkUrls(urls, options) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < urls.length) {
      const currentIndex = index;
      index += 1;

      const url = urls[currentIndex];
      const result = await validateUrl(url, options.timeout, options.retries);
      results[currentIndex] = result;

      if (options.verbose) {
        const statusLabel = result.statusCode ?? 'n/a';
        const exitLabel = result.exitCode;
        console.log(`[${currentIndex + 1}/${urls.length}] ${statusLabel} (code ${exitLabel}) ${url}`);
      }
    }
  }

  const workerCount = Math.min(options.concurrency, Math.max(1, urls.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}

function printResultSummary(results, urlMap) {
  const valid = [];
  const restricted = [];
  const invalid = [];

  for (const result of results) {
    if (result.exitCode === 0 && isValidStatus(result.statusCode)) {
      valid.push(result);
      continue;
    }

    if (result.exitCode === 0 && isRestrictedStatus(result.statusCode)) {
      restricted.push(result);
      continue;
    }

    invalid.push(result);
  }

  console.log('');
  console.log(`Total URLs checked: ${results.length}`);
  console.log(`Valid (2xx/3xx): ${valid.length}`);
  console.log(`Restricted (401/403): ${restricted.length}`);
  console.log(`Invalid/Error: ${invalid.length}`);

  if (restricted.length > 0) {
    console.log('');
    console.log('Restricted URLs:');
    for (const result of restricted) {
      console.log(`- ${result.statusCode} ${result.url}`);
      for (const location of urlMap.get(result.url) ?? []) {
        console.log(`  at ${location.file}:${location.line}`);
      }
    }
  }

  if (invalid.length > 0) {
    console.log('');
    console.log('Invalid URLs:');
    for (const result of invalid) {
      const status = result.statusCode ?? 'n/a';
      const errorSuffix = result.error ? ` (${result.error})` : '';
      console.log(`- status=${status}, exit=${result.exitCode}, attempts=${result.attempts} ${result.url}${errorSuffix}`);
      for (const location of urlMap.get(result.url) ?? []) {
        console.log(`  at ${location.file}:${location.line}`);
      }
    }
  }

  return invalid.length === 0;
}

async function main() {
  const program = new Command();

  program
    .description('Find links in content/**/data.yaml and validate them with fetch')
    .option('--glob <pattern>', 'Glob used to discover YAML files', '../content/**/data.yaml')
    .option('--concurrency <number>', 'Concurrent fetch checks', '12')
    .option('--timeout <seconds>', 'Per-request timeout for fetch', '20')
    .option('--retries <number>', 'Retry count per URL when fetch fails', '1')
    .option('--limit <number>', 'Only check the first N URLs (for quick validation)')
    .option('--verbose', 'Print each URL as it is checked', false)
    .parse(process.argv);

  const options = program.opts();
  const parsedOptions = {
    concurrency: Number.parseInt(options.concurrency, 10),
    timeout: Number.parseInt(options.timeout, 10),
    retries: Number.parseInt(options.retries, 10),
    limit: options.limit ? Number.parseInt(options.limit, 10) : undefined,
    verbose: Boolean(options.verbose),
  };

  const { urlMap, files } = await collectUrls(options.glob);
  const uniqueUrls = Array.from(urlMap.keys());
  const urlsToCheck = parsedOptions.limit ? uniqueUrls.slice(0, parsedOptions.limit) : uniqueUrls;

  console.log(`Scanned files: ${files.length}`);
  console.log(`Discovered unique URLs: ${uniqueUrls.length}`);
  if (parsedOptions.limit) {
    console.log(`Checking first ${urlsToCheck.length} URL(s) due to --limit`);
  }

  const results = await checkUrls(urlsToCheck, parsedOptions);
  const ok = printResultSummary(results, urlMap);

  process.exitCode = ok ? 0 : 1;
}

await main();
