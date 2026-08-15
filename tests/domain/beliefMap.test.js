/**
 * beliefMap.test.js — Phase 5.5 WAVE A, the belief-map PURE module.
 *
 * The selector's identity fallback, the V.4 reconciliation properties
 * (deterministic, order-independent, contradiction widens, silence decays,
 * independence beats echo), cold-start init == truth, the sparse cardinality cap,
 * and misjudgment detection — all on the pure functions, no kernel.
 */
import { describe, it, expect } from 'vitest';

import {
  beliefsActive, belief, readBeliefStrength, readBeliefRelationship,
  reconcileBelief, decayedConfidence, detectMisjudgment,
  strengthBandOf, strengthOfBand, advanceBeliefMaps, GOVERNING_SEAT_KEY, BELIEF_TUNING,
} from '../../src/domain/worldPulse/beliefMap.js';

const seatOf = (ledger, obs) => ledger?.[obs]?.[GOVERNING_SEAT_KEY] || {};

function report(patch = {}) {
  return {
    hopCount: 0, ageTicks: 0, independentSources: 1,
    completeness01: 1, accuracy01: 1, score: 80, sortKey: 'trade:evt', ...patch,
  };
}
const GT = { readiness: 0.75, strengthBand: 4, allianceLabel: 'hostile', faithLabel: 'Vorn', confidence01: 1, lastUpdateTick: 10 };
const PRIOR = { readiness: 0, strengthBand: 1, allianceLabel: 'trade_partner', faithLabel: 'Sol', confidence01: 0.6, lastUpdateTick: 2 };

// ── The activation gate (ORTHOGONAL to settlementStrategyEnabled) ─────────────
describe('WAVE A — beliefsActive gate', () => {
  it('is false without the spatial marker, false under omniscient, true only under marker + a live mode', () => {
    expect(beliefsActive({ simulationRules: { infoMode: 'unreliable' } })).toBe(false); // no marker
    expect(beliefsActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient' } })).toBe(false);
    expect(beliefsActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' } })).toBe(true);
    expect(beliefsActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } })).toBe(true);
    // A garbage / non-positive marker never activates.
    expect(beliefsActive({ spatialCanonVersion: 0, simulationRules: { infoMode: 'unreliable' } })).toBe(false);
    expect(beliefsActive({ spatialCanonVersion: '1', simulationRules: { infoMode: 'unreliable' } })).toBe(false);
    // settlementStrategyEnabled is IRRELEVANT — the gate is spatial + infoMode only.
    expect(beliefsActive({ simulationRules: { settlementStrategyEnabled: true, infoMode: 'unreliable' } })).toBe(false);
  });
});

// ── The selector — identity fallback (byte-exact) ─────────────────────────────
describe('WAVE A — belief selector identity fallback', () => {
  const active = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' }, spatialLedgers: { beliefMaps: { a: { [GOVERNING_SEAT_KEY]: { b: { ...GT } } } } } };

  it('SELF and DORMANT reads resolve to truth', () => {
    expect(belief('a', 'a', active).source).toBe('truth');       // self carve-out
    expect(belief('a', 'b', {}).source).toBe('truth');           // dormant
    expect(belief('a', 'b', { spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient' } }).source).toBe('truth');
  });

  it('a held record ⇒ belief; marker present + no record ⇒ unknown (max-uncertainty)', () => {
    expect(belief('a', 'b', active).source).toBe('belief');
    expect(belief('a', 'z', active).source).toBe('unknown');
  });

  it('readBeliefStrength: truth verbatim / banded belief / neutral mid band', () => {
    expect(readBeliefStrength('a', 'a', active, 0.9)).toBe(0.9);                 // self ⇒ truth verbatim
    expect(readBeliefStrength('a', 'b', {}, 0.9)).toBe(0.9);                     // dormant ⇒ verbatim
    expect(readBeliefStrength('a', 'b', active, 0.9)).toBe(strengthOfBand(4));   // believed band
    expect(readBeliefStrength('a', 'z', active, 0.9)).toBe(strengthOfBand(BELIEF_TUNING.NEUTRAL_STRENGTH_BAND));
  });

  it('readBeliefRelationship: truth verbatim (dormant/unknown) / believed label (possibly stale)', () => {
    expect(readBeliefRelationship('a', 'b', {}, 'rival')).toBe('rival');          // dormant ⇒ verbatim
    expect(readBeliefRelationship('a', 'z', active, 'rival')).toBe('rival');      // unknown ⇒ known declared label
    expect(readBeliefRelationship('a', 'b', active, 'trade_partner')).toBe('hostile'); // STALE belief overrides truth
  });

  it('strength band round-trips through the midpoint', () => {
    for (let b = 0; b < 5; b += 1) expect(strengthBandOf(strengthOfBand(b))).toBe(b);
  });
});

// ── The V.4 reconciliation rule ───────────────────────────────────────────────
describe('WAVE A — reconciliation (V.4)', () => {
  it('is DETERMINISTIC and ORDER-INDEPENDENT (commutative fold)', () => {
    const reports = [report({ sortKey: 'k1', independentSources: 2 }), report({ sortKey: 'k2', accuracy01: 0.8 })];
    const a = reconcileBelief({ prior: PRIOR, groundTruth: GT, reports, now: 10 });
    const b = reconcileBelief({ prior: PRIOR, groundTruth: GT, reports: [...reports].reverse(), now: 10 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    // deterministic across repeated calls
    expect(JSON.stringify(reconcileBelief({ prior: PRIOR, groundTruth: GT, reports, now: 10 }))).toBe(JSON.stringify(a));
  });

  it('DEGENERATE zero-weight new belief: a completeness-0 report on a NULL prior yields FINITE bands (not NaN)', () => {
    // SS2-F2: prior null ⇒ priorConf 0; a completeness-0 report ⇒ aggregate weight 0 ⇒ blendW 0 ⇒
    // denom 0 ⇒ the weighted blend was 0/0 = NaN, poisoning the byte-pinned belief ledger. This
    // exported fn is called directly by generosityKernel/others (not only via rumorNetwork, which
    // floors completeness), so the guard must live here. The record must carry finite bands.
    const rec = reconcileBelief({ prior: null, groundTruth: GT, reports: [report({ completeness01: 0 })], now: 10 });
    expect(Number.isFinite(rec.strengthBand)).toBe(true);
    expect(Number.isFinite(rec.readiness)).toBe(true);
    expect(Number.isNaN(rec.strengthBand)).toBe(false);
    expect(Number.isNaN(rec.readiness)).toBe(false);
    // A non-degenerate new belief (weight > 0) still re-anchors toward truth — the guard is inert there.
    const live = reconcileBelief({ prior: null, groundTruth: GT, reports: [report()], now: 10 });
    expect(Number.isFinite(live.strengthBand)).toBe(true);
  });

  it('INDEPENDENCE beats the echo chamber (more independent lineages ⇒ higher confidence + stronger re-anchor)', () => {
    const one = reconcileBelief({ prior: PRIOR, groundTruth: GT, reports: [report({ independentSources: 1 })], now: 10 });
    const three = reconcileBelief({ prior: PRIOR, groundTruth: GT, reports: [report({ independentSources: 3 })], now: 10 });
    expect(three.confidence01).toBeGreaterThan(one.confidence01);
    // the independent report pulls the band further toward the truth (band 4)
    expect(three.strengthBand).toBeGreaterThanOrEqual(one.strengthBand);
  });

  it('CONTRADICTION widens uncertainty (a report far from the prior lands lower confidence than a confirming one)', () => {
    const priorMatchesTruth = { ...GT, confidence01: 0.6 };
    const confirm = reconcileBelief({ prior: priorMatchesTruth, groundTruth: GT, reports: [report()], now: 10 });
    const contradict = reconcileBelief({ prior: PRIOR, groundTruth: GT, reports: [report()], now: 10 });
    expect(confirm.confidence01).toBeGreaterThan(contradict.confidence01);
  });

  it('SILENCE decays confidence monotonically (pure arithmetic, no rng)', () => {
    expect(decayedConfidence(1, 0)).toBe(1);
    expect(decayedConfidence(1, 5)).toBeLessThan(decayedConfidence(1, 3));
    expect(decayedConfidence(1, 3)).toBeLessThan(decayedConfidence(1, 1));
    expect(decayedConfidence(1, 100)).toBeGreaterThanOrEqual(0);
  });

  it('low ACCURACY pulls the observed value toward the neutral midpoint (a garbled telling informs less)', () => {
    const faithful = reconcileBelief({ prior: null, groundTruth: GT, reports: [report({ accuracy01: 1 })], now: 10 });
    const garbled = reconcileBelief({ prior: null, groundTruth: GT, reports: [report({ accuracy01: 0.1 })], now: 10 });
    expect(faithful.strengthBand).toBe(4);                                  // faithful ⇒ the truth
    expect(garbled.strengthBand).toBe(BELIEF_TUNING.NEUTRAL_STRENGTH_BAND); // garbled ⇒ pulled to neutral
  });

  it('no reports ⇒ the frozen value survives (only the caller-decayed confidence moves)', () => {
    const kept = reconcileBelief({ prior: { ...PRIOR, confidence01: 0.4 }, groundTruth: GT, reports: [], now: 20 });
    expect(kept.strengthBand).toBe(PRIOR.strengthBand);      // value frozen
    expect(kept.allianceLabel).toBe(PRIOR.allianceLabel);
    expect(kept.confidence01).toBe(0.4);
  });
});

// ── Misjudgment detection ─────────────────────────────────────────────────────
describe('WAVE A — detectMisjudgment', () => {
  const base = { observerId: 'a', subjectId: 'b', believedRelationship: 'hostile', trueRelationship: 'hostile', confidence01: 0.5 };
  it('fires on a strength-band divergence ≥ the band delta', () => {
    const mis = detectMisjudgment({ ...base, believedStrengthBand: 1, trueStrengthBand: 4 });
    expect(mis).not.toBeNull();
    expect(mis.kinds).toContain('strength');
  });
  it('does NOT fire when the belief is sound (a one-band read error is not a misjudgment)', () => {
    expect(detectMisjudgment({ ...base, believedStrengthBand: 3, trueStrengthBand: 4 })).toBeNull();
  });
  it('fires on a STALE hostility (believed hostile, truly at peace) — the ally-confusion war', () => {
    const mis = detectMisjudgment({ ...base, believedStrengthBand: 3, trueStrengthBand: 3, believedRelationship: 'hostile', trueRelationship: 'trade_partner' });
    expect(mis).not.toBeNull();
    expect(mis.kinds).toContain('relationship');
  });
});

// ── Cold-start + cardinality (through advanceBeliefMaps) ──────────────────────
function item(id, tier, pop) {
  return { id, name: id.toUpperCase(), settlement: { name: id, tier, population: pop, config: { primaryDeitySnapshot: { name: 'Sol' } } } };
}
function snapshotOf(settlements, edges) {
  return { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges } };
}

describe('WAVE A — cold-start init == truth', () => {
  it('seeds the relationship neighbourhood to ground truth at the first active advance (confidence 1.0)', () => {
    const settlements = [item('a', 'city', 40000), item('b', 'village', 300)];
    const snapshot = snapshotOf(settlements, [{ id: 'e.ab', from: 'a', to: 'b', relationshipType: 'hostile' }]);
    const ws = { spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' }, warPosture: { a: { state: 'mobilized' } } };
    const { next, changed } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 7 });
    expect(changed).toBe(true);
    const ab = seatOf(next, 'a').b;
    const ba = seatOf(next, 'b').a;
    expect(ab.confidence01).toBe(1);
    expect(ab.lastUpdateTick).toBe(7);
    expect(ab.allianceLabel).toBe('hostile');
    // b believes a mobilized (warPosture ground truth), a believes b at peace.
    expect(ba.readiness).toBeGreaterThan(0.5);
    expect(ab.readiness).toBe(0);
    // A stronger settlement (a, city) reads a higher band than a weaker one (b, village).
    expect(ba.strengthBand).toBeGreaterThan(ab.strengthBand);
  });

  it('DORMANT (omniscient) ⇒ no work, no key', () => {
    const settlements = [item('a', 'city', 40000), item('b', 'village', 300)];
    const snapshot = snapshotOf(settlements, [{ id: 'e.ab', from: 'a', to: 'b', relationshipType: 'hostile' }]);
    const { next, changed } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: { spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient' } }, tick: 7 });
    expect(changed).toBe(false);
    expect(next).toBeNull();
  });
});

describe('WAVE A — cardinality stays sparse (no all-pairs blow-up)', () => {
  it('a 30-settlement fixture with a sparse ring graph seeds only edge-adjacent beliefs', () => {
    const N = 30;
    const settlements = Array.from({ length: N }, (_, i) => item(`s${i}`, 'town', 2000));
    // A ring: each settlement has exactly 2 relationship edges. O(N) edges, never O(N^2).
    const edges = Array.from({ length: N }, (_, i) => ({
      id: `e.${i}`, from: `s${i}`, to: `s${(i + 1) % N}`, relationshipType: 'rival',
    }));
    const snapshot = snapshotOf(settlements, edges);
    const ws = { spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' } };
    const { next } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 1 });
    let entries = 0;
    for (const obs of Object.keys(next)) entries += Object.keys(seatOf(next, obs)).length;
    // Ring ⇒ each of N observers knows its 2 neighbours ⇒ 2N entries, FAR below N^2 = 900.
    expect(entries).toBe(2 * N);
    expect(entries).toBeLessThan((N * N) / 4);
  });
});

// ── advance fold order-independence ───────────────────────────────────────────
describe('WAVE A — advanceBeliefMaps is order-independent (total-order fold)', () => {
  it('reversing the settlements + edges yields a byte-identical ledger', () => {
    const settlements = [item('a', 'city', 40000), item('b', 'town', 3000), item('c', 'village', 400)];
    const edges = [
      { id: 'e.ab', from: 'a', to: 'b', relationshipType: 'hostile' },
      { id: 'e.bc', from: 'b', to: 'c', relationshipType: 'rival' },
    ];
    const ws = { spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' } };
    const fwd = advanceBeliefMaps({ snapshot: snapshotOf(settlements, edges), pressureIdx: null, worldState: ws, tick: 3 });
    const rev = advanceBeliefMaps({ snapshot: snapshotOf([...settlements].reverse(), [...edges].reverse()), pressureIdx: null, worldState: ws, tick: 3 });
    expect(JSON.stringify(fwd.next)).toBe(JSON.stringify(rev.next));
  });
});
