/**
 * compendium/registrySlug.js — stable kebab-case slugs for Compendium entry
 * anchors. Derived from the entry's own id/name so an anchor survives regeneration
 * (the SEO practice: anchor ids must NOT change per build). Pure, no React.
 */

import { slugify } from '../../kernel/slugify.js';
import { ANCHOR_OFFSET } from '../theme.js';

/** @param {unknown} s @returns {string} */
export function slug(s) {
  // s == null ? '' : s (NOT s || '') — 0/false slugify to '0'/'false' here; raw
  // coercion preserves that while null/undefined still collapse to ''.
  return slugify(s == null ? '' : s, { raw: true });
}

// The header offset so a shared #anchor deep-link lands below the sticky chrome
// rather than under it (scroll-margin-top, the anchor-SEO practice).
//
// RE-EXPORTED, NOT RESPELLED (v2 directive §1). This used to be its own `= 84`
// literal, byte-equal to theme.js's ANCHOR_OFFSET by coincidence and pinned at 84
// on both sides — which is a second truth wearing a matching number, and it stopped
// matching the moment the shaft slimmed to 48. The alias is kept rather than
// deleted because RegistryHubs.jsx and CatalogHubs.jsx import this name at 14 call
// sites; the name stays, the number is now derived, and there is one anchor
// measurement in the estate.
export const ANCHOR_SCROLL_MARGIN = ANCHOR_OFFSET;
