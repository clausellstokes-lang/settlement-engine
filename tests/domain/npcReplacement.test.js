/**
 * npcReplacement.test.js — W-H3: THE SETTLEMENT'S FINGERPRINT, MEASURED, AND THE
 * POPULATION FLOOR.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §5 replacement + bias + stationarity, §9 the
 * population floor reconciliation; §12's envelope instruments.)
 *
 * THE TWO CLAIMS THIS FILE EXISTS FOR, and they pull in opposite directions:
 *   1. EFFECT SIZE. The bias is real and reads at scale. An unbiased draw would put the
 *      favoured rung at 1/3; the designed weight puts it at 0.513, and the registered
 *      envelope's LOWER bound is what makes "the bias is actually applied" measurable
 *      rather than asserted.
 *   2. STATIONARITY. The bias does not COMPOUND. A cohort minted at year 100 lands inside
 *      the same envelope as one minted at year 10, so the corruption-attracts-corruption
 *      loop is shut. The UPPER bound is what makes that measurable.
 * One registered pair of bounds carries both, on purpose: stationarity IS the claim that
 * the later cohort still lands inside the earlier one's envelope, and a second pair would
 * have been a second definition of the same property.
 *
 * THE NEGATIVE CONTROLS ARE EXECUTED, NOT DESCRIBED. The effect-size control drives the
 * draw at weight 0 through the module's own band arithmetic and shows the favoured count
 * collapsing under the lower bound. The stationarity control runs a MUTANT bias that
 * reads the cast (the loop the design forbids) and shows the year-100 cohort escaping the
 * upper bound while the real one does not.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';
import {
  MINT_BIAS_BANDS,
  MINT_BIAS_KEYS,
  biasedRung,
  drainAnonymousFirst,
  effectivePopulationForFloor,
  freshMintDraw,
  reconcilePopulationFloor,
  reducedToCast,
  replacementDueTick,
  replacementRoll01,
  residentNamedNpcCount,
  resolveSlotRefill,
  settlementTraitBias,
} from '../../src/domain/worldPulse/npcReplacement.js';
import { NPC_CONSEQUENCES_TUNING } from '../../src/domain/worldPulse/npcConsequencesTuning.js';
import { graduateNpc, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/distribution-envelopes.manifest.json'), 'utf8'));
const UPPER = readEnvelope(MANIFEST, 'npcConsequences.replacementBias.favoured.upper');
const LOWER = readEnvelope(MANIFEST, 'npcConsequences.replacementBias.favoured.lower');

const DARK = () => ({ simulationRules: {} });
const LIT = () => ({ simulationRules: { npcConsequencesEnabled: true } });
const SEED = 'seed-aldermoor';
const SID = 'aldermoor';

/** The corpus the registered envelope was derived over: 400 mints x 3 bands. */
const MINTS = 400;

/** A hard, prosperous, ill-tempered town: every band leans away from its middle rung. */
const hardTown = (extra = {}) => ({
  name: 'Aldermoor', tier: 'town', population: 1400,
  alignment: 'lawful evil', prosperity: 80, unrest: 70,
  npcs: [{ id: 'npc_1', name: 'Halden Roke' }, { id: 'npc_2', name: 'Sera Quill' }],
  ...extra,
});

/** Count favoured-rung hits over a cohort of fresh mints. */
function favouredCount({ settlement, mints = MINTS, tickBase = 0, weight = null }) {
  let hits = 0;
  for (let i = 0; i < mints; i += 1) {
    const draw = weight == null
      ? freshMintDraw({
        settlement, settlementSeed: `${SEED}-${i}`, settlementId: `s${i % 37}`,
        rosterId: `npc_${i % 11}`, tick: tickBase + i,
      })
      : mintAtWeight({ settlement, index: i, tick: tickBase + i, weight });
    for (const key of MINT_BIAS_KEYS) if (draw[key] === draw.bias[key]) hits += 1;
  }
  return hits;
}

/**
 * THE NEGATIVE-CONTROL DRAW. The module's own band arithmetic re-expressed with an
 * INJECTABLE weight, so "weight 0 collapses the effect" is measured through the same
 * roulette the production code runs rather than against a hand-written uniform.
 */
function mintAtWeight({ settlement, index, tick, weight }) {
  const bias = settlementTraitBias(settlement);
  /** @type {Record<string, unknown>} */
  const out = { bias };
  for (const key of MINT_BIAS_KEYS) {
    const band = MINT_BIAS_BANDS[key];
    const uniform = 1 / band.length;
    const share = weight / (band.length - 1);
    const favouredIndex = band.indexOf(bias[key]);
    const roll = replacementRoll01(
      ['npcfate:mint', `${SEED}-${index}`, `s${index % 37}`, `npc_${index % 11}`, String(tick), key].join('|'),
    );
    let acc = 0;
    let chosen = band[band.length - 1];
    for (let i = 0; i < band.length; i += 1) {
      acc += i === favouredIndex ? uniform + weight : uniform - share;
      if (roll < acc) { chosen = band[i]; break; }
    }
    out[key] = chosen;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §5 — the replacement bias, at the designed effect size', () => {
  test('the registered envelope is two-sided, powered, and read from the manifest', () => {
    expect(UPPER.direction).toBe('upper');
    expect(LOWER.direction).toBe('lower');
    expect(UPPER.n).toBe(1200);
    expect(LOWER.n).toBe(1200);
    // Both bounds carry real power; the walker enforces >= 2 sigma, and this restates it
    // locally so a reader of THIS file can see the instrument is not a coin flip.
    expect(UPPER.margin).toBeGreaterThan(2);
    expect(LOWER.margin).toBeGreaterThan(2);
  });

  test('a 400-mint cohort lands inside the envelope on both sides', () => {
    const hits = favouredCount({ settlement: hardTown() });
    expect(hits).toBeLessThanOrEqual(UPPER.bound);
    expect(hits).toBeGreaterThanOrEqual(LOWER.bound);
  });

  test('NEGATIVE CONTROL: at bias weight 0 the favoured count falls under the lower bound', () => {
    const unbiased = favouredCount({ settlement: hardTown(), weight: 0 });
    // The anchor: the SAME corpus at the SAME arithmetic with the LIVE weight is inside.
    const live = favouredCount({ settlement: hardTown(), weight: NPC_CONSEQUENCES_TUNING.REPLACEMENT_BIAS_WEIGHT });
    expect(live).toBeGreaterThanOrEqual(LOWER.bound);
    expect(unbiased).toBeLessThan(LOWER.bound);
  });

  test('every rung keeps positive mass: individuals surprise', () => {
    const seen = { alignmentLean: new Set(), economicCharacter: new Set(), stressPosture: new Set() };
    for (let i = 0; i < MINTS; i += 1) {
      const draw = freshMintDraw({
        settlement: hardTown(), settlementSeed: `${SEED}-${i}`, settlementId: SID,
        rosterId: `npc_${i % 7}`, tick: i,
      });
      for (const key of MINT_BIAS_KEYS) seen[key].add(draw[key]);
    }
    const failures = collectSeedFailures(MINT_BIAS_KEYS, (key) => {
      expect([...seen[key]].sort()).toEqual([...MINT_BIAS_BANDS[key]].sort());
    });
    expectNoSeedFailures(failures, 'every band rung is reachable under the live bias');
  });

  test('the draw consumes zero rng and is idempotent for one key', () => {
    const args = { settlement: hardTown(), settlementSeed: SEED, settlementId: SID, rosterId: 'npc_3', tick: 12 };
    expect(freshMintDraw(args)).toEqual(freshMintDraw(args));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §5 — STATIONARITY: the loop is cut at the input', () => {
  test('settlementTraitBias is invariant to the cast and variant to the state', () => {
    const state = { tier: 'town', alignment: 'lawful evil', prosperity: 80, unrest: 70 };
    const saintly = { ...state, npcs: [{ id: 'a', name: 'A', personality: { dominant: 'compassionate' }, corrupt: false }] };
    const venal = {
      ...state,
      npcs: Array.from({ length: 40 }, (_, i) => ({
        id: `n${i}`, name: `N${i}`, corrupt: true, personality: { dominant: 'greedy', flaw: 'cruel' },
      })),
      factions: [{ name: 'Ring', members: [{ id: 'n0', corrupt: true }] }],
    };
    // THE STRUCTURAL PROOF: forty corrupt residents move the bias not at all.
    expect(settlementTraitBias(venal)).toEqual(settlementTraitBias(saintly));
    // THE ANCHOR, from the same function: a SETTLEMENT-STATE change does move it, so the
    // invariance above measures a severed input rather than a dead function.
    const gentled = { ...saintly, alignment: 'neutral good', prosperity: 10, unrest: 5 };
    expect(settlementTraitBias(gentled)).not.toEqual(settlementTraitBias(saintly));
    expect(settlementTraitBias(gentled)).toEqual({
      alignmentLean: 'good', economicCharacter: 'thrifty', stressPosture: 'sanguine',
    });
  });

  test('year 100 lands in the same envelope as year 10', () => {
    // Ten ticks per year at this horizon; the settlement state is HELD, which is the
    // condition the design's claim is made under (the cast changes, the town does not).
    const town = hardTown();
    const early = favouredCount({ settlement: town, tickBase: 10 * 10 });
    const late = favouredCount({ settlement: town, tickBase: 100 * 10 });
    for (const hits of [early, late]) {
      expect(hits).toBeLessThanOrEqual(UPPER.bound);
      expect(hits).toBeGreaterThanOrEqual(LOWER.bound);
    }
  });

  test('NEGATIVE CONTROL: a bias that reads the cast escapes the envelope by year 100', () => {
    // THE MUTANT: the weight grows with the share of the previous cohort that matched, so
    // each generation biases the next one harder. This is exactly the loop design §5
    // requires be shut, and it is here to prove the stationarity assertion has teeth.
    const town = hardTown();
    let weight = NPC_CONSEQUENCES_TUNING.REPLACEMENT_BIAS_WEIGHT;
    for (let generation = 1; generation <= 100; generation += 1) {
      // Loop-scoped: each generation's count feeds only its own weight step.
      const hits = favouredCount({ settlement: town, mints: 40, tickBase: generation * 1000, weight });
      const share = hits / (40 * MINT_BIAS_KEYS.length);
      weight = Math.min(1 - 1 / 3, weight * (1 + share));
    }
    const ratcheted = favouredCount({ settlement: town, tickBase: 100 * 10, weight });
    expect(ratcheted).toBeGreaterThan(UPPER.bound);
    // The anchor: the LIVE weight over the SAME cohort keys stays inside.
    expect(favouredCount({ settlement: town, tickBase: 100 * 10 })).toBeLessThanOrEqual(UPPER.bound);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §5 — the banded delay and the refill priority', () => {
  test('the delay is inside its band and stable per vacancy', () => {
    const band = NPC_CONSEQUENCES_TUNING.REPLACEMENT_DELAY_TICKS;
    const failures = collectSeedFailures(Array.from({ length: 200 }, (_, i) => i), (i) => {
      const due = replacementDueTick({ settlementSeed: SEED, settlementId: SID, rosterId: `npc_${i}`, vacancyTick: 7 });
      expect(due).toBeGreaterThanOrEqual(7 + band.min);
      expect(due).toBeLessThanOrEqual(7 + band.max);
      expect(due).toBe(replacementDueTick({ settlementSeed: SEED, settlementId: SID, rosterId: `npc_${i}`, vacancyTick: 7 }));
    });
    expectNoSeedFailures(failures, 'the replacement delay stays inside its declared band');
    expect(band.min).toBeGreaterThanOrEqual(1);
  });

  test('a roamer takes the seat before a fresh mint is drawn', () => {
    const graduated = graduateNpc({
      worldState: LIT(), settlementSeed: SEED, settlementId: 'faraway',
      rosterIdentity: { rosterId: 'npc_9', name: 'Ivo Marsh', role: 'Steward' },
      tick: 1, verdictCause: 'banished',
    });
    const wnpcId = graduated.wnpcId;
    expect(Object.keys(npcLedgerOf(graduated.worldState).roamers)).toContain(wnpcId);

    const late = 500;
    const withRoamer = resolveSlotRefill({
      worldState: graduated.worldState, settlement: hardTown(), settlementSeed: SEED,
      settlementId: SID, rosterId: 'npc_3', vacancyTick: 1, tick: late, admittedRoamerIds: [wnpcId],
    });
    expect(withRoamer.kind).toBe('roamer');
    expect(withRoamer.wnpcId).toBe(wnpcId);
    expect(withRoamer.draw).toBeNull();

    // The anchor for the negative below: WITHOUT a candidate the same call mints.
    const withoutRoamer = resolveSlotRefill({
      worldState: graduated.worldState, settlement: hardTown(), settlementSeed: SEED,
      settlementId: SID, rosterId: 'npc_3', vacancyTick: 1, tick: late, admittedRoamerIds: [],
    });
    expect(withoutRoamer.kind).toBe('fresh_mint');
    expect(withoutRoamer.draw).not.toBeNull();
  });

  test('a candidate who is not in the pool is ignored rather than seated', () => {
    const graduated = graduateNpc({
      worldState: LIT(), settlementSeed: SEED, settlementId: 'faraway',
      rosterIdentity: { rosterId: 'npc_9', name: 'Ivo Marsh' }, tick: 1, verdictCause: 'banished',
    });
    const decision = resolveSlotRefill({
      worldState: graduated.worldState, settlement: hardTown(), settlementSeed: SEED,
      settlementId: SID, rosterId: 'npc_3', vacancyTick: 1, tick: 500,
      admittedRoamerIds: ['wnpc_deadbeef', graduated.wnpcId],
    });
    // The ledger, not the caller's list, decides who exists.
    expect(decision.kind).toBe('roamer');
    expect(decision.wnpcId).toBe(graduated.wnpcId);
  });

  test('the seat stands open until the delay elapses', () => {
    const due = replacementDueTick({ settlementSeed: SEED, settlementId: SID, rosterId: 'npc_3', vacancyTick: 10 });
    const early = resolveSlotRefill({
      worldState: LIT(), settlement: hardTown(), settlementSeed: SEED, settlementId: SID,
      rosterId: 'npc_3', vacancyTick: 10, tick: due - 1,
    });
    expect(early.kind).toBe('not_due');
    const onTime = resolveSlotRefill({
      worldState: LIT(), settlement: hardTown(), settlementSeed: SEED, settlementId: SID,
      rosterId: 'npc_3', vacancyTick: 10, tick: due,
    });
    expect(onTime.kind).toBe('fresh_mint');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §9 — the population floor reconciliation', () => {
  test('the named cast is counted once, never summed across the alias homes', () => {
    const npcs = [{ id: 'npc_1', name: 'A' }, { id: 'npc_2', name: 'B' }, { id: 'npc_3', name: 'C' }];
    const town = {
      population: 40, npcs,
      factions: [{ name: 'Council', members: [npcs[0], npcs[1]] }],
      powerStructure: { factions: [{ faction: 'Council', members: [npcs[2]] }] },
    };
    expect(residentNamedNpcCount(town)).toBe(3);
    // AND AFTER A ROUND TRIP, where the alias is split into independent copies. A count
    // that summed the homes would read 3 in memory and 6 here, or the reverse.
    expect(residentNamedNpcCount(JSON.parse(JSON.stringify(town)))).toBe(3);
  });

  test('the empty fast path evaluates against population MINUS the resident named cast', () => {
    const cast = Array.from({ length: 6 }, (_, i) => ({ id: `npc_${i}`, name: `N${i}` }));
    const town = { population: 6, npcs: cast };
    // Six souls, all of them named: the effective population is ZERO, which is what makes
    // a town reduced to its cast terminal-decline eligible instead of immortal.
    expect(effectivePopulationForFloor(town)).toBe(0);
    expect(reducedToCast(town, 0)).toBe(true);
    // THE ANCHOR: the same town with forty anonymous residents is not reduced to its cast,
    // so the predicate is reading the arithmetic rather than always answering true.
    expect(reducedToCast({ ...town, population: 46 }, 0)).toBe(false);
    expect(effectivePopulationForFloor({ ...town, population: 46 })).toBe(40);
  });

  test('population is repaired UP to the named count, never by removing people', () => {
    const cast = Array.from({ length: 5 }, (_, i) => ({ id: `npc_${i}`, name: `N${i}` }));
    const broken = reconcilePopulationFloor({ population: 2, npcs: cast });
    expect(broken.violated).toBe(true);
    expect(broken.population).toBe(5);
    expect(broken.namedCount).toBe(5);
    expect(broken.anonymous).toBe(0);
    const healthy = reconcilePopulationFloor({ population: 900, npcs: cast });
    expect(healthy.violated).toBe(false);
    expect(healthy.population).toBe(900);
    expect(healthy.anonymous).toBe(895);
  });

  test('anonymous residents drain first and the cast is exposed, never deleted', () => {
    const cast = Array.from({ length: 4 }, (_, i) => ({ id: `npc_${i}`, name: `N${i}` }));
    const partial = drainAnonymousFirst({ population: 100, npcs: cast }, 50);
    expect(partial).toEqual({ population: 50, drained: 50, shortfall: 0, castExposed: false });
    const total = drainAnonymousFirst({ population: 100, npcs: cast }, 500);
    expect(total.population).toBe(4);
    expect(total.drained).toBe(96);
    expect(total.shortfall).toBe(404);
    expect(total.castExposed).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §5 — DORMANCY (law 5)', () => {
  test('a dark world refills nothing and draws nothing', () => {
    for (const rules of [{}, { npcConsequencesEnabled: 'true' }, { npcConsequencesEnabled: 1 }]) {
      const decision = resolveSlotRefill({
        worldState: { simulationRules: rules }, settlement: hardTown(), settlementSeed: SEED,
        settlementId: SID, rosterId: 'npc_3', vacancyTick: 1, tick: 9999,
      });
      expect(decision.kind).toBe('not_due');
      expect(decision.draw).toBeNull();
    }
    // The anchor: the SAME call with the flag genuinely lit does mint.
    const lit = resolveSlotRefill({
      worldState: LIT(), settlement: hardTown(), settlementSeed: SEED, settlementId: SID,
      rosterId: 'npc_3', vacancyTick: 1, tick: 9999,
    });
    expect(lit.kind).toBe('fresh_mint');
  });

  test('the tuning table has ONE home and the H2 keys survived the move', () => {
    // The relocation is only invisible if the verdict half is still here.
    expect(NPC_CONSEQUENCES_TUNING.VERDICT_WEIGHTS.rival_power).toEqual({ eligible: 55, base: 45 });
    expect(NPC_CONSEQUENCES_TUNING.JAIL_TERM_TICKS).toBe(8);
    expect(NPC_CONSEQUENCES_TUNING.REPLACEMENT_BIAS_WEIGHT).toBeGreaterThan(0);
    // anchored: the object is frozen, so this negative cannot pass on a missing key.
    expect(Object.isFrozen(NPC_CONSEQUENCES_TUNING)).toBe(true);
    expectAbsentWithAnchor(
      Object.keys(NPC_CONSEQUENCES_TUNING), 'REPLACEMENT_BIAS', 'REPLACEMENT_BIAS_WEIGHT',
    );
  });

  test('an unknown band or favoured rung still returns a member of its band', () => {
    expect(MINT_BIAS_BANDS.alignmentLean).toContain(biasedRung('alignmentLean', 'nonsense', 'k'));
    expect(MINT_BIAS_BANDS.alignmentLean).toContain(biasedRung('nonsense', 'good', 'k'));
  });

  test('the floor arithmetic is total on garbage', () => {
    for (const junk of [null, undefined, 'x', 42, [], { npcs: 'no' }, { population: 'many' }]) {
      expect(residentNamedNpcCount(junk)).toBe(0);
      expect(effectivePopulationForFloor(junk)).toBe(0);
      expect(reconcilePopulationFloor(junk).population).toBe(0);
    }
    expect(DARK().simulationRules.npcConsequencesEnabled).toBeUndefined();
  });
});
