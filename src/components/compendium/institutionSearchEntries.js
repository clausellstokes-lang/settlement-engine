/**
 * compendium/institutionSearchEntries.js — the institutions, findable in the global
 * search (COMPENDIUM-HUB H6).
 *
 * MEASURED 2026-11-10: the global search's index (domain/compendium/searchIndex.js
 * COMPENDIUM_INDEX) carried no institution at all — 276 entries, none of category
 * Institution — so "inn", "smith", "watch" or "thieves" returned nothing in every
 * build, production included, under an empty-state line that tells the reader to try
 * an institution name. This module supplies the 282 distinct institutions as SEARCH
 * targets only: they are not added to COMPENDIUM_INDEX, whose ids the prerender and
 * the sitemap fan into per-entry pages, so no page, sitemap row or generated output
 * moves. Each entry lands on the Institutions page, its search pre-filled with the
 * name and its card's anchor (`inst-<slug>`, stamped by InstitutionsTab) in view.
 *
 * The catalog read and the de-duplication are InstitutionsTab's own (first name wins),
 * and the shown term is the card's own label (institutionDisplayName), with the raw
 * engine key kept as a keyword so a DM who knows the engine's spelling still finds it.
 */
import { getInstitutionalCatalog, getFullCatalogWithTierMeta } from '../../generators/lookups.js';
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { COMPENDIUM_INDEX } from '../../domain/compendium/searchIndex.js';
import { slug } from './registrySlug.js';

/** The anchor id an institution card carries. @param {string} name @returns {string} */
export function institutionAnchor(name) {
  return `inst-${slug(name)}`;
}

/** The distinct institutions, in catalog order (InstitutionsTab's read). */
export function distinctInstitutions() {
  let catalog;
  try { catalog = getFullCatalogWithTierMeta(); }
  catch {
    try { catalog = getInstitutionalCatalog('all'); } catch { catalog = {}; }
  }
  const seen = new Set();
  return Object.entries(catalog).flatMap(([cat, catData]) =>
    Object.entries(catData || {}).map(([name, props]) => ({ name, category: cat, ...props })),
  ).filter((i) => { if (!i.name || seen.has(i.name)) return false; seen.add(i.name); return true; });
}

let cached = null;
/** The global search's index: the committed compendium index plus the institutions. */
export function compendiumGlobalSearchIndex() {
  if (cached) return cached;
  const institutions = distinctInstitutions().map((i) => Object.freeze({
    id: institutionAnchor(i.name),
    term: institutionDisplayName(i),
    category: 'Institution',
    tab: 'institutions',
    anchor: institutionAnchor(i.name),
    keywords: `${i.name} ${i.category || ''}`,
  }));
  cached = Object.freeze([...COMPENDIUM_INDEX, ...institutions]);
  return cached;
}
