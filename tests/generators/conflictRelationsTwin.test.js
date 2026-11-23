/**
 * conflictRelationsTwin.test.js — TAIL-POWERS-B-2 (the chair's P13(1)/P19, 2026-11-15): ONE HOME FOR A PAIR'S STANDING.
 * A relation row called symbiotic or dependent where the conflicts hold the same pair at HIGH no longer reads 'stable'
 * with no word of the quarrel: on the final record (factionDynamics.js :: withConflictRelations, the pipeline's final-
 * roster seam) it keeps its kind and its bargain and takes a twin that names the quarrel, its direction 'escalating'.
 * A row of another kind (tense, subordinate) is kept as drawn. BAR3-POWERS (C21481, C51168; 2026-11-15, the chair's P3): a
 * bargain beside a conflict of the pair BELOW HIGH names the quarrel too, its direction kept (the arm below re-keyed so).
 * RED AT THE BASE (700ba76cf): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** [town, the pair the conflicts hold at HIGH] — the readers' rows 09930..10588 (WORKLIST-DISPLAY-CIVIC) */
const REFUSED = /** @type {Array<[string, string, string]>} */ ([
  ['r2s-monster_pressure-metropolis-0', 'Grand Merchant Senate', 'Military/Guard'],
  ['r2s-insurgency-metropolis-3', 'Ducal Governorship', 'Military/Guard'],
  // RE-PICKED BY THE PREMISE (the flip, 2026-11-23, CLOSE-5 F-SEAT): r2s-religious_conversion-metropolis-1's Grand Merchant
  // Oligarchy ~ Military/Guard row is drawn 'competitive' lit; metropolis-4 is the lowest of its family (of 200, lit) whose
  // conflicts hold the seat and the Military/Guard at HIGH beside a symbiotic or dependent row (the premise's own predicate)
  ['r2s-religious_conversion-metropolis-4', 'Grand Guild Consortium', 'Military/Guard'],
]);
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed] of REFUSED) births[seed] = born(seed);
}, 300000);

const same = (/** @type {string[]} */ p, /** @type {string[]} */ q) => (p[0] === q[0] && p[1] === q[1]) || (p[0] === q[1] && p[1] === q[0]);

describe('TAIL-POWERS-B-2 · P19: a pair at HIGH conflict is not called a stable bargain', () => {
  for (const [seed, a, b] of REFUSED) {
    it(`${seed}: ${a} ~ ${b} names the quarrel and escalates`, () => {
      const s = births[seed];
      const quarrel = (s.conflicts || []).find((/** @type {any} */ c) => c.intensity === 'high' && same(c.parties, [a, b]));
      expect(quarrel, 'anchored: the conflicts hold the pair at HIGH').toBeTruthy();
      const row = s.powerStructure.factionRelationships.find((/** @type {any} */ r) => same(r.pair, [a, b]));
      expect(['symbiotic', 'dependent']).toContain(row.type); // the kind is kept
      expect(row.direction).not.toBe('stable');
      expect(row.direction).toBe('escalating');
      expect(row.narrative).toContain(`Even so, the two are now at odds over ${quarrel.issue.toLowerCase()}.`);
      expect(row.narrative).toMatch(/gives the orders and the Guard carries them out/); // KEEP: the bargain stands // NAMES-1 (CN1): the article
    });
  }
  // RE-KEYED TO BAR3-POWERS (the flip, 2026-11-23, CLOSE-5 F-SEAT; the census's cause): the seam twins a bargain beside a
  // conflict of the pair at ANY intensity (the seam arm below holds it), so a row is kept as drawn where it is no bargain or
  // the conflicts hold its pair at no intensity (was: at no HIGH), and a bargain held below HIGH must name its quarrel
  it('KEEP: every other row of those towns is kept as drawn (no twin where the conflicts do not hold a bargain\'s pair; below HIGH the bargain names its quarrel)', () => {
    const failures = collectSeedFailures(REFUSED, ([seed]) => {
      const s = births[seed];
      const highs = (s.conflicts || []).filter((/** @type {any} */ c) => c.intensity === 'high');
      let kept = 0;
      for (const r of s.powerStructure.factionRelationships) {
        const atHigh = highs.some((/** @type {any} */ c) => same(c.parties, r.pair));
        const held = (s.conflicts || []).some((/** @type {any} */ c) => same(c.parties, r.pair));
        const bargain = ['symbiotic', 'dependent'].includes(r.type);
        if (bargain && held && !atHigh) expect(r.narrative, `${seed}: ${r.pair}, a bargain below HIGH, names its quarrel (BAR3-POWERS)`).toContain('Even so, the two are now at odds over');
        if (!held || !bargain) {
          kept += 1;
          expect(r.narrative, `${seed}: ${r.pair} has a drawn narrative`).toMatch(/\S/);
          // anchored: the toMatch(/\S/) above proves this same row's narrative is a live drawn string
          expect(r.narrative).not.toMatch(/Even so, the two are now at odds/);
        }
      }
      expect(kept, `${seed}: the town has rows kept as drawn for this check to read`).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'every row of those towns not at HIGH is kept as drawn');
  });
  it('the seam alone: tense and subordinate rows are kept; a moderate bargain names its quarrel, its direction kept; the input is not mutated', async () => {
    const { withConflictRelations } = await import('../../src/generators/factionDynamics.js');
    const ps = { factionRelationships: [
      { pair: ['A', 'B'], type: 'symbiotic', direction: 'stable', narrative: 'A gives the orders.' },
      { pair: ['C', 'A'], type: 'tense', direction: 'stable', narrative: 'C rivals A.' }, // KEEP: not a bargain
      { pair: ['A', 'D'], type: 'dependent', direction: 'stable', narrative: 'A needs D.' }, // moderate: named, direction kept (BAR3-POWERS)
    ] };
    const conflicts = [
      { parties: ['B', 'A'], intensity: 'high', issue: 'An unpaid debt between the two powers' },
      { parties: ['A', 'C'], intensity: 'high', issue: 'Precedence at public gatherings' },
      { parties: ['A', 'D'], intensity: 'moderate', issue: 'A loan called in early' },
    ];
    const out = withConflictRelations(ps, conflicts);
    expect(out.factionRelationships[0]).toMatchObject({ type: 'symbiotic', direction: 'escalating', narrative: 'A gives the orders. Even so, the two are now at odds over an unpaid debt between the two powers.' });
    expect(out.factionRelationships[1]).toBe(ps.factionRelationships[1]);
    expect(out.factionRelationships[2]).toMatchObject({ type: 'dependent', direction: 'stable', narrative: 'A needs D. Even so, the two are now at odds over a loan called in early.' });
    expect(ps.factionRelationships[0].direction).toBe('stable');
    expect(withConflictRelations(ps, [])).toBe(ps);
  });
});
