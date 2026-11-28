/**
 * tests/generators/tailTies4Batch1.test.js — TAIL-TIES-4 batch 1 (the chair's ruling (T18) of 2026-11-15, vetoable by the owner),
 * collected on births: three loyalty hooks new on the tabs at the landed tip (READ-ALL-4). The cargo "lost at sea" and its
 * inland twin come only by an open route (no siege; not isolated: `npcData.js :: NPC_FACTION_LOYALTY.economy`), and the twin
 * claims no road a river town may lack ("lost on its way here", reworded for the owner's veto: `NPC_HOOK_SIBLINGS`); the scales
 * and the lender's note on "their shop" need a market. A refused row resolves within its own pool (the draw's own
 * resolution); every card keeps its hook.
 * NOT pairs: each printed at 2f2f9f12d (the 720 census, by record) and is false there by the fact named.
 * KEEP pairs: a true print at the base that still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTies4Batch1.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed); // the census's r2s arm (seedcfg.mjs), verbatim
  if (r2s) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
  const m = /** @type {RegExpExecArray} */ (/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};

/** @type {Map<string, any>} */ const births = new Map();
const of = (/** @type {string} */ seed) => { if (!births.has(seed)) births.set(seed, born(seed)); return births.get(seed); };
/** every person's stored hook text in the town @param {string} seed @returns {string[]} */
const hooks = (seed) => (of(seed).npcs || []).flatMap((/** @type {any} */ n) => n.plotHooks || []);

const L = {
  cargo: 'A valuable cargo was reported lost', road: 'A valuable cargo was reported lost on the road', way: 'A valuable cargo was reported lost on its way here',
  sea: 'A valuable cargo was reported lost at sea', scales: 'Their scales were tested and found heavy', lender: 'A lender has bought the note on their shop',
};
/** [seed, line, the fact that makes it false there] */
const NOT = [
  ['r2s-under_siege-town-1', 'cargo', 'siege'], ['r2s-under_siege-metropolis-3', 'cargo', 'siege'],
  ['r2r-village-0', 'cargo', 'isolated'], ['r2r-city-49', 'cargo', 'isolated'], ['r2r-metropolis-56', 'cargo', 'isolated'],
  ['r2r-city-6', 'road', 'a river town'], ['r2r-city-22', 'road', 'a river town'], ['r2r-metropolis-16', 'road', 'a river town'],
  ['r2r-thorp-17', 'scales', 'no market'], ['r2r-village-54', 'scales', 'no market'], ['r2s-mass_migration-village-1', 'scales', 'no market'],
  ['r2r-thorp-38', 'lender', 'no market'], ['r2r-village-22', 'lender', 'no market'], ['r2r-village-47', 'lender', 'no market'],
];
/** [seed, line] a true print at the base */
const KEEP = [['r2r-city-16', 'sea'], ['r2r-city-41', 'scales'], ['r2r-town-31', 'lender']];

describe('TAIL-TIES-4 batch 1: a cargo needs an open route; scales and a shop need a market (T18)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT: the line is gone where the town makes it false, and every titled person there still holds a hook', () => {
    const failures = collectSeedFailures(NOT, ([seed, key, why]) => {
      expect(hooks(seed).filter((h) => h.includes(L[key])), `${seed}: ${key} (${why})`).toEqual([]);
      expect((of(seed).npcs || []).filter((/** @type {any} */ n) => n.title !== undefined && !(n.plotHooks || []).length).map((/** @type {any} */ n) => n.name), `${seed}: a mute card`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'the refused line is gone where the town makes it false, and no titled card is mute');
  });

  it("INSTEAD: a river town's cargo is lost on its way here (the sea line's twin keeps the draw)", () => {
    const failures = collectSeedFailures(['r2r-city-6', 'r2r-city-22', 'r2r-metropolis-16'], (seed) => {
      expect(hooks(seed).some((h) => h.includes(L.way)), seed).toBe(true);
    });
    expectNoSeedFailures(failures, "every river town's cargo is lost on its way here");
  });

  it('KEEP: where the town holds the fact, the line still prints', () => {
    const failures = collectSeedFailures(KEEP, ([seed, key]) => {
      expect(hooks(seed).some((h) => h.includes(L[key])), `${seed}: ${key}`).toBe(true);
    });
    expectNoSeedFailures(failures, 'where the town holds the fact, the line still prints');
  });
});
