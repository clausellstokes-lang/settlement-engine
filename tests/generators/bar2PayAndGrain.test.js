/**
 * bar2PayAndGrain.test.js — BAR2-LABELS-2 batch 4 (LB4 and LB6's need line, the chair's ruling of 2026-11-15 and its grant LB7, vetoable by
 * the owner): THE DEFENDERS' PAY HAS ONE HOME, the defence generator's funded gate of the forces,
 * `defenseProfile.economicGates.military` (1 = fully funded; the page's own wages line, DS-DEF-11, falls below 1). The
 * three lines that read config dials instead now read it, after the profile is written (`assembleSettlement.js`):
 *   · the guard line's "disciplined but resource-constrained … irregular pay" only below 1 (at 1:
 *     `safetyLineTruth.js :: PAID_IN_FULL`); its "well paid, well equipped" only at 1 (below: the irregular-pay line);
 *   · the validator's "chronically underfunded" (and "barely maintained") only below 1 (at 1:
 *     `structuralValidator.js :: FUNDED_EMBATTLED`).
 * And LB6 (C26982): the need line "… depend on grain brought in" only where the food record brings food in
 * (`foodSecurity.importPct` above 0; `chainNeedShown.js :: chainNeedLine`); else the food good is left out of it, and the
 * card states no need where nothing else is brought in.
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs, its r2r- arm). A DECLARED MOVE of the record (the families in
 * the commit). Each NOT pair is red at the batch's base (d1e7b3f9e); each KEEP pair is green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { PAID_IN_FULL, manyForce } from '../../src/generators/safetyLineTruth.js';
import { FUNDED_EMBATTLED } from '../../src/generators/structuralValidator.js';
import { chainNeedLine } from '../../src/domain/display/chainNeedShown.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own birth (seedcfg.mjs, its r2r- arm). @param {string} seed */
const birth = (seed) => {
  const calm = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }), null, { seed, customContent: {} });
};
const IRREGULAR = /irregular pay/;
const WELL_PAID = /well paid,? (?:and )?well equipped/;
const UNDERFUNDED = /chronically underfunded: poor equipment|so underfunded that they are barely maintained/;
/** @param {any} t */ const guard = (t) => String(t.economicState?.safetyProfile?.guardEffectivenessDesc ?? '');
/** @param {any} t */ const reasons = (t) => (t.structuralViolations ?? []).map((/** @type {any} */ v) => String(v?.reason ?? '')).join(' | ');
/** @param {any} t */ const gate = (t) => t.defenseProfile?.economicGates?.military;

/** @type {Map<string, any>} */
const born = new Map();
/** @param {string} seed */
const town = (seed) => { if (!born.has(seed)) born.set(seed, birth(seed)); return born.get(seed); };

describe('BAR2-LABELS-2 batch 4: the defenders\' pay reads the military gate (LB4); the need line reads the food record (LB6)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('NOT "irregular pay" where the gate is 1 (the paid-in-full twin prints); KEEP: below 1 it stands', () => {
    const failures = collectSeedFailures(['r2r-town-28', 'r2r-city-6', 'r2r-metropolis-0'], (seed) => {
      const t = town(seed);
      expect(gate(t), `${seed}: the gate`).toBe(1);
      expect(IRREGULAR.test(guard(t)), `${seed}: no irregular pay`).toBe(false);
      const law = /^The (.+?) (?:is|are) disciplined, paid in full/.exec(guard(t))?.[1] ?? '';
      expect(guard(t).startsWith(PAID_IN_FULL(law, manyForce(law))), `${seed}: the paid-in-full twin`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the irregular-pay line reads the gate');
    const keep = town('r2r-town-15');
    expect(gate(keep), 'r2r-town-15: the gate below 1').toBeLessThan(1);
    expect(IRREGULAR.test(guard(keep)), 'r2r-town-15 keeps irregular pay').toBe(true);
  }, 240_000);

  test('NOT "well paid, well equipped" where the gate is below 1 (the irregular-pay line prints); KEEP: at 1 it stands', () => {
    const t = town('r2r-town-9');
    expect(gate(t), 'r2r-town-9: the gate below 1').toBeLessThan(1);
    expect(WELL_PAID.test(guard(t)), 'r2r-town-9: no well paid').toBe(false);
    expect(guard(t).startsWith('The garrison and town watch are disciplined but resource-constrained: motivated with inadequate equipment and irregular pay.'), 'r2r-town-9: the irregular-pay line').toBe(true);
    const keep = town('r2r-town-10');
    expect(gate(keep), 'r2r-town-10: the gate').toBe(1);
    expect(WELL_PAID.test(guard(keep)), 'r2r-town-10 keeps well paid').toBe(true);
  }, 240_000);

  test('NOT "chronically underfunded" where the gate is 1 (the funded twin prints); KEEP: below 1 it stands', () => {
    const failures = collectSeedFailures(['r2r-thorp-45', 'r2r-city-47', 'r2r-metropolis-2'], (seed) => {
      const t = town(seed);
      expect(gate(t), `${seed}: the gate`).toBe(1);
      expect(UNDERFUNDED.test(reasons(t)), `${seed}: no underfunding`).toBe(false);
      expect(reasons(t).includes(FUNDED_EMBATTLED), `${seed}: the funded twin`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the validator\'s funding reason reads the gate');
    const keep = town('r2r-thorp-17');
    expect(gate(keep), 'r2r-thorp-17: the gate below 1').toBeLessThan(1);
    expect(UNDERFUNDED.test(reasons(keep)), 'r2r-thorp-17 keeps chronic underfunding').toBe(true);
  }, 240_000);

  test('LB6 NOT: "grain brought in" where the food record brings no food in (the card states its other needs, or none); KEEP: food comes in', () => {
    /** @param {any} t */
    const needs = (t) => { const out = []; for (const c of t.economicState.activeChains ?? []) { const line = chainNeedLine(c, t, !out.length); if (line) out.push(line); } return out.join(' '); };
    const failures = collectSeedFailures(['r2r-town-10', 'r2r-town-21', 'r2r-town-34'], (seed) => {
      const t = town(seed);
      expect(t.economicState.foodSecurity.importPct, `${seed}: no food brought in`).toBe(0);
      expect(/depend on [^.]*grain[^.]* brought in/.test(needs(t)), `${seed}: no grain brought in`).toBe(false);
    });
    expectNoSeedFailures(failures, 'the need line reads the food record');
    const keep = town('r2r-town-11');
    expect(keep.economicState.foodSecurity.importPct, 'r2r-town-11: food brought in').toBeGreaterThan(0);
    expect(/depend on [^.]*grain[^.]* brought in/.test(needs(keep)), 'r2r-town-11 keeps grain brought in').toBe(true);
  }, 240_000);

  test('THE LAW, on every birth above: a gate of 1 never prints irregular pay or underfunding; a gate below 1 never prints well paid', () => {
    const failures = collectSeedFailures([...born.keys()], (seed) => {
      const t = town(seed);
      const g = gate(t);
      if (g === 1) {
        expect(IRREGULAR.test(guard(t)), `${seed}: gate 1, irregular pay`).toBe(false);
        expect(UNDERFUNDED.test(reasons(t)), `${seed}: gate 1, underfunded`).toBe(false);
      } else if (typeof g === 'number') {
        expect(WELL_PAID.test(guard(t)), `${seed}: gate ${g}, well paid`).toBe(false);
      }
    });
    expect(born.size).toBeGreaterThanOrEqual(13);
    expectNoSeedFailures(failures, 'the pay lines read the gate');
  }, 240_000);
});
