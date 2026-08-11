/**
 * townCartography/cartographyPaintRoles.js — THE PALETTE ROLE PROGRAM (TC-5a).
 *
 * A ROLE is what a record MEANS tonally; it is never a colour. The component layer
 * (TC-5b) is the only place a role becomes a value, and it resolves one through the
 * design token module. This leaf therefore holds no colour literal in any notation
 * and no design-layer import at all — the manifest contract's "NO COLOUR, EVER" rule
 * (cartographyContract.js:38-42, and its live rejectRawColour validator) applies to
 * the painter's ROLE half exactly as it applies to the block.
 *
 * ⚠ C4 scans this file's WHOLE SOURCE TEXT, prose included, so a comment that spells
 * a colour notation or a design-module path CONVICTS the file. This docblock names
 * the law and deliberately spells no example of it.
 *
 * ── WHY THE MAPS ARE BUILT RATHER THAN AUTHORED ──────────────────────────────
 * TC-4 shipped two hand-maintained tables that could disagree, and the guard was a
 * test that compared them. This leaf removes the habitat instead: every map's KEY
 * SET is BUILT by iterating the frozen contract vocabulary, so an exact-set-both-ways
 * mismatch is impossible to express — a missing member and a foreign key each throw
 * at module load, before any consumer can read a half-populated table. The
 * corresponding test then measures a property that holds by construction rather than
 * one maintained by hand.
 *
 * ── WHY EVERY ACCESSOR THROWS ────────────────────────────────────────────────
 * A lookup that falls back to 'default' on an unknown key is a FAIL-OPEN shape: a
 * vocabulary member added to the contract and forgotten here would paint silently
 * and plausibly, and no test could see it. Each accessor throws the shared TC-3
 * premise error instead, so an unmapped kind is loud at the first paint that meets it.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state, no float.
 *
 * @enforced-by tests/domain/townCartographyPaint.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */
import {
  TOWN_CARTOGRAPHY_CONDITIONS,
  TOWN_CARTOGRAPHY_STREET_CLASSES,
  TOWN_CARTOGRAPHY_WARD_KINDS,
} from '../townScene/cartographyContract.js';
import { premise } from './cartographyPlan.js';

/**
 * The closed paint-role vocabulary. Sorted; the sort is the enumeration order.
 * It is deliberately WIDER than the ward map: `green` and `water` name tones a
 * terrain pass owns, and reserving them here keeps the role names in one place
 * rather than letting TC-5b mint a second spelling.
 * @type {ReadonlyArray<string>}
 */
export const CARTOGRAPHY_PAINT_ROLES = Object.freeze([
  'civic', 'craft', 'default', 'green', 'ground',
  'industry', 'sacred', 'street', 'wall', 'water',
]);

/**
 * BUILD a map whose key set IS the frozen vocabulary, in the vocabulary's own order.
 * Both directions are checked, so neither a forgotten member nor a stale key can
 * survive module load. This is the packet's structural cure: the key set is DERIVED,
 * never restated.
 * @template T
 * @param {ReadonlyArray<string>} vocabulary the frozen contract vocabulary
 * @param {Record<string, T>} authored the authored values, keyed by member
 * @param {string} label the map's name, for the error text
 * @returns {Readonly<Record<string, T>>}
 */
function exhaustiveOver(vocabulary, authored, label) {
  /** @type {Record<string, T>} */
  const built = {};
  for (const member of vocabulary) {
    if (!Object.prototype.hasOwnProperty.call(authored, member)) {
      throw premise(`${label} has no entry for the frozen vocabulary member '${member}'`);
    }
    built[member] = authored[member];
  }
  for (const key of Object.keys(authored)) {
    if (!vocabulary.includes(key)) {
      throw premise(`${label} carries '${key}', which the frozen vocabulary does not contain`);
    }
  }
  return Object.freeze(built);
}

/**
 * WARD KIND → PAINT ROLE, exhaustive over the estate's twelve district categories.
 * @type {Readonly<Record<string, string>>}
 */
export const WARD_ROLE_BY_KIND = exhaustiveOver(TOWN_CARTOGRAPHY_WARD_KINDS, {
  arcane: 'sacred',
  civic: 'civic',
  craft: 'craft',
  criminal: 'ground',
  foreign: 'default',
  industrial: 'industry',
  merchant: 'civic',
  military: 'wall',
  noble: 'civic',
  other: 'default',
  religious: 'sacred',
  residential: 'ground',
}, 'WARD_ROLE_BY_KIND');

/**
 * CONDITION → TONE SHIFT in permille, monotone NON-INCREASING along the frozen
 * ladder (index 0 best, last worst). A worse rung may never paint brighter than a
 * better one, which is the only ordering claim this table makes.
 * @type {Readonly<Record<string, number>>}
 */
export const CONDITION_TONE_SHIFT_PERMILLE = exhaustiveOver(TOWN_CARTOGRAPHY_CONDITIONS, {
  pristine: 80,
  sound: 0,
  worn: -60,
  damaged: -120,
  burned: -260,
  ruined: -380,
}, 'CONDITION_TONE_SHIFT_PERMILLE');

/**
 * STREET CLASS → WIDTH WEIGHT in permille. Applied to the record's own `widthPlan`;
 * it never replaces it, so the geometry stays the block's and only the emphasis is
 * the painter's.
 * @type {Readonly<Record<string, number>>}
 */
export const STREET_WIDTH_WEIGHT_PERMILLE = exhaustiveOver(TOWN_CARTOGRAPHY_STREET_CLASSES, {
  arterial: 1000,
  lane: 620,
}, 'STREET_WIDTH_WEIGHT_PERMILLE');

/**
 * @param {unknown} kind a ward kind drawn from the frozen vocabulary
 * @returns {string} the paint role; THROWS rather than falling back to 'default'
 */
export function paintRoleForWardKind(kind) {
  const role = typeof kind === 'string' ? WARD_ROLE_BY_KIND[kind] : undefined;
  if (role === undefined) {
    throw premise(`ward kind '${String(kind)}' has no paint role; a silent 'default' would`
      + ' paint an unmapped vocabulary member plausibly and invisibly');
  }
  return role;
}

/**
 * @param {unknown} condition a building condition drawn from the frozen ladder
 * @returns {number} the permille tone shift; THROWS on an unmapped rung
 */
export function toneShiftForCondition(condition) {
  const shift = typeof condition === 'string'
    ? CONDITION_TONE_SHIFT_PERMILLE[condition]
    : undefined;
  if (shift === undefined) {
    throw premise(`building condition '${String(condition)}' has no tone shift; a silent 0`
      + ' would paint a ruin as though it were sound');
  }
  return shift;
}

/**
 * @param {unknown} classKind a street class drawn from the frozen vocabulary
 * @returns {number} the permille width weight; THROWS on an unmapped class
 */
export function streetWeightForClass(classKind) {
  const weight = typeof classKind === 'string'
    ? STREET_WIDTH_WEIGHT_PERMILLE[classKind]
    : undefined;
  if (weight === undefined) {
    throw premise(`street class '${String(classKind)}' has no width weight`);
  }
  return weight;
}
