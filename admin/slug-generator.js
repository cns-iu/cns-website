/**
 * admin/slug-generator.js
 *
 * Production-ready auto-slug generator for Decap CMS.
 *
 * Behavior
 *  - Uses nanoid.customAlphabet with alphabet "0123456789abcdefghijklmnopqrstuvwxyz".
 *  - Default target field: "slug".
 *  - Generates a slug only when the field value === UNFILLED_VALUE.
 *  - Never overwrites other values.
 *  - Registers a preSave handler automatically on module load.
 *
 * Configuration (top of file)
 *  - ID_FIELD       String: data field to populate (default: 'slug').
 *  - UNFILLED_VALUE String: sentinel value that triggers generation (default: 'EMPTY').
 *  - NANOID_SIZE    Number: resulting id length (default: 21).
 *  - LOGGING        Boolean: set true only for troubleshooting.
 * 
 * In config.yml, collections that use this feature should have a field that look like this (with default config):
 *  - { name: slug, default: 'EMPTY', widget: hidden }
 *
 * Deployment notes
 *  - For production, prefer bundling nanoid with your assets (do not rely on the CDN).
 *  - Keep LOGGING=false in production to avoid console noise.
 *  - This module assumes the Decap admin loads prior to (or shortly after) module import;
 *    it retries registration when necessary.
 */

import { customAlphabet } from 'https://cdn.jsdelivr.net/npm/nanoid/index.browser.js';

/* ===================== Config ===================== */
const ID_FIELD = 'slug';
const UNFILLED_VALUE = 'EMPTY';
const NANOID_SIZE = 21;
const LOGGING = false;
/* ================================================== */

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(ALPHABET, NANOID_SIZE);

/**
 * Check whether Decap CMS has attached the required API.
 * @returns {boolean}
 */
function cmsReady() {
  return typeof window.CMS !== 'undefined' && typeof window.CMS.registerEventListener === 'function';
}

/**
 * Safely obtain the Immutable data Map from an entry object.
 * @param {object} entry Immutable entry object provided by Decap event
 * @returns {Immutable.Map|null}
 */
function getEntryData(entry) {
  try {
    return entry && typeof entry.get === 'function' ? entry.get('data') || null : null;
  } catch {
    return null;
  }
}

/**
 * Register the preSave handler which will set ID_FIELD when the sentinel is present.
 * Generation condition: data.get(ID_FIELD) string-equals UNFILLED_VALUE.
 */
function registerHandler() {
  try {
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: ({ entry }) => {
        const data = getEntryData(entry);
        if (!data) return data;

        const current = data.get && data.get(ID_FIELD);

        // Only generate if the current value exactly equals the sentinel
        if (String(current) !== UNFILLED_VALUE) return data;

        const newId = nanoid();
        if (LOGGING) console.info(`slug-generator: setting ${ID_FIELD}="${newId}"`);

        return data.set(ID_FIELD, newId);
      },
    });

    if (LOGGING) {
      console.info(`slug-generator: registered preSave handler (field="${ID_FIELD}")`);
    }
  } catch (err) {
    if (LOGGING) console.warn('slug-generator: error registering handler', err);
  }
}

/**
 * Initialize registration:
 *  - Try immediate registration when CMS is ready.
 *  - If not ready, wait for DOMContentLoaded then retry, with a final fallback retry.
 */
function init() {
  if (cmsReady()) {
    registerHandler();
    return;
  }

  const attempt = () => {
    if (cmsReady()) {
      registerHandler();
      return;
    }

    // final retry after short delay
    setTimeout(() => {
      if (cmsReady()) registerHandler();
      else if (LOGGING) console.warn('slug-generator: Decap CMS not detected; handler not registered');
    }, 800);
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', attempt);
  } else {
    attempt();
  }
}

/* Auto-run on module import */
init();
