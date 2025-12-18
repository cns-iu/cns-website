/**
 * Export:
 *   - formatCitation(cslData, cslStyleXml, options)
 *
 * Assumptions:
 *   - All CSL-JSON items MUST have a valid "id" property.
 *   - Input items are never mutated.
 *   - A minimal built-in en-US locale is used unless a locale XML is explicitly provided.
 */

import citeproc from 'citeproc';

const DEFAULT_LOCALE_XML = `<?xml version="1.0" encoding="utf-8"?>
<locale xml:lang="en-US" xmlns="http://purl.org/net/xbiblio/csl">
  <terms/>
</locale>`;

/**
 * Validate and normalize the CSL input.
 *
 * @param {Object|Object[]} cslData - single CSL-JSON item or array of items
 * @returns {{ itemsMap: Record<string,Object>, ids: string[] }}
 * @throws {TypeError} when items are invalid or missing ids
 */
function normalizeInput(cslData) {
  const arr = Array.isArray(cslData) ? cslData : [cslData];

  if (arr.length === 0) {
    throw new TypeError('cslData must contain at least one CSL item.');
  }

  const itemsMap = {};
  const ids = [];

  arr.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new TypeError(`CSL item at index ${index} must be an object.`);
    }
    if (!item.id || typeof item.id !== 'string') {
      throw new TypeError(
        `CSL item at index ${index} must include a valid string "id". Received: ${JSON.stringify(item)}`
      );
    }

    itemsMap[item.id] = item;
    ids.push(item.id);
  });

  return { itemsMap, ids };
}

/**
 * Construct the system object expected by citeproc.Engine.
 *
 * @param {Record<string,Object>} itemsMap
 * @param {string} localeXml
 * @returns {{ retrieveLocale: (lang:string)=>string, retrieveItem: (id:string)=>Object|undefined }}
 */
function createSys(itemsMap, localeXml) {
  return {
    retrieveLocale: () => localeXml,
    retrieveItem: (id) => itemsMap[id],
  };
}

/**
 * Format CSL-JSON items using a CSL style XML string.
 *
 * @param {Object|Object[]} cslData - CSL-JSON item(s), each MUST contain a string "id"
 * @param {string} cslStyleXml - CSL style XML document string
 * @param {Object} [options]
 * @param {string} [options.localeXml] - optional locale XML (recommended)
 *
 * @returns {{
 *   entries: { [string]: string },
 *   citation: string,
 *   bibliography: string,
 * }}
 *
 * @throws {TypeError} for invalid inputs
 * @throws {Error} for citeproc runtime errors
 */
export function formatCitation(cslData, cslStyleXml, options = {}) {
  if (typeof cslStyleXml !== 'string' || !cslStyleXml.trim()) {
    throw new TypeError('cslStyleXml must be a non-empty CSL style XML string.');
  }

  const { itemsMap, ids } = normalizeInput(cslData);

  const localeXml =
    typeof options.localeXml === 'string' && options.localeXml.trim() ? options.localeXml : DEFAULT_LOCALE_XML;

  const sys = createSys(itemsMap, localeXml);
  const engine = new citeproc.Engine(sys, cslStyleXml);

  // Register items
  engine.updateItems(ids);

  // Bibliography
  const bib = engine.makeBibliography();
  const rawEntries = Array.isArray(bib) && Array.isArray(bib[1]) ? bib[1] : [];
  const bibliography = rawEntries.join('\n');
  const entries = bib[0].entry_ids.reduce((acc, [id], index) => {
    acc[id] = rawEntries[index];
    return acc;
  }, {});

  // Citation cluster
  const citeItems = ids.map((id) => ({ id }));
  let citation = '';

  if (typeof engine.makeCitationCluster === 'function') {
    const out = engine.makeCitationCluster(citeItems);
    citation = Array.isArray(out) ? out.join('') : String(out ?? '');
  } else if (typeof engine.processCitationCluster === 'function') {
    const out = engine.processCitationCluster({ citationItems: citeItems }, [], []);
    if (Array.isArray(out) && typeof out[0] === 'string') {
      citation = out[0];
    } else if (typeof out === 'string') {
      citation = out;
    }
  }

  return {
    entries,
    citation,
    bibliography,
  };
}
