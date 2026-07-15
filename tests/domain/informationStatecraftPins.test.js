/**
 * informationStatecraftPins.test.js — W-DOCTRINE-2 PIN BATTERY (design §8).
 *
 * The verbatim battery for the load-bearing pair (CREDIBILITY stock + the LIE verb):
 *   - the credibility ASYMMETRY pin (slow-build / fast-fall + generational decay)
 *   - the centered-on-1.0 byte-identity anchor (weight(0) === 1.0 exactly)
 *   - THE BLAINEY-CREDIBILITY pin (a war against a proven liar converges SLOWER than the
 *     truth-teller twin)
 *   - the fracture-credibilityHit CONSUMPTION pin (the recorded-not-enforced seam closes)
 *   - the LIE per-verb pins (engage / effect / counter / negative) + the lie-lifecycle
 *     pin (seed → propagate → contradict → expose → the blowback triple)
 *   - DORMANCY: every entry point is a no-op when the gate is dark.
 */
import { describe, it, expect } from 'vitest';
import {
  infoStatecraftActive,
  credibilityWeight,
  credibilityDiscount,
  decayedCredibilityScore,
  credibilityScoreOf,
  advanceCredibility,
  fractureCredibilityDeltas,
  makeCredibilityWeightFn,
  makeBlaineyCredibilityFn,
  lieWillingness,
  processLies,
  advanceInformationStatecraft,
  CREDIBILITY_TUNING,
  LIE_TUNING,
} from '../../src/domain/worldPulse/informationStatecraft.js';
import { scoreBeliefConvergence } from '../../src/domain/worldPulse/peaceReasons.js';

// A live-info, statecraft-lit worldState skeleton (beliefsActive + the virtual flag).
const LIT = { infoMode: 'unreliable', infoStatecraftEnabled: true };
const litWorld = (/** @type {Record<string, unknown>} */ ledgers = {}) => ({
  spatialCanonVersion: 1,
  simulationRules: LIT,
  spatialLedgers: ledgers,
});
/** @param {number} band */
const rec = (band, over = {}) => ({
  readiness: 0.4, strengthBand: band, allianceLabel: 'hostile', faithLabel: null,
  confidence01: 0.8, lastUpdateTick: 0, ...over,
});

describe('W-DOCTRINE-2 — the gate (dormancy)', () => {
  it('is dark unless beliefsActive AND the virtual flag are both set', () => {
    expect(infoStatecraftActive(null)).toBe(false);
    expect(infoStatecraftActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } })).toBe(false); // no flag
    expect(infoStatecraftActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient', infoStatecraftEnabled: true } })).toBe(false); // omniscient
    expect(infoStatecraftActive({ simulationRules: LIT })).toBe(false); // no spatial marker
    expect(infoStatecraftActive(litWorld())).toBe(true);
  });
  it('every entry point is a byte-neutral no-op when dark', () => {
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } };
    expect(advanceCredibility({ worldState: dark, tick: 0, deltas: [{ id: 'a', kind: 'deception' }] }))
      .toEqual({ worldState: dark, changed: false });
    expect(makeCredibilityWeightFn(dark, 0)).toBeNull();
    expect(makeBlaineyCredibilityFn(dark, 0)).toBeNull();
    const mover = advanceInformationStatecraft({ snapshot: { byId: new Map(), settlements: [] }, worldState: dark, tick: 0, strengthOf: () => 0.5 });
    expect(mover.changed).toBe(false);
    expect(mover.newsEntries).toEqual([]);
  });
  it('makeCredibilityWeightFn/DiscountFn are null until a credibility ledger materializes (byte-identity)', () => {
    expect(makeCredibilityWeightFn(litWorld(), 0)).toBeNull(); // lit but no ledger yet
    expect(makeBlaineyCredibilityFn(litWorld(), 0)).toBeNull();
  });
});

describe('W-DOCTRINE-2 — credibility weight (centered on 1.0)', () => {
  it('a neutral/absent stock reads EXACTLY 1.0 (the byte-identity anchor)', () => {
    expect(credibilityWeight(0)).toBe(1.0);
    expect(credibilityDiscount(0)).toBe(1.0);
    expect(decayedCredibilityScore(null, 5)).toBe(0);
    expect(credibilityScoreOf(litWorld(), 'x', 0)).toBe(0);
  });
  it('a proven liar is discounted below 1.0; a proven-true court rises above it', () => {
    expect(credibilityWeight(-CREDIBILITY_TUNING.SCORE_SAT)).toBeCloseTo(CREDIBILITY_TUNING.WEIGHT_FLOOR, 6);
    expect(credibilityWeight(CREDIBILITY_TUNING.SCORE_SAT)).toBeCloseTo(CREDIBILITY_TUNING.WEIGHT_CEIL, 6);
    expect(credibilityWeight(-4)).toBeLessThan(1);
    expect(credibilityWeight(4)).toBeGreaterThan(1);
    // the Blainey discount never amplifies (≤ 1.0)
    expect(credibilityDiscount(CREDIBILITY_TUNING.SCORE_SAT)).toBe(1.0);
    expect(credibilityDiscount(-4)).toBeLessThan(1);
  });
});

describe('W-DOCTRINE-2 — credibility ASYMMETRY (slow build, fast fall)', () => {
  it('a proven-true rise is SLOW; an exposed-deception fall is SHARP', () => {
    const up = advanceCredibility({ worldState: litWorld(), tick: 0, deltas: [{ id: 'a', kind: 'proven_true', magnitude01: 1 }] });
    const down = advanceCredibility({ worldState: litWorld(), tick: 0, deltas: [{ id: 'b', kind: 'deception', magnitude01: 1 }] });
    const rise = credibilityScoreOf(up.worldState, 'a', 0);
    const fall = credibilityScoreOf(down.worldState, 'b', 0);
    expect(rise).toBeCloseTo(CREDIBILITY_TUNING.TRUE_RISE, 6);
    expect(fall).toBeCloseTo(-CREDIBILITY_TUNING.LIE_FALL, 6);
    // The pinned asymmetry: one caught lie undoes MANY honest tellings.
    expect(Math.abs(fall)).toBeGreaterThan(5 * Math.abs(rise));
  });
  it('credibility regresses toward neutral on a generational clock (decay)', () => {
    const seeded = advanceCredibility({ worldState: litWorld(), tick: 0, deltas: [{ id: 'b', kind: 'deception', magnitude01: 1 }] });
    const atSeed = credibilityScoreOf(seeded.worldState, 'b', 0);
    const oneHalfLife = credibilityScoreOf(seeded.worldState, 'b', CREDIBILITY_TUNING.HALF_LIFE_TICKS);
    const longAfter = credibilityScoreOf(seeded.worldState, 'b', CREDIBILITY_TUNING.MAX_LOOKBACK_TICKS + 1);
    expect(Math.abs(oneHalfLife)).toBeCloseTo(Math.abs(atSeed) / 2, 4); // half-life
    expect(longAfter).toBe(0); // fully spent → toward neutral
  });
  it('the ledger drops-when-empty (byte-identical dormant) once a mark fully decays', () => {
    // A tiny mark that decays below PRUNE_EPSILON next advance drops the whole key.
    const tiny = advanceCredibility({ worldState: litWorld(), tick: 0, deltas: [{ id: 'a', kind: 'proven_true', magnitude01: 0.05 }] });
    // advance far in the future with no new deltas: the decayed mark prunes → key drops.
    const later = advanceCredibility({ worldState: tiny.worldState, tick: CREDIBILITY_TUNING.HALF_LIFE_TICKS * 6, deltas: [] });
    const ns = /** @type {{ spatialLedgers?: Record<string, unknown> }} */ (later.worldState).spatialLedgers;
    expect(ns && ns.credibility).toBeUndefined();
  });
});

describe('W-DOCTRINE-2 — the fracture-credibilityHit CONSUMPTION pin', () => {
  it('reads a this-tick fracture record and charges the deserter (the recorded-not-enforced seam)', () => {
    const treaties = { 't1': { fracture: { deserter: 'd', credibilityHit: 0.3, tick: 5 } } };
    const deltas = fractureCredibilityDeltas(litWorld({ treaties }), 5);
    expect(deltas).toEqual([{ id: 'd', kind: 'fracture', magnitude01: 0.3 }]);
    // idempotent: NOT charged on later ticks (only at the mint tick).
    expect(fractureCredibilityDeltas(litWorld({ treaties }), 6)).toEqual([]);
  });
  it('a charged fracture debits the deserter\'s credibility stock', () => {
    const treaties = { 't1': { fracture: { deserter: 'd', credibilityHit: 0.5, tick: 5 } } };
    const ws = litWorld({ treaties });
    const after = advanceInformationStatecraft({ snapshot: { byId: new Map(), settlements: [] }, worldState: ws, tick: 5, strengthOf: () => 0.5 });
    expect(credibilityScoreOf(after.worldState, 'd', 5)).toBeLessThan(0);
  });
});

describe('W-DOCTRINE-2 — THE BLAINEY-CREDIBILITY pin', () => {
  it('a war against a proven liar converges SLOWER than the truth-teller twin', () => {
    // Twin wars: the courts have RECONCILED (marginA ≈ -marginB ⇒ converged, peace near).
    const honest = scoreBeliefConvergence({ marginA: -0.3, marginB: 0.3 });
    expect(honest.score).toBeGreaterThan(0.75); // converged

    // Now the FOE is a proven liar: the party's read of the foe's strength is discounted
    // toward neutral (its signals are trusted less), breaking the reconciliation.
    const wsCred = litWorld({ credibility: { foe: { score: -CREDIBILITY_TUNING.SCORE_SAT, lastUpdateTick: 0, holder: 'people_held' } } });
    const disc = makeBlaineyCredibilityFn(wsCred, 0);
    expect(disc).not.toBeNull();
    const believedFoeRaw = 0.8; // marginA raw = self(0.5) - 0.8 = -0.3 (matches the honest twin)
    const marginA_liar = 0.5 - /** @type {(s: string, v: number) => number} */ (disc)('foe', believedFoeRaw);
    const liar = scoreBeliefConvergence({ marginA: marginA_liar, marginB: 0.3 });
    expect(liar.score).toBeLessThan(honest.score); // the war against a proven liar runs longer

    // An HONEST foe (neutral credibility) is byte-identical to the raw read.
    const discHonest = makeBlaineyCredibilityFn(litWorld({ credibility: { other: { score: 3, lastUpdateTick: 0, holder: 'people_held' } } }), 0);
    expect(/** @type {(s: string, v: number) => number} */ (discHonest)('foe', believedFoeRaw)).toBe(believedFoeRaw);
  });
});

describe('W-DOCTRINE-2 — LIE willingness (alignment/structure gated)', () => {
  it('a lawful-good council will not; a deceitful/desperate seat will', () => {
    const lawfulGood = lieWillingness({ malice01: 0.1, lawfulness01: 0.9, desperation01: 0.6 });
    const deceitful = lieWillingness({ malice01: 0.9, lawfulness01: 0.2, desperation01: 0.7 });
    expect(lawfulGood).toBeLessThan(LIE_TUNING.WILLING_FLOOR); // won't lie
    expect(deceitful).toBeGreaterThan(LIE_TUNING.WILLING_FLOOR); // will lie
    // desperation raises willingness monotonically.
    expect(lieWillingness({ malice01: 0.5, lawfulness01: 0.5, desperation01: 0.9 }))
      .toBeGreaterThan(lieWillingness({ malice01: 0.5, lawfulness01: 0.5, desperation01: 0.1 }));
  });
});

describe('W-DOCTRINE-2 — the LIE lifecycle (engage / effect / counter / negative)', () => {
  const snapshot = { byId: new Map([['L', { id: 'L' }], ['A', { id: 'A' }]]), settlements: [{ id: 'L' }, { id: 'A' }] };
  const always = { fork: () => ({ random: () => 0 }) };   // always initiate
  const never = { fork: () => ({ random: () => 0.999 }) }; // never initiate
  const strengthOf = (/** @type {string} */ id) => (id === 'L' ? 0.3 : 0.6); // L weak ⇒ desperate
  const deceitful = () => ({ malice01: 0.9, lawfulness01: 0.2 });
  // L believes A hostile; A holds a (channel) belief about L at band 1.
  const beliefMaps = () => ({
    L: { seat: { A: rec(3) } },
    A: { seat: { L: rec(1) } },
  });

  it('ENGAGE + EFFECT: a willing, desperate liar plants an inflated garrison bluff in a hostile neighbour', () => {
    const res = processLies({ snapshot, worldState: litWorld(), beliefMaps: beliefMaps(), rng: always, tick: 0, strengthOf, alignmentOf: deceitful, nameFor: (/** @type {string} */ id) => id });
    // ENGAGE: a synthetic-origin lie is recorded (deniable-until-lineage).
    expect(res.disinfo && res.disinfo['lie:L:A']).toBeTruthy();
    expect(res.disinfo && res.disinfo['lie:L:A'].lineageId).toContain('disinfo:L:A');
    // EFFECT: A's believed strength of L is inflated above the truth.
    const planted = /** @type {Map<string, { strengthBand: number, confidence01: number }>} */ (res.overrides.get('A'));
    expect(planted.get('L')?.strengthBand).toBeGreaterThan(1);
  });

  it('a lawful-good seat plants NOTHING (the willingness gate)', () => {
    const res = processLies({ snapshot, worldState: litWorld(), beliefMaps: beliefMaps(), rng: always, tick: 0, strengthOf, alignmentOf: () => ({ malice01: 0.05, lawfulness01: 0.95 }), nameFor: (/** @type {string} */ id) => id });
    expect(res.overrides.size).toBe(0);
    expect(res.disinfo).toBeNull();
  });

  it('COUNTER: a proven liar\'s bluff is planted at LOWER confidence (credibility discounts believability)', () => {
    const clean = processLies({ snapshot, worldState: litWorld(), beliefMaps: beliefMaps(), rng: always, tick: 0, strengthOf, alignmentOf: deceitful, nameFor: (/** @type {string} */ id) => id });
    const liarWorld = litWorld({ credibility: { L: { score: -CREDIBILITY_TUNING.SCORE_SAT, lastUpdateTick: 0, holder: 'people_held' } } });
    const dirty = processLies({ snapshot, worldState: liarWorld, beliefMaps: beliefMaps(), rng: always, tick: 0, strengthOf, alignmentOf: deceitful, nameFor: (/** @type {string} */ id) => id });
    const cleanConf = /** @type {Map<string, { confidence01: number }>} */ (clean.overrides.get('A')).get('L')?.confidence01 || 0;
    const dirtyConf = /** @type {Map<string, { confidence01: number }>} */ (dirty.overrides.get('A')).get('L')?.confidence01 || 0;
    expect(dirtyConf).toBeLessThan(cleanConf);
  });

  it('NEGATIVE: a contradicted lie is EXPOSED → the blowback triple (credibility charge + the legible grievance/legitimacy receipt)', () => {
    // A's belief has re-anchored back toward truth (band 1); |1 - assertedBand 3| ≥ the
    // contradiction gate ⇒ exposure.
    const disinfo = { 'lie:L:A': { liarId: 'L', subjectId: 'L', audienceId: 'A', assertedBand: 3, trueBand: 1, seededTick: 0, lineageId: 'disinfo:L:A:0' } };
    const contradicted = { A: { seat: { L: rec(1) } } }; // re-anchored to the truth
    const res = processLies({ snapshot: { byId: new Map([['A', { id: 'A' }]]), settlements: [{ id: 'A' }] }, worldState: litWorld({ disinfo }), beliefMaps: contradicted, rng: never, tick: 1, strengthOf, alignmentOf: deceitful, nameFor: (/** @type {string} */ id) => id });
    // credibility charge (the sharp fall side of the asymmetry)
    expect(res.deltas).toContainEqual({ id: 'L', kind: 'deception', magnitude01: LIE_TUNING.EXPOSE_CHARGE01 });
    // the legible receipt carries the full triple (grievance + legitimacy + credibility)
    const news = res.newsEntries[0];
    expect(news.kind).toBe('infowar_lie_exposed');
    expect(news.tags).toEqual(expect.arrayContaining(['deception', 'exposed_lie', 'grievance', 'legitimacy']));
    // the exposed lie is dropped from the ledger.
    expect(res.disinfo).toBeNull();
  });

  it('a lie aged past its shelf life is exposed even without a fresh contradiction', () => {
    const disinfo = { 'lie:L:A': { liarId: 'L', subjectId: 'L', audienceId: 'A', assertedBand: 3, trueBand: 1, seededTick: 0, lineageId: 'x' } };
    // belief still holds the plant (band 3), but it has aged out.
    const held = { A: { seat: { L: rec(3) } } };
    const res = processLies({ snapshot: { byId: new Map([['A', { id: 'A' }]]), settlements: [{ id: 'A' }] }, worldState: litWorld({ disinfo }), beliefMaps: held, rng: never, tick: LIE_TUNING.EXPOSE_MAX_AGE_TICKS, strengthOf, alignmentOf: deceitful, nameFor: (/** @type {string} */ id) => id });
    expect(res.deltas.some((d) => d.id === 'L' && d.kind === 'deception')).toBe(true);
  });

  it('the mover materializes the disinfo + credibility ledgers on the LIT path (anti-vacuity), and the exposed-lie charge lands in the stock', () => {
    // Tick 0: seed the bluff.
    const seeded = advanceInformationStatecraft({ snapshot, worldState: litWorld({ beliefMaps: beliefMaps() }), rng: always, tick: 0, strengthOf, alignmentOf: deceitful, nameFor: (/** @type {string} */ id) => id });
    expect(seeded.changed).toBe(true);
    const ns = /** @type {{ spatialLedgers?: Record<string, unknown> }} */ (seeded.worldState).spatialLedgers || {};
    expect(ns.disinfo).toBeTruthy();
    // A's belief about L is inflated in the persisted maps.
    const maps = /** @type {Record<string, { seat?: Record<string, { strengthBand?: number }> }>} */ (ns.beliefMaps);
    expect(maps.A.seat?.L?.strengthBand).toBeGreaterThan(1);
  });
});
