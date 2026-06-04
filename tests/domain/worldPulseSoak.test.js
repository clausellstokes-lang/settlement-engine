import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';

// A long-horizon "soak" test — the feel/balance analog of the generator's
// distribution test. We advance a small region many ticks and assert the world
// stays plausible: it keeps producing events (alive) but doesn't explode
// (bounded) or peg every settlement into permanent all-crisis.

function settlement(name, seed) {
  return {
    name,
    tier: 'town',
    population: 1200 + (seed % 5) * 400,
    config: { tradeRouteAccess: seed % 2 ? 'road' : 'remote', priorityEconomy: 20, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 26 + (seed % 4) * 6, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 70 },
        { faction: 'Temple Wardens', category: 'religious', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${seed}`, name: `Reeve ${name}`, importance: 'key', faction: 'Merchant League' },
      { id: `captain_${seed}`, name: `Captain ${name}`, importance: 'notable', faction: 'Temple Wardens' },
    ],
    activeConditions: [],
  };
}

function save(id, name, seed) {
  return {
    id, name, phase: 'canon',
    settlement: settlement(name, seed),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

describe('world pulse — long-horizon soak / balance', () => {
  test('40 ticks across 5 settlements stays bounded, alive, and stable', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    let saves = ids.map((id, i) => save(id, `Town-${id.toUpperCase()}`, i + 1));

    let campaign = {
      id: 'soak',
      name: 'Soak Region',
      settlementIds: ids,
      worldState: { rngSeed: 'soak-seed', tick: 0, stressors: [
        { id: 'world_stressor.siege.a', type: 'siege', severity: 0.8, affectedSettlementIds: ['a'] },
      ] },
      regionalGraph: ensureRegionalGraph({
        channels: [
          { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
          { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
          { type: 'military_protection', from: 'c', to: 'd', status: 'confirmed' },
          { type: 'political_authority', from: 'a', to: 'e', status: 'confirmed' },
        ],
      }),
      wizardNews: { currentTick: 0, entries: [] },
    };

    const TICKS = 40;
    let maxStressors = 0;
    let maxConditionsAnySettlement = 0;
    let totalAutoApplied = 0;

    for (let i = 0; i < TICKS; i++) {
      const result = advanceCampaignWorld({
        campaign,
        saves,
        interval: 'one_month',
        now: `2026-03-01T00:00:${String(i).padStart(2, '0')}.000Z`,
      });
      expect(result).not.toBeNull();

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

      totalAutoApplied += result.autoApplied.length;
      maxStressors = Math.max(maxStressors, (result.worldState.stressors || []).length);
      for (const s of saves) {
        maxConditionsAnySettlement = Math.max(maxConditionsAnySettlement, deriveAllActiveConditions(s.settlement).length);
      }
    }

    // Reached the end without throwing, and advanced the calendar.
    expect(campaign.worldState.tick).toBe(TICKS);
    // Alive: the world produced events over the run.
    expect(totalAutoApplied).toBeGreaterThan(0);
    // Bounded: roaming stressors don't explode...
    expect(maxStressors).toBeLessThanOrEqual(40);
    // ...and no settlement pegs into permanent all-crisis (conditions expire).
    expect(maxConditionsAnySettlement).toBeLessThanOrEqual(30);
    // History is capped (no unbounded memory growth).
    expect(campaign.worldState.pulseHistory.length).toBeLessThanOrEqual(80);
  });
});
