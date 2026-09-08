/**
 * tests/domain/regionalEventLogBounds.test.js — Regional wave R4 pins (H18).
 *
 * regionalGraph.eventLog grew without bound, and every appended record
 * embedded the full localDelta — TWO complete before/after settlement
 * projections (~4.4KB+) per canon event — into campaign JSON that persists
 * to localStorage and cloud-syncs on every change. Nothing ever read the
 * embedded projections (verified by consumer grep: the inbox/summary/chain
 * viewer read sourceSettlementId/sourceEvent/impactIds; wizardNews reads
 * impactIds + sourceEvent).
 *
 * Pins:
 *   • the log never exceeds REGIONAL_EVENT_LOG_LIMIT (FIFO drop, newest kept),
 *     both on append and when ensure heals a legacy oversized save;
 *   • appended records carry event metadata + the typed changes list, never
 *     the embedded projections;
 *   • the five zero-consumer deriveRegionalState fields are gone, every
 *     consumed field stays, and discovery + propagation behavior is unchanged
 *     on a fixture pair.
 */

import { describe, expect, it } from 'vitest';

import {
  addRegionalChannels,
  appendRegionalEvent,
  deriveLocalDelta,
  deriveRegionalState,
  discoverDependencyCandidates,
  ensureRegionalGraph,
  normalizeGoodsList,
  propagateRegionalEvent,
  REGIONAL_EVENT_LOG_LIMIT,
} from '../../src/domain/region/index.js';

const NOW = '2026-06-11T12:00:00.000Z';

function save(id, name, settlement = {}) {
  return {
    id,
    name,
    tier: settlement.tier || 'town',
    settlement: {
      id: `settlement.${id}`,
      name,
      tier: settlement.tier || 'town',
      config: { tradeRouteAccess: 'road', ...(settlement.config || {}) },
      institutions: [],
      economicState: {
        primaryExports: [],
        primaryImports: [],
        activeChains: [],
        ...(settlement.economicState || {}),
      },
      neighbourNetwork: settlement.neighbourNetwork || [],
      activeConditions: settlement.activeConditions || [],
    },
  };
}

function supplierPair() {
  const beforeSupplier = save('supplier', 'Granary Ford', {
    economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
  });
  const afterSupplier = save('supplier', 'Granary Ford', {
    economicState: { primaryExports: [] },
  });
  const buyer = save('buyer', 'Millcross', {
    economicState: { primaryImports: ['Grain and malt'] },
  });
  return { beforeSupplier, afterSupplier, buyer };
}

function confirmedTradeGraph() {
  const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);
  return addRegionalChannels(null, [
    { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 1, confidence: 1 },
  ], { now: NOW });
}

describe('eventLog bounds (H18)', () => {
  it('appendRegionalEvent never lets the log exceed the cap — FIFO drop, newest kept', () => {
    let graph = ensureRegionalGraph({});
    const total = REGIONAL_EVENT_LOG_LIMIT + 10;
    for (let i = 0; i < total; i += 1) {
      graph = appendRegionalEvent(graph, { id: `regional_event.${i}` }, { now: NOW });
      expect(graph.eventLog.length).toBeLessThanOrEqual(REGIONAL_EVENT_LOG_LIMIT);
    }
    expect(graph.eventLog).toHaveLength(REGIONAL_EVENT_LOG_LIMIT);
    expect(graph.eventLog[0].id).toBe('regional_event.10');
    expect(graph.eventLog.at(-1).id).toBe(`regional_event.${total - 1}`);
  });

  it('ensureRegionalGraph heals a legacy oversized log down to the cap (newest survive)', () => {
    const oversized = Array.from({ length: 400 }, (_, i) => ({ id: `regional_event.${i}` }));
    const graph = ensureRegionalGraph({ eventLog: oversized });
    expect(graph.eventLog).toHaveLength(REGIONAL_EVENT_LOG_LIMIT);
    expect(graph.eventLog[0].id).toBe(`regional_event.${400 - REGIONAL_EVENT_LOG_LIMIT}`);
    expect(graph.eventLog.at(-1).id).toBe('regional_event.399');
  });

  it('ensure is an identity-shape no-op for a log already under the cap', () => {
    const log = [{ id: 'regional_event.keep' }];
    const graph = ensureRegionalGraph({ eventLog: log });
    expect(graph.eventLog).toHaveLength(1);
    expect(graph.eventLog[0].id).toBe('regional_event.keep');
  });
});

describe('eventLog projection diet (H18)', () => {
  it('appended records carry event metadata + typed changes, but no embedded projections', () => {
    const { beforeSupplier, afterSupplier } = supplierPair();
    const result = propagateRegionalEvent({
      graph: confirmedTradeGraph(),
      beforeSettlement: beforeSupplier,
      afterSettlement: afterSupplier,
      event: { id: 'evt_diet', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
      now: NOW,
    });

    const record = result.graph.eventLog.at(-1);
    // What the consumers read stays.
    expect(record.sourceSettlementId).toBe('supplier');
    expect(record.sourceEvent).toMatchObject({ id: 'evt_diet', type: 'DEPLETE_RESOURCE' });
    expect(record.impactIds.length).toBeGreaterThan(0);
    // The typed changes list survives (what moved, and how hard)...
    expect(record.changes.some(change => change.kind === 'export_lost')).toBe(true);
    const goodsChange = record.changes.find(change => change.good);
    expect(Object.keys(goodsChange.good).sort()).toEqual(['id', 'label']);
    // ...but the embedded before/after settlement projections are gone — the
    // record carries exactly the audit-row surface and nothing else.
    expect(record.localDelta).toBeUndefined();
    expect(Object.keys(record).sort()).toEqual([
      'changes', 'id', 'impactIds', 'recordedAt',
      'sourceEvent', 'sourceSettlementId', 'sourceSettlementName',
    ]);
    expect(JSON.stringify(record)).not.toContain('"activeChains"');
  });
});

describe('deriveRegionalState projection diet (R4)', () => {
  it('drops the five zero-consumer fields and keeps every consumed field', () => {
    const state = deriveRegionalState(save('a', 'Aford', {
      config: { nearbyResourcesState: { grain_fields: 'depleted' } },
      economicState: { primaryExports: ['Milled flour'], primaryImports: ['Iron ore'] },
    }));

    for (const dead of ['services', 'unhealthyChains', 'activeConditions', 'causal', 'systemState']) {
      expect(state).not.toHaveProperty(dead);
    }

    // The consumed surface is intact: graph nodes (id/name/tier), discovery
    // (exports/imports/route), deriveLocalDelta (population/activeChains/
    // localProduction/depletedGoods/tier diffs).
    expect(state.id).toBe('a');
    expect(state.settlementId).toBe('settlement.a');
    expect(state.name).toBe('Aford');
    expect(state.tier).toBe('town');
    expect(state.population).toBe(0);
    expect(state.exports.map(g => g.id)).toContain('flour');
    expect(state.imports.map(g => g.id)).toContain('iron');
    expect(Array.isArray(state.localProduction)).toBe(true);
    expect(Array.isArray(state.activeChains)).toBe(true);
    expect(state.route.open).toBe(true);
    expect(state.depletedGoods.map(g => g.id)).toContain('grain');
  });

  it('the empty-settlement fallback matches the slimmed shape', () => {
    const empty = deriveRegionalState(null);
    expect(Object.keys(empty).sort()).toEqual([
      'activeChains', 'depletedGoods', 'exports', 'id', 'imports',
      'localProduction', 'name', 'population', 'route', 'tier',
    ]);
  });

  it('discovery + propagation behavior is unchanged on a fixture pair', () => {
    const { beforeSupplier, afterSupplier, buyer } = supplierPair();

    // Discovery still finds the P0 channels from the slimmed projection.
    const channels = discoverDependencyCandidates(beforeSupplier, buyer);
    expect(channels.some(c => c.type === 'trade_dependency' && c.from === 'supplier' && c.to === 'buyer')).toBe(true);
    expect(channels.some(c => c.type === 'export_market' && c.from === 'buyer' && c.to === 'supplier')).toBe(true);
    expect(channels.some(c => c.type === 'trade_route')).toBe(true);

    // The local delta still derives the same typed changes...
    const localDelta = deriveLocalDelta(beforeSupplier, afterSupplier, {
      event: { id: 'evt_diet2', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
    });
    expect(localDelta.changes.some(change => change.kind === 'export_lost')).toBe(true);

    // ...and propagation still queues the same impact.
    const result = propagateRegionalEvent({
      graph: confirmedTradeGraph(),
      beforeSettlement: beforeSupplier,
      afterSettlement: afterSupplier,
      event: { id: 'evt_diet2', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
      now: NOW,
    });
    expect(result.impacts.some(i => i.kind === 'import_shortage' && i.targetSettlementId === 'buyer')).toBe(true);
    expect(result.graph.queuedImpacts.some(i => i.kind === 'import_shortage')).toBe(true);
  });
});
