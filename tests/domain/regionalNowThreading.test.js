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

  it('ensureRegionalGraph stamps minted channel_inferred edges with the threaded now, never the wall clock', () => {
    // ensure MINTS state: a channel whose pair has no edge gets an inferred
    // edge. That mint was the one record in a now-threaded apply still
    // reading the wall clock.
    const channels = [{
      type: 'political_authority',
      from: 'v',
      to: 'o',
      status: 'confirmed',
      discoveredAt: '2026-05-01T00:00:00.000Z',
      confirmedAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-01T00:00:00.000Z',
    }];
    const graph = ensureRegionalGraph({ channels }, { now: NOW });
    const inferred = graph.edges.find(edge => edge.relationshipType === 'channel_inferred');
    expect(inferred).toBeTruthy();
    expect(inferred.id).toBe('edge.v.o');
    expect(inferred.updatedAt).toBe(NOW);
    expect(graph.updatedAt).toBe(NOW);
    expect(JSON.stringify(graph)).not.toContain(T_FIXTURE.toISOString());

    // API compatibility: without now, the wall clock still fills the mint.
    const fallback = ensureRegionalGraph({ channels });
    expect(fallback.edges.find(edge => edge.relationshipType === 'channel_inferred').updatedAt)
      .toBe(T_FIXTURE.toISOString());
  });

  it('ensureRegionalGraph of a raw timestampless graph replays JSON-identical across a moved clock', () => {
    // The triage pin: EVERY normalize* default stamp (node/edge/channel
    // discoveredAt/updatedAt, the minted channel_inferred edge, the graph
    // updatedAt) honours the threaded now — a raw graph with no timestamps
    // anywhere is the maximal exercise of the fallback paths.
    const raw = () => ({
      nodes: [{ id: 'v', name: 'Ashford' }, { id: 'o', name: 'Crownhold' }],
      channels: [{ type: 'political_authority', from: 'v', to: 'o', status: 'confirmed' }],
    });

    const first = ensureRegionalGraph(raw(), { now: NOW });
    vi.setSystemTime(T_DRIFTED); // the clock moves; a replay must not see it
    const second = ensureRegionalGraph(raw(), { now: NOW });

    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    // The synthesized edge and the raw channel both carry the threaded now.
    expect(first.edges.find(edge => edge.relationshipType === 'channel_inferred').updatedAt).toBe(NOW);
    expect(first.channels[0].discoveredAt).toBe(NOW);
    expect(JSON.stringify(first)).not.toContain(T_FIXTURE.toISOString());
    expect(JSON.stringify(second)).not.toContain(T_DRIFTED.toISOString());
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

  it('a subjugation apply mints its inferred edges with the pulse now and replays byte-identical', () => {
    // The audit's concrete leak: the vassal bundle mints channels for the
    // overlord->vassal pair, which has no edge — ensureRegionalGraph used to
    // stamp that channel_inferred edge with the wall clock while every other
    // updatedAt honoured the threaded now.
    const baseline = '2026-05-01T00:00:00.000Z';
    const outcome = {
      id: 'candidate.relationship.hostile_occupation_pressure.edge.v.o.4',
      type: 'relationship',
      candidateType: 'hostile_occupation_pressure',
      relationshipKey: 'edge.v.o',
      severity: 0.86,
      applyMode: 'auto',
      headline: 'hostile becomes vassal',
      summary: 'Crownhold presses Ashford into vassalage.',
      relationshipPatch: { proposedRelationshipType: 'vassal', overlordSaveId: 'o', vassalSaveId: 'v' },
      proposalPayload: { kind: 'relationship_label_change', relationshipKey: 'edge.v.o', fromType: 'hostile', toType: 'vassal', reason: 'Crownhold conquers Ashford.' },
    };
    const run = () => applyWorldPulseOutcomes({
      snapshot: { regionalGraph: null, settlements: [], campaign: {} },
      worldState: {
        tick: 4,
        relationshipStates: {
          'edge.v.o': { relationshipType: 'hostile', resentment: 0.9, fear: 0.8 },
        },
      },
      regionalGraph: {
        nodes: [
          { id: 'o', name: 'Crownhold', updatedAt: baseline },
          { id: 'v', name: 'Ashford', updatedAt: baseline },
        ],
        edges: [{ id: 'edge.v.o', from: 'v', to: 'o', relationshipType: 'hostile', updatedAt: baseline }],
        channels: [],
        updatedAt: baseline,
      },
      wizardNews: { currentTick: 4, entries: [], updatedAt: baseline },
      settlementMap: new Map(),
      outcomes: [outcome],
      tick: 4,
      now: NOW,
    });

    const first = run();

    expect(first.regionalGraph.edges.find(edge => edge.id === 'edge.v.o').relationshipType).toBe('vassal');
    const inferred = first.regionalGraph.edges.filter(edge => edge.relationshipType === 'channel_inferred');
    expect(inferred.length).toBeGreaterThan(0);
    for (const edge of inferred) expect(edge.updatedAt).toBe(NOW);
    expect(first.regionalGraph.channels.length).toBeGreaterThan(0);
    for (const channel of first.regionalGraph.channels) {
      expect(channel.discoveredAt).toBe(NOW);
      expect(channel.updatedAt).toBe(NOW);
    }
    // Nothing anywhere in the apply output carries the drifted wall clock.
    expect(JSON.stringify(first.regionalGraph)).not.toContain('2026-08-15');

    vi.setSystemTime(new Date('2026-10-01T07:00:00.000Z')); // the clock moves; a replay must not see it
    const second = run();
    expect(JSON.stringify(second.regionalGraph)).toBe(JSON.stringify(first.regionalGraph));
  });
});
