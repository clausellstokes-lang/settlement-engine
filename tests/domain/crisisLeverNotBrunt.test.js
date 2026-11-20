/**
 * crisisLeverNotBrunt.test.js — R2-CODE-B-13, the reader's M4 (REVIEW-R2-CODE-B-2026-11-14 §9): the natural kinds cast
 * the brunt first and the lever second, and nothing kept them apart: one person "takes the worst of it: one of the
 * house the crisis hits" while holding the lever ("runs the office that decides how the crisis goes"), 56 crises of the
 * 1,536 births (rr2s-village-famine-rand-1: Olivera Novikov runs the mill, holds the lever and "has food, enough to
 * matter"). RULED (M4): THE ONE WHO HOLDS THE LEVER DOES NOT BEAR THE BRUNT: the next of the hit house, else ABSENT by
 * its reason. The lever is not re-drawn (src/domain/crisis/crisisCast.js :: deriveCrisisCast).
 * COLLECTED over census towns (every crisis checked); KEEP-GUARD (the lever stays the office-holder who runs it);
 * TAKEN-OFF GUARD (in these towns the lever's holder is a brunt candidate of the house hit, so the rule bites).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { CAST_ABSENCES, CAST_REASONS, bruntCandidates, deriveStakes } from '../../src/domain/crisis/crisisCast.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function cfgFor(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  throw new Error(seed);
}
/** Towns where one person held both at 3a4198e0f: the four natural kinds, a hamlet to a city. */
const SEEDS = ['r2r-hamlet-10', 'r2r-hamlet-27', 'r2r-village-28', 'r2r-village-58', 'r2r-town-37', 'r2r-city-47',
  'r2s-famine-village-1', 'r2s-famine-town-2', 'r2s-plague_onset-village-0', 'r2s-plague_onset-village-1',
  'r2s-plague_onset-town-3', 'r2s-monster_pressure-town-0'];

/** @type {Array<{ seed: string, s: any }>} */
const rows = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) rows.push({ seed, s: generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }) });
}, 300000);

describe('M4: the one who holds the lever does not bear the brunt', () => {
  test('COLLECTED: no crisis casts one person as both; the brunt is the next of the house, else absent by its reason', () => {
    const wrong = [];
    let levers = 0;
    let collided = 0;
    for (const { seed, s } of rows) {
      for (const e of [].concat(s.stress || [])) {
        const cast = e?.cast;
        if (!cast) continue;
        const brunt = cast.roles.find((r) => r.role === 'brunt');
        const lever = cast.roles.find((r) => r.role === 'lever');
        if (!lever || lever.kind !== 'npc' || lever.temporary) continue;
        levers += 1;
        if (lever.reason !== CAST_REASONS.leverRuns) wrong.push([seed, e.type, 'lever re-drawn', lever.reason]);
        const cands = bruntCandidates(s, String(e.type), deriveStakes(s, String(e.type))).candidates;
        if (cands.some((c) => c.kind === 'npc' && c.id === lever.id)) collided += 1;
        if (brunt && brunt.kind === 'npc' && brunt.id === lever.id) wrong.push([seed, e.type, 'both', brunt.name]);
        if (!brunt && !cast.absent.some((a) => a.role === 'brunt' && Object.values(CAST_ABSENCES).includes(a.reason))) wrong.push([seed, e.type, 'brunt gone without its reason']);
      }
    }
    expect(wrong).toEqual([]);
    expect(levers, 'KEEP-GUARD: the lever stays with the office-holder in these towns').toBeGreaterThanOrEqual(10);
    expect(collided, 'TAKEN-OFF GUARD: the lever\'s holder is a brunt candidate of the house hit, so the rule bites').toBeGreaterThanOrEqual(10);
  });
});
