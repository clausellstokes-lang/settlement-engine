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

/**
 * Landing-grid order, reading across three columns (the owner, 2026-11-10: "three columns not
 * three rows"; the chair's H1+ order): the world first, then how it works, then the index and
 * the reader's own content. `kicker` is the small line above a tile's name — the two words the
 * owner approved, "The world" and "How it works"; the last two tiles carry none.
 * @type {ReadonlyArray<{ slug: string, tab: string, kicker?: string }>}
 */
export const COMPENDIUM_SECTIONS = Object.freeze([
  { slug: 'tiers', tab: 'tiers', kicker: 'The world' },
  { slug: 'economy', tab: 'economy', kicker: 'The world' },
  { slug: 'powers', tab: 'power', kicker: 'The world' },
  { slug: 'institutions', tab: 'institutions', kicker: 'The world' },
  { slug: 'magic-and-religion', tab: 'arcane', kicker: 'The world' },
  { slug: 'stress', tab: 'stress', kicker: 'The world' },
  { slug: 'calamity', tab: 'calamity', kicker: 'The world' },
  { slug: 'neighbours', tab: 'neighbour', kicker: 'The world' },
  { slug: 'operations', tab: 'operations', kicker: 'How it works' },
  { slug: 'living-world', tab: 'living', kicker: 'How it works' },
  { slug: 'a-z', tab: 'az' },
  { slug: 'custom', tab: 'custom' },
].map(Object.freeze));

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
