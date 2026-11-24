/**
 * THE LATE RE-READ (TAIL-CRISIS-5, the chair's ruling K21 of 2026-11-15, vetoable by the owner; ORDER-MEASURE-1's cure
 * C1b): the stress entries' summary, hook and note are rendered again after the last roster write, against the SETTLED
 * record, from the kept roll and the catalogue's original hook and note. With it, the two declarations it was made for:
 * the insurgency's strong line keyed by `rival power` (a rival of standing, true of the SETTLED record only: K10), and
 * monster_pressure's "Its defences were built for quieter times" (a defence that exists; declared since batch 1, read
 * here against the settled record).
 *
 * THE GUARD (structural prevention, the measuring seat's): a declaration whose needs read the powers is resolved after
 * the last roster write. (1) The source order: the late re-read stands after every roster writer in
 * assembleSettlement.js and before the receipt. (2) On births of the census's own seeds (CENSUS-3 seedcfg.mjs, the
 * r2r-/r2s- arms, copied): every stored summary is the one its renderer gives against the town's FINAL record, so a
 * declaration added later that reads a fact settled after the first render is caught on any seed it moves.
 * (3) Pairs: the strong line where a rival of standing holds at the end (red at 3f45e6fa9, where the summary was on its
 * fallback), and the plain line where the roster loses its rival in the resize (green at 3f45e6fa9; red under a plant
 * that keeps the declaration and drops the late re-read: the K10 hazard).
 */
import fs from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { renderStressSummary } from '../../src/generators/stressNarrative.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { rivalPowerOf } from '../../src/domain/facts/rivalPower.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
    let cfg;
    if (m) cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
    else {
      m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
      if (!m) throw new Error(`no configuration for ${seed}`);
      cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    }
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 120000);

/** @param {any} s @param {string} type */
const summaryOf = (s, type) => String(([].concat(s.stress || []).find((/** @type {any} */ e) => e?.type === type) || {}).summary || '').replaceAll(String(s.name), '{name}');

const STRONG = 'A strong power in {name} has stopped obeying the government. Its people stall, its taxes go unpaid, and it waits.';
const PLAIN = 'Some in {name} have stopped obeying the government. They stall, their taxes go unpaid, and they wait.';

/** A rival of standing at the end: the strong line (the smallest, the largest, a crisis arm). */
// RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-thorp-25 lit holds no rival of standing at the end; the lowest
// r2r-thorp under an insurgency that holds one at the end is thorp-60 (60 75 of 200)
const RIVAL = ['r2r-thorp-60','r2s-insurgency-village-1', 'r2s-insurgency-city-2', 'r2r-metropolis-26'];
/** No rival of standing at the end, though the roster held one when the summary was first rendered (lost in the resize). */
const LOST_IN_RESIZE = ['r2r-thorp-22', 'r2r-thorp-29', 'r2r-thorp-52', 'r2s-insurgency-thorp-0', 'r2s-insurgency-thorp-1', 'r2s-insurgency-thorp-2', 'r2s-insurgency-hamlet-0', 'r2s-insurgency-hamlet-1', 'r2s-insurgency-hamlet-2', 'r2s-insurgency-hamlet-3'];
/** No rival of standing at any point. */
const NEVER = ['r2r-metropolis-51', 'r2s-insurgency-metropolis-1'];
/** monster_pressure: a defence that exists keeps "built for quieter times"; none takes the twin. */
const DEFENDED = ['r2r-hamlet-10', 'r2s-monster_pressure-thorp-2', 'r2s-monster_pressure-metropolis-3'];
const UNDEFENDED = ['r2r-thorp-5', 'r2s-monster_pressure-village-3'];

describe('the insurgency summary: the strong line needs a rival of standing ON THE SETTLED RECORD', () => {
  it('each RIVAL seed holds a rival of standing at the end and prints the strong line (red at 3f45e6fa9: the plain line) (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(RIVAL, (seed) => {
      const s = birth(seed);
      expect(rivalPowerOf(s), `${seed} holds a rival of standing at the end`).toBe(true);
      expect(summaryOf(s, 'insurgency'), `${seed} prints the strong line`).toBe(STRONG);
    }), 'every RIVAL seed holds a rival of standing at the end and prints the strong line');
  });
  it('each LOST_IN_RESIZE seed lost its rival in the resize and prints the plain line (red where the first render is stored) (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(LOST_IN_RESIZE, (seed) => {
      const s = birth(seed);
      expect(rivalPowerOf(s), `${seed} lost its rival in the resize`).toBe(false);
      expect(summaryOf(s, 'insurgency'), `${seed} prints the plain line`).toBe(PLAIN);
    }), 'every LOST_IN_RESIZE seed lost its rival in the resize and prints the plain line');
  });
  it('each NEVER seed never held a rival of standing and prints the plain line (KEEP) (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NEVER, (seed) => {
      expect(summaryOf(birth(seed), 'insurgency'), `${seed} never held a rival of standing and prints the plain line`).toBe(PLAIN);
    }), 'every NEVER seed prints the plain line');
  });
});

describe('monster_pressure: "built for quieter times" needs a defence that exists (KEEP pairs, both ways)', () => {
  it('each DEFENDED seed keeps a defence and says its defences were built for quieter times (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(DEFENDED, (seed) => {
      expect(summaryOf(birth(seed), 'monster_pressure'), `${seed} keeps a defence and says its defences were built for quieter times`).toContain('Its defences were built for quieter times.');
    }), 'every DEFENDED seed says its defences were built for quieter times');
  });
  it('each UNDEFENDED seed keeps none and says it has nothing to hold such things off (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(UNDEFENDED, (seed) => {
      expect(summaryOf(birth(seed), 'monster_pressure'), `${seed} keeps none and says it has nothing to hold such things off`).toContain('It has nothing built or kept to hold such things off.');
    }), 'every UNDEFENDED seed says it has nothing to hold such things off');
  });
});

describe('THE GUARD: a declaration that reads a late fact is resolved after the last roster write', () => {
  it('the late re-read stands after every roster writer and the hook pass, and before the receipt (source order)', () => {
    const src = fs.readFileSync(new URL('../../src/generators/steps/assembleSettlement.js', import.meta.url), 'utf8');
    const at = (/** @type {string} */ needle) => { const i = src.lastIndexOf(needle); expect(i, needle).toBeGreaterThan(-1); return i; };
    const late = at('for (const [e, kept] of stressLateReads) readStressEntry(e, kept);');
    for (const writer of ['reconcilePowerStructure(', 'resizePoliticalRoster({', 'storeTrueHooksOnly(settlement', 'resolveFactionLabelsAtClose(settlement)']) {
      expect(late, `the late re-read after ${writer}`).toBeGreaterThan(at(writer));
    }
    expect(late, 'the late re-read before the receipt').toBeLessThan(at('buildGenerationCoherenceReceipt('));
  });
  it('every stored summary is the one its renderer gives against the FINAL record (insurgency and monster towns)', () => {
    const failures = collectSeedFailures([...RIVAL, ...LOST_IN_RESIZE, ...NEVER, ...DEFENDED, ...UNDEFENDED], (seed) => {
      const s = birth(seed);
      for (const e of [].concat(s.stress || [])) {
        const /** @type {any} */ x = e;
        if (!x || x.type === 'wartime') continue; // wartime's roll is not kept on the record; its two texts are checked by its own tests
        expect(x.summary, `${seed} ${x.type}`).toBe(renderStressSummary(x.type, s.name, null, x.direction, factsOf(s)));
      }
    });
    expectNoSeedFailures(failures, 'every stored stress summary is the one its renderer gives against the FINAL record');
  });
});
