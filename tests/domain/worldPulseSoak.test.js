import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { foodLedger } from '../../src/domain/foodLedger.js';
import { healingLedger } from '../../src/domain/healingLedger.js';

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

// A deep, *conserved* food deficit — the real economicState.foodSecurity shape
// foodGenerator emits. This is what makes foodLedger(s).present true, so the
// P3.2 capacity branch (deriveFoodProduction's ledger contributor) actually
// fires inside the loop instead of short-circuiting on the absent ledger.
function withFoodDeficit(sv) {
  return {
    ...sv,
    settlement: {
      ...sv.settlement,
      economicState: {
        ...sv.settlement.economicState,
        foodSecurity: {
          dailyNeed: 4200, dailyProduction: 2100, foodRatio: 0.5,
          deficitPct: 50, surplusPct: 0, storageMonths: 1,
          importDependency: 0.6, magicSupplement: 0, resilienceScore: 30,
        },
      },
    },
  };
}

// Offered healing SERVICES but no healer-named institution (institutions stay []), so
// healingLedger has healerCount 0 + services > 0 — exactly the P3.3b Stage 4b "services_only"
// rescue branch. This is the only soak case that exercises it (baseline fixtures have no services).
function withHealingServices(sv) {
  return {
    ...sv,
    settlement: {
      ...sv.settlement,
      economicState: {
        ...sv.settlement.economicState,
        availableServices: { healing: ['Basic wound care', 'Medical care (basic)', 'Poor relief'] },
      },
    },
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

  // P3.3: same region, but two towns carry a deep conserved food deficit. This
  // is the only soak case where foodLedger(s).present is true, so it's the only
  // one that exercises the P3.2 capacity-ledger branch under the long loop. The
  // guard: a famine that strains food *capacity* must not feed back into a
  // runaway (the branch has no cross-tick coupling), and conserved foodSecurity
  // must survive the loop so the branch keeps firing.
  test('40 ticks with conserved food deficits stays bounded and exercises the ledger branch', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    // Towns b and d starve; a, c, e are unspecified (present:false) — a mixed region.
    const starving = new Set(['b', 'd']);
    let saves = ids.map((id, i) => {
      const sv = save(id, `Town-${id.toUpperCase()}`, i + 1);
      return starving.has(id) ? withFoodDeficit(sv) : sv;
    });

    // Precondition the branch depends on actually holds at t0.
    for (const s of saves.filter(s => starving.has(s.id))) {
      const led = foodLedger(s.settlement);
      expect(led.present).toBe(true);
      expect(led.deficitPct).toBeGreaterThanOrEqual(40);
    }

    let campaign = {
      id: 'soak-famine',
      name: 'Famine Region',
      settlementIds: ids,
      worldState: { rngSeed: 'soak-famine-seed', tick: 0, stressors: [
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

    // Same bounds as the baseline soak — the famine branch must not destabilise them.
    expect(campaign.worldState.tick).toBe(TICKS);
    expect(totalAutoApplied).toBeGreaterThan(0);
    expect(maxStressors).toBeLessThanOrEqual(40);
    expect(maxConditionsAnySettlement).toBeLessThanOrEqual(30);
    expect(campaign.worldState.pulseHistory.length).toBeLessThanOrEqual(80);

    // Probative: the conserved deficit survived the whole loop, so the branch
    // kept firing tick after tick (a vacuous pass would lose foodSecurity).
    for (const s of saves.filter(s => starving.has(s.id))) {
      const led = foodLedger(s.settlement);
      expect(led.present).toBe(true);
      expect(led.deficitPct).toBeGreaterThan(0);
    }
  });

  // P3.3b Stage 4b: towns that offer healing SERVICES but have no healer-named institution
  // exercise the "services_only" rescue. The only soak case that does (baseline has no services).
  // The rescue RELIEVES disease pressure, so it moves away from runaway — assert still bounded AND
  // still alive (over-relieving could make the world too quiet), and that services survive the loop.
  test('40 ticks with healing-services-only towns stays bounded, alive, and exercises the rescue', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const cared = new Set(['b', 'd']); // these offer healing services but no healer institution
    let saves = ids.map((id, i) => {
      const sv = save(id, `Town-${id.toUpperCase()}`, i + 1);
      return cared.has(id) ? withHealingServices(sv) : sv;
    });

    // Precondition the rescue depends on holds at t0: healerCount 0 but services present.
    for (const s of saves.filter(s => cared.has(s.id))) {
      const led = healingLedger(s.settlement);
      expect(led.healerCount).toBe(0);
      expect(led.services.length).toBeGreaterThan(0);
    }

    let campaign = {
      id: 'soak-care',
      name: 'Care Region',
      settlementIds: ids,
      worldState: { rngSeed: 'soak-care-seed', tick: 0, stressors: [
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

    expect(campaign.worldState.tick).toBe(TICKS);
    expect(totalAutoApplied).toBeGreaterThan(0); // alive — the rescue must not make the world silent
    expect(maxStressors).toBeLessThanOrEqual(40);
    expect(maxConditionsAnySettlement).toBeLessThanOrEqual(30);
    expect(campaign.worldState.pulseHistory.length).toBeLessThanOrEqual(80);

    // Probative: the healing services survived the loop, so the rescue kept firing.
    for (const s of saves.filter(s => cared.has(s.id))) {
      const led = healingLedger(s.settlement);
      expect(led.healerCount).toBe(0);
      expect(led.services.length).toBeGreaterThan(0);
    }
  });
});
