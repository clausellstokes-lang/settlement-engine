/**
 * bar2People3Funding.test.js — BAR2-PEOPLE-3 (REVIEW-BAR-2, the POWERS worklist's row named by the labels seat; the
 * chair's grant PP11 of 2026-11-15, vetoable by the owner), on births:
 *   THE STABILITY LINE SAYS "UNDERFUNDED" ONLY WHERE THE FORCES ARE: "Tense (militarised, chronically underfunded)"
 *   (`governanceNarrative.js :: deriveBaselineStability`) prints only where the record's funding gate
 *   (`defenseProfile.economicGates.military`) reads under 1; where it reads 1 (funded in full) the same slot takes the
 *   twin "Tense (militarised)". The gate is handed in by the readiness-label replay at assembly (the power step runs
 *   before the gate exists). DRAW-FREE: the same branch of the ladder, its text only.
 * RED AT THE BASE (e2cb710ea): every funded town; the KEEP (a town whose gate is under 1) green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shapes (r2r-, r2s-) @param {string} seed */
function born(seed) {
  let m = seed.match(/^r2r-(\w+)-\d+$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  throw new Error(`no shape for ${seed}`);
}

const UNDERFUNDED = 'Tense (militarised, chronically underfunded)';
const TWIN = 'Tense (militarised)';
/** the funded towns (gate 1) that printed UNDERFUNDED at the base: each takes the twin */
// RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): the gates of r2r-city-6 and r2s-monster_pressure-city-0 lit read 0.88 (fortune moves the funding); the
// lowest r2r-city and r2s-monster_pressure-city whose gate is 1 and whose stability takes the militarised branch are city-135
// and city-199 (each alone of 200)
const ROWS = ['r2r-town-28', 'r2r-city-135', 'r2s-monster_pressure-city-199'];
/** KEEP: a town whose gate is under 1 (0.88 on the base census) keeps the line */
const KEEP = ['r2r-town-16'];

/** @type {Record<string, { stability: string, gate: unknown }>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...ROWS, ...KEEP]) {
    const s = born(seed);
    towns[seed] = { stability: String(s.powerStructure?.stability ?? ''), gate: s.defenseProfile?.economicGates?.military };
  }
}, 600000);

describe('BAR2-PEOPLE-3 · "underfunded" only where the funding gate is under 1 (PP11)', () => {
  for (const seed of ROWS) {
    it(`${seed}: the gate reads 1; not "${UNDERFUNDED}": its twin "${TWIN}" prints`, () => {
      expect(towns[seed].gate).toBe(1);
      expectAbsentWithAnchor(towns[seed].stability, 'underfunded', TWIN, `${seed}: the twin prints, not the underfunded line`);
      expect(towns[seed].stability.startsWith(TWIN)).toBe(true);
    });
  }
  for (const seed of KEEP) {
    it(`KEEP ${seed}: the gate reads under 1; "${UNDERFUNDED}" still prints`, () => {
      expect(Number(towns[seed].gate)).toBeLessThan(1);
      expect(towns[seed].stability.startsWith(UNDERFUNDED)).toBe(true);
    });
  }
  it('THE LAW over every birth above: the line says "underfunded" only where the gate is under 1', () => {
    const failures = collectSeedFailures(Object.keys(towns), (seed) => {
      const t = towns[seed];
      if (t.stability.includes('underfunded')) expect(Number(t.gate), seed).toBeLessThan(1);
    });
    expectNoSeedFailures(failures, '"underfunded" is said only where the funding gate is under 1');
  });
});
