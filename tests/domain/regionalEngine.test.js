/**
 * tests/domain/regionalEngine.test.js
 */

import { describe, expect, it } from 'vitest';
import {
  addRegionalChannels,
  advanceRegionalImpacts,
  appendWizardNewsEntries,
  applyRegionalImpact,
  deriveGraphWithDiscoveredCandidates,
  deriveLocalDelta,
  deriveRegionalImpacts,
  deriveRegionalState,
  deriveWizardNewsEntriesFromGraphChange,
  discoverDependencyCandidates,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  goodsIntersect,
  isRegionalImpactAvailable,
  normalizeGood,
  normalizeGoodsList,
  propagateRegionalEvent,
  queueRegionalImpacts,
  REGIONAL_GRAPH_SCHEMA_VERSION,
  setRegionalChannelStatus,
  setRegionalChannelVisibility,
  setRegionalImpactStatus,
  summarizeWizardNews,
  WIZARD_NEWS_SIGNIFICANCE,
} from '../../src/domain/region/index.js';
import { findActiveCondition } from '../../src/domain/activeConditions.js';

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

describe('regional goods catalog', () => {
  it('normalizes common economic labels to stable ids', () => {
    expect(normalizeGood('Bulk grain and foodstuffs').id).toBe('grain');
    expect(normalizeGood('Milled flour (transit)').id).toBe('flour');
    expect(normalizeGood('Financial services (letters of credit)').id).toBe('financial_services');
  });

  it('preserves unknown user goods as custom ids', () => {
    const good = normalizeGood('Dragonbone ingots');
    expect(good.id).toBe('custom.dragonbone_ingots');
    expect(good.custom).toBe(true);
  });

  it('finds intersections after normalization', () => {
    const matches = goodsIntersect(['Bulk grain and foodstuffs'], ['Grain and malt']);
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe('grain');
  });
});

describe('deriveRegionalState()', () => {
  it('projects exports, imports, route state, and depleted goods', () => {
    const s = save('a', 'Aford', {
      config: {
        tradeRouteAccess: 'road',
        nearbyResourcesState: { grain_fields: 'depleted' },
      },
      economicState: {
        primaryExports: ['Milled flour'],
        primaryImports: ['Iron ore'],
      },
    });
    const state = deriveRegionalState(s);
    expect(state.id).toBe('a');
    expect(state.exports.map(g => g.id)).toContain('flour');
    expect(state.imports.map(g => g.id)).toContain('iron');
    expect(state.route.open).toBe(true);
    expect(state.depletedGoods.map(g => g.id)).toContain('grain');
  });
});

describe('dependency discovery', () => {
  it('discovers trade dependency and export-market channels from matching flows', () => {
    const supplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
      neighbourNetwork: [{ id: 'buyer', neighbourName: 'Millcross', relationshipType: 'trade_partner' }],
    });
    const buyer = save('buyer', 'Millcross', {
      economicState: { primaryImports: ['Grain and malt'] },
      neighbourNetwork: [{ id: 'supplier', neighbourName: 'Granary Ford', relationshipType: 'trade_partner' }],
    });

    const channels = discoverDependencyCandidates(supplier, buyer);
    expect(channels.some(c => c.type === 'trade_dependency' && c.from === 'supplier' && c.to === 'buyer')).toBe(true);
    expect(channels.some(c => c.type === 'export_market' && c.from === 'buyer' && c.to === 'supplier')).toBe(true);
    expect(channels.some(c => c.type === 'trade_route')).toBe(true);
  });

  it('adds suggested candidates to a campaign graph without confirming them', () => {
    const supplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
    });
    const buyer = save('buyer', 'Millcross', {
      economicState: { primaryImports: ['Grain and malt'] },
    });
    const graph = deriveGraphWithDiscoveredCandidates([supplier, buyer]);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.channels.some(c => c.status === 'suggested')).toBe(true);
  });

  it('discovers relationship-based authority channels as suggestions', () => {
    const client = save('client', 'Millcross', {
      neighbourNetwork: [{ id: 'capital', neighbourName: 'Stone Crown', relationshipType: 'patron' }],
    });
    const capital = save('capital', 'Stone Crown');
    const channels = discoverDependencyCandidates(client, capital);

    expect(channels.some(c =>
      c.type === 'political_authority'
      && c.from === 'capital'
      && c.to === 'client'
      && c.status === 'suggested'
    )).toBe(true);
  });
});

describe('regional propagation', () => {
  it('turns a supplier export loss into an import-shortage impact', () => {
    const beforeSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
    });
    const afterSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: [] },
    });
    const buyer = save('buyer', 'Millcross', {
      economicState: { primaryImports: ['Grain and malt'] },
    });

    let graph = deriveGraphWithDiscoveredCandidates([beforeSupplier, buyer]);
    const channel = graph.channels.find(c => c.type === 'trade_dependency');
    graph = setRegionalChannelStatus(graph, channel.id, 'confirmed');

    const localDelta = deriveLocalDelta(beforeSupplier, afterSupplier, {
      event: { id: 'evt_1', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
    });
    const impacts = deriveRegionalImpacts(localDelta, graph);
    expect(impacts).toHaveLength(1);
    expect(impacts[0].kind).toBe('import_shortage');
    expect(impacts[0].targetSettlementId).toBe('buyer');
  });

  it('can materialize an impact as an active condition on the target', () => {
    const settlement = save('buyer', 'Millcross').settlement;
    const impact = {
      id: 'regional_impact.test',
      kind: 'import_shortage',
      sourceSettlementId: 'supplier',
      targetSettlementId: 'buyer',
      channelId: 'channel.trade_dependency.supplier.buyer.grain',
      goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      severity: 0.7,
      explanation: 'Granary Ford can no longer supply grain.',
      sourceChange: { kind: 'export_lost' },
    };
    const next = applyRegionalImpact(settlement, impact);
    expect(findActiveCondition(next, 'regional_import_shortage')).toBeTruthy();
  });

  it('returns an updated graph and queued impacts for a propagated local event', () => {
    const beforeSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
    });
    const afterSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: [] },
    });
    const buyer = save('buyer', 'Millcross', {
      economicState: { primaryImports: ['Grain and malt'] },
    });
    let graph = deriveGraphWithDiscoveredCandidates([beforeSupplier, buyer]);
    for (const channel of graph.channels) {
      graph = setRegionalChannelStatus(graph, channel.id, 'confirmed');
    }

    const result = propagateRegionalEvent({
      graph,
      beforeSettlement: beforeSupplier,
      afterSettlement: afterSupplier,
      event: { id: 'evt_1', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
      visibleSettlementIds: ['buyer'],
    });

    expect(result.impacts.length).toBeGreaterThan(0);
    expect(result.graph.queuedImpacts.length).toBeGreaterThan(0);
    expect(result.focusDecisions.some(d => d.focus === 'partial')).toBe(true);
  });

  it('can transition queued impact status without losing the impact payload', () => {
    const beforeSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
    });
    const afterSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: [] },
    });
    const buyer = save('buyer', 'Millcross', {
      economicState: { primaryImports: ['Grain and malt'] },
    });
    let graph = deriveGraphWithDiscoveredCandidates([beforeSupplier, buyer]);
    for (const channel of graph.channels) {
      graph = setRegionalChannelStatus(graph, channel.id, 'confirmed');
    }

    const result = propagateRegionalEvent({
      graph,
      beforeSettlement: beforeSupplier,
      afterSettlement: afterSupplier,
      event: { id: 'evt_status', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
    });
    const [impact] = result.graph.queuedImpacts;
    const ignored = setRegionalImpactStatus(result.graph, impact.id, 'ignored');
    const rediscovered = queueRegionalImpacts(ignored, [{ ...impact, status: 'queued', severity: 0.1 }]);

    expect(ignored.queuedImpacts[0].id).toBe(impact.id);
    expect(ignored.queuedImpacts[0].status).toBe('ignored');
    expect(ignored.queuedImpacts[0].goods).toEqual(impact.goods);
    expect(rediscovered.queuedImpacts[0].status).toBe('ignored');
  });

  it('turns a patron authority shock into regional authority instability', () => {
    const client = save('client', 'Millcross', {
      neighbourNetwork: [{ id: 'capital', neighbourName: 'Stone Crown', relationshipType: 'patron' }],
    });
    const capitalBefore = save('capital', 'Stone Crown');
    const capitalAfter = save('capital', 'Stone Crown');
    let graph = deriveGraphWithDiscoveredCandidates([client, capitalBefore]);
    const channel = graph.channels.find(c => c.type === 'political_authority' && c.from === 'capital');
    graph = setRegionalChannelStatus(graph, channel.id, 'confirmed');

    const localDelta = deriveLocalDelta(capitalBefore, capitalAfter, {
      event: { id: 'evt_authority', type: 'KILL_LEADER', targetId: 'queen', payload: { severity: 0.85 } },
    });
    const impacts = deriveRegionalImpacts(localDelta, graph);

    expect(localDelta.changes.some(c => c.kind === 'authority_shock')).toBe(true);
    expect(impacts.some(i => i.kind === 'authority_instability' && i.targetSettlementId === 'client')).toBe(true);

    const next = applyRegionalImpact(client.settlement, impacts.find(i => i.kind === 'authority_instability'));
    expect(findActiveCondition(next, 'regional_authority_instability')).toBeTruthy();
  });

  it('propagates bounded multi-hop waves with severity decay', () => {
    const beforeSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
    });
    const afterSupplier = save('supplier', 'Granary Ford', {
      economicState: { primaryExports: [] },
    });
    const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 1, confidence: 1 },
      { type: 'trade_route', from: 'buyer', to: 'market', goods, status: 'confirmed', strength: 0.8, confidence: 1 },
    ]);
    const localDelta = deriveLocalDelta(beforeSupplier, afterSupplier, {
      event: { id: 'evt_wave', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
    });

    const impacts = deriveRegionalImpacts(localDelta, graph, { maxDepth: 1, waveDecay: 0.5 });
    const direct = impacts.find(i => i.targetSettlementId === 'buyer');
    const wave = impacts.find(i => i.targetSettlementId === 'market');

    expect(direct?.kind).toBe('import_shortage');
    expect(wave?.kind).toBe('route_disruption');
    expect(wave.waveDepth).toBe(1);
    expect(wave.severity).toBeLessThan(direct.severity);
  });
});

describe('graph channel merge', () => {
  it('preserves confirmed channels when suggested rediscovery repeats', () => {
    const raw = {
      type: 'trade_dependency',
      from: 'a',
      to: 'b',
      goods: normalizeGoodsList(['Grain']),
      status: 'confirmed',
    };
    let graph = addRegionalChannels(null, [raw]);
    const confirmed = graph.channels[0];
    graph = addRegionalChannels(graph, [{ ...raw, status: 'suggested', strength: 0.1 }]);
    expect(graph.channels[0].id).toBe(confirmed.id);
    expect(graph.channels[0].status).toBe('confirmed');
  });

  it('migrates regional graphs to schema v2 with channel visibility defaults', () => {
    const graph = ensureRegionalGraph({
      schemaVersion: 1,
      channels: [
        { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'criminal_corridor', from: 'b', to: 'c', status: 'confirmed' },
      ],
    });

    expect(graph.schemaVersion).toBe(REGIONAL_GRAPH_SCHEMA_VERSION);
    expect(graph.channels.find(c => c.type === 'trade_dependency').visibility).toBe('public');
    expect(graph.channels.find(c => c.type === 'criminal_corridor').visibility).toBe('gm');

    const hidden = setRegionalChannelVisibility(graph, graph.channels[0].id, 'hidden');
    expect(hidden.channels[0].visibility).toBe('hidden');
  });

  it('advances delayed queued impacts and expires stale impacts', () => {
    const graph = ensureRegionalGraph({
      queuedImpacts: [{
        id: 'regional_impact.delay',
        kind: 'route_disruption',
        sourceSettlementId: 'a',
        targetSettlementId: 'b',
        severity: 0.4,
        status: 'queued',
        delayTicks: 2,
        ageTicks: 0,
        maxAgeTicks: 3,
      }],
    });

    expect(isRegionalImpactAvailable(graph.queuedImpacts[0])).toBe(false);
    const matured = advanceRegionalImpacts(graph, 2);
    expect(matured.queuedImpacts[0].delayTicks).toBe(0);
    expect(isRegionalImpactAvailable(matured.queuedImpacts[0])).toBe(true);

    const expired = advanceRegionalImpacts(matured, 1);
    expect(expired.queuedImpacts[0].status).toBe('expired');
  });
});

describe('wizard news feed', () => {
  it('classifies severe multi-settlement changes as major and routine changes as notables', () => {
    const graph = ensureRegionalGraph({
      nodes: [
        { id: 'supplier', name: 'Granary Ford' },
        { id: 'buyer', name: 'Millcross' },
        { id: 'market', name: 'Far Market' },
      ],
      channels: [{
        id: 'channel.trade_dependency.supplier.buyer.grain',
        type: 'trade_dependency',
        from: 'supplier',
        to: 'buyer',
        status: 'confirmed',
        goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      }],
      queuedImpacts: [{
        id: 'regional_impact.major',
        kind: 'import_shortage',
        sourceSettlementId: 'supplier',
        targetSettlementId: 'buyer',
        channelId: 'channel.trade_dependency.supplier.buyer.grain',
        channelType: 'trade_dependency',
        goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
        severity: 0.8,
        status: 'queued',
        pathSettlementIds: ['supplier', 'market', 'buyer'],
        explanation: 'Granary Ford can no longer supply grain.',
      }, {
        id: 'regional_impact.notable',
        kind: 'information_shock',
        sourceSettlementId: 'supplier',
        targetSettlementId: 'buyer',
        channelId: 'channel.information_flow.supplier.buyer',
        channelType: 'information_flow',
        severity: 0.2,
        status: 'queued',
        explanation: 'Rumors reach the market.',
      }],
      eventLog: [{
        id: 'regional_event.major',
        sourceSettlementId: 'supplier',
        sourceEvent: { id: 'evt_grain', type: 'DEPLETE_RESOURCE' },
        impactIds: ['regional_impact.major'],
      }],
    });

    const entries = deriveWizardNewsEntriesFromGraphChange(null, graph, { tick: 3 });
    const major = entries.find(entry => entry.impactIds.includes('regional_impact.major'));
    const notable = entries.find(entry => entry.impactIds.includes('regional_impact.notable'));

    expect(major.significance).toBe(WIZARD_NEWS_SIGNIFICANCE.MAJOR);
    expect(major.reasons).toContain('high severity');
    expect(major.sourceEventId).toBe('evt_grain');
    expect(notable.significance).toBe(WIZARD_NEWS_SIGNIFICANCE.NOTABLE);
  });

  it('records a ready update when delayed regional impacts mature', () => {
    const before = ensureRegionalGraph({
      queuedImpacts: [{
        id: 'regional_impact.delayed_news',
        kind: 'route_disruption',
        sourceSettlementId: 'supplier',
        targetSettlementId: 'buyer',
        channelType: 'trade_route',
        severity: 0.45,
        status: 'queued',
        delayTicks: 1,
        ageTicks: 0,
      }],
    });
    const after = advanceRegionalImpacts(before, 1);
    const entries = deriveWizardNewsEntriesFromGraphChange(before, after, { tick: 4 });

    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('ready');
    expect(entries[0].headline).toMatch(/Route disruption/);
    expect(entries[0].tick).toBe(4);
  });

  it('dedupes deterministic entries while preserving major/notable summaries', () => {
    const graph = ensureRegionalGraph({
      queuedImpacts: [{
        id: 'regional_impact.one',
        kind: 'import_shortage',
        sourceSettlementId: 'supplier',
        targetSettlementId: 'buyer',
        channelType: 'trade_dependency',
        goods: normalizeGoodsList(['Grain']),
        severity: 0.7,
        status: 'queued',
      }],
    });
    const [entry] = deriveWizardNewsEntriesFromGraphChange(null, graph, { tick: 2 });
    const feed = appendWizardNewsEntries(ensureWizardNewsFeed(), [entry, entry]);
    const summary = summarizeWizardNews(feed);

    expect(feed.entries).toHaveLength(1);
    expect(summary.major.length + summary.notables.length).toBe(1);
    expect(summary.byTick[0].tick).toBe(2);
  });
});
