/**
 * tradeFlow.test.js — Phase 5.5 mover M6d: the arrivals TALLY pure engine.
 *
 * Proves the windowed, modality-weighted, sparse throughput tally + the qualitative
 * bands: arrivals count IN at the consumer and OUT at the source, modality-weighted
 * (a roster read); the tally DECAYS when flow stops (drops to absent — autarky); the
 * band vocabulary is M6a's (shortage/adequate/surplus), no numeric prices.
 */
import { describe, it, expect } from 'vitest';
import {
  settlementModalityWeight, advanceTradeFlowTally, throughputBand, flowMagnitudeBand,
  TRADE_FLOW_TUNING, FLOW_BANDS, FLOW_MAGNITUDE,
} from '../../src/domain/spatial/tradeFlow.js';

const wrap = (tradeFlow) => (tradeFlow ? { spatialLedgers: { tradeFlow } } : {});

describe('M6d settlementModalityWeight — the ROSTER read', () => {
  it('a landlocked road settlement is the caravan LAND base', () => {
    expect(settlementModalityWeight({ institutions: [], config: { tradeRouteAccess: 'road' } }))
      .toBe(TRADE_FLOW_TUNING.MODALITY.LAND);
  });
  it('a port (economicState.tradeAccess) adds SEA weight', () => {
    const w = settlementModalityWeight({ economicState: { tradeAccess: 'port' }, institutions: [] });
    expect(w).toBe(TRADE_FLOW_TUNING.MODALITY.LAND + TRADE_FLOW_TUNING.MODALITY.SEA);
  });
  it('a harbour institution adds SEA weight by roster name', () => {
    const w = settlementModalityWeight({ institutions: [{ name: 'The Grand Harbour' }] });
    expect(w).toBe(TRADE_FLOW_TUNING.MODALITY.LAND + TRADE_FLOW_TUNING.MODALITY.SEA);
  });
  it('an airship dock adds AIRSHIP weight', () => {
    const w = settlementModalityWeight({ institutions: [{ name: 'Airship Dock' }] });
    expect(w).toBe(TRADE_FLOW_TUNING.MODALITY.LAND + TRADE_FLOW_TUNING.MODALITY.AIRSHIP);
  });
  it('a teleportation circle adds TELEPORT weight', () => {
    const w = settlementModalityWeight({ institutions: [{ name: 'Teleportation Circle' }] });
    expect(w).toBe(TRADE_FLOW_TUNING.MODALITY.LAND + TRADE_FLOW_TUNING.MODALITY.TELEPORT);
  });
  it('modalities STACK (a port that also runs airships + a circle)', () => {
    const w = settlementModalityWeight({
      economicState: { tradeAccess: 'port' },
      institutions: [{ name: 'Airship Dock' }, { name: 'Planar Gate' }],
    });
    const M = TRADE_FLOW_TUNING.MODALITY;
    expect(w).toBe(M.LAND + M.SEA + M.AIRSHIP + M.TELEPORT);
  });
  it('a null / garbage settlement never crashes (LAND base)', () => {
    expect(settlementModalityWeight(null)).toBe(TRADE_FLOW_TUNING.MODALITY.LAND);
    expect(settlementModalityWeight({ institutions: 'nope' })).toBe(TRADE_FLOW_TUNING.MODALITY.LAND);
  });
});

describe('M6d advanceTradeFlowTally — the windowed tally', () => {
  it('DORMANT: no prior + no arrivals ⇒ null, unchanged', () => {
    const r = advanceTradeFlowTally({ worldState: {}, tick: 0, arrivals: [] });
    expect(r.next).toBeNull();
    expect(r.changed).toBe(false);
  });

  it('counts arrivals IN at the consumer and OUT at the source, modality-weighted', () => {
    const r = advanceTradeFlowTally({
      worldState: {}, tick: 3,
      arrivals: [{ destId: 'forge', sourceId: 'vale', destWeight: 2, sourceWeight: 1 }],
    });
    expect(r.changed).toBe(true);
    expect(r.next.forge).toEqual({ in: 2, out: 0, lastTick: 3 });
    expect(r.next.vale).toEqual({ in: 0, out: 1, lastTick: 3 });
  });

  it('modality weighting: a heavier-weight destination registers heavier inbound', () => {
    const light = advanceTradeFlowTally({ worldState: {}, tick: 0,
      arrivals: [{ destId: 'a', sourceId: 'z', destWeight: 1, sourceWeight: 1 }] });
    const heavy = advanceTradeFlowTally({ worldState: {}, tick: 0,
      arrivals: [{ destId: 'a', sourceId: 'z', destWeight: 3, sourceWeight: 1 }] });
    expect(heavy.next.a.in).toBeGreaterThan(light.next.a.in);
  });

  it('multiple arrivals in one tick accumulate at a hub', () => {
    const r = advanceTradeFlowTally({ worldState: {}, tick: 1, arrivals: [
      { destId: 'hub', sourceId: 's1', destWeight: 1, sourceWeight: 1 },
      { destId: 'hub', sourceId: 's2', destWeight: 1, sourceWeight: 1 },
    ] });
    expect(r.next.hub.in).toBe(2);
  });

  it('DECAYS when flow stops, and DROPS to absent (autarky) — a blockade made real', () => {
    let ws = wrap(advanceTradeFlowTally({ worldState: {}, tick: 0,
      arrivals: [{ destId: 'town', sourceId: 'mine', destWeight: 1, sourceWeight: 1 }] }).next);
    let last = null;
    for (let t = 1; t <= 8; t++) {
      const r = advanceTradeFlowTally({ worldState: ws, tick: t, arrivals: [] });
      ws = wrap(r.next);
      last = r;
    }
    // Every entry has decayed below EPS and been pruned ⇒ the ledger is gone.
    expect(last.next).toBeNull();
  });

  it('a decaying entry shrinks monotonically before it drops', () => {
    let ws = wrap(advanceTradeFlowTally({ worldState: {}, tick: 0,
      arrivals: [{ destId: 'town', sourceId: 'mine', destWeight: 1, sourceWeight: 1 }] }).next);
    const r1 = advanceTradeFlowTally({ worldState: ws, tick: 1, arrivals: [] });
    expect(r1.next.town.in).toBeLessThan(1);
    expect(r1.next.town.in).toBeGreaterThan(0);
  });

  it('renewed flow refills the tally (arrivals ADD after decay)', () => {
    let ws = wrap(advanceTradeFlowTally({ worldState: {}, tick: 0,
      arrivals: [{ destId: 'town', sourceId: 'mine', destWeight: 1, sourceWeight: 1 }] }).next);
    const decayed = advanceTradeFlowTally({ worldState: ws, tick: 1, arrivals: [] });
    ws = wrap(decayed.next);
    const refilled = advanceTradeFlowTally({ worldState: ws, tick: 2,
      arrivals: [{ destId: 'town', sourceId: 'mine', destWeight: 1, sourceWeight: 1 }] });
    expect(refilled.next.town.in).toBeGreaterThan(decayed.next.town.in);
  });

  it('is deterministic + codepoint-sorted', () => {
    const arrivals = [
      { destId: 'z', sourceId: 'a', destWeight: 1, sourceWeight: 1 },
      { destId: 'a', sourceId: 'z', destWeight: 1, sourceWeight: 1 },
    ];
    const a = advanceTradeFlowTally({ worldState: {}, tick: 0, arrivals });
    const b = advanceTradeFlowTally({ worldState: {}, tick: 0, arrivals });
    expect(JSON.stringify(a.next)).toBe(JSON.stringify(b.next));
    expect(Object.keys(a.next)).toEqual(['a', 'z']);
  });
});

describe('M6d bands — qualitative only (no numeric prices)', () => {
  it('flowMagnitudeBand buckets a decayed count into plain words', () => {
    expect(flowMagnitudeBand(0)).toBe(FLOW_MAGNITUDE.QUIET);
    expect(flowMagnitudeBand(0.5)).toBe(FLOW_MAGNITUDE.TRICKLE);
    expect(flowMagnitudeBand(1.5)).toBe(FLOW_MAGNITUDE.STEADY);
    expect(flowMagnitudeBand(5)).toBe(FLOW_MAGNITUDE.BUSY);
  });
  it('a TRADE-DEPENDENT town starved of throughput reads SHORTAGE', () => {
    expect(throughputBand(0.1, 0, true)).toBe(FLOW_BANDS.SHORTAGE);
  });
  it('a TRADE-DEPENDENT town with brisk throughput reads SURPLUS', () => {
    expect(throughputBand(3, 2, true)).toBe(FLOW_BANDS.SURPLUS);
  });
  it('a TRADE-DEPENDENT town with ordinary throughput reads ADEQUATE', () => {
    expect(throughputBand(1, 0.5, true)).toBe(FLOW_BANDS.ADEQUATE);
  });
  it('a SELF-SUFFICIENT town never reads shortage — flow is upside only', () => {
    expect(throughputBand(0.1, 0, false)).toBe(FLOW_BANDS.ADEQUATE);
    expect(throughputBand(4, 2, false)).toBe(FLOW_BANDS.SURPLUS);
  });
});
