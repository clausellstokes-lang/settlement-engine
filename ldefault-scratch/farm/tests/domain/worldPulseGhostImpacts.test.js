/**
 * tests/domain/worldPulseGhostImpacts.test.js — Regional wave R2 pins
 * (ghost applied impacts).
 *
 * Materialized regional conditions expire locally (duration.expiresAtTicks,
 * dropped by time progression during pulses), but the impact row used to
 * stay 'applied' forever — map markers, inbox rows with live Resolve
 * buttons, and Wizard News kept asserting pressure that no longer existed.
 *
 * Pins:
 *   • A pulse whose target settlement no longer carries the materialized
 *     condition flips the applied impact to 'resolved' and emits a resolved
 *     news entry (the DM reads the pressure easing, not a ghost).
 *   • An applied impact whose condition still lives stays 'applied'.
 *   • An applied impact targeting a settlement ABSENT from this pulse's
 *     saves is untouched — absence from the pulse is not evidence of expiry.
 *   • Legacy rows (no conditionId) reconcile through the legacy truncated
 *     condition id, both directions.
 *   • Discrete injections (advanceRegionalImpacts:false — party/proposal
 *     paths) never reconcile; that is the pulse's job.
 */

import { describe, expect, test } from 'vitest';

import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph, legacyRegionalConditionId } from '../../src/domain/region/index.js';

const NOW = '2026-06-11T00:00:00.000Z';

function bareWorldState() {
  return { stressors: [], npcStates: {}, proposals: [] };
}

function town(name, activeConditions = []) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    activeConditions,
  };
}

function appliedImpact(overrides = {}) {
  return {
    id: 'regional_impact.evt_grain.channel.trade_dependency.supplier.buyer.import_shortage',
    kind: 'import_shortage',
    sourceSettlementId: 'supplier',
    targetSettlementId: 'buyer',
    channelId: 'channel.trade_dependency.supplier.buyer.grain',
    channelType: 'trade_dependency',
    severity: 0.7,
    confidence: 0.8,
    status: 'applied',
    appliedAt: '2026-05-01T00:00:00.000Z',
    conditionId: 'condition.regional_import_shortage.grain_hash',
    explanation: 'Granary Ford can no longer reliably supply grain.',
    createdAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function graphWith(impact) {
  return ensureRegionalGraph({
    nodes: [
      { id: 'supplier', name: 'Granary Ford' },
      { id: 'buyer', name: 'Millcross' },
    ],
    queuedImpacts: [impact],
  });
}

function buyerMap(activeConditions) {
  return new Map([
    ['buyer', { saveId: 'buyer', save: { name: 'Millcross' }, settlement: town('Millcross', activeConditions) }],
  ]);
}

function pulse(graph, settlementMap, overrides = {}) {
  return applyWorldPulseOutcomes({
    snapshot: { regionalGraph: graph, settlements: [], campaign: {} },
    worldState: bareWorldState(),
    regionalGraph: graph,
    wizardNews: { currentTick: 5, entries: [] },
    settlementMap,
    outcomes: [],
    tick: 6,
    now: NOW,
    ...overrides,
  });
}

describe('ghost applied impacts reconcile at the pulse seam', () => {
  test('an applied impact whose materialized condition expired flips to resolved with a news entry', () => {
    const impact = appliedImpact();
    const result = pulse(graphWith(impact), buyerMap([]));

    const row = result.regionalGraph.queuedImpacts.find(item => item.id === impact.id);
    expect(row.status).toBe('resolved');
    expect(row.resolvedAt).toBe(NOW);
    expect(result.newsEntries.some(entry =>
      entry.kind === 'resolved' && entry.impactIds.includes(impact.id)
    )).toBe(true);
    expect(result.wizardNews.entries.some(entry =>
      entry.kind === 'resolved' && entry.impactIds.includes(impact.id)
    )).toBe(true);
  });

  test('an applied impact whose condition still lives stays applied', () => {
    const impact = appliedImpact();
    const condition = { id: impact.conditionId, archetype: 'regional_import_shortage', severity: 0.7 };
    const result = pulse(graphWith(impact), buyerMap([condition]));

    const row = result.regionalGraph.queuedImpacts.find(item => item.id === impact.id);
    expect(row.status).toBe('applied');
    expect(result.newsEntries.some(entry => entry.kind === 'resolved')).toBe(false);
  });

  test('an applied impact targeting a settlement not in this pulse is untouched', () => {
    const impact = appliedImpact();
    const settlementMap = new Map([
      ['supplier', { saveId: 'supplier', save: { name: 'Granary Ford' }, settlement: town('Granary Ford') }],
    ]);
    const result = pulse(graphWith(impact), settlementMap);

    const row = result.regionalGraph.queuedImpacts.find(item => item.id === impact.id);
    expect(row.status).toBe('applied');
    expect(row.resolvedAt).toBeUndefined();
  });

  test('legacy rows (no conditionId) reconcile through the legacy truncated id', () => {
    const impact = appliedImpact({ conditionId: undefined });
    const legacyCondition = { id: legacyRegionalConditionId(impact), archetype: 'regional_import_shortage', severity: 0.7 };

    // Condition still lives under the legacy id: the row must stay applied.
    const first = pulse(graphWith(impact), buyerMap([legacyCondition]));
    expect(first.regionalGraph.queuedImpacts.find(item => item.id === impact.id).status).toBe('applied');

    // Next pulse, the legacy condition has expired: the row resolves.
    const second = pulse(first.regionalGraph, buyerMap([]), { tick: 7 });
    const row = second.regionalGraph.queuedImpacts.find(item => item.id === impact.id);
    expect(row.status).toBe('resolved');
    expect(second.newsEntries.some(entry =>
      entry.kind === 'resolved' && entry.impactIds.includes(impact.id)
    )).toBe(true);
  });

  test('discrete injections (advanceRegionalImpacts:false) leave reconciliation to the pulse', () => {
    const impact = appliedImpact();
    const result = pulse(graphWith(impact), buyerMap([]), {
      advanceNewsTick: false,
      advanceRegionalImpacts: false,
    });

    const row = result.regionalGraph.queuedImpacts.find(item => item.id === impact.id);
    expect(row.status).toBe('applied');
  });
});
