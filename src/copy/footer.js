/**
 * copy/footer.js — the `footer.*` copy namespace + its own `t()` lookup for
 * the eager app shell (App.jsx's footer).
 *
 * WHY ITS OWN MODULE (the inverse of copy/landing.js's lazy segmentation):
 * App.jsx is the ONLY module in the first-paint static graph that reads copy,
 * and it reads ONLY `footer.*`. While App.jsx imported `t` from copy/index.js,
 * that static edge dragged the ENTIRE en.js registry (~68 kB source) into the
 * eager entry chunk — every deep-surface namespace (auth, pricing, moments,
 * dossier, account, …) paid first-paint bytes for six footer links. So the
 * footer namespace is EAGERLY SEGMENTED here with a local `t()` (same
 * dotted-key + interpolation + missing-key semantics as copy/index.js), and
 * App.jsx imports THIS module. copy/index.js + en.js are now imported only by
 * lazy surfaces and ride a shared lazy chunk — zero first-paint footprint for
 * the rest of the registry. en.js spreads this same object back into the full
 * `en` tree, so tests and the copy linter still see one complete registry and
 * the strings stay single-sourced.
 *
 * FIRST-PAINT LAW: never import copy/index.js (or en.js) from any module in
 * the eager graph — that re-drags the whole registry into the entry closure
 * (tests/build/vendorPdfLazy.test.js's byte budget will fail). If eager shell
 * code needs a NEW namespace, segment it here the same way.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

export const footer = {
  tagline:  'A simulator for Dungeon Masters.',
  antiAi:   'Simulated, not AI-generated.',
  about:    'About',
  pricing:  'Pricing',
  compendium: 'Compendium',
  gallery:  'Gallery',
  discord:  'Discord',
  privacy:  'Privacy',
  terms:    'Terms',
  refunds:  'Refunds',
  contact:  'Feedback & support',
  copyright: '© {year} SettlementForge',
};

// The namespaces the eager shell may read. Keyed so call sites keep the exact
// same dotted keys they used against the full registry ('footer.pricing').
const CORE = { footer };

/**
 * t — resolve a dotted key against the eager-shell copy slice. Mirrors
 * copy/index.js's t() exactly: `{name}` interpolation from `vars`, missing
 * keys warn in DEV and return the key string in PROD.
 *
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 * @returns {string}
 */
export function t(key, vars) {
  const parts = key.split('.');
  let cur = /** @type {unknown} */ (CORE);
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') { cur = undefined; break; }
    cur = /** @type {Record<string, unknown>} */ (cur)[p];
  }
  if (typeof cur !== 'string') {
    if (import.meta?.env?.DEV) {
      console.warn(`[copy] missing key: ${key}`);
    }
    return key;
  }
  if (!vars) return cur;
  return cur.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}
