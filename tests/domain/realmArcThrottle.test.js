/**
 * tests/domain/realmArcThrottle.test.js — Regional wave R1 pin (H17).
 *
 * The realm-arc re-emission throttle must read the NEWEST entries of the
 * newest-first feed. The old `slice(-80)` read the 80 oldest, so once a
 * campaign exceeded 80 entries every long arc re-emitted a duplicate major
 * headline every tick.
 *
 * Pins:
 *   • With a 100+ entry feed, an arc entry at tick T-1 suppresses re-emission
 *     at tick T.
 *   • An arc entry older than the cooldown does NOT suppress (long arcs stay
 *     visible).
 */

import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';
const IDS = ['a', 'b', 'c'];

function save(id, i) {
  return {
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
  };
}

function fillerEntries(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `wizard_news.filler.${i}`,
    tick: 1 + Math.floor(i / 10),
    scope: 'settlement',
    significance: 'notable',
    score: 10,
    headline: `Filler ${i}`,
    kind: 'applied',
    severity: 0.2,
    settlementIds: ['a'],
  }));
}

function arcEntry(tick) {
  return {
    id: `wizard_news.${tick}.realm.famine`,
    tick,
    scope: 'realm',
    significance: 'major',
    score: 83,
    headline: 'The Great Hunger grips the realm',
    kind: 'realm',
    impactKind: 'realm_famine',
    severity: 0.84,
    settlementIds: IDS,
    tags: ['world_pulse', 'realm', 'famine'],
  };
}

function pulse(arcTick) {
  const campaign = {
    id: 'camp-arc',
    name: 'Arc Realm',
    settlementIds: IDS,
    regionalGraph: ensureRegionalGraph(),
    wizardNews: { currentTick: 11, entries: [...fillerEntries(110), arcEntry(arcTick)] },
    worldState: {
      rngSeed: 'arc-seed',
      tick: 11,
      canonizedAt: NOW,
      stressors: [{ id: 'world_stressor.famine.realm', type: 'famine', severity: 0.75, affectedSettlementIds: IDS }],
    },
  };
  return advanceCampaignWorld({ campaign, saves: IDS.map(save), interval: 'one_month', now: NOW });
}

describe('H17 — realm-arc re-emission throttle reads the newest feed entries', () => {
  test('an arc entry at tick T-1 suppresses re-emission at tick T even past 100 entries', () => {
    const result = pulse(11); // last emitted one tick ago, well inside the cooldown

    // Premise: the arc is still live, so the only reason for silence is the throttle.
    const famine = (result.worldState.stressors || []).find(s => s.type === 'famine');
    expect(famine).toBeTruthy();
    expect([...(famine.affectedSettlementIds || [])].sort()).toEqual(IDS);

    const reEmitted = result.wizardNews.entries.filter(e => e.impactKind === 'realm_famine' && e.tick === 12);
    expect(reEmitted).toEqual([]);
  });

  test('an arc entry older than the cooldown re-emits (long arcs stay visible)', () => {
    const result = pulse(5); // 12 - 5 = 7 ticks ago, past the 6-tick cooldown
    const reEmitted = result.wizardNews.entries.filter(e => e.impactKind === 'realm_famine' && e.tick === 12);
    expect(reEmitted).toHaveLength(1);
    expect(reEmitted[0].settlementIds).toEqual(IDS);
  });
});
