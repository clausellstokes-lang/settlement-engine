/**
 * tests/domain/regionalNowThreading.test.js — Regional wave R4 pins
 * (deterministic timestamps / byte-identical replay).
 *
 * propagation.js claimed replay was byte-identical when `now` is threaded,
 * but graph.js, wizardNews.js, and the discovery helpers still read the wall
 * clock for updatedAt/recordedAt/discoveredAt defaults — two identical calls
 * produced JSON-different graphs (the audit's exact failing probe). Every
 * helper now accepts options.now (the wall clock is the fallback ONLY when
 * `now` is not provided, preserving API compatibility) and every production
 * caller threads it.
 *
 * Fake timers move the system clock BETWEEN replays so any surviving
 * wall-clock read shows up as a byte difference, never a same-millisecond
 * false pass.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  addRegionalChannels,
  advanceRegionalImpacts,
  deriveGraphWithDiscoveredCandidates,
  discoverDependencyCandidates,
  ensureRegionalGraph,
  normalizeGoodsList,
  propagateRegionalEvent,
  queueRegionalImpacts,
  setRegionalImpactStatus,
} from '../../src/domain/region/index.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';

const T_FIXTURE = new Date('2026-06-01T00:00:00.000Z');
const T_DRIFTED = new Date('2026-08-15T03:00:00.000Z');
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

describe('byte-identical replay (the audit probe)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(T_FIXTURE);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('two propagateRegionalEvent calls with identical args incl. now produce JSON-identical graphs across a moving wall clock', () => {
    const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 1, confidence: 1 },
      { type: 'trade_route', from: 'buyer', to: 'market', goods, status: 'confirmed', strength: 0.8, confidence: 1 },
    ], { now: '2026-05-01T00:00:00.000Z' });
    const args = () => ({
      graph,
      beforeSettlement: save('supplier', 'Granary Ford', {
        economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
      }),
      afterSettlement: save('supplier', 'Granary Ford', {
        economicState: { primaryExports: [] },
      }),
      event: { id: 'evt_replay', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
      maxDepth: 1,
      waveDecay: 0.5,
      now: NOW,
    });

    const first = propagateRegionalEvent(args());
    vi.setSystemTime(T_DRIFTED); // the wall clock moves; a replay must not see it
    const second = propagateRegionalEvent(args());

    expect(first.impacts.length).toBeGreaterThan(0);
    expect(JSON.stringify(second.graph)).toBe(JSON.stringify(first.graph));
    // The records propagation itself wrote carry the threaded now.
    expect(first.graph.eventLog.at(-1).recordedAt).toBe(NOW);
    expect(first.graph.updatedAt).toBe(NOW);
    for (const row of first.graph.queuedImpacts) {
      expect(row.createdAt).toBe(NOW);
      expect(row.updatedAt).toBe(NOW);
    }
  });

  it('graph helpers stamp the threaded now, never the wall clock', () => {
    const impact = {
      id: 'regional_impact.threading',
      kind: 'route_disruption',
      sourceSettlementId: 'a',
      targetSettlementId: 'b',
      severity: 0.5,
      status: 'queued',
      delayTicks: 1,
      createdAt: '2026-05-01T00:00:00.000Z',
    };
    let graph = queueRegionalImpacts(null, [impact], { now: NOW });
    expect(graph.updatedAt).toBe(NOW);
    expect(graph.queuedImpacts[0].updatedAt).toBe(NOW);

    graph = advanceRegionalImpacts(graph, 1, { now: NOW });
    expect(graph.updatedAt).toBe(NOW);
    expect(graph.queuedImpacts[0].updatedAt).toBe(NOW);

    graph = setRegionalImpactStatus(graph, impact.id, 'ignored', {}, { now: NOW });
    expect(graph.updatedAt).toBe(NOW);
    expect(graph.queuedImpacts[0].ignoredAt).toBe(NOW);
    expect(graph.queuedImpacts[0].updatedAt).toBe(NOW);
  });

  it('discovery candidates stamp the threaded now over candidate()’s wall-clock default', () => {
    const supplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
      neighbourNetwork: [{ id: 'buyer', neighbourName: 'Millcross', relationshipType: 'trade_partner' }],
    });
    const buyer = save('buyer', 'Millcross', {
      economicState: { primaryImports: ['Grain and malt'] },
      neighbourNetwork: [{ id: 'supplier', neighbourName: 'Granary Ford', relationshipType: 'trade_partner' }],
    });

    const channels = discoverDependencyCandidates(supplier, buyer, { now: NOW });
    expect(channels.length).toBeGreaterThan(0);
    for (const channel of channels) {
      expect(channel.discoveredAt).toBe(NOW);
      expect(channel.updatedAt).toBe(NOW);
    }

    const graph = deriveGraphWithDiscoveredCandidates([supplier, buyer], null, { now: NOW });
    expect(graph.updatedAt).toBe(NOW);
    for (const node of graph.nodes) expect(node.updatedAt).toBe(NOW);
    for (const channel of graph.channels) expect(channel.updatedAt).toBe(NOW);

    // API compatibility: without now, the wall clock still fills the defaults.
    const fallback = discoverDependencyCandidates(supplier, buyer);
    expect(fallback[0].discoveredAt).toBe(T_FIXTURE.toISOString());
  });
});

describe('pulse path stamps no wall-clock time when now is threaded', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(T_DRIFTED); // far from NOW: any wall-clock read is visible
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('advance + news append + feed all carry the pulse now (updatedAt === now)', () => {
    const graph = ensureRegionalGraph({
      nodes: [
        { id: 'supplier', name: 'Granary Ford', updatedAt: '2026-05-01T00:00:00.000Z' },
        { id: 'buyer', name: 'Millcross', updatedAt: '2026-05-01T00:00:00.000Z' },
      ],
      queuedImpacts: [{
        id: 'regional_impact.delayed',
        kind: 'route_disruption',
        sourceSettlementId: 'supplier',
        targetSettlementId: 'buyer',
        severity: 0.45,
        status: 'queued',
        delayTicks: 1,
        ageTicks: 0,
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T00:00:00.000Z',
      }],
      updatedAt: '2026-05-01T00:00:00.000Z',
    });

    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: graph, settlements: [], campaign: {} },
      worldState: { stressors: [], npcStates: {}, proposals: [] },
      regionalGraph: graph,
      wizardNews: { currentTick: 5, entries: [], updatedAt: '2026-05-01T00:00:00.000Z' },
      settlementMap: new Map(),
      outcomes: [],
      tick: 6,
      now: NOW,
    });

    expect(result.regionalGraph.updatedAt).toBe(NOW);
    expect(result.regionalGraph.queuedImpacts[0].updatedAt).toBe(NOW);

    // The matured delay emits a 'ready' entry — stamped with the pulse now.
    expect(result.newsEntries.length).toBeGreaterThan(0);
    expect(result.wizardNews.updatedAt).toBe(NOW);
    for (const entry of result.wizardNews.entries) {
      expect(entry.createdAt).toBe(NOW);
    }

    // Nothing anywhere in the pulse output carries the drifted wall clock.
    expect(JSON.stringify(result.regionalGraph)).not.toContain('2026-08-15');
    expect(JSON.stringify(result.wizardNews)).not.toContain('2026-08-15');
  });

  it('the ghost-reconcile row carries the pulse now on updatedAt, not just resolvedAt', () => {
    const graph = ensureRegionalGraph({
      nodes: [
        { id: 'supplier', name: 'Granary Ford', updatedAt: '2026-05-01T00:00:00.000Z' },
        { id: 'buyer', name: 'Millcross', updatedAt: '2026-05-01T00:00:00.000Z' },
      ],
      queuedImpacts: [{
        id: 'regional_impact.ghost',
        kind: 'import_shortage',
        sourceSettlementId: 'supplier',
        targetSettlementId: 'buyer',
        channelId: 'channel.trade_dependency.supplier.buyer.grain',
        channelType: 'trade_dependency',
        severity: 0.7,
        status: 'applied',
        appliedAt: '2026-05-01T00:00:00.000Z',
        conditionId: 'condition.regional_import_shortage.gone',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T00:00:00.000Z',
      }],
      updatedAt: '2026-05-01T00:00:00.000Z',
    });
    const settlementMap = new Map([
      ['buyer', {
        saveId: 'buyer',
        save: { name: 'Millcross' },
        settlement: { name: 'Millcross', tier: 'town', activeConditions: [] },
      }],
    ]);

    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: graph, settlements: [], campaign: {} },
      worldState: { stressors: [], npcStates: {}, proposals: [] },
      regionalGraph: graph,
      wizardNews: { currentTick: 5, entries: [], updatedAt: '2026-05-01T00:00:00.000Z' },
      settlementMap,
      outcomes: [],
      tick: 6,
      now: NOW,
    });

    const row = result.regionalGraph.queuedImpacts.find(item => item.id === 'regional_impact.ghost');
    expect(row.status).toBe('resolved');
    expect(row.resolvedAt).toBe(NOW);
    expect(row.updatedAt).toBe(NOW);
    expect(JSON.stringify(result.regionalGraph)).not.toContain('2026-08-15');
  });
});
