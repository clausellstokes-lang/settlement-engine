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
 *   2. AUTHORED GLYPH → a registered custom-content glyph, when the canonical model
 *      carries one. The registry is shared with TownScene; arbitrary identifiers fail
 *      closed into the ordinary inference below.
 *   3. EXACT NAME → the named landmark glyph (church/temple→spire, mill→wheelhouse,
 *      smithy→forge, kiln/tannery→kiln-yard, inn/tavern→signpost-house,
 *      keep→towered-keep, barracks→barracks, watchtower→watchtower, market→
 *      stall-rows, granary→gambrel-store, docks→quay-shed, shrine→small-spire,
 *      and named civic/rural/temporary/ruined places to their own silhouettes).
 *   4. CATEGORY DEFAULT → the district's 12-enum category default (the PINNED vocabulary).
 *   5. HOUSE MASS → a seeded house variant (house-a/b/c) for the residential commons.
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

/**
 * Public custom-content subset of the map glyph vocabulary.
 *
 * Illustrated 2D owns glyph classification, and TownScene consumes these same
 * identifiers when adapting the selected silhouette into scene geometry. Keep
 * this list explicit: extending an internal glyph library must never silently
 * widen authorable input.
 */
export const CUSTOM_SETTLEMENT_GLYPH_IDS = Object.freeze([
  'archive-hall',
  'barracks',
  'farmstead',
  'forge',
  'guildhall',
  'house-a',
  'house-b',
  'house-c',
  'mage-tower',
  'moot-hall',
  'ruin-shell',
  'signpost-house',
  'small-spire',
  'spire',
  'stall-rows',
  'towered-keep',
  'watchtower',
  'wheelhouse',
  'workshop',
]);
const CUSTOM_SETTLEMENT_GLYPH_ID_SET = new Set(CUSTOM_SETTLEMENT_GLYPH_IDS);

/** Exact institution-name → glyph (ordered; first match wins). Matched case-insensitively
 *  against the building's institution name — the only identity the DRAW-MODEL building
 *  carries (priorityCategory/tags live on the source institution, not the model building;
 *  threading richer identity would move the model golden — a deferred re-mint window). */
/** @type {ReadonlyArray<{ re: RegExp, kind: string }>} */
const EXACT_RULES = Object.freeze([
  { re: /\b(cathedral|minster|temple|church|abbey|priory|basilica)\b/i, kind: 'spire' },
  { re: /\b(shrine|chapel|reliquary)\b/i, kind: 'small-spire' },
  { re: /\b(windmill|watermill|mill)\b/i, kind: 'wheelhouse' },
  { re: /\b(kiln|pottery|brickyard|tannery|tanneries)\b/i, kind: 'kiln-yard' },
  { re: /\b(blacksmith|smithy|smith|forge|foundry)\b/i, kind: 'forge' },
  { re: /\b(inn|tavern|alehouse|taproom)\b/i, kind: 'signpost-house' },
  { re: /\b(keep|castle|citadel|fort|fortress)\b/i, kind: 'towered-keep' },
  { re: /\b(barracks|garrison|guardhouse|guard house)\b/i, kind: 'barracks' },
  { re: /\b(watchtower|watch tower|signal tower)\b/i, kind: 'watchtower' },
  { re: /\b(market|bazaar|exchange|shambles|stalls)\b/i, kind: 'stall-rows' },
  { re: /\b(granary|storehouse|warehouse)\b/i, kind: 'gambrel-store' },
  { re: /\b(docks|dock|wharf|quay|harbour|harbor|pier)\b/i, kind: 'quay-shed' },
  { re: /\b(guildhall|guild hall|livery hall)\b/i, kind: 'guildhall' },
  { re: /\b(archive|library|courthouse|court house|records hall)\b/i, kind: 'archive-hall' },
  { re: /\b(farmstead|farm house|farmhouse|orchard|vineyard|stable|barn)\b/i, kind: 'farmstead' },
  { re: /\b(graveyard|cemetery|necropolis|ossuary)\b/i, kind: 'graveyard-chapel' },
  { re: /\b(encampment|refugee camp|tent city|army camp)\b/i, kind: 'encampment' },
  { re: /\b(ruins|ruined [a-z -]+|broken [a-z -]+)\b/i, kind: 'ruin-shell' },
]);

/** The seeded house variants (the residential commons). */
const HOUSE_VARIANTS = Object.freeze(['house-a', 'house-b', 'house-c']);

/**
 * Derive the glyph kind + mirror bit for a draw-model building. Pure + deterministic.
 * @param {{ name?: string, anchorKey?: string, kind?: string, glyph?: string }|null|undefined} building
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

  // (2) An admitted authored glyph outranks prose/category inference. Checking
  // the closed registry here keeps direct callers fail-closed as well.
  if (
    typeof b.glyph === 'string'
    && CUSTOM_SETTLEMENT_GLYPH_ID_SET.has(b.glyph)
  ) {
    return { kind: b.glyph, mirror };
  }

  // (3) Exact institution-name match → the named landmark glyph.
  const name = typeof b.name === 'string' ? b.name : '';
  for (const rule of EXACT_RULES) {
    if (rule.re.test(name)) return { kind: rule.kind, mirror };
  }

  // (4) District-category default → (5) seeded house variant for the house commons.
  const cat = typeof districtCategory === 'string' ? districtCategory : 'other';
  let kind = CATEGORY_GLYPH_DEFAULT[cat] || CATEGORY_GLYPH_DEFAULT.other;
  if (kind === 'house') kind = rng.fork('variant').pick(HOUSE_VARIANTS) || 'house-a';
  return { kind, mirror };
}
