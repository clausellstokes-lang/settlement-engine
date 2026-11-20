/**
 * tests/data/tailDefeconDEmptyRosterBand.test.js — TAIL-DEFECON-D, the chair's D20 (2026-11-15; RECORD-MEASURE-2 class f,
 * measured and granted): AN EMPTY ROSTER READS AT MOST VULNERABLE. "Lightly Defended" (and once "Defensible") with no
 * walls, garrison, militia, watch or hired company on the roster: 24 of the census's 720 at 345f13157, each red here at
 * that base; a town whose roster holds a force keeps its band (KEEP); where `held` is not given the band is the ladder's
 * alone (the posture pool's bare-score reading).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { readinessBandOf } from '../../src/data/bandLadders.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
}

/** [seed, the band its badge must read] */
const GONE = [['r2r-thorp-0', 'Vulnerable'], ['r2r-thorp-3', 'Vulnerable'], ['r2r-thorp-5', 'Vulnerable']];
const KEEP = [['r2r-thorp-2', 'Lightly Defended'], ['r2r-thorp-4', 'Lightly Defended']];

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed] of [...GONE, ...KEEP]) towns[seed] = censusBirth(seed).defenseProfile.readiness.label;
}, 600000);

describe('D20: an empty roster reads at most Vulnerable', () => {
  for (const [seed, band] of GONE) test(`${seed}: no wall and no force, so "${band}", not "Lightly Defended"`, () => expect(towns[seed]).toBe(band));
  for (const [seed, band] of KEEP) test(`${seed}: a force on the roster keeps "${band}"`, () => expect(towns[seed]).toBe(band));
  test('the leaf: false caps at Vulnerable, true floors above Undefended, omitted is the ladder alone', () => {
    expect(readinessBandOf(60, false).label).toBe('Vulnerable');
    expect(readinessBandOf(5, false).label).toBe('Undefended');
    expect(readinessBandOf(5, true).label).toBe('Vulnerable');
    expect(readinessBandOf(60, true).label).toBe('Well-Defended');
    expect(readinessBandOf(30).label).toBe('Lightly Defended');
    expect(readinessBandOf(5).label).toBe('Undefended');
  });
});
