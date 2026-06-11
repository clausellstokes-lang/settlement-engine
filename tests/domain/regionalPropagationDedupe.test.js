/**
 * tests/domain/regionalPropagationDedupe.test.js
 *
 * R2 pins for H7 (+ reviewer-probed medium): one local shock queues ONE
 * impact per (target, kind, source event) even when several confirmed
 * channel types — or a direct impact plus a wave echo — derive the same kind
 * toward the same target; same-id collisions inside the derivation keep the
 * strongest severity, not the first; and legacyRegionalConditionId is
 * exported, matching the pre-R1 truncated derivation verbatim.
 */

import { describe, expect, it } from 'vitest';
import {
  addRegionalChannels,
  deriveLocalDelta,
  deriveRegionalImpacts,
  foldSameShockImpacts,
  legacyRegionalConditionId,
  normalizeGoodsList,
  propagateRegionalEvent,
} from '../../src/domain/region/index.js';

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

describe('same-shock fold across channels (H7)', () => {
  const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);

  function cutRouteGraph() {
    return addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 1, confidence: 1 },
      { type: 'trade_route', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 0.8, confidence: 1 },
      { type: 'export_market', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 0.9, confidence: 1 },
    ]);
  }

  const cutEvent = { id: 'evt_cut', type: 'CUT_TRADE_ROUTE', targetId: 'supplier' };

  it('one event over trade_dependency + trade_route queues ONE impact per kind, at the max severity, with folded-channel attribution', () => {
    const graph = cutRouteGraph();
    const before = save('supplier', 'Granary Ford');
    const after = save('supplier', 'Granary Ford');

    // Premise: the raw derivation still mints one route_disruption per channel.
    const raw = deriveRegionalImpacts(deriveLocalDelta(before, after, { event: cutEvent }), graph);
    const rawRoute = raw.filter(i => i.kind === 'route_disruption' && i.targetSettlementId === 'buyer');
    expect(rawRoute).toHaveLength(2);

    const result = propagateRegionalEvent({
      graph,
      beforeSettlement: before,
      afterSettlement: after,
      event: cutEvent,
    });
    const queuedRoute = result.graph.queuedImpacts.filter(i => i.kind === 'route_disruption' && i.targetSettlementId === 'buyer');
    expect(queuedRoute).toHaveLength(1);
    expect(queuedRoute[0].severity).toBe(Math.max(...rawRoute.map(i => i.severity)));

    // The kept impact keeps its own channel attribution; the folded sibling
    // stays visible (channel + severity) and is named in the explanation.
    const loser = rawRoute.find(i => i.id !== queuedRoute[0].id);
    expect(queuedRoute[0].foldedChannels).toHaveLength(1);
    expect(queuedRoute[0].foldedChannels[0]).toMatchObject({
      impactId: loser.id,
      channelId: loser.channelId,
      channelType: loser.channelType,
      severity: loser.severity,
    });
    expect(queuedRoute[0].explanation).toMatch(new RegExp(loser.channelType.replace(/_/g, ' ')));
    // The event log records the folded set — no dangling impact ids.
    const eventLogIds = result.graph.eventLog.at(-1).impactIds;
    expect(eventLogIds).toContain(queuedRoute[0].id);
    expect(eventLogIds).not.toContain(loser.id);
  });

  it('distinct kinds from one event are distinct consequences and both still queue', () => {
    const result = propagateRegionalEvent({
      graph: cutRouteGraph(),
      beforeSettlement: save('supplier', 'Granary Ford'),
      afterSettlement: save('supplier', 'Granary Ford'),
      event: cutEvent,
    });
    const kinds = result.graph.queuedImpacts
      .filter(i => i.targetSettlementId === 'buyer')
      .map(i => i.kind)
      .sort();
    expect(kinds).toEqual(['export_market_loss', 'route_disruption']);
  });

  it('folding same-kind impacts from two goods channels merges the goods lists', () => {
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods: normalizeGoodsList(['Grain']), status: 'confirmed', strength: 1, confidence: 1 },
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods: normalizeGoodsList(['Iron ore']), status: 'confirmed', strength: 1, confidence: 1 },
    ]);
    const result = propagateRegionalEvent({
      graph,
      beforeSettlement: save('supplier', 'Granary Ford', { tier: 'city' }),
      afterSettlement: save('supplier', 'Granary Ford', { tier: 'town' }),
      event: { id: 'evt_demote', type: 'TIER_CHANGE', targetId: 'supplier' },
    });
    const queued = result.graph.queuedImpacts.filter(i => i.kind === 'import_shortage' && i.targetSettlementId === 'buyer');
    expect(queued).toHaveLength(1);
    expect(queued[0].goods.map(g => g.id).sort()).toEqual(['grain', 'iron']);
    expect(queued[0].foldedChannels).toHaveLength(1);
  });

  it('foldSameShockImpacts is an identity no-op when nothing folds', () => {
    const impacts = [
      { id: 'a', targetSettlementId: 'b', kind: 'import_shortage', severity: 0.5 },
      { id: 'b', targetSettlementId: 'b', kind: 'route_disruption', severity: 0.4 },
    ];
    expect(foldSameShockImpacts(impacts)).toBe(impacts);
  });
});

describe('same-id collision keeps the strongest (R2 medium)', () => {
  const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);
  const graph = addRegionalChannels(null, [
    { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 1, confidence: 1 },
  ]);
  // population_loss and tier_demotion both mint import_shortage over the
  // channel goods — same impact id, different severity.
  const weak = { kind: 'population_loss', magnitude: 0.2, source: 'population' };
  const strong = { kind: 'tier_demotion', magnitude: 0.9, source: 'settlement_tier' };

  function delta(changes) {
    return {
      id: 'delta.supplier.collide',
      sourceSettlementId: 'supplier',
      sourceSettlementName: 'Granary Ford',
      cause: { event: { id: 'evt_collide', type: 'WORLD_PULSE' } },
      changes,
    };
  }

  it('keeps the stronger derivation regardless of change order', () => {
    const [weakOnly] = deriveRegionalImpacts(delta([weak]), graph);
    const [strongOnly] = deriveRegionalImpacts(delta([strong]), graph);
    // Premise: same impact id, weaker first under the fixed change order.
    expect(weakOnly.id).toBe(strongOnly.id);
    expect(weakOnly.severity).toBeLessThan(strongOnly.severity);

    const weakFirst = deriveRegionalImpacts(delta([weak, strong]), graph);
    expect(weakFirst).toHaveLength(1);
    expect(weakFirst[0].severity).toBe(strongOnly.severity);
    expect(weakFirst[0].sourceChange.kind).toBe('tier_demotion');

    const strongFirst = deriveRegionalImpacts(delta([strong, weak]), graph);
    expect(strongFirst).toHaveLength(1);
    expect(strongFirst[0].severity).toBe(strongOnly.severity);
  });
});

describe('wave-vs-direct fold keeps the stronger', () => {
  it('a stronger wave echo displaces a weak direct impact of the same kind on the same target', () => {
    // a -> b directly over a weak route; a -> c -> b over strong routes, so
    // the depth-1 wave into b outweighs b's own direct impact.
    const graph = addRegionalChannels(null, [
      { type: 'trade_route', from: 'a', to: 'b', status: 'confirmed', strength: 0.1, confidence: 1 },
      { type: 'trade_route', from: 'a', to: 'c', status: 'confirmed', strength: 1, confidence: 1 },
      { type: 'trade_route', from: 'c', to: 'b', status: 'confirmed', strength: 1, confidence: 1 },
    ]);
    const result = propagateRegionalEvent({
      graph,
      beforeSettlement: save('a', 'Aford'),
      afterSettlement: save('a', 'Aford'),
      event: { id: 'evt_wave_fold', type: 'CUT_TRADE_ROUTE', targetId: 'a' },
      maxDepth: 1,
      waveDecay: 1,
    });

    const toB = result.impacts.filter(i => i.targetSettlementId === 'b' && i.kind === 'route_disruption');
    const toC = result.impacts.find(i => i.targetSettlementId === 'c');
    expect(toB).toHaveLength(1);
    expect(toB[0].waveDepth).toBe(1); // the wave won
    expect(toB[0].severity).toBe(toC.severity); // full-strength, undecayed echo
    expect(toB[0].foldedChannels).toHaveLength(1);
    expect(toB[0].foldedChannels[0].severity).toBeLessThan(toB[0].severity);
    expect(result.graph.queuedImpacts.filter(i => i.targetSettlementId === 'b' && i.kind === 'route_disruption')).toHaveLength(1);
  });
});

describe('legacyRegionalConditionId export (R1 P1 follow-up)', () => {
  // Pre-R1 derivation, copied verbatim from the R1 legacy pin in
  // regionalEngine.test.js: readable archetype prefix + idPart truncated at
  // 80 chars, NO hash suffix.
  function legacyIdPart(value) {
    return String(value || 'unknown')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80) || 'unknown';
  }

  it('is exported and matches the pre-R1 truncated derivation for a known fixture', () => {
    const LONG_EVENT_ID = `evt_${'x'.repeat(90)}`;
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods: normalizeGoodsList(['Grain']), status: 'confirmed', strength: 1, confidence: 1 },
    ]);
    const [impactItem] = deriveRegionalImpacts({
      id: 'delta.supplier.long',
      sourceSettlementId: 'supplier',
      sourceSettlementName: 'Granary Ford',
      cause: { event: { id: LONG_EVENT_ID, type: 'TIER_CHANGE' } },
      changes: [{ kind: 'tier_demotion', magnitude: 0.8, source: 'settlement_tier' }],
    }, graph);

    expect(typeof legacyRegionalConditionId).toBe('function');
    expect(impactItem.id.length).toBeGreaterThan(80); // the truncation zone
    expect(legacyRegionalConditionId(impactItem)).toBe(
      `condition.regional_import_shortage.${legacyIdPart(impactItem.id)}`
    );
    // And it is NOT the hashed post-R1 id — the legacy derivation is frozen.
    expect(legacyRegionalConditionId(impactItem)).not.toBe(impactItem.conditionId);
  });
});
