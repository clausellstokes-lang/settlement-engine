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
 * BECAUSE IT IS EAGER, EVERY KEY HERE IS PAID FOR AT FIRST PAINT. Keys that no
 * surface resolves are deleted rather than parked (four were, on 2026-09-18).
 *
 * FIRST-PAINT LAW: never import copy/index.js (or en.js) from any module in
 * the eager graph — that re-drags the whole registry into the entry closure
 * (tests/build/vendorPdfLazy.test.js's byte budget will fail). If eager shell
 * code needs a NEW namespace, segment it here the same way.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

export const footer = {
  antiAi:   'Simulated, not AI-generated.',
  about:    'About',
  // The Practical Guide (/about/guide) and the public roadmap (/roadmap) had ZERO
  // inbound links outside the route registry: reachable only by typing the URL or
  // finding them in the sitemap. Neither has a top-nav block, so the ribbon is
  // their door — which is exactly the job routes.js already credits it with.
  guide:    'Guide',
  roadmap:  'Roadmap',
  pricing:  'Pricing',
  privacy:  'Privacy',
  terms:    'Terms',
  refunds:  'Refunds',
  contact:  'Feedback & support',
  copyright: '© {year} SettlementForge',
};
// DELETED 2026-09-18 with the orphan-route sweep: `tagline`, `compendium`,
// `gallery` and `discord` were resolved by nothing. This module is EAGER (the
// first-paint entry chunk reads it), so an unused string here is not free — it is
// bytes every visitor downloads for a link that does not exist. `refunds` stays:
// PurchaseModal resolves it.

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
