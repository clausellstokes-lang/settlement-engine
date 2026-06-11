/**
 * tests/domain/worldPulseTickClock.test.js — Regional wave R1 pins (C3 + H9).
 *
 * Pins:
 *   • C3 — a pulse SYNCS wizardNews.currentTick to worldState.tick (it does
 *     not blindly +1), so a manual impact-advance press can never permanently
 *     skew which tick pulse entries group and ground under.
 *   • C3 — chronicle grounding defaults its window to the latest tick that
 *     HAS entries, not the (possibly skewed-ahead) feed clock.
 *   • H9 — the pulse ages the PREVIOUS tick's regional queue before queueing
 *     this tick's propagation: a pulse-created delayTicks:1 impact stays
 *     delayed through its creating pulse and matures on the NEXT pulse, with
 *     no contradictory queued+ready pair for one impact in one tick.
 */

import { describe, expect, test } from 'vitest';

import {
  advanceCampaignWorld,
  applyWorldPulseOutcomes,
  buildChronicleGrounding,
} from '../../src/domain/worldPulse/index.js';
import { addRegionalChannels, ensureRegionalGraph, normalizeGoodsList } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';

function bareWorldState() {
  return { stressors: [], npcStates: {}, proposals: [] };
}

describe('C3 — one authoritative tick clock', () => {
  test('a pulse syncs wizardNews.currentTick to the world tick, healing manual skew', () => {
    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: ensureRegionalGraph(), settlements: [], campaign: {} },
      worldState: bareWorldState(),
      regionalGraph: ensureRegionalGraph(),
      // Manual +1/+3 presses ran the feed clock ahead of the world.
      wizardNews: { currentTick: 7, entries: [] },
      settlementMap: new Map(),
      outcomes: [],
      tick: 3,
      now: NOW,
    });
    expect(result.wizardNews.currentTick).toBe(3);
  });

  test('advanceNewsTick:false leaves the feed clock untouched (party/proposal injections)', () => {
    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: ensureRegionalGraph(), settlements: [], campaign: {} },
      worldState: bareWorldState(),
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 7, entries: [] },
      settlementMap: new Map(),
      outcomes: [],
      tick: 3,
      now: NOW,
      advanceNewsTick: false,
      advanceRegionalImpacts: false,
    });
    expect(result.wizardNews.currentTick).toBe(7);
  });

  test('manual skew then full pulse: clocks agree and the pulse entries group under the pulse tick', () => {
    const ids = ['a', 'b', 'c'];
    const saves = ids.map((id, i) => ({
      id,
      name: `Town-${id.toUpperCase()}`,
      phase: 'canon',
      settlement: {
        name: `Town-${id.toUpperCase()}`,
        tier: 'town',
        population: 1400 + i * 300,
        config: { tradeRouteAccess: 'road' },
        institutions: [],
        economicState: { primaryExports: [], primaryImports: [] },
        powerStructure: { factions: [], conflicts: [] },
        npcs: [],
        activeConditions: [],
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    const campaign = {
      id: 'camp-clock',
      name: 'Clock Realm',
      settlementIds: ids,
      regionalGraph: ensureRegionalGraph(),
      // Four manual presses while the world never pulsed.
      wizardNews: { currentTick: 4, entries: [] },
      worldState: {
        rngSeed: 'clock-seed',
        tick: 0,
        canonizedAt: NOW,
        // A realm-wide stressor guarantees the pulse emits news entries.
        stressors: [{ id: 'world_stressor.famine.realm', type: 'famine', severity: 0.7, affectedSettlementIds: ids }],
      },
    };

    const result = advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: NOW });

    expect(result.worldState.tick).toBe(1);
    expect(result.wizardNews.currentTick).toBe(1);
    expect(result.wizardNews.entries.length).toBeGreaterThan(0);
    // The feed started empty, so every entry came from this pulse — all of
    // them must group under the live tick, not a stale or skewed one.
    expect(result.wizardNews.entries.every(entry => entry.tick === 1)).toBe(true);
  });
});

describe('C3 — chronicle grounding window', () => {
  test('defaults to the latest entry tick over a mixed manual+pulse feed (latest pulse headline included)', () => {
    const wizardNews = {
      currentTick: 9, // manual presses ran ahead of the last pulse
      entries: [
        { id: 'n1', tick: 4, headline: 'The Great Hunger grips the realm', significance: 'major', scope: 'realm', settlementIds: ['a', 'b', 'c'] },
        { id: 'n2', tick: 4, headline: 'Trade slows in Millcross', significance: 'notable', scope: 'regional', settlementIds: ['a'] },
        { id: 'n3', tick: 2, headline: 'Old news', significance: 'notable', scope: 'settlement', settlementIds: ['b'] },
      ],
    };
    const g = buildChronicleGrounding({ wizardNews, worldState: { tick: 9 } });
    expect(g.tick).toBe(4);
    expect(g.headlines).toHaveLength(2);
    expect(g.majorHeadlines).toContain('The Great Hunger grips the realm');
  });

  test('an empty feed falls back to the world tick with zero headlines', () => {
    const g = buildChronicleGrounding({ wizardNews: { currentTick: 5, entries: [] }, worldState: { tick: 5 } });
    expect(g.tick).toBe(5);
    expect(g.headlines).toEqual([]);
  });
});

describe('H9 — pulses age the queue before queueing newborns', () => {
  function fixture() {
    const supplier = {
      name: 'Granary Ford',
      tier: 'town',
      population: 2000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { primaryExports: ['Bulk grain and foodstuffs'], primaryImports: [] },
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
      activeConditions: [],
    };
    const buyer = { ...supplier, name: 'Millcross', economicState: { primaryExports: [], primaryImports: ['Grain and malt'] } };
    const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 0.6, confidence: 0.8 },
    ]);
    const settlements = [
      { id: 'supplier', name: supplier.name, settlement: supplier },
      { id: 'buyer', name: buyer.name, settlement: buyer },
    ];
    const settlementMap = new Map(settlements.map(item => [item.id, { saveId: item.id, save: { name: item.name }, settlement: item.settlement }]));
    return { graph, settlements, settlementMap };
  }

  test('a pulse-queued delayed impact survives its creating pulse and matures on the NEXT pulse', () => {
    const { graph, settlements, settlementMap } = fixture();
    const outcome = {
      id: 'o_pop_loss',
      type: 'population',
      candidateType: 'population_decline',
      applyMode: 'auto',
      targetSaveId: 'supplier',
      severity: 0.4,
      headline: 'A hard season empties Granary Ford',
      populationDeltas: [{ saveId: 'supplier', delta: -120 }],
    };

    const first = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: graph, settlements, campaign: {} },
      worldState: bareWorldState(),
      regionalGraph: graph,
      wizardNews: { currentTick: 4, entries: [] },
      settlementMap,
      outcomes: [outcome],
      tick: 5,
      now: NOW,
    });

    const newborn = first.regionalGraph.queuedImpacts.find(impact =>
      impact.kind === 'import_shortage' && impact.targetSettlementId === 'buyer');
    expect(newborn).toBeTruthy();
    // delayTicks:1 means "next tick": this pulse must not age its own newborn.
    expect(newborn.status).toBe('queued');
    expect(newborn.delayTicks).toBeGreaterThan(0);
    // No contradictory queued+ready pair for one impact in one tick's feed.
    const kinds = first.newsEntries.filter(e => e.impactIds.includes(newborn.id)).map(e => e.kind);
    expect(kinds).toContain('queued');
    expect(kinds).not.toContain('ready');

    const updatedMap = new Map(first.settlementUpdates.map(item => [item.saveId, item]));
    const second = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: first.regionalGraph, settlements, campaign: {} },
      worldState: first.worldState,
      regionalGraph: first.regionalGraph,
      wizardNews: first.wizardNews,
      settlementMap: updatedMap,
      outcomes: [],
      tick: 6,
      now: NOW,
    });

    const matured = second.regionalGraph.queuedImpacts.find(impact => impact.id === newborn.id);
    expect(matured.status).toBe('queued');
    expect(matured.delayTicks).toBe(0);
    expect(second.newsEntries.some(e => e.kind === 'ready' && e.impactIds.includes(newborn.id))).toBe(true);
  });
});
