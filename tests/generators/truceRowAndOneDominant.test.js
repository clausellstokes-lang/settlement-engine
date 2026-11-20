/**
 * truceRowAndOneDominant.test.js — TAIL-POWERS-B batch 3 (the chair's rulings P13(2) and P14, 2026-11-15):
 * (P13(2)) THE DIRECTION READS THE CAPTURE RUNG: the hall-and-thieves row at the truce rung (equilibrium: "leaves it alone
 * because stamping it out would cost more than it saves") is 'stable', never 'escalating', whatever the legitimacy; a
 * legitimacy crisis still escalates a rung the hall is fighting (adversarial) or losing (corrupted, capture).
 * (P14, RECORD-MEASURE-2 G1) ONE DOMINANT POWER AT A TIME, on the final roster: a second power at the Dominant share reads
 * "Strong"; two at the same share both read "Strong". Labels only; no share moves.
 * RED AT THE BASE (40238d3ab... f89c0d7c1): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { govCriminalRelation } from '../../src/generators/factionDynamics.js';

const gov = { faction: 'Town Mayor', isGoverning: true, power: 30 };
const crim = { faction: "Thieves' Guild", power: 20 };
/** [rung, legitimacy, the direction that must print, the one that must not] */
const DIRECTIONS = /** @type {Array<[string, Record<string, boolean>, string, string]>} */ ([
  ['equilibrium', { isLegitimacyCrisis: true }, 'stable', 'escalating'], // refused at the base
  ['equilibrium', { isEndorsed: true }, 'stable', 'declining'], // refused at the base
  ['adversarial', { isLegitimacyCrisis: true }, 'escalating', 'stable'], // KEEP
  ['corrupted', { isLegitimacyCrisis: true }, 'escalating', 'stable'], // KEEP
  ['equilibrium', {}, 'stable', 'escalating'], // KEEP
]);

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** census towns: the reader's (r2r-town-37: Feudal Appointee~Thieves' Guild escalating at the truce) */
const TRUCE_TOWNS = ['r2r-town-37', 'r2s-famine-town-2'];
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of TRUCE_TOWNS) births[seed] = born(seed);
}, 240000);

describe('TAIL-POWERS-B batch 3 · the truce row reads its rung; one Dominant power', () => {
  for (const [rung, leg, must, mustNot] of DIRECTIONS) {
    it(`${rung} under ${JSON.stringify(leg)}: ${must}, not ${mustNot}`, () => {
      const row = govCriminalRelation(gov, crim, rung, leg);
      expect(row.direction).toBe(must);
      expect(row.direction).not.toBe(mustNot);
    });
  }
  for (const seed of TRUCE_TOWNS) {
    it(`${seed}: the hall's truce row with the thieves is stable, not escalating`, () => {
      const rows = (births[seed].powerStructure.factionRelationships || []).filter((/** @type {any} */ r) => r.captureState === 'equilibrium' && /stamping it out/.test(r.narrative || ''));
      expect(rows.length, 'anchored: the truce row prints').toBeGreaterThan(0);
      for (const r of rows) expect(r.direction).toBe('stable');
    });
  }
  it('one Dominant power: a second at the Dominant share reads Strong; a tie at the top makes both Strong', async () => {
    const { keepOneDominant } = await import('../../src/generators/factionDynamics.js');
    const two = [{ faction: 'A', power: 40, powerLabel: 'Dominant' }, { faction: 'B', power: 36, powerLabel: 'Dominant' }, { faction: 'C', power: 24, powerLabel: 'Significant' }];
    keepOneDominant(two);
    expect(two.map((f) => f.powerLabel)).toEqual(['Dominant', 'Strong', 'Significant']);
    const tie = [{ faction: 'A', power: 38, powerLabel: 'Dominant' }, { faction: 'B', power: 38, powerLabel: 'Dominant' }];
    keepOneDominant(tie);
    expect(tie.map((f) => f.powerLabel)).toEqual(['Strong', 'Strong']);
    const one = [{ faction: 'A', power: 60, powerLabel: 'Dominant' }, { faction: 'B', power: 30, powerLabel: 'Strong' }]; // KEEP
    keepOneDominant(one);
    expect(one.map((f) => f.powerLabel)).toEqual(['Dominant', 'Strong']);
  });
});
