/**
 * tests/store/campaignSlice.regional.test.js
 */

import { beforeEach, describe, expect, test } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { ensureRegionalGraph, normalizeGoodsList } from '../../src/domain/region/index.js';
import { findActiveCondition } from '../../src/domain/activeConditions.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  savedSettlements: [],
  settlement: null,
  activeSaveId: null,
  phase: 'draft',
  eventLog: [],
  locks: {},
  generatedAt: null,
  editedAt: null,
  canonizedAt: null,
  lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a) })));
}

function settlement(name) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    economicState: { primaryExports: [], primaryImports: [] },
    activeConditions: [],
  };
}

describe('campaignSlice regional impact lifecycle', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    localStorage.removeItem('dnd_settlement_saves');
  });

  test('applyQueuedRegionalImpact materializes a condition and marks the impact applied', () => {
    const store = makeStore();
    const impact = {
      id: 'regional_impact.test',
      kind: 'import_shortage',
      sourceSettlementId: 'supplier',
      targetSettlementId: 'buyer',
      channelId: 'channel.trade_dependency.supplier.buyer.grain',
      channelType: 'trade_dependency',
      goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      severity: 0.75,
      confidence: 0.9,
      status: 'queued',
      sourceChange: { kind: 'export_lost' },
      explanation: 'Granary Ford can no longer reliably supply grain.',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    store.setState(state => {
      state.savedSettlements = [{
        id: 'buyer',
        name: 'Millcross',
        tier: 'town',
        settlement: settlement('Millcross'),
        campaignState: { phase: 'canon', eventLog: [], systemState: null, locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1',
        name: 'Trade Belt',
        settlementIds: ['supplier', 'buyer'],
        regionalGraph: ensureRegionalGraph({
          nodes: [
            { id: 'supplier', name: 'Granary Ford' },
            { id: 'buyer', name: 'Millcross' },
          ],
          queuedImpacts: [impact],
        }),
      }];
    });

    const result = store.getState().applyQueuedRegionalImpact('camp-1', impact.id);
    const saved = store.getState().savedSettlements[0];
    const graphImpact = store.getState().campaigns[0].regionalGraph.queuedImpacts[0];

    expect(result.saveId).toBe('buyer');
    expect(saved.settlement.activeConditions[0].archetype).toBe('regional_import_shortage');
    expect(saved.campaignState.systemState).toBeTruthy();
    expect(graphImpact.status).toBe('applied');
    expect(store.getState().campaigns[0].wizardNews.entries.some(entry =>
      entry.kind === 'applied' && entry.impactIds.includes(impact.id)
    )).toBe(true);

    const resolved = store.getState().resolveRegionalImpact('camp-1', impact.id);
    const resolvedSave = store.getState().savedSettlements[0];
    const resolvedImpact = store.getState().campaigns[0].regionalGraph.queuedImpacts[0];

    expect(resolved.saveId).toBe('buyer');
    expect(findActiveCondition(resolvedSave.settlement, 'regional_import_shortage')).toBeNull();
    expect(resolvedImpact.status).toBe('resolved');
    expect(store.getState().campaigns[0].wizardNews.entries.some(entry =>
      entry.kind === 'resolved' && entry.impactIds.includes(impact.id)
    )).toBe(true);
  });

  test('applying an impact stamps the condition with the canonized world tick, not 0', () => {
    const store = makeStore();
    const impact = {
      id: 'regional_impact.tick7',
      kind: 'import_shortage',
      sourceSettlementId: 'supplier',
      targetSettlementId: 'buyer',
      channelId: 'channel.trade_dependency.supplier.buyer.grain',
      channelType: 'trade_dependency',
      goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      severity: 0.6,
      status: 'queued',
      sourceChange: { kind: 'export_lost' },
      explanation: 'Granary Ford can no longer reliably supply grain.',
    };

    store.setState(state => {
      state.savedSettlements = [{
        id: 'buyer',
        name: 'Millcross',
        tier: 'town',
        settlement: settlement('Millcross'),
        campaignState: { phase: 'canon', eventLog: [], systemState: null, locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1',
        name: 'Trade Belt',
        settlementIds: ['supplier', 'buyer'],
        worldState: { tick: 7, canonizedAt: '2026-06-01T00:00:00.000Z' },
        regionalGraph: ensureRegionalGraph({ queuedImpacts: [impact] }),
      }];
    });

    store.getState().applyQueuedRegionalImpact('camp-1', impact.id);
    const condition = store.getState().savedSettlements[0].settlement.activeConditions[0];
    expect(condition.triggeredAt.tick).toBe(7);
  });

  test('without a canonized world the feed clock stamps the condition', () => {
    const store = makeStore();
    const impact = {
      id: 'regional_impact.feedtick',
      kind: 'import_shortage',
      sourceSettlementId: 'supplier',
      targetSettlementId: 'buyer',
      channelId: 'channel.trade_dependency.supplier.buyer.grain',
      channelType: 'trade_dependency',
      goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      severity: 0.6,
      status: 'queued',
      sourceChange: { kind: 'export_lost' },
      explanation: 'Granary Ford can no longer reliably supply grain.',
    };

    store.setState(state => {
      state.savedSettlements = [{
        id: 'buyer',
        name: 'Millcross',
        tier: 'town',
        settlement: settlement('Millcross'),
        campaignState: { phase: 'canon', eventLog: [], systemState: null, locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1',
        name: 'Trade Belt',
        settlementIds: ['supplier', 'buyer'],
        wizardNews: { currentTick: 3, entries: [] },
        regionalGraph: ensureRegionalGraph({ queuedImpacts: [impact] }),
      }];
    });

    store.getState().applyQueuedRegionalImpact('camp-1', impact.id);
    const condition = store.getState().savedSettlements[0].settlement.activeConditions[0];
    expect(condition.triggeredAt.tick).toBe(3);
  });

  test('batch actions apply or ignore every queued regional impact', () => {
    const store = makeStore();
    const impacts = ['one', 'two'].map(id => ({
      id: `regional_impact.${id}`,
      kind: 'import_shortage',
      sourceSettlementId: 'supplier',
      targetSettlementId: 'buyer',
      channelId: `channel.trade_dependency.supplier.buyer.${id}`,
      channelType: 'trade_dependency',
      goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      severity: 0.6,
      status: 'queued',
      sourceChange: { kind: 'export_lost' },
      explanation: 'Granary Ford can no longer reliably supply grain.',
    }));

    store.setState(state => {
      state.savedSettlements = [{
        id: 'buyer',
        name: 'Millcross',
        tier: 'town',
        settlement: settlement('Millcross'),
        campaignState: { phase: 'canon', eventLog: [], systemState: null, locks: {} },
      }];
      state.campaigns = [{
        id: 'camp-1',
        name: 'Trade Belt',
        settlementIds: ['supplier', 'buyer'],
        regionalGraph: ensureRegionalGraph({ queuedImpacts: impacts }),
      }];
    });

    const results = store.getState().applyAllQueuedRegionalImpacts('camp-1');
    expect(results).toHaveLength(2);
    expect(store.getState().campaigns[0].regionalGraph.queuedImpacts.every(i => i.status === 'applied')).toBe(true);

    store.setState(state => {
      state.savedSettlements[0].settlement = settlement('Millcross');
      state.campaigns[0].regionalGraph = ensureRegionalGraph({ queuedImpacts: impacts });
    });

    const ignored = store.getState().ignoreAllQueuedRegionalImpacts('camp-1');
    expect(ignored).toBe(2);
    expect(store.getState().campaigns[0].regionalGraph.queuedImpacts.every(i => i.status === 'ignored')).toBe(true);
  });

  test('advanceCampaignRegionalImpacts matures delayed queued impacts', () => {
    const store = makeStore();
    store.setState(state => {
      state.campaigns = [{
        id: 'camp-1',
        name: 'Trade Belt',
        settlementIds: ['buyer'],
        regionalGraph: ensureRegionalGraph({
          queuedImpacts: [{
            id: 'regional_impact.delayed',
            kind: 'route_disruption',
            sourceSettlementId: 'supplier',
            targetSettlementId: 'buyer',
            severity: 0.4,
            status: 'queued',
            delayTicks: 1,
            ageTicks: 0,
            maxAgeTicks: 12,
          }],
        }),
      }];
    });

    const graph = store.getState().advanceCampaignRegionalImpacts('camp-1', 1);

    expect(graph.queuedImpacts[0].delayTicks).toBe(0);
    expect(graph.queuedImpacts[0].ageTicks).toBe(1);
    expect(store.getState().campaigns[0].wizardNews.currentTick).toBe(1);
    expect(store.getState().campaigns[0].wizardNews.entries.some(entry =>
      entry.kind === 'ready' && entry.impactIds.includes('regional_impact.delayed')
    )).toBe(true);
  });

  test('setCampaignRegionalGraph appends wizard news for newly propagated impacts', () => {
    const store = makeStore();
    const impact = {
      id: 'regional_impact.replaced',
      kind: 'import_shortage',
      sourceSettlementId: 'supplier',
      targetSettlementId: 'buyer',
      channelId: 'channel.trade_dependency.supplier.buyer.grain',
      channelType: 'trade_dependency',
      goods: normalizeGoodsList(['Bulk grain and foodstuffs']),
      severity: 0.82,
      status: 'queued',
      explanation: 'Granary Ford can no longer reliably supply grain.',
    };

    store.setState(state => {
      state.campaigns = [{
        id: 'camp-1',
        name: 'Trade Belt',
        settlementIds: ['supplier', 'buyer'],
        regionalGraph: ensureRegionalGraph({
          nodes: [
            { id: 'supplier', name: 'Granary Ford' },
            { id: 'buyer', name: 'Millcross' },
          ],
        }),
      }];
    });

    const before = store.getState().getCampaignRegionalGraph('camp-1');
    const after = ensureRegionalGraph({
      ...before,
      queuedImpacts: [impact],
      eventLog: [{
        id: 'regional_event.replaced',
        sourceSettlementId: 'supplier',
        sourceEvent: { id: 'evt_replaced', type: 'DEPLETE_RESOURCE' },
        impactIds: [impact.id],
      }],
    });

    store.getState().setCampaignRegionalGraph('camp-1', after);
    const feed = store.getState().getCampaignWizardNews('camp-1');

    expect(feed.entries).toHaveLength(1);
    expect(feed.entries[0].impactIds).toContain(impact.id);
    expect(feed.entries[0].sourceEventId).toBe('evt_replaced');
  });
});
