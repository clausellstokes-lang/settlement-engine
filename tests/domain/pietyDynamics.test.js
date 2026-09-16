/**
 * pietyDynamics.test.js — Phase 4 W-F5.5 property pins for the three piety-dynamics
 * addenda (docs/PHASE4_FAITH_DELTA.md): DEVOTIONAL MOMENTUM, THE UNAFFILIATED SINK, and
 * CONDUCT DRIFT ERODES PIETY. All three are engine-only, pulse-side, and INERT under the
 * neutrality theorem (no deities / no measured piety record ⇒ byte-identical); each pins
 * its mechanism, its bound, and the spiral brake.
 */
import { describe, it, expect } from 'vitest';
import { pietyRecord, localPiety01, PIETY_TUNING } from '../../src/domain/worldPulse/piety.js';
import {
  applyUnaffiliatedSink, renormShares, RELIGION_TUNING,
  projectReligionStateOntoSettlement, patronSnapshot,
} from '../../src/domain/worldPulse/religionState.js';
import { RELIGION_LEGITIMACY_TUNING } from '../../src/domain/worldPulse/religionLegitimacy.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEVOTIONAL MOMENTUM — the LAG (legitimacy's pattern, slower).
// ─────────────────────────────────────────────────────────────────────────────
describe('devotional momentum — piety lags its structural target', () => {
  const inputs = { authority01: 0.6, institutionBacking: 0.5, devotion01: 0.7 };

  it('PIETY_LAG is slower than legitimacy’s 0.12 (felt faith trails the rightful-claim axis)', () => {
    expect(PIETY_TUNING.PIETY_LAG).toBeLessThan(RELIGION_LEGITIMACY_TUNING.LAG);
    expect(PIETY_TUNING.PIETY_LAG).toBeGreaterThan(0);
  });

  it('FIRST measurement (no prior) seeds local01 AT the target — no cold-start artifact', () => {
    const rec = pietyRecord({ ...inputs });                              // priorLocal01 absent
    const structural = localPiety01(inputs);
    expect(rec.local01).toBe(structural);           // seeded exactly at target
    expect(rec.structuralTarget).toBe(structural);  // and target == structural at fit 0
  });

  it('a present prior lags PARTWAY toward the target (an arc, not a step)', () => {
    const target = localPiety01(inputs);
    const prior = 0.1;                                                   // far below target
    const rec = pietyRecord({ ...inputs, priorLocal01: prior });
    const expected = prior + PIETY_TUNING.PIETY_LAG * (target - prior);
    expect(rec.local01).toBeCloseTo(expected, 12);
    expect(rec.local01).toBeGreaterThan(prior);        // moved toward target…
    expect(rec.local01).toBeLessThan(target);          // …but NOT all the way (the lag)
  });

  it('iterated momentum CONVERGES to the target (becoming pious is an arc)', () => {
    const target = localPiety01(inputs);
    let prior = 0.05;
    for (let t = 0; t < 200; t++) prior = pietyRecord({ ...inputs, priorLocal01: prior }).local01;
    expect(prior).toBeCloseTo(target, 4);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONDUCT DRIFT ERODES PIETY — asymmetric, floored (the spiral brake).
// ─────────────────────────────────────────────────────────────────────────────
describe('conduct drift erodes piety — asymmetric, feeds the target through the lag', () => {
  // mid-range inputs so neither direction clamps at 0/1.
  const inputs = { authority01: 0.6, institutionBacking: 0.5, devotion01: 0.7 };

  it('negative fit LOWERS the target, positive fit RAISES it; fit 0 is the structural target', () => {
    const base = pietyRecord({ ...inputs, conductFit: 0 }).structuralTarget;
    const drift = pietyRecord({ ...inputs, conductFit: -0.5 }).structuralTarget;
    const align = pietyRecord({ ...inputs, conductFit: 0.5 }).structuralTarget;
    expect(drift).toBeLessThan(base);
    expect(align).toBeGreaterThan(base);
  });

  it('ASYMMETRY: drift erodes ~2× faster than agreement builds (loss aversion)', () => {
    const base = pietyRecord({ ...inputs, conductFit: 0 }).structuralTarget;
    const erode = base - pietyRecord({ ...inputs, conductFit: -0.5 }).structuralTarget;   // >0
    const build = pietyRecord({ ...inputs, conductFit: 0.5 }).structuralTarget - base;    // >0
    expect(erode).toBeGreaterThan(0);
    expect(build).toBeGreaterThan(0);
    expect(erode).toBeCloseTo(PIETY_TUNING.DRIFT_ASYMMETRY * build, 6);
  });

  it('legibility law: drift names a conduct_drift cause; agreement a conduct_alignment cause; fit 0 neither (byte-identical)', () => {
    expect(pietyRecord({ ...inputs, conductFit: -0.5 }).causes.some((c) => c.source === 'conduct_drift')).toBe(true);
    expect(pietyRecord({ ...inputs, conductFit: 0.5 }).causes.some((c) => c.source === 'conduct_alignment')).toBe(true);
    const neutral = pietyRecord({ ...inputs, conductFit: 0 });
    expect(neutral.causes.some((c) => c.source === 'conduct_drift' || c.source === 'conduct_alignment')).toBe(false);
  });

  it('SPIRAL BRAKE: sustained MAX drift floors piety (never zeroes) — apostasy is an arc, not collapse', () => {
    // A seated patron with real structural backing, but maximal conduct drift each tick.
    const seated = { authority01: 0.6, institutionBacking: 0.4, devotion01: 0.7 };
    const oneShot = pietyRecord({ ...seated, conductFit: -1 });
    expect(oneShot.structuralTarget).toBeGreaterThan(0);                         // floors above zero
    expect(oneShot.localMult).toBeGreaterThanOrEqual(0.65 - 1e-9);               // never below the f-floor
    // Iterate the disillusionment arc from a devout prior; it erodes but does NOT reach 0.
    let prior = 0.95;
    for (let t = 0; t < 300; t++) prior = pietyRecord({ ...seated, conductFit: -1, priorLocal01: prior }).local01;
    expect(prior).toBeLessThan(0.5);        // the pews emptied (the arc happened)…
    expect(prior).toBeGreaterThan(0.1);     // …but faith did NOT collapse to zero (the floor)
    // The seat-contest termination is the LEGITIMACY path (W-F4a): an organic-contest floor
    // exists, independent of piety, so sustained drift ends in a SEAT change, not faithlessness.
    expect(RELIGION_TUNING.LEGIT_ORGANIC_CONTEST).toBeGreaterThan(0);
  });

  it('the "fervent young cult": aligned conduct lifts piety even with weak structural inputs', () => {
    const youngCult = { authority01: 0.2, institutionBacking: 0.1, devotion01: 0.3 };
    const cold = pietyRecord({ ...youngCult, conductFit: 0 }).structuralTarget;
    const fervent = pietyRecord({ ...youngCult, conductFit: 1 }).structuralTarget;
    expect(fervent).toBeGreaterThan(cold);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE UNAFFILIATED SINK — 'none' bucket, bounds, revival, non-deity.
// ─────────────────────────────────────────────────────────────────────────────
function sinkState(none0 = 0) {
  const faithful = 100 - Math.round(none0);
  const p = Math.round(faithful * 0.6);
  const q = faithful - p;
  const s = {
    patronRef: 'p', capacity: 3,
    deities: {
      p: { deityRef: 'p', niche: 'a', share: p, standing: 'ascendant', suppressed: false, legitimacy: 0.6, snapshot: { name: 'P', alignmentAxis: 'good' } },
      q: { deityRef: 'q', niche: 'b', share: q, standing: 'established', suppressed: false, legitimacy: 0.3, snapshot: { name: 'Q', alignmentAxis: 'neutral' } },
    },
  };
  if (none0 > 0) s.noneShare = none0;
  return s;
}
const deitySum = (s) => Object.values(s.deities).filter((d) => !d.suppressed).reduce((t, d) => t + d.share, 0);

describe('the unaffiliated sink — a bounded, renormalizing "none" bucket', () => {
  it('preserves the 100-sum invariant every tick (Σ deities + round(none) === 100)', () => {
    const s = sinkState();
    for (let t = 0; t < 120; t++) {
      applyUnaffiliatedSink(s, { secularPull: 0.8, crisisDisorder: 0 });
      expect(deitySum(s) + Math.round(s.noneShare || 0)).toBe(100);
    }
  });

  it('SECULARIZATION: sustained comfort leaks share to "none", BOUNDED by SINK_MAX (no atheist collapse)', () => {
    const s = sinkState();
    for (let t = 0; t < 400; t++) applyUnaffiliatedSink(s, { secularPull: 1, crisisDisorder: 0 });
    expect(s.noneShare).toBeGreaterThan(20);                       // substantial secular drift
    expect(s.noneShare).toBeLessThanOrEqual(RELIGION_TUNING.SINK_MAX);   // never past the ceiling
    expect(deitySum(s)).toBeGreaterThanOrEqual(100 - RELIGION_TUNING.SINK_MAX);  // pantheon keeps a majority
  });

  it('REVIVAL: crisis drains "none" back to the pantheon (the great awakening)', () => {
    const s = sinkState(30);
    const before = s.noneShare;
    for (let t = 0; t < 80; t++) applyUnaffiliatedSink(s, { secularPull: 0, crisisDisorder: 1 });
    expect(s.noneShare || 0).toBeLessThan(before);
    expect(s.noneShare || 0).toBeLessThan(3);                      // reclaimed nearly all of it
    expect(deitySum(s) + Math.round(s.noneShare || 0)).toBe(100);
    // conditional-materialization: once fully faithful again the key is gone.
    for (let t = 0; t < 40; t++) applyUnaffiliatedSink(s, { secularPull: 0, crisisDisorder: 1 });
    expect('noneShare' in s).toBe(false);
  });

  it('revival OUTPACES drift (SINK_REVIVAL_RATE > SINK_SECULAR_RATE) — the historical cycle', () => {
    expect(RELIGION_TUNING.SINK_REVIVAL_RATE).toBeGreaterThan(RELIGION_TUNING.SINK_SECULAR_RATE);
    expect(RELIGION_TUNING.SINK_MAX).toBeLessThan(100);            // bounded — a secular city, never godless
  });

  it('"none" is a NON-DEITY: it never enters state.deities, never ranks, never holds the seat', () => {
    // A single application preserves the deity ORDER (proportional carve): the seat is
    // never handed to indifference. (In the live driver advanceShares re-establishes the
    // strength-driven distribution each tick; here we pin the per-application property.)
    const one = sinkState();
    applyUnaffiliatedSink(one, { secularPull: 1, crisisDisorder: 0 });
    expect(one.deities.p.share).toBeGreaterThan(one.deities.q.share);
    // Over a long secular run the invariants hold regardless: 'none' is never a deity,
    // and the top deity — never 'none' — keeps the seat.
    const s = sinkState();
    for (let t = 0; t < 200; t++) applyUnaffiliatedSink(s, { secularPull: 1, crisisDisorder: 0 });
    expect(Object.keys(s.deities)).not.toContain('none');
    expect(s.patronRef).toBe('p');
    expect(s.deities.p.share).toBeGreaterThanOrEqual(s.deities.q.share);
  });

  it('no-op with no faith; deterministic under identical inputs', () => {
    expect(applyUnaffiliatedSink({ deities: {} }, { secularPull: 1, crisisDisorder: 0 })).toEqual({ share: 0, rising: false });
    const run = () => { const s = sinkState(); for (let t = 0; t < 50; t++) applyUnaffiliatedSink(s, { secularPull: 0.7, crisisDisorder: 0.1 }); return JSON.stringify(s); };
    expect(run()).toBe(run());
  });

  it('renormShares(deities) defaults to 100 (byte-identical fallback); a lower target is the sink case', () => {
    const d = { a: { share: 30, suppressed: false }, b: { share: 70, suppressed: false } };
    renormShares(d);
    expect(d.a.share + d.b.share).toBe(100);
    const d2 = { a: { share: 30, suppressed: false }, b: { share: 70, suppressed: false } };
    renormShares(d2, 55);
    expect(d2.a.share + d2.b.share).toBe(55);                      // the sink target
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NEUTRALITY + GATE — the three mechanisms are inert without a piety record.
// ─────────────────────────────────────────────────────────────────────────────
const NOW = '2026-01-01T00:00:00.000Z';
const deity = (name, rank = 'cult') => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: 'neutral', alignmentAxis: 'neutral', lawAxis: 'neutral', rankAxis: rank });
function save(id, name, d, tier = 'metropolis') {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier, population: 40000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, primaryDeityRef: d._deityRef, primaryDeitySnapshot: d },
      institutions: [], economicState: { primaryExports: [], primaryImports: [], prosperity: 'prosperous' },
      powerStructure: { government: 'merchant council', publicLegitimacy: { score: 70, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}
function makeCampaign() {
  return {
    id: 'pd', name: 'pd', settlementIds: ['a'],
    worldState: { rngSeed: 'pd', tick: 1, simulationRules: { faithSpreadEnabled: false } },
    regionalGraph: { edges: [], channels: [] },
    wizardNews: { currentTick: 1, entries: [] },
  };
}
// One advance. `projectPiety` mirrors the kernel: re-embed patron AND project faithProfile
// (incl. piety) so next tick reads the tick-START record. Toggling it off models a caller
// that never measures piety (the neutrality path).
function step(campaign, saves, { projectPiety }) {
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const rng = createPRNG(`${campaign.worldState.rngSeed}::tick:${campaign.worldState.tick}`);
  const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: campaign.worldState.tick, now: NOW, rules: campaign.worldState.simulationRules, rng });
  const nextWS = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
  if (r.religionStates) nextWS.religionStates = r.religionStates;
  const nextSaves = saves.map((s) => {
    const st = r.religionStates?.[s.id];
    if (!st) return s;
    const patron = patronSnapshot(st);
    let settlement = s.settlement;
    if (projectPiety) settlement = projectReligionStateOntoSettlement(settlement, r.religionStates, s.id, r.pietyByCid);
    const cfg = { ...settlement.config };
    if (patron) { cfg.primaryDeityRef = patron._deityRef; cfg.primaryDeitySnapshot = patron; }
    return { ...s, settlement: { ...settlement, config: cfg } };
  });
  return { campaign: { ...campaign, worldState: nextWS }, saves: nextSaves, result: r };
}

describe('neutrality — the sink/momentum/drift are inert without a measured piety record', () => {
  it('a caller that NEVER projects piety keeps deities summing to 100 and mints no "none" bucket', () => {
    let campaign = makeCampaign();
    let saves = [save('a', 'Acity', deity('Faded'))];
    for (let t = 0; t < 40; t++) ({ campaign, saves } = step(campaign, saves, { projectPiety: false }));
    const st = campaign.worldState.religionStates.a;
    expect('noneShare' in st).toBe(false);                                  // sink never armed
    expect(deitySum(st)).toBe(100);                                         // full-pool invariant unchanged
  });

  it('deterministic end-to-end with piety projection ON', () => {
    const run = () => {
      let campaign = makeCampaign();
      let saves = [save('a', 'Acity', deity('Faded'))];
      for (let t = 0; t < 30; t++) ({ campaign, saves } = step(campaign, saves, { projectPiety: true }));
      return JSON.stringify(campaign.worldState.religionStates);
    };
    expect(run()).toBe(run());
  });
});

describe('integration — the sink activates end-to-end once piety is measured (bounded)', () => {
  it('a comfortable, low-authority metropolis secularizes across ticks, invariant + bound held', () => {
    let campaign = makeCampaign();
    let saves = [save('a', 'Acity', deity('Faded'))];
    for (let t = 0; t < 90; t++) ({ campaign, saves } = step(campaign, saves, { projectPiety: true }));
    const st = campaign.worldState.religionStates.a;
    const none = Math.round(st.noneShare || 0);
    expect(none).toBeGreaterThan(0);                                        // the pews emptied somewhat
    expect(none).toBeLessThanOrEqual(RELIGION_TUNING.SINK_MAX);             // never past the ceiling
    expect(deitySum(st) + none).toBe(100);                                 // the ledger still sums to 100
    // and the surfaced read-model carries the bucket for the panel.
    const projected = projectReligionStateOntoSettlement(saves[0].settlement, campaign.worldState.religionStates, 'a', {});
    expect(projected.config.faithProfile.unaffiliated).toBe(none);
    // legibility: the piety record names the secular/revival driver.
    const causes = campaign.worldState.religionStates.a && saves[0].settlement.config.faithProfile.piety?.causes;
    expect(Array.isArray(causes)).toBe(true);
  });
});
