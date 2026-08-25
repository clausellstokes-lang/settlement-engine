/**
 * tests/domain/worldPulseChronicleCuration.test.js — Cohesion Wave 7 pins
 * (the paid chronicle grounds on a CURATED feed; the ledger stays complete).
 *
 * Integration over real pulses (advanceCampaignWorld):
 *   • The population_growth metronome stops flooding the feed: across the
 *     first cooldown window a quiet settlement emits ONE applied
 *     population_growth entry, not one per tick — and at least one
 *     auto-applied outcome in the run has no feed entry at all (the
 *     suppression actually fired; anti-vacuity).
 *   • pulseHistory stays the honest ledger: EVERY auto-applied outcome of
 *     every tick lands in that tick's pulseRecord.selectedOutcomes, feed
 *     entry or not.
 *   • Major arc entries survive curation: a realm-wide famine arc ("The
 *     Great Hunger grips the realm") is still in the feed after the run and
 *     buildChronicleGrounding lists it among majorHeadlines — the chronicle
 *     reads the story, not the metronome.
 */

import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld, buildChronicleGrounding } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function save(id, i) {
  const name = `Town-${id.toUpperCase()}`;
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1200 + i * 300,
      config: { tradeRouteAccess: 'road', priorityEconomy: 20, priorityMilitary: 30 },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 70, label: 'Approved' },
        factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
        conflicts: [],
      },
      npcs: [{ id: `reeve_${id}`, name: `Reeve ${id}`, importance: 'key', faction: 'Merchant League' }],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function runTicks({ campaign, saves, ticks }) {
  const perTick = [];
  for (let i = 0; i < ticks; i++) {
    const result = advanceCampaignWorld({
      campaign, saves, interval: 'one_month',
      now: `2026-03-01T00:00:${String(i).padStart(2, '0')}.000Z`,
    });
    perTick.push(result);
    campaign = {
      ...campaign,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      wizardNews: result.wizardNews,
    };
    saves = saves.map(s => {
      const update = result.settlementUpdates.find(u => String(u.saveId) === String(s.id));
      return update ? { ...s, settlement: update.settlement } : s;
    });
  }
  return { perTick, campaign, saves };
}

describe('curated feed vs complete ledger (quiet region, 10 ticks)', () => {
  const ids = ['a', 'b', 'c'];
  const baseCampaign = (stressors = []) => ({
    id: 'curation', name: 'Curation Region', settlementIds: ids,
    worldState: { rngSeed: 'curation-seed', tick: 0, stressors },
    regionalGraph: ensureRegionalGraph({
      channels: [
        { type: 'trade_route', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  });

  test('the metronome is suppressed from the feed while every outcome stays in pulseHistory', () => {
    const { perTick, campaign } = runTicks({
      campaign: baseCampaign(), saves: ids.map((id, i) => save(id, i)), ticks: 10,
    });

    let appliedCount = 0;
    let suppressedCount = 0;
    for (const result of perTick) {
      const feedIds = new Set(result.wizardNews.entries.map(e => e.sourceEventId));
      for (const outcome of result.autoApplied) {
        appliedCount += 1;
        if (!feedIds.has(outcome.id)) suppressedCount += 1;
        // The LEDGER is never curated: every auto-applied outcome of this
        // tick is in its pulseRecord.selectedOutcomes.
        expect(
          result.pulseRecord.selectedOutcomes.some(s => s.id === outcome.id),
          `outcome ${outcome.id} missing from tick ${result.tick} ledger`,
        ).toBe(true);
      }
    }
    expect(appliedCount).toBeGreaterThan(0);
    // Anti-vacuity: suppression actually fired during the run.
    expect(suppressedCount).toBeGreaterThan(0);

    // Within the first cooldown window (ticks 1..6) a quiet settlement's
    // identical-reason growth metronome emits ONE applied entry, not six.
    const earlyGrowthEntriesForA = campaign.wizardNews.entries.filter(e =>
      e.kind === 'applied'
      && e.impactKind === 'population_growth'
      && e.tick >= 1 && e.tick <= 6
      && e.settlementIds.length === 1 && e.settlementIds[0] === 'a');
    expect(earlyGrowthEntriesForA.length).toBe(1);
    // And the applied entry states a fact, not a hypothesis.
    expect(earlyGrowthEntriesForA[0].headline).not.toMatch(/\bmay\b/);
  });

  test('a realm-wide famine arc survives curation and grounds the chronicle', () => {
    const famine = {
      id: 'world_stressor.famine.realm',
      type: 'famine',
      label: 'Famine',
      severity: 0.75,
      lifecycleStage: 'active',
      affectedSettlementIds: ['a', 'b', 'c'],
    };
    const { perTick, campaign } = runTicks({
      campaign: baseCampaign([famine]), saves: ids.map((id, i) => save(id, i)), ticks: 6,
    });

    // The arc entry is in the curated feed (realm/compound kinds are never
    // candidates for metronome suppression — they have their own R1 cooldown).
    const arcEntries = campaign.wizardNews.entries.filter(e => e.impactKind === 'realm_famine');
    expect(arcEntries.length).toBeGreaterThan(0);
    expect(arcEntries[0].significance).toBe('major');
    expect(arcEntries[0].headline).toBe('The Great Hunger grips the realm');

    // The paid chronicle, grounded on the curated feed, still reads the arc.
    const grounding = buildChronicleGrounding({
      wizardNews: campaign.wizardNews,
      worldState: campaign.worldState,
      snapshot: { settlements: [] },
      lookback: 6,
    });
    expect(grounding.majorHeadlines).toContain('The Great Hunger grips the realm');
    expect(grounding.realmArcs.some(a => a.headline === 'The Great Hunger grips the realm')).toBe(true);

    // The run still produced pulses every tick (curation never silences the world).
    expect(perTick.every(r => r.pulseRecord)).toBe(true);
  });
});
