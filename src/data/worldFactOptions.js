/**
 * The world-fact option VALUES — the one home (EM-P3).
 *
 * Terrain and culture are the two world facts the estate spelled more than once:
 * the generator rolled from one copy, the gallery filtered on another, and a
 * contract test held the two together by hand. The lists live here now, and
 * every production spelling imports them. `src/domain/worldFactOptions.js` is
 * the stable domain address for readers outside the generator, and it owns the
 * citation index for the five facts whose homes are elsewhere.
 *
 * ⛔ PURE DATA. No import, no branch, no derivation. Frozen at module load.
 *
 * ⛔ WORLD_FACT_SOURCES DOES NOT LIVE HERE, and the placement is priced, not
 *    stylistic. This module rides into the generation worker's bundle with
 *    `src/generators/steps/resolveConfig.js`, whose ceiling has zero slack; the
 *    citation index is an index of OTHER modules' addresses that the generation
 *    worker never reads. Measured, keeping it out of this file is +206 B into
 *    that bundle instead of +634 B. The estate's rule for this shape is
 *    vite.config.js's own: THE CURE IS THE PLACEMENT, NEVER THE CEILING.
 *
 * ⛔ ORDER IS A GENERATION INPUT, NOT A PRESENTATION CHOICE. `TERRAIN_WEIGHTS`
 *    is consumed positionally by `rng.weightedPick(terrains, weights)` and
 *    `CULTURES` by `rng.pick`, so reordering either array moves every world a
 *    stored seed replays. Pinned by tests/components/gallery/facetAlignment.test.js.
 */

/**
 * The weighted terrain pool, verbatim from resolveConfig.js: members, order and weights.
 *
 * ⚠ The tuple TYPE is load-bearing, not decoration. Without it the pairs infer as
 * `(string | number)[]`, `TERRAINS` widens to `(string | number)[]`, and every
 * downstream reader of the terrain vocabulary (src/lib/galleryHubs.js calls
 * `.replace` on one) reds `typecheck:ratchet` against a baseline of zero.
 *
 * @type {ReadonlyArray<readonly [string, number]>}
 */
export const TERRAIN_WEIGHTS = Object.freeze([
  ['plains', 22], ['hills', 18], ['forest', 13],
  ['riverside', 16], ['coastal', 16], ['mountain', 9], ['desert', 6],
]);

/** The terrain vocabulary alone, in the pool's order (the gallery facet's source). */
export const TERRAINS = Object.freeze(TERRAIN_WEIGHTS.map(([terrain]) => terrain));

/** The canonical 11-culture catalog, verbatim from resolveConfig.js. */
export const CULTURES = Object.freeze([
  'germanic', 'latin', 'celtic', 'arabic', 'norse', 'slavic',
  'east_asian', 'mesoamerican', 'south_asian', 'steppe', 'greek',
]);
