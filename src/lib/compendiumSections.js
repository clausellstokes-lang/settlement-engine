/**
 * lib/compendiumSections.js — the Compendium's section pages: slug ↔ tab.
 *
 * THE OWNER'S WORD (2026-11-10): "Rather than a horizontal scroll, I would like that
 * the first page of compendium lists in boxes that are flush to each other maybe in 3
 * rows each of the different tabs. Then when one clicks on it they are taken to a
 * different page. There is always a back button and clicking the compendium tab when
 * not on the main compendium page brings you back to the main compendium page. Custom
 * content itself now joins the other tabs."
 *
 * Each section is its own path route, /compendium/<slug>. The slugs are RESERVED: the
 * router matches them BEFORE the per-entry pattern (/compendium/<entry-id>), and
 * tests/lib/compendiumSectionRoutes.test.js fails if any compendium entry id ever
 * equals one. `tab` is the section's internal id (the old tab id, which the search
 * index's `tab` field and the A–Z rows still carry). Pure data: the router (first
 * paint), the lazy panel, the prerender and the sitemap all read this one list.
 */

/** @type {ReadonlyArray<{ slug: string, tab: string }>} — landing-grid order. */
export const COMPENDIUM_SECTIONS = Object.freeze([
  { slug: 'tiers', tab: 'tiers' },
  { slug: 'economy', tab: 'economy' },
  { slug: 'powers', tab: 'power' },
  { slug: 'institutions', tab: 'institutions' },
  { slug: 'operations', tab: 'operations' },
  { slug: 'magic-and-religion', tab: 'arcane' },
  { slug: 'living-world', tab: 'living' },
  { slug: 'stress', tab: 'stress' },
  { slug: 'calamity', tab: 'calamity' },
  { slug: 'neighbours', tab: 'neighbour' },
  { slug: 'a-z', tab: 'az' },
  { slug: 'custom', tab: 'custom' },
]);

/** The reserved slugs, in order. */
export const COMPENDIUM_SECTION_SLUGS = Object.freeze(COMPENDIUM_SECTIONS.map((s) => s.slug));

/** @param {string} tab @returns {string|undefined} the section slug for a tab id. */
export function sectionSlugForTab(tab) {
  const s = COMPENDIUM_SECTIONS.find((x) => x.tab === tab);
  return s ? s.slug : undefined;
}

/** @param {string} slug @returns {string|undefined} the tab id for a section slug. */
export function tabForSectionSlug(slug) {
  const s = COMPENDIUM_SECTIONS.find((x) => x.slug === slug);
  return s ? s.tab : undefined;
}
