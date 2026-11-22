/**
 * tests/helpers/goldenMasterCorpus.js — THE 525-ROW CONFIGURATION CORPUS, ONE SPELLING.
 *
 * WHY IT MOVED HERE (ARCH car 1). `tests/property/generatorGoldenMaster.test.js` built this
 * corpus privately, which was right while it had one reader. The composed-prose manifest's
 * DRIFT corpus is defined as "the golden's 525 configurations, `keyOf(config)`, its four
 * seeds" (ARCH §3.4), so a second reader now exists — and a second SPELLING of a corpus is
 * how two instruments come to disagree about which world they measured while both report
 * green. The rows and the key function are therefore extracted VERBATIM and imported back by
 * the golden master, whose manifest keys are unchanged and whose suite proves it.
 *
 * ⛔ A HELPER, NEVER A SUITE. Nothing here registers a `describe` or a `test`: a test file
 * imported by another test file registers its cases twice, which is the re-registration
 * coupling `tests/helpers/dormancyOracle.js` was extracted to break. This module holds data
 * and one pure key function, and reads no file.
 *
 * ⚠ THE COMMENTS BELOW ARE THE GOLDEN MASTER'S OWN, kept with the code they explain. A
 * corpus comment that stays behind while its rows move is a comment about nothing.
 */
import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
// Every selectable tradition is now mechanically meaningful, so stability
// coverage must include the complete canonical vocabulary. Keep the legacy
// mediterranean alias as an explicit compatibility row rather than allowing it
// to dominate a corpus that omitted most current choices.
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
// The pipeline's REAL terrain vocabulary. terrainOverride is the live key the
// pipeline reads (terrainHelpers.getTerrainType, resolveConfig, resolveResources);
// a bare `terrain` key is dead. These seven tokens are the ones getTerrainType
// returns and resolveConfig weights, so each value genuinely changes the terrain
// type, the terrain-specific resource pool, and the terrain institution modifiers.
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
// Each terrain is swept with the trade route that HONESTLY reaches its resources:
// water terrains (riverside/coastal) need river/port access to unlock their
// water-terrain resources, and a forest hamlet is reached by an isolated track.
// Pairing terrain with its natural route is what makes riverside/coastal exercise
// their full resource unlock rather than degrading to the road-access subset.
const TERRAIN_ROUTE = {
  plains: 'road',
  hills: 'road',
  forest: 'isolated',
  riverside: 'river',
  coastal: 'port',
  mountain: 'road',
  desert: 'road',
};
// 'mountain_pass' is the panel's seventh option. No route pool rolls it, so only an
// explicit config reaches it, and it was therefore the one selectable route with no
// golden row at all — the blind spot that let it score a neutral tier unnoticed.
const TRADE = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass', 'none'];
const THREAT = ['safe', 'civilized', 'frontier', 'plagued'];

/**
 * The key a row is addressed by, in the golden master's own order.
 * @param {{settType: string, culture: string, terrainOverride: string,
 *   tradeRouteAccess: string, monsterThreat: string, _seed: string}} c
 * @returns {string}
 */
export const keyOf = (c) => [
  c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed,
].join('|');

/**
 * The fixed corpus. One-dimension-at-a-time sweeps from a base config plus a
 * full tier×culture×terrain grid — broad categorical-branch coverage without a
 * combinatorial explosion. Each grid row pins terrainOverride (the live terrain
 * key) paired with a terrain-honest trade route, so the seven terrains each drive
 * a genuinely distinct output (distinct terrainType, terrain-specific resources,
 * and terrain institution modifiers) rather than an inert echoed config string.
 * Deterministic order; the seed is folded into each key so the manifest is
 * stable.
 * @returns {Array<{settType: string, culture: string, terrainOverride: string,
 *   tradeRouteAccess: string, monsterThreat: string, _seed: string}>}
 */
export function goldenCorpus() {
  const rows = [];
  const base = {
    settType: 'town',
    culture: 'germanic',
    terrainOverride: 'plains',
    tradeRouteAccess: 'road',
    monsterThreat: 'civilized',
  };
  const seed = 'golden-master-v3';
  // Full tier × culture × terrain grid (terrain paired with its honest route).
  for (const settType of TIERS) {
    for (const culture of CULTURES) {
      for (const terrainOverride of TERRAINS) {
        rows.push({
          ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride], _seed: seed,
        });
      }
    }
  }
  // Sweep trade and threat independently from the base (plains baseline).
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  // The plains sweep row above holds the mountain_pass hash but exercises little of
  // it: a plains town runs a food surplus, so the seasonal import rung never bites.
  // This row puts the pass on the terrain it belongs to, where the structural
  // deficit makes the rung load-bearing.
  rows.push({
    ...base, tradeRouteAccess: 'mountain_pass', terrainOverride: 'mountain', _seed: seed,
  });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  // Pin the random_trade machinery: the weighted terrain roll (TERRAIN_WEIGHTS)
  // and the terrain-constrained route pools (TERRAIN_ROUTE_POOLS) in
  // resolveConfig are reachable ONLY via tradeRouteAccess:'random_trade' with an
  // 'auto' (unpinned) terrain, so every fixed-route/fixed-terrain row above
  // bypasses them. terrainOverride 'auto' is required here: the base pins
  // 'plains', which suppresses the roll (doRandomTerrain needs an unset/auto
  // override). Seeded → deterministic. The 'mountain' variant pins the
  // override+random_trade interaction: the explicit override wins the terrain, so
  // doRandomTerrain stays false and the route rolls from the GENERIC pool, not
  // the terrain pool.
  for (const s of [seed, 'gm-seed-a', 'gm-seed-b', 'gm-seed-c']) {
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', _seed: s });
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'mountain', _seed: s });
  }
  // A few extra seeds on the base config (seed sensitivity is also locked).
  for (const s of ['gm-seed-a', 'gm-seed-b', 'gm-seed-c']) rows.push({ ...base, _seed: s });
  // The trade/threat sweeps re-include the base values; dedupe by key so each
  // config appears once.
  const seen = new Set();
  return rows.filter((c) => {
    const k = keyOf(c);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
