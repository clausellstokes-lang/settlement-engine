/**
 * data/biomeTexture.js — THE BIOME/SEASON TEXTURE corpus (VISION WAVE V-6 BIOME TRUTH).
 *
 * A LAZY, PURE data leaf (the CONTENT-GT max-lines ratchet rule: growing in-register prose
 * lives in src/data, off the domain size ceilings). It gives the road scene + travel news a
 * short season-flavoured texture line for the terrain a road passes through — the two crowns
 * stitched: a road scene through tundra should KNOW it, cheaply.
 *
 * Consumed by src/domain/briefs/roadScene.js (and, seam, a future travel-news read) via the
 * pure accessors below, keyed by the spatial digest's per-settlement/per-leg biome (the
 * `biomes` sub-digest, present only on a biomeTexture canon). Absent digest biome ⇒ the
 * consumer never calls in ⇒ byte-identical.
 *
 * THE LAWS:
 *  1. PORTABLE SPECIFICITY: no proper nouns — the texture speaks of terrain + season only, in
 *     the world's own diegetic register (the roadsProse specificity rule).
 *  2. NO CALAMITY VOCABULARY: no flood/fire/quake/earthquake/storm (the F24 scan register) —
 *     weather texture is not a calamity event.
 *  3. TOTAL + DETERMINISTIC: every terrain × season resolves to one stable line; an unknown
 *     terrain folds to 'grassland', an unknown season to 'summer' (a pure, byte-stable read).
 *
 * Pure leaf: imports nothing.
 */

/**
 * FMG biome id → human name (index-aligned 0..12; the sf-bridge BIOME_COST order). A biome
 * id outside the table reads as 'wilds' (a safe generic). @type {ReadonlyArray<string>}
 */
export const BIOME_NAMES = Object.freeze([
  'open sea',              // 0 marine
  'hot desert',            // 1
  'cold desert',           // 2
  'savanna',               // 3
  'grassland',             // 4
  'tropical woodland',     // 5 tropical seasonal forest
  'deciduous forest',      // 6 temperate deciduous
  'rainforest',            // 7 tropical rainforest
  'temperate rainforest',  // 8
  'taiga',                 // 9
  'tundra',                // 10
  'glacier',               // 11
  'marshland',             // 12 wetland
]);

/** The human name for an FMG biome id (null/out-of-range ⇒ 'wilds'). Pure, total.
 *  @param {number|null|undefined} id @returns {string} */
export function biomeNameOf(id) {
  if (typeof id !== 'number' || !Number.isInteger(id)) return 'wilds';
  return BIOME_NAMES[id] || 'wilds';
}

// The eight terrain classes (spatialCost.terrainClassOf's vocabulary) × the four SEASONS-A
// season labels → a short texture line. Index-0 is not a variant pool here (a direct lookup,
// not pickLine): each cell is the ONE canonical line for that terrain/season. Kept terse so a
// road scene reads as a caption, not a paragraph.
/** @type {Readonly<Record<string, Readonly<Record<string, string>>>>} */
export const TERRAIN_SEASON_TEXTURE = Object.freeze({
  water: Object.freeze({
    spring: 'the crossing runs high with meltwater',
    summer: 'the ford lies low and easy',
    autumn: 'the water runs cold and grey',
    winter: 'the crossing is rimed with ice',
  }),
  desert: Object.freeze({
    spring: 'the sands are merciful, the wells still sweet',
    summer: 'the road shimmers, water rationed by the mile',
    autumn: 'the heat breaks and the dunes go long and gold',
    winter: 'the nights bite hard over open sand',
  }),
  grassland: Object.freeze({
    spring: 'the grasslands run green and open',
    summer: 'the plains lie dry and golden underfoot',
    autumn: 'the grass is cut short and the ground firm',
    winter: 'the open ground is hard and bare of cover',
  }),
  forest: Object.freeze({
    spring: 'the woodland tracks are soft with new leaf',
    summer: 'the forest road runs shaded and close',
    autumn: 'the canopy turns and the paths fill with leaf-fall',
    winter: 'the bare wood offers little shelter',
  }),
  wetland: Object.freeze({
    spring: 'the marsh causeways are half-drowned',
    summer: 'the fen road holds, the reeds high and dense',
    autumn: 'the marsh runs to mud and standing water',
    winter: 'the fen freezes patchy and treacherous',
  }),
  tundra: Object.freeze({
    spring: 'the thaw turns the tundra to a mire',
    summer: 'the tundra is brief-green and passable',
    autumn: 'the ground hardens and the light grows short',
    winter: 'the tundra lies frozen and wind-scoured',
  }),
  glacier: Object.freeze({
    spring: 'the ice groans but holds the old path',
    summer: 'meltchannels seam the glacier road',
    autumn: 'the ice road firms as the cold returns',
    winter: 'the glacier is a hard white road, and pitiless',
  }),
  mountain: Object.freeze({
    spring: 'the high passes open late, still snow-choked',
    summer: 'the pass is clear, the climb long',
    autumn: 'the first snows threaten the high road',
    winter: 'the passes are all but shut',
  }),
});

const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);

/** The season/terrain texture line (the caption a road scene appends). Total + deterministic:
 *  an unknown terrain folds to 'grassland', an unknown season to 'summer'. Pure.
 *  @param {string} terrain @param {string} season @returns {string} */
export function biomeSeasonTexture(terrain, season) {
  const t = TERRAIN_SEASON_TEXTURE[String(terrain)] ? String(terrain) : 'grassland';
  const s = SEASONS.includes(String(season)) ? String(season) : 'summer';
  return TERRAIN_SEASON_TEXTURE[t][s];
}
