/**
 * compendium/registrySlug.js — stable kebab-case slugs for Compendium entry
 * anchors. Derived from the entry's own id/name so an anchor survives regeneration
 * (the SEO practice: anchor ids must NOT change per build). Pure, no React.
 */

import { slugify } from '../../kernel/slugify.js';

/** @param {unknown} s @returns {string} */
export function slug(s) {
  // s == null ? '' : s (NOT s || '') — 0/false slugify to '0'/'false' here; raw
  // coercion preserves that while null/undefined still collapse to ''.
  return slugify(s == null ? '' : s, { raw: true });
}

// The fixed header offset so a shared #anchor deep-link lands below the sticky
// chrome rather than under it (scroll-margin-top, the anchor-SEO practice).
export const ANCHOR_SCROLL_MARGIN = 84;
