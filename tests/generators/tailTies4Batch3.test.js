/**
 * tests/generators/tailTies4Batch3.test.js — TAIL-TIES-4 batch 3 (the worklist's next row by width, 17103 and X9 11965; the chair's
 * ruling (T21)): the economic-betrayal secret "shorting investments they publicly recommend" printed in towns with no house of
 * finance (a hamlet, towns, a famine city): reworded to what any trader bears, for the owner's veto
 * (`npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER.economic_betrayal#0`). The draw is not moved: the same card holds the same row.
 *
 * @enforced-by npx vitest run tests/generators/tailTies4Batch3.test.js
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
/** every person's secret text in the town @param {string} seed @returns {string[]} */
const secrets = (seed) => (of(seed).npcs || []).map((/** @type {any} */ n) => JSON.stringify(n.secret ?? ''));
const OLD = 'shorting investments they publicly recommend', NOW = 'betting against the ventures they talk their neighbours into';
/** [seed, why the old line was false there] */
const NOT = [['r2r-hamlet-32', 'a hamlet with no house of finance'], ['r2r-town-17', 'no house of finance'], ['r2s-famine-metropolis-2', 'no house of finance']];

describe('TAIL-TIES-4 batch 3: a secret claims no investments the town has no house for (T21)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT: the old line is gone; INSTEAD: the same card holds the reworded row', () => {
    const failures = collectSeedFailures(NOT, ([seed, why]) => {
      expect(secrets(seed).filter((t) => t.includes(OLD)), `${seed} (${why})`).toEqual([]);
      expect(secrets(seed).some((t) => t.includes(NOW)), `${seed}: instead`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the old line is gone and the same card holds the reworded row');
  });

  it('KEEP: the row\'s stakes still print beside it', () => {
    const failures = collectSeedFailures(NOT, ([seed]) => { expect(secrets(seed).some((t) => t.includes('Civil fraud liability')), seed).toBe(true); });
    expectNoSeedFailures(failures, 'the row\'s stakes still print beside it');
  });
});
