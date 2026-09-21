/**
 * The institutional catalogue's tier lookups — THE ONE HOME (EM-P4).
 *
 * These readers used to live in the generator's own lookup leaf, so a `src/domain`
 * module that needed the catalogue's tier gate had to import across the generator
 * boundary — which `tests/build/domainGeneratorsBoundary.test.js` refuses, its own
 * message saying to invert the coupling by moving the shared leaf DOWN a layer.
 * This file is that inversion, on EM-P3's landed pattern. The generator's leaf keeps
 * every export name it had, four of them as BARE re-exports of this module, so both
 * addresses hand out the same function objects: identity, not equality.
 *
 * ⛔ TWO IMPORTS AND NO MORE — the same two `src/data` modules the reader already
 *    depended on. No generator import, no React, no store. The bodies live here and
 *    not in a new `src/domain` leaf because bodies under `src/domain` would make the
 *    generator import `src/domain`, which `computeEngineSharedDomain()` reads as an
 *    eager first-paint seed.
 *
 * ⛔ THE BASENAME IS LOAD-BEARING. `catalogTierGateParity`'s A5 scans raw source —
 *    comments included — under `src/generators`, `src/domain` and `src/lib` for an
 *    import specifier whose final segment is the generator reader's basename. Reusing
 *    that basename here would red A5 by the domain address's own import line.
 *
 * ⭐ `src/domain/institutionLookups.js` is the stable domain address for readers
 *    outside the generator; this module is what the generator itself takes.
 */

import { TIER_ORDER, tierAtLeast } from './constants.js';
import { institutionalCatalog } from './institutionalCatalog.js';

/**
 * One catalog row as every reader in this file treats it: an authored bag whose only
 * keys these lookups care about are the tier gate and the tag list the magic filter
 * reads. Named once so the tier filter and `filterCatalogForMagic` cannot drift apart.
 * @typedef {{ minTier?: string, tags?: unknown[] }} CatalogRow
 * @typedef {Record<string, Record<string, CatalogRow>>} CatalogShape
 */

/**
 * [CH-3 §3.1 / J-CH-3-1] THE TIER GATE THE GENERATOR APPLIES, MIRRORED HERE.
 *
 * A catalog row may be AUTHORED in one tier's block and GATED to a higher tier by
 * `minTier` — "author here, gate there". Ten rows use that form today: nine city rows
 * gated to metropolis (four Entertainment, five Exotic) and one village row gated to
 * city. The positions are interleaved with un-gated neighbours inside the same shelf,
 * so the form is authored judgement, not a copy-paste run.
 *
 * `assembleInstitutions` refuses such a row below its gate as its FIRST in-loop act:
 *
 *     if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;
 *
 * These lookups used to return the raw block, so the UI offered all ten rows at a tier
 * the generator would never roll them at. `institutionAvailableAtTier` is that same
 * test written the same way round, so the UI-visible set and the generator's
 * probabilistic/required set agree at every tier.
 *
 * ⚠ NOT a claim about the FORCE path. `assembleInstitutions`'s two forced-toggle loops
 * (the `_`-form at :391 and the `::`-form at :457) deliberately reach past the tier —
 * that is what an out-of-tier override IS — and neither consults `minTier`. Measured
 * on this base: force-requiring any of the ten puts it in 70 of 70 settlements at its
 * authoring tier. Hiding a row from one tier's grid therefore does not make it
 * unforceable; the manual/all-tier view still reaches it. Do not "fix" that asymmetry
 * here — making the force path honour `minTier` is a generation behaviour change, not
 * a reader repair.
 *
 * @param {{ minTier?: string } | null | undefined} def
 * @param {string} tier
 * @returns {boolean}
 */
export const institutionAvailableAtTier = (def, tier) =>
  !def?.minTier || tierAtLeast(tier, def.minTier);

/**
 * The later of a row's authoring block and its own `minTier` gate — the earliest tier
 * at which the generator will actually consider it. This is what `nativeTier` must
 * report for a gated row, because the UI reads `nativeTier` to label and place it.
 * @param {{ minTier?: string }} def
 * @param {string} blockTier
 * @returns {string}
 */
const effectiveTierOf = (def, blockTier) =>
  def?.minTier && !tierAtLeast(blockTier, def.minTier) ? def.minTier : blockTier;

/**
 * Drop every row the tier gate refuses. Empty categories are dropped, mirroring
 * `filterCatalogForMagic`, which runs immediately after this in `selectCurrentCatalog`
 * — the two filters must not disagree about the shape they hand the grid.
 *
 * The types are spelled out rather than inferred: `selectCurrentCatalog` passes this
 * result straight into `filterCatalogForMagic`, whose parameter is a
 * `Record<string, Record<string, { tags?: unknown[] }>>`. A bare `const out = {}` here
 * evolves to a shape TS will not accept there, which is a real typecheck regression and
 * not a cosmetic one.
 * @param {CatalogShape} catalog
 * @param {string} tier
 * @returns {CatalogShape}
 */
const filterCatalogByTierGate = (catalog, tier) => {
  /** @type {CatalogShape} */
  const out = {};
  for (const [category, insts] of Object.entries(catalog || {})) {
    /** @type {Record<string, CatalogRow>} */
    const kept = {};
    for (const [name, def] of Object.entries(insts || {})) {
      if (institutionAvailableAtTier(def, tier)) kept[name] = def;
    }
    if (Object.keys(kept).length > 0) out[category] = kept;
  }
  return out;
};

// pipeline-5: merge a list of tier catalogs (later tiers override on name clash),
// mirroring assembleInstitutions.mergeCatalogs so the UI lookup and the generator
// agree about what a metropolis catalog contains.
/** @param {string[]} tiers @returns {CatalogShape} */
const mergeTierCatalogs = (tiers) => {
  /** @type {CatalogShape} */
  const merged = {};
  for (const t of tiers) {
    const tierCat = institutionalCatalog[t] || {};
    for (const [category, insts] of Object.entries(tierCat)) {
      if (!merged[category]) merged[category] = {};
      for (const [name, def] of Object.entries(insts)) {
        merged[category][name] = def;
      }
    }
  }
  return merged;
};

/**
 * Return the institutional catalog appropriate for a given tier.
 * Special cases:
 *   - random/custom/no-tier → village catalog (sane default for previews)
 *   - metropolis → city + metropolis merge (the 24 metropolis-only entries — e.g.
 *     Academy of magic, Assassins' guild, Underground city — are reachable so the
 *     UI catalog/force path can author them; pipeline-5)
 *   - 'all' → merged catalog across all tiers (metropolis included)
 *
 * [CH-3 §3.1] Every tier-specific result is passed through the `minTier` gate, so this
 * never offers a row the generator would refuse at that tier. `'all'` is exempt on
 * purpose: it is a cross-tier browse, and a metropolis-gated row IS reachable — at
 * metropolis. Filtering it there would hide the row from every view at once.
 */
export const getInstitutionalCatalog = (tier) => {
  if (!tier || tier === 'random' || tier === 'custom') {
    return filterCatalogByTierGate(institutionalCatalog['village'] || {}, 'village');
  }
  if (tier === 'metropolis') return filterCatalogByTierGate(mergeTierCatalogs(['city', 'metropolis']), 'metropolis');
  if (tier === 'all') return mergeTierCatalogs(TIER_ORDER);
  return filterCatalogByTierGate(institutionalCatalog[tier] || {}, tier);
};

/**
 * Full catalog merged across all tiers, with each institution def
 * tagged with `nativeTier` so the UI can show which tier it originated
 * in. Used by InstitutionalGrid for the "all tiers" view.
 *
 * [CH-3 §3.1] `nativeTier` reports the EFFECTIVE tier — the later of the authoring
 * block and the row's own `minTier`. This view spans every tier, so no row is dropped;
 * what was wrong was the LABEL. `InstitutionalGrid` renders `nativeTier` as the badge
 * and in its "Out-of-tier (… tier)" affordance, so a city-authored, metropolis-gated
 * row used to be advertised as a city row a city could never roll.
 */
export const getFullCatalogWithTierMeta = () => {
  /** @type {Record<string, Record<string, CatalogRow & { nativeTier: string }>>} */
  const merged = {};
  for (const t of TIER_ORDER) {
    const tierCat = institutionalCatalog[t] || {};
    for (const [category, insts] of Object.entries(tierCat)) {
      if (!merged[category]) merged[category] = {};
      for (const [name, def] of Object.entries(insts)) {
        merged[category][name] = { ...def, nativeTier: effectiveTierOf(def, t) };
      }
    }
  }
  return merged;
};

/**
 * Set of institution names that exist in the native tier catalog.
 * [CH-3 §3.1] Gated by `minTier`, so this agrees with `getInstitutionalCatalog(tier)`
 * name-for-name — the store derives "is this in-tier?" affordances from it.
 */
export const getInstitutionsForTier = (tier) => {
  // metropolis inherits city AND its own top-tier entries (pipeline-5).
  const tiers = tier === 'metropolis' ? ['city', 'metropolis'] : [tier];
  const names = new Set();
  for (const t of tiers) {
    const cat = institutionalCatalog[t] || {};
    Object.values(cat).forEach(insts => Object.entries(insts).forEach(([n, def]) => {
      if (institutionAvailableAtTier(def, tier)) names.add(n);
    }));
  }
  return names;
};
