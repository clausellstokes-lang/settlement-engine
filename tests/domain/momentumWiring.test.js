/**
 * momentumWiring.test.js — W-MOMENTUM WIRING PASS pins (the integration seams the 49 pure
 * core pins cannot reach): the LIVE CRACK MOVER (advanceMomentumCracks) and the belief
 * DISCOUNT through reconcileBelief.
 *
 * These fence the wiring's promises (DESIGN_MOMENTUM.md §4 + §6):
 *   • the crack fires ONCE, only PAST the cliff, only on a FRESH sue_for_peace* reversal;
 *   • succession-rerolls-the-cliff (the proud king's war holds; the pragmatic heir's cracks);
 *   • a face-saving exit reduces the price and the receipt says so;
 *   • the belief discount only SLOWS convergence (never inverts it) and leaves a corroborating
 *     read heard in full (first-hand / agreeing reports are never discounted).
 */

import { describe, it, expect } from 'vitest';
import { advanceMomentumCracks, MOMENTUM_TUNING } from '../../src/domain/worldPulse/momentum.js';
import { reconcileBelief } from '../../src/domain/worldPulse/beliefMap.js';

// ── Crack-mover fixtures ─────────────────────────────────────────────────────────
const TICK = 5;
/** A world where `iron` holds a committed war on `weak` and its deployment took a fresh
 *  sue_for_peace recall THIS tick. `stock` + `ruler` are the knobs. */
function crackWorld({ stock = MOMENTUM_TUNING.STOCK_MAX, recallTick = TICK, cause = 'sue_for_peace', legitimacy = 50 } = {}) {
  return {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', momentumEnabled: true },
    deployments: { iron: { targetId: 'weak', recalled: { cause, tick: recallTick } } },
    spatialLedgers: { commitments: { 'iron>war:weak': { stock, sinceTick: 0, lastDepositTick: TICK, deposits: [{ tick: TICK, kind: 'siege', mag: 0.8 }] } } },
    __legitimacy: legitimacy,
  };
}
function crackItem(personality, legitimacy = 50) {
  return { id: 'iron', settlement: { npcs: [{ id: 'k', importance: 'key', personality }], powerStructure: { publicLegitimacy: { score: legitimacy, label: 'Contested' } } } };
}
function runCrack(world, item, { exitKind = '' } = {}) {
  return advanceMomentumCracks({
    snapshot: { byId: new Map([['iron', item]]) },
    worldState: world,
    settlementUpdates: [{ saveId: 'iron', settlement: item.settlement }],
    tick: TICK,
    nameFor: (id) => String(id).toUpperCase(),
    exitKindFor: () => exitKind,
  });
}
const legitOf = (r) => Number(r.settlementUpdates[0].settlement.powerStructure.publicLegitimacy.score);

describe('W-MOMENTUM wiring — the LIVE CRACK mover (advanceMomentumCracks)', () => {
  it('fires on a fresh, PAST-CLIFF sue_for_peace reversal: a legitimacy hit + a receipt', () => {
    // A pragmatic seat (low cliff) at full stock is well past its cliff.
    const world = crackWorld({ stock: MOMENTUM_TUNING.STOCK_MAX });
    const r = runCrack(world, crackItem({ dominant: 'pragmatic' }));
    expect(r.changed).toBe(true);
    expect(r.newsEntries.length).toBe(1);
    expect(r.newsEntries[0].kind).toBe('momentum_climb_down');
    expect(legitOf(r)).toBeLessThan(50); // the seat spent legitimacy on the reversal
  });

  it('does NOT fire below the cliff (a below-cliff reversal is free physics — today\'s bytes)', () => {
    const world = crackWorld({ stock: 1 }); // well below any cliff
    const r = runCrack(world, crackItem({ dominant: 'pragmatic' }));
    expect(r.changed).toBe(false);
    expect(legitOf(r)).toBe(50);
  });

  it('is charged ONCE: a STALE recall (recall tick !== this tick) does not re-fire', () => {
    const world = crackWorld({ stock: MOMENTUM_TUNING.STOCK_MAX, recallTick: TICK - 2 });
    const r = runCrack(world, crackItem({ dominant: 'pragmatic' }));
    expect(r.changed).toBe(false);
  });

  it('a FACE-SAVING exit (mediation) reduces the price, and the receipt says so', () => {
    const world = crackWorld({ stock: MOMENTUM_TUNING.STOCK_MAX });
    const full = runCrack(world, crackItem({ dominant: 'pragmatic' }), { exitKind: '' });
    const saved = runCrack(world, crackItem({ dominant: 'pragmatic' }), { exitKind: 'mediation' });
    // The mediated climb-down spends LESS legitimacy (a smaller hit ⇒ a higher remaining score).
    expect(legitOf(saved)).toBeGreaterThan(legitOf(full));
    expect(saved.newsEntries[0].headline).toMatch(/honour intact/);
    expect(JSON.stringify(saved.newsEntries[0].reasons)).toMatch(/mediation/);
  });

  it('DORMANT (momentum off) ⇒ a complete no-op (byte-identical)', () => {
    const world = crackWorld({ stock: MOMENTUM_TUNING.STOCK_MAX });
    world.simulationRules = { infoMode: 'full' }; // momentumEnabled absent
    const r = runCrack(world, crackItem({ dominant: 'pragmatic' }));
    expect(r.changed).toBe(false);
    expect(r.newsEntries).toEqual([]);
    expect(r.worldState).toBe(world);
  });

  it('SUCCESSION-REROLLS-THE-CLIFF: the proud king\'s war HOLDS where the pragmatic heir\'s CRACKS (same stock)', () => {
    // A stock that sits BELOW a proud+stubborn cliff (temperament 1 ⇒ cliff = 6×1.7 = 10.2)
    // but ABOVE a pragmatic cliff (temperament −0.7 ⇒ cliff = 6×0.51 = 3.06). Legitimacy 50
    // ⇒ no fragility, so the cliff is temperament-only.
    const stock = 10;
    const proud = runCrack(crackWorld({ stock }), crackItem({ dominant: 'proud', flaw: 'stubborn' }));
    const heir = runCrack(crackWorld({ stock }), crackItem({ dominant: 'pragmatic' }));
    expect(proud.changed, 'the proud crown holds its war past this stock — no crack').toBe(false);
    expect(heir.changed, 'the pragmatic heir meets a lower cliff — the war cracks').toBe(true);
  });
});

describe('W-MOMENTUM r2 politics-psychology-5 — the DM-accept (proposal-lane) climb-down is priced exactly once', () => {
  const item = () => crackItem({ dominant: 'pragmatic' });
  // The proposal lane: the recall was stamped LAST tick (now-1) when the DM accepted the label
  // between pulses, and the war layer has ALREADY deleted the deployment by the time the crack
  // detector runs — so it survives only in the pre-war snapshot (priorDeployments).
  const proposalPrior = (recallTick = TICK - 1, extra = {}) => ({
    iron: { targetId: 'weak', recalled: { cause: 'sue_for_peace', tick: recallTick, ...extra } },
  });
  const world = () => ({
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', momentumEnabled: true },
    deployments: {}, // the war layer already deleted the recalled deployment
    spatialLedgers: { commitments: { 'iron>war:weak': { stock: MOMENTUM_TUNING.STOCK_MAX, sinceTick: 0, lastDepositTick: TICK, deposits: [{ tick: TICK, kind: 'siege', mag: 0.8 }] } } },
  });
  const run = (w, prior) => advanceMomentumCracks({
    snapshot: { byId: new Map([['iron', item()]]) }, worldState: w,
    settlementUpdates: [{ saveId: 'iron', settlement: item().settlement }],
    tick: TICK, nameFor: (id) => String(id).toUpperCase(), exitKindFor: () => '', priorDeployments: prior,
  });

  it('CONTROL: without the pre-war snapshot, a deleted deployment is INVISIBLE (the bug) — no crack', () => {
    const r = run(world(), null);
    expect(r.changed, 'the deleted proposal-lane deployment cannot be seen without the snapshot').toBe(false);
  });

  it('WITH the pre-war snapshot, the now-1 proposal-lane climb-down IS priced (past cliff)', () => {
    const r = run(world(), proposalPrior(TICK - 1));
    expect(r.changed, 'the proposal-lane climb-down is now detected + charged').toBe(true);
    expect(r.newsEntries[0].kind).toBe('momentum_climb_down');
  });

  it('IDEMPOTENT: a recall already carrying chargedTick is never re-priced (no double-fire with the auto lane)', () => {
    const r = run(world(), proposalPrior(TICK - 1, { chargedTick: TICK - 1 }));
    expect(r.changed, 'an already-charged recall does not fire a second time').toBe(false);
  });

  it('a genuinely STALE snapshot recall (older than now-1) still does not fire', () => {
    const r = run(world(), proposalPrior(TICK - 3));
    expect(r.changed).toBe(false);
  });

  it('the AUTO lane is unchanged: a live same-tick recall still fires WITHOUT any snapshot', () => {
    const auto = crackWorld({ stock: MOMENTUM_TUNING.STOCK_MAX, recallTick: TICK });
    const r = runCrack(auto, item());
    expect(r.changed).toBe(true);
    // And the fix stamps chargedTick on the surviving live deployment so next tick can't re-charge.
    expect(/** @type {any} */ (r.worldState).deployments.iron.recalled.chargedTick).toBe(TICK);
  });
});

// ── The belief discount through reconcileBelief ──────────────────────────────────
/** A fresh, faithful report (high accuracy, independent, complete). */
const faithfulReport = (sortKey = 'r') => ({ hopCount: 0, ageTicks: 0, independentSources: 3, completeness01: 1, accuracy01: 1, score: 1, sortKey, sourceId: 's' });
const rec = (strengthBand, readiness) => ({ strengthBand, readiness, allianceLabel: 'unknown', faithLabel: 'unknown', confidence01: 1, lastUpdateTick: 0 });

describe('W-MOMENTUM wiring — the belief discount through reconcileBelief', () => {
  it('commitmentDiscount01 = 1 is the byte-identity anchor (identical to the no-param call)', () => {
    const args = { prior: { ...rec(0, 0), confidence01: 0.5 }, groundTruth: rec(4, 1), reports: [faithfulReport()], now: 5 };
    const base = reconcileBelief({ ...args });
    const explicitOne = reconcileBelief({ ...args, commitmentDiscount01: 1 });
    expect(explicitOne).toEqual(base);
  });

  it('a CORROBORATING read is heard in FULL — the discount only bites on contradiction', () => {
    // prior AGREES with truth (both band 4) ⇒ no contradiction ⇒ the discount cannot bite.
    const args = { prior: { ...rec(4, 0), confidence01: 0.5 }, groundTruth: rec(4, 1), reports: [faithfulReport()], now: 5 };
    const undiscounted = reconcileBelief({ ...args, commitmentDiscount01: 1 });
    const committed = reconcileBelief({ ...args, commitmentDiscount01: 0.4 });
    expect(committed.readiness).toBe(undiscounted.readiness); // agreeing report unaffected
  });

  it('a CONTRADICTING read converges SLOWER under a committed discount, but STILL toward truth (slows, never inverts)', () => {
    // prior CONTRADICTS truth (band 0 vs 4). The value re-anchors toward the truthful report;
    // the discount SLOWS that pull but never reverses it (the floor keeps re-anchoring alive).
    const args = { prior: { ...rec(0, 0), confidence01: 0.5 }, groundTruth: rec(4, 1), reports: [faithfulReport()], now: 5 };
    const undiscounted = reconcileBelief({ ...args, commitmentDiscount01: 1 });
    const committed = reconcileBelief({ ...args, commitmentDiscount01: 0.4 });
    // Both move readiness UP from the prior (0) toward truth (1) — reality wins either way.
    expect(committed.readiness).toBeGreaterThan(0);
    expect(undiscounted.readiness).toBeGreaterThan(0);
    // But the committed observer moves LESS this tick (motivated reasoning slows convergence).
    expect(committed.readiness).toBeLessThan(undiscounted.readiness);
    // Never inverted: it never overshoots past truth.
    expect(committed.readiness).toBeLessThanOrEqual(1);
  });
});
