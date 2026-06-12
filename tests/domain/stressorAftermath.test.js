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
  withOrganicStressorResolution,
  recordGraduationsIntoHistory,
} from '../../src/domain/worldPulse/stressorAftermath.js';
import { advanceCampaignWorld, resolveStressorById } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';

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

// Wave 8 #4 — the resolution asymmetry, synced (owner decision 2026-06-11):
// an ORGANIC world-pulse resolution winds down the origin settlement's local
// crisis representations through the crisis lifecycle — the same settlement
// half RESOLVE_STRESSOR uses. The candidate vocabulary spans the twin's
// pulse type AND its generation aliases (a local 'under_siege' entry, a
// roaming 'siege' twin).
describe('withOrganicStressorResolution()', () => {
  const authored = () => mutateSettlement({
    settlement: {
      name: 'Ashford',
      config: {},
      institutions: [],
      npcs: [],
      activeConditions: [],
    },
    event: {
      id: 'ev-onset', type: 'APPLY_STRESSOR', targetId: 'under_siege',
      payload: { stressorType: 'under_siege', label: 'Under Siege', severity: 0.8 },
      cause: 'player_action',
    },
    now: NOW,
  });

  const resolvedTwin = (patch = {}) => ({
    id: 'world_stressor.siege.ashford',
    type: 'siege', // the PULSE vocabulary — the alias of the local under_siege
    label: 'Under Siege',
    status: 'resolved',
    severity: 0.05,
    originSettlementId: 'ashford',
    affectedSettlementIds: ['ashford'],
    ...patch,
  });

  test('the origin winds down: entry removed, condition eased with a world_pulse receipt, suppression recorded', () => {
    const next = withOrganicStressorResolution(authored(), [resolvedTwin()], 'ashford');
    expect((next.stress || []).some(st => st?.type === 'under_siege')).toBe(false);
    const cond = (next.activeConditions || []).find(c => c.archetype === 'war_pressure');
    expect(cond.status).toBe('easing');
    expect(cond.causes.at(-1)).toMatchObject({ source: 'world_pulse' });
    // The suppression spans BOTH vocabularies — the gen key the config-forced
    // re-roll would mint AND the pulse type the twin roamed under — so the
    // crisis stays resolved across regenerations even when the wind-down ran
    // entry-less (the regen suppression matches gen vocabulary only).
    expect(next.config.stressorEdits).toEqual({ added: [], resolved: ['under_siege', 'siege'] });
    // The eased event-promoted condition's record follows (the projection).
    expect(next.config.eventConditions.find(c => c.archetype === 'war_pressure').status).toBe('easing');
  });

  test('identity no-ops: a non-origin settlement and an unrelated type are untouched', () => {
    const s = authored();
    expect(withOrganicStressorResolution(s, [resolvedTwin()], 'briar')).toBe(s);
    expect(withOrganicStressorResolution(
      s,
      [resolvedTwin({ id: 'world_stressor.famine.ashford', type: 'famine', label: 'Famine' })],
      'ashford',
    )).toBe(s);
  });

  test('the ownership gate holds on the ORGANIC path: a campaign-owned condition is untouched while the entry still winds down', () => {
    // The same gate RESOLVE_STRESSOR is pinned on (eventConditions.test.js):
    // a condition whose ORIGIN cause is a regional channel belongs to the
    // campaign layer even when its archetype collides with the local crisis.
    // An organic wind-down stamping a world_pulse receipt onto it would
    // desync it from the layer that owns its resolution.
    const planted = {
      id: 'condition.war_pressure.chan99',
      archetype: 'war_pressure',
      severity: 0.5,
      status: 'worsening',
      triggeredAt: { tick: 4, sourceEventType: 'regional_wave', sourceEventTargetId: 'channel.x' },
      duration: { elapsedTicks: 0, expiresAtTicks: 8 },
      causes: [{ source: 'channel.x', detail: 'A neighbouring war is spilling over.' }],
    };
    const s = authored();
    const desynced = { ...s, activeConditions: [...s.activeConditions, planted] };
    const next = withOrganicStressorResolution(desynced, [resolvedTwin()], 'ashford');
    // The local entry still winds down…
    expect((next.stress || []).some(st => st?.type === 'under_siege')).toBe(false);
    // …and the EVENT-born condition eases…
    const eventBorn = next.activeConditions.find(c => c.archetype === 'war_pressure' && c.id !== planted.id);
    expect(eventBorn.status).toBe('easing');
    // …but the campaign-owned twin keeps its reference: no easing, no
    // world_pulse receipt, no recruitment into the eventConditions record.
    expect(next.activeConditions.find(c => c.id === planted.id)).toBe(planted);
    expect((next.config.eventConditions || []).some(c => c.id === planted.id)).toBe(false);
  });
});

// Triage pin (T3 deferred): residuals scale per target through
// effectiveStressorSeverity — a spread target's residual scar matches the
// attenuated severity it actually experienced, not the record's origin
// severity. Settlements the crisis never reached get no residual at all.
describe('truthful aftermath: per-target residual severity', () => {
  test('origin residual > spread-target residual for an attenuated spread; unaffected settlements get nothing', () => {
    const { residualOutcomes, resolved } = resolveStressorById([{
      id: 'world_stressor.famine.origin',
      type: 'famine',
      severity: 0.8,
      age: 3,
      status: 'active',
      originSettlementId: 'origin',
      affectedSettlementIds: ['origin', 'spread'],
      // The R3 spread stamp: 'spread' experienced the famine attenuated.
      severityBySettlement: { spread: 0.4 },
    }], 'world_stressor.famine.origin', { tick: 9, now: NOW });

    expect(resolved).toHaveLength(1);
    // Exactly the affected settlements — nobody else scars.
    expect(residualOutcomes.map(o => o.targetSaveId).sort()).toEqual(['origin', 'spread']);

    const origin = residualOutcomes.find(o => o.targetSaveId === 'origin');
    const spread = residualOutcomes.find(o => o.targetSaveId === 'spread');
    expect(origin.severity).toBeCloseTo(0.8 * 0.45, 5);
    expect(spread.severity).toBeCloseTo(0.4 * 0.45, 5);
    expect(origin.severity).toBeGreaterThan(spread.severity);
    // The emitted condition carries the same per-target severity.
    expect(origin.condition.severity).toBeCloseTo(0.8 * 0.45, 5);
    expect(spread.condition.severity).toBeCloseTo(0.4 * 0.45, 5);
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
