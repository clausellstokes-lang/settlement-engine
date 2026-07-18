/**
 * compendium/registrySlug.js — stable kebab-case slugs for Compendium entry
 * anchors. Derived from the entry's own id/name so an anchor survives regeneration
 * (the SEO practice: anchor ids must NOT change per build). Pure, no React.
 */

/** @param {unknown} s @returns {string} */
export function slug(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// The fixed header offset so a shared #anchor deep-link lands below the sticky
// chrome rather than under it (scroll-margin-top, the anchor-SEO practice).
export const ANCHOR_SCROLL_MARGIN = 84;
