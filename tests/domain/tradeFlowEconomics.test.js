/**
 * tradeFlowEconomics.test.js — Phase 5.5 mover M6d: the FLOW-DERIVED ECONOMICS
 * display read-model (the drift selector).
 *
 * Proves the settlementRumors dormancy shape: measured flow ⇒ a qualitative drift;
 * absent flow ⇒ NULL ⇒ the tab renders the generation baseline byte-identically.
 * GENERATION IS SACRED — the selector never mutates economicState. ISOLATION =
 * autarky = zero live drift.
 */
import { describe, it, expect } from 'vitest';
import {
  flowDerivedDependency, hasTradeFlow, isTradeDependent,
} from '../../src/domain/display/tradeFlowEconomics.js';

const world = (tradeFlow, tick = 5) => ({ tick, spatialLedgers: tradeFlow ? { tradeFlow } : {} });
const DEP_ECO = { primaryImports: ['Wrought iron'], primaryExports: [], tradeDependencies: [{ resource: 'iron', severity: 'critical' }] };
const SELF_ECO = { primaryImports: [], primaryExports: [], tradeDependencies: [] };

describe('M6d flowDerivedDependency — dormancy shape', () => {
  it('ABSENT ledger ⇒ null (the tab renders the generation baseline byte-identically)', () => {
    expect(flowDerivedDependency({ worldState: world(null), economicState: DEP_ECO, settlementId: 'forge' })).toBeNull();
    expect(flowDerivedDependency({ worldState: {}, economicState: DEP_ECO, settlementId: 'forge' })).toBeNull();
    expect(flowDerivedDependency({ worldState: null, economicState: DEP_ECO, settlementId: 'forge' })).toBeNull();
  });

  it('ISOLATION = autarky: a settlement absent from the tally ⇒ null (zero live drift)', () => {
    const ws = world({ other: { in: 2, out: 1, lastTick: 5 } });
    expect(flowDerivedDependency({ worldState: ws, economicState: DEP_ECO, settlementId: 'forge' })).toBeNull();
  });

  it('a below-EPS entry fails closed to null (decayed-away autarky)', () => {
    const ws = world({ forge: { in: 0.01, out: 0.0, lastTick: 5 } });
    expect(flowDerivedDependency({ worldState: ws, economicState: DEP_ECO, settlementId: 'forge' })).toBeNull();
  });

  it('null settlementId ⇒ null', () => {
    expect(flowDerivedDependency({ worldState: world({ forge: { in: 2, out: 1, lastTick: 5 } }), economicState: DEP_ECO, settlementId: null })).toBeNull();
  });

  it('FLOW PRESENT ⇒ a qualitative drift (band + inbound/outbound words, no numbers)', () => {
    const ws = world({ forge: { in: 2, out: 1, lastTick: 5 } });
    const d = flowDerivedDependency({ worldState: ws, economicState: DEP_ECO, settlementId: 'forge' });
    expect(d).not.toBeNull();
    expect(['shortage', 'adequate', 'surplus']).toContain(d.band);
    expect(['quiet', 'trickle', 'steady', 'busy']).toContain(d.inbound);
    expect(['quiet', 'trickle', 'steady', 'busy']).toContain(d.outbound);
    expect(typeof d.headline).toBe('string');
    // No raw numeric tally leaks into the surfaced drift (no numeric price).
    for (const v of Object.values(d)) expect(typeof v).not.toBe('number');
  });

  it('a trade-dependent town CHOKED of flow drifts toward shortage; a busy one toward surplus', () => {
    const choked = flowDerivedDependency({ worldState: world({ forge: { in: 0.1, out: 0.1, lastTick: 5 } }), economicState: DEP_ECO, settlementId: 'forge' });
    const busy = flowDerivedDependency({ worldState: world({ forge: { in: 4, out: 3, lastTick: 5 } }), economicState: DEP_ECO, settlementId: 'forge' });
    expect(choked.band).toBe('shortage');
    expect(choked.dependency).toBe('strained');
    expect(busy.band).toBe('surplus');
  });

  it('a SELF-SUFFICIENT town never drifts to shortage (flow is upside only)', () => {
    const d = flowDerivedDependency({ worldState: world({ hamlet: { in: 0.1, out: 0.1, lastTick: 5 } }), economicState: SELF_ECO, settlementId: 'hamlet' });
    expect(d.band).not.toBe('shortage');
  });
});

describe('M6d GENERATION IS SACRED — the selector is a pure read', () => {
  it('never mutates the economicState baseline', () => {
    const eco = JSON.parse(JSON.stringify(DEP_ECO));
    const snapshot = JSON.stringify(eco);
    flowDerivedDependency({ worldState: world({ forge: { in: 2, out: 1, lastTick: 5 } }), economicState: eco, settlementId: 'forge' });
    expect(JSON.stringify(eco)).toBe(snapshot);
  });

  it('never mutates the worldState it reads', () => {
    const ws = world({ forge: { in: 2, out: 1, lastTick: 5 } });
    const snapshot = JSON.stringify(ws);
    flowDerivedDependency({ worldState: ws, economicState: DEP_ECO, settlementId: 'forge' });
    expect(JSON.stringify(ws)).toBe(snapshot);
  });
});

describe('M6d hasTradeFlow + isTradeDependent gates', () => {
  it('hasTradeFlow: present ledger ⇒ true, absent ⇒ false', () => {
    expect(hasTradeFlow(world({ forge: { in: 1, out: 0, lastTick: 1 } }))).toBe(true);
    expect(hasTradeFlow(world(null))).toBe(false);
    expect(hasTradeFlow({})).toBe(false);
    expect(hasTradeFlow(null)).toBe(false);
  });
  it('isTradeDependent reads the seeded trade profile', () => {
    expect(isTradeDependent(DEP_ECO)).toBe(true);
    expect(isTradeDependent(SELF_ECO)).toBe(false);
    expect(isTradeDependent(null)).toBe(false);
  });
});
