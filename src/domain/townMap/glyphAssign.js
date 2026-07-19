/**
 * domain/townMap/glyphAssign.js — INSTITUTION/BUILDING → GLYPH KIND (THE ILLUSTRATED
 * TOWN, IT-1).
 *
 * The one derivation the glyph layer needs: which oblique-elevation glyph a building
 * wears. A pure, deterministic waterfall on the DRAW-MODEL building (name + district
 * category + stable anchor) — resolved at DRAW time so the render model stays byte-
 * identical (the v1/v2 model goldens never move; glyphKind is NOT stored on the model):
 *
 *   1. FILL MASS  → 'massing' — aggregate lodging/residential fill renders as simplified
 *      massing rows (the LOD rule), regardless of name, so a metropolis never explodes.
 *   2. EXACT NAME → the named landmark glyph (church/temple→spire, mill→wheelhouse,
 *      smithy→forge, inn/tavern→signpost-house, keep/garrison→towered-keep, market→
 *      stall-rows, granary→gambrel-store, docks→quay-shed, shrine→small-spire).
 *   3. CATEGORY DEFAULT → the district's 12-enum category default (the PINNED vocabulary).
 *   4. HOUSE MASS → a seeded house variant (house-a/b/c) for the residential commons.
 *
 * A per-building MIRROR bit + the house-variant pick are seeded off the building's stable
 * anchor via createPRNG (the town-map idiom — NO Math.random, the domain purity scan bans
 * it), so the same building always wears the same glyph, and adding/removing one building
 * never re-stamps the others.
 */

import { createPRNG } from '../../kernel/prng.js';

// ── THE PINNED CATEGORY VOCABULARY (JUDGMENT — say "veto") ────────────────────
// Keyed on the town-map district 12-enum (districtProfile DISTRICT_CATEGORIES) — the ONE
// spine already shared inline by CATEGORY_PLACEMENT / CATEGORY_CENTRALITY / CATEGORY_HEIGHT
// / the affinity table / every palette. PINNED equal by the vocabulary pin, never imported
// (engine decoupling — the urbanFabricKernel.js:163-172 rule); tests/domain/townMapGlyphAssign
// asserts these keys === DISTRICT_CATEGORIES. A category whose default is 'house' resolves to
// a seeded house-a/b/c variant.
/** @type {Readonly<Record<string, string>>} */
export const CATEGORY_GLYPH_DEFAULT = Object.freeze({
  religious: 'spire',
  merchant: 'stall-rows',
  military: 'towered-keep',
  craft: 'forge',
  residential: 'house',
  noble: 'manor-hall',
  civic: 'moot-hall',
  arcane: 'mage-tower',
  criminal: 'house',
  foreign: 'caravan-house',
  industrial: 'workshop',
  other: 'house',
});

/** Exact institution-name → glyph (ordered; first match wins). Matched case-insensitively
 *  against the building's institution name — the only identity the DRAW-MODEL building
 *  carries (priorityCategory/tags live on the source institution, not the model building;
 *  threading richer identity would move the model golden — a deferred re-mint window). */
/** @type {ReadonlyArray<{ re: RegExp, kind: string }>} */
const EXACT_RULES = Object.freeze([
  { re: /\b(cathedral|minster|temple|church|abbey|priory|basilica)\b/i, kind: 'spire' },
  { re: /\b(shrine|chapel|reliquary)\b/i, kind: 'small-spire' },
  { re: /\b(windmill|watermill|mill)\b/i, kind: 'wheelhouse' },
  { re: /\b(blacksmith|smithy|smith|forge|foundry)\b/i, kind: 'forge' },
  { re: /\b(inn|tavern|alehouse|taproom)\b/i, kind: 'signpost-house' },
  { re: /\b(keep|garrison|barracks|castle|citadel|watchtower|fort)\b/i, kind: 'towered-keep' },
  { re: /\b(market|bazaar|exchange|shambles|stalls)\b/i, kind: 'stall-rows' },
  { re: /\b(granary|storehouse|warehouse)\b/i, kind: 'gambrel-store' },
  { re: /\b(docks|dock|wharf|quay|harbour|harbor|pier)\b/i, kind: 'quay-shed' },
]);

/** The seeded house variants (the residential commons). */
const HOUSE_VARIANTS = Object.freeze(['house-a', 'house-b', 'house-c']);

/**
 * Derive the glyph kind + mirror bit for a draw-model building. Pure + deterministic.
 * @param {{ name?: string, anchorKey?: string, kind?: string }|null|undefined} building
 * @param {string|null|undefined} districtCategory  the building's district's 12-enum category
 * @returns {{ kind: string, mirror: boolean }}
 */
export function glyphKindFor(building, districtCategory) {
  const b = building || {};
  const seedId = (typeof b.anchorKey === 'string' && b.anchorKey)
    || (typeof b.name === 'string' && b.name)
    || 'glyph-seedless';
  const rng = createPRNG(`glyph:${seedId}`);
  const mirror = rng.fork('mirror').chance(0.5);

  // (1) Fill mass → simplified massing rows (the LOD rule), regardless of name.
  if (b.kind === 'fill') return { kind: 'massing', mirror };

  // (2) Exact institution-name match → the named landmark glyph.
  const name = typeof b.name === 'string' ? b.name : '';
  for (const rule of EXACT_RULES) {
    if (rule.re.test(name)) return { kind: rule.kind, mirror };
  }

  // (3) District-category default → (4) seeded house variant for the house commons.
  const cat = typeof districtCategory === 'string' ? districtCategory : 'other';
  let kind = CATEGORY_GLYPH_DEFAULT[cat] || CATEGORY_GLYPH_DEFAULT.other;
  if (kind === 'house') kind = rng.fork('variant').pick(HOUSE_VARIANTS) || 'house-a';
  return { kind, mirror };
}
