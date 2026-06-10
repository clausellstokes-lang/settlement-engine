/**
 * tests/domain/stressorAftermath.test.js — aftermath is recorded, twice.
 *
 * Pins:
 *   • Resolution emits a chronicle entry ("X has passed"); graduation emits
 *     "X passes into history".
 *   • A graduated echo appends a campaign-era event to
 *     settlement.history.historicalEvents (campaignEra: true, severity word
 *     from peak, type mapped into the generators' vocabulary), idempotently,
 *     capped, and WITHOUT touching generation-era history.
 *   • Both flow end-to-end through advanceCampaignWorld.
 */

import { describe, expect, test } from 'vitest';
import {
  aftermathNewsEntries,
  graduationNewsEntries,
  withCampaignHistoryEvent,
  recordGraduationsIntoHistory,
} from '../../src/domain/worldPulse/stressorAftermath.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

function echo(patch = {}) {
  return {
    id: 'world_stressor.famine.a',
    type: 'famine',
    label: 'Famine pressure',
    status: 'residual',
    lifecycleStage: 'residual',
    severity: 0.1,
    peakSeverity: 0.7,
    memoryStrength: 0.3,
    age: 6,
    affectedSettlementIds: ['a'],
    residualEffects: ['food_debt', 'hoarding_grievance'],
    ...patch,
  };
}

describe('withCampaignHistoryEvent()', () => {
  const settlement = {
    name: 'Ashford',
    history: {
      historicalEvents: [
        { name: 'The Iron Dispute', type: 'disputed_land', severity: 'major', yearsAgo: 40 },
      ],
    },
  };

  test('appends a campaign-era event mapped into the generator vocabulary', () => {
    const next = withCampaignHistoryEvent(settlement, echo(), 18);
    const events = next.history.historicalEvents;
    expect(events).toHaveLength(2);
    const added = events.find(e => e.campaignEra);
    expect(added.name).toBe('Famine pressure');
    expect(added.type).toBe('resource_scarcity');
    expect(added.severity).toBe('major'); // peak 0.7
    expect(added.yearsAgo).toBe(0);
    expect(added.tick).toBe(18);
    // ARRAY shape — HistoryTab/.join and the PDF HistoryFounding/.map both
    // crash on a bare string here.
    expect(Array.isArray(added.lastingEffects)).toBe(true);
    expect(added.lastingEffects).toContain('food debt');
    // Generation history untouched.
    expect(events[0].name).toBe('The Iron Dispute');
  });

  test('idempotent per echo', () => {
    const once = withCampaignHistoryEvent(settlement, echo(), 18);
    const twice = withCampaignHistoryEvent(once, echo(), 18);
    expect(twice).toBe(once);
  });

  test('caps campaign-era events without pruning generation history', () => {
    let s = settlement;
    for (let i = 0; i < 25; i++) {
      s = withCampaignHistoryEvent(s, echo({ id: `world_stressor.famine.a${i}`, resolvedAt: `t${i}` }), i);
    }
    const events = s.history.historicalEvents;
    expect(events.filter(e => e.campaignEra)).toHaveLength(20);
    expect(events.filter(e => !e.campaignEra)).toHaveLength(1);
  });

  test('a settlement without a history object still gains one', () => {
    const bare = { name: 'Bare' };
    const next = withCampaignHistoryEvent(bare, echo(), 3);
    expect(next.history.historicalEvents).toHaveLength(1);
  });
});

describe('news entries', () => {
  test('resolution news names the residuals and the echo', () => {
    const [entry] = aftermathNewsEntries([echo({ status: 'resolved' })], 9, NOW);
    expect(entry.headline).toBe('Famine pressure has passed');
    expect(entry.impactKind).toBe('stressor_aftermath');
    expect(entry.summary).toMatch(/food debt/);
    expect(entry.significance).toBe('major'); // peak 0.7
  });

  test('graduation news marks the passage into history', () => {
    const [entry] = graduationNewsEntries([echo({ status: 'dormant' })], 21, NOW);
    expect(entry.headline).toBe('Famine pressure passes into history');
    expect(entry.impactKind).toBe('stressor_graduated');
  });

  test('recordGraduationsIntoHistory writes every affected local settlement', () => {
    const local = new Map([['a', { name: 'Ashford' }], ['b', { name: 'Briar' }]]);
    const written = recordGraduationsIntoHistory(local, [echo({ affectedSettlementIds: ['a', 'b'] })], 5);
    expect(written).toBe(2);
    expect(local.get('a').history.historicalEvents[0].campaignEra).toBe(true);
    expect(local.get('b').history.historicalEvents[0].campaignEra).toBe(true);
  });
});

describe('end-to-end through advanceCampaignWorld', () => {
  function campaignWith(stressors) {
    return {
      id: 'aftermath-e2e',
      name: 'Aftermath',
      settlementIds: ['a'],
      worldState: { rngSeed: 'aftermath-seed', tick: 0, stressors },
      regionalGraph: ensureRegionalGraph({}),
      wizardNews: { currentTick: 0, entries: [] },
    };
  }

  const saves = [{
    id: 'a',
    name: 'Ashford',
    phase: 'canon',
    settlement: {
      name: 'Ashford', tier: 'town', population: 1500,
      config: {}, institutions: [], npcs: [], activeConditions: [],
      powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' }, factions: [] },
      economicState: {},
      history: { historicalEvents: [] },
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }];

  test('a resolving stressor lands an aftermath entry in the chronicle feed', () => {
    // market_shock at severity 0.2, age 5: decay drops it under the 0.08
    // auto-resolve floor this tick — resolution is roll-independent.
    const result = advanceCampaignWorld({
      campaign: campaignWith([{
        id: 'world_stressor.market_shock.a', type: 'market_shock',
        severity: 0.2, age: 5, affectedSettlementIds: ['a'], originSettlementId: 'a',
      }]),
      saves,
      interval: 'one_month',
      now: NOW,
    });
    expect(result.resolvedStressors).toHaveLength(1);
    const entries = result.wizardNews.entries || [];
    expect(entries.some(e => e.impactKind === 'stressor_aftermath')).toBe(true);
    // The echo persists in world state.
    expect(result.worldState.stressors.some(s => s.status === 'residual')).toBe(true);
  });

  test('a fading echo graduates into settlement history and the chronicle', () => {
    const result = advanceCampaignWorld({
      campaign: campaignWith([echo({ memoryStrength: 0.105 })]),
      saves,
      interval: 'one_month',
      now: NOW,
    });
    expect(result.pulseRecord.graduatedStressors).toHaveLength(1);
    const entries = result.wizardNews.entries || [];
    expect(entries.some(e => e.impactKind === 'stressor_graduated')).toBe(true);
    const settlement = result.settlementUpdates.find(u => String(u.saveId) === 'a').settlement;
    const campaignEvents = (settlement.history?.historicalEvents || []).filter(e => e.campaignEra);
    expect(campaignEvents).toHaveLength(1);
    expect(campaignEvents[0].name).toBe('Famine pressure');
  });
});
