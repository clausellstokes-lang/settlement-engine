import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { foodLedger } from '../../src/domain/foodLedger.js';
import { healingLedger } from '../../src/domain/healingLedger.js';
import { npcCorruptibleFlaw, readCorruptionClimate } from '../../src/domain/corruption.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import {
  economyHealthScore,
  classifyEconomyDirection,
  detectInstitutionGaps,
  isClosableInstitution,
} from '../../src/domain/worldPulse/institutionLifecycle.js';
import { catalogEntryByName } from '../../src/domain/worldPulse/tierResourceDynamics.js';

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

  // Corruption runaway guard. memory/corruption-system.md names this soak as THE guard
  // for the damped NPC/faction/thieves-guild loop, but the baseline fixtures carry
  // institutions: [] and no corruptible flaws — so every corruption/capture path
  // short-circuited and the guard exercised ZERO corruption iterations across 40 ticks.
  // This case gives every town a criminal institution + corruptible NPCs so the loop
  // actually runs, then asserts the damping holds (no total corruption, world bounded).
  test('40 ticks with a criminal underworld stays bounded and corruption does not run away', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const withUnderworld = (sv) => ({
      ...sv,
      settlement: {
        ...sv.settlement,
        institutions: [
          ...sv.settlement.institutions,
          { id: `guild_${sv.id}`, name: "Thieves' Guild", category: 'criminal' },
          { id: `market_${sv.id}`, name: 'Market square' },
          // A security institution + a watch-homed NPC: exercises the
          // corruption-duality loop (patronage onset drag, raw-security
          // exposure, proximity after an oust impairs the watch) under the
          // same 40-tick damping guard.
          { id: `watch_${sv.id}`, name: 'Town Watch' },
        ],
        npcs: sv.settlement.npcs.map((n, i) => ({
          ...n,
          flaw: 'greedy',
          ...(i === 0 ? { factionAffiliation: 'Town Watch' } : {}),
        })),
      },
    });
    let saves = ids.map((id, i) => withUnderworld(save(id, `Town-${id.toUpperCase()}`, i + 1)));

    // Precondition the corruption loop depends on actually holds at t0: a criminal
    // institution is present (the climate gate) and EVERY fixture NPC is eligible
    // through the same function the engine uses. (An earlier revision set a plural
    // `flaws` array the engine never reads — eligibility silently failed and the
    // guard passed vacuously. Asserting via npcCorruptibleFlaw closes that hole.)
    for (const s of saves) {
      expect(readCorruptionClimate(s.settlement).hasCriminalInst).toBe(true);
      for (const n of s.settlement.npcs) expect(npcCorruptibleFlaw(n)).toBe('greedy');
    }

    let campaign = {
      id: 'soak-underworld',
      name: 'Underworld Region',
      settlementIds: ids,
      worldState: { rngSeed: 'soak-underworld-seed', tick: 0, stressors: [] },
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
    const everCorrupt = new Set(); // npcState ids that were corrupt at ANY tick

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
      for (const [id, st] of Object.entries(result.worldState.npcStates || {})) {
        if (st.corruption) everCorrupt.add(id);
      }
    }

    // Same bounds as the baseline soak — the underworld must not destabilise them.
    expect(campaign.worldState.tick).toBe(TICKS);
    expect(totalAutoApplied).toBeGreaterThan(0);
    expect(maxStressors).toBeLessThanOrEqual(40);
    expect(maxConditionsAnySettlement).toBeLessThanOrEqual(30);
    expect(campaign.worldState.pulseHistory.length).toBeLessThanOrEqual(80);

    // Probative: the corruption loop actually RAN. npcStates being non-empty is NOT
    // enough — ensureNpcStates tracks every NPC whether or not corruption is live —
    // so the guard also requires that at least one NPC turned corrupt during the
    // soak. If this fails, eligibility short-circuited and the case is vacuous again.
    const npcStates = campaign.worldState.npcStates || {};
    expect(Object.keys(npcStates).length).toBeGreaterThan(0);
    expect(everCorrupt.size).toBeGreaterThan(0);

    // The damping guard itself: corruption must not saturate. A runaway pegs every
    // NPC corrupt within 40 ticks; the damped loop stabilises below that.
    const allNpcs = saves.flatMap(s => s.settlement.npcs || []);
    const corruptCount = allNpcs.filter(n => n.corrupt === true).length;
    expect(allNpcs.length).toBeGreaterThan(0);
    expect(corruptCount).toBeLessThan(allNpcs.length); // not total corruption
  });

  // Institution-lifecycle GROWTH guard. The baseline fixtures (institutions: [],
  // neutral causal scores) keep the lifecycle gate shut, so this case decorates
  // every town into a verifiably booming economy with a known missing
  // supply-chain step (smithy + iron deposits, no mine) and asserts the loop
  // both RAN (anti-vacuity: at least one institution was built) and stayed
  // BOUNDED (no settlement sprawls without limit).
  test('40 ticks of stable prosperity grows missing supply-chain institutions without sprawl', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const withBoomEconomy = (sv) => ({
      ...sv,
      settlement: {
        ...sv.settlement,
        population: 4000,
        config: { ...sv.settlement.config, tradeRouteAccess: 'crossroads', priorityEconomy: 60, nearbyResources: ['iron_deposits'] },
        institutions: [
          'Market square', 'Weekly market', 'Blacksmiths (3-10)', 'Town granary', 'Craft guilds (5-15)',
          'Town watch', 'Town hall', 'Mill', 'Farmland', 'Parish church', 'Carpenters (5-15)', 'Bakehouse',
          'Tavern', 'Inn', 'Stables', 'Warehouse district',
        ].map(name => ({ name, category: 'Civic' })),
        economicState: {
          ...sv.settlement.economicState,
          prosperity: 'Prosperous',
          primaryExports: ['Quality tools and weapons', 'Grain surplus'],
          primaryImports: [],
          foodSecurity: {
            dailyNeed: 4200, dailyProduction: 6800, foodRatio: 1.62,
            deficitPct: 0, surplusPct: 45, storageMonths: 6,
            importDependency: 0.05, magicSupplement: 0, resilienceScore: 82,
          },
          activeChains: [
            { needKey: 'food_security', chainId: 'grain', label: 'Grain & Bread', status: 'running', processingInstitutions: ['Mill'], outputs: ['Baked goods', 'Grain surplus'], exportable: true, upstreamChains: [] },
            { needKey: 'food_security', chainId: 'livestock', label: 'Livestock', status: 'operational', processingInstitutions: ['Farmland'], outputs: ['Meat'], exportable: true, upstreamChains: [] },
            { needKey: 'food_security', chainId: 'fish', label: 'Fish & Waterways', status: 'running', processingInstitutions: ['Market square'], outputs: ['Preserved fish'], exportable: true, upstreamChains: [] },
          ],
        },
        powerStructure: { ...sv.settlement.powerStructure, publicLegitimacy: { score: 74, label: 'Approved' } },
      },
    });
    let saves = ids.map((id, i) => withBoomEconomy(save(id, `Boom-${id.toUpperCase()}`, i + 1)));

    // t0 preconditions through the engine's OWN functions (the anti-vacuity
    // lesson from the corruption guard): every town must classify as
    // 'prosperous' AND carry a detectable supply-chain gap, or the case is
    // silently asserting nothing.
    for (const s of saves) {
      const health = economyHealthScore(deriveCausalState(s.settlement).scores);
      expect(classifyEconomyDirection(health)).toBe('prosperous');
      const gaps = detectInstitutionGaps(s.settlement);
      expect(gaps.length).toBeGreaterThan(0);
      expect(gaps[0].name.toLowerCase()).toContain('mine'); // the smithy/ore/no-mine gap
    }

    let campaign = {
      id: 'soak-growth',
      name: 'Boom Region',
      settlementIds: ids,
      worldState: { rngSeed: 'soak-growth-seed', tick: 0, stressors: [] },
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
    const startCounts = new Map(saves.map(s => [s.id, s.settlement.institutions.length]));
    let maxStressors = 0;
    let maxConditionsAnySettlement = 0;
    let totalAutoApplied = 0;
    const everBuilt = new Set(); // `${saveId}:${name}` for every lifecycle-built institution

    for (let i = 0; i < TICKS; i++) {
      const result = advanceCampaignWorld({
        campaign,
        saves,
        interval: 'one_month',
        now: `2026-05-01T00:00:${String(i).padStart(2, '0')}.000Z`,
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
        for (const inst of s.settlement.institutions || []) {
          if (inst._worldPulseEconomyBuilt && inst.status === 'active') everBuilt.add(`${s.id}:${inst.name}`);
        }
      }
    }

    // Shared world bounds — growth must not destabilise the soak invariants.
    expect(campaign.worldState.tick).toBe(TICKS);
    expect(totalAutoApplied).toBeGreaterThan(0);
    expect(maxStressors).toBeLessThanOrEqual(40);
    expect(maxConditionsAnySettlement).toBeLessThanOrEqual(30);
    expect(campaign.worldState.pulseHistory.length).toBeLessThanOrEqual(80);

    // Probative: the lifecycle actually built something across the run.
    expect(everBuilt.size).toBeGreaterThan(0);

    // Every built institution must carry an exact catalog name (all economic
    // joins are name-keyed) and never be a criminal-economy step.
    for (const key of everBuilt) {
      const name = key.split(':').slice(1).join(':');
      expect(catalogEntryByName(name)).not.toBeNull();
      expect(/thieves|smuggl|black market|gang|fence/i.test(name)).toBe(false);
    }

    // The damping guard itself: growth saturates. No settlement may sprawl
    // beyond a plausible band over 40 prosperous months.
    for (const s of saves) {
      const active = (s.settlement.institutions || []).filter(inst => inst.status !== 'removed' && !inst._worldPulseInactive);
      expect(active.length).toBeLessThanOrEqual((startCounts.get(s.id) || 0) + 8);
    }
  });

  // Institution-lifecycle CLOSURE guard. Decorates every town into a verifiably
  // distressed economy with a roster of closable institutions (one impaired —
  // it must be squeezed out first) plus a required granary that must SURVIVE.
  // Asserts the loop ran (at least one closure), closures stay uncommon, and
  // decline never hollows a settlement out (no closure cascade).
  test('40 ticks of stable decline closes low-necessity institutions rarely and never the required ones', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const withBustEconomy = (sv) => ({
      ...sv,
      settlement: {
        ...sv.settlement,
        population: 1500,
        config: { ...sv.settlement.config, tradeRouteAccess: 'isolated', priorityEconomy: 10 },
        institutions: [
          { name: 'Town granary', category: 'Storage', required: true },
          { name: 'Bathhouse', category: 'Services', impairments: [{ type: 'capacity', severity: 0.6, causeEventId: 'soak:seed' }] },
          { name: 'Gambling den', category: 'Entertainment' },
          { name: 'Shrine', category: 'Religious' },
        ],
        economicState: {
          ...sv.settlement.economicState,
          prosperity: 'Struggling',
          primaryExports: [],
          primaryImports: ['Bulk grain and foodstuffs', 'Iron ore'],
          foodSecurity: {
            dailyNeed: 4200, dailyProduction: 2100, foodRatio: 0.5,
            deficitPct: 50, surplusPct: 0, storageMonths: 1,
            importDependency: 0.6, magicSupplement: 0, resilienceScore: 22,
          },
        },
        defenseProfile: { scores: { military: 14, monster: 20, internal: 18, economic: 12, magical: 5 }, readinessScore: 14 },
        powerStructure: { ...sv.settlement.powerStructure, publicLegitimacy: { score: 24, label: 'Legitimacy Crisis' } },
      },
    });
    let saves = ids.map((id, i) => withBustEconomy(save(id, `Bust-${id.toUpperCase()}`, i + 1)));

    // t0 preconditions via the engine's own functions: every town classifies
    // as 'declining' and has at least one closable institution, while the
    // granary is correctly recognised as never-closable.
    for (const s of saves) {
      const health = economyHealthScore(deriveCausalState(s.settlement).scores);
      expect(classifyEconomyDirection(health)).toBe('declining');
      const closable = s.settlement.institutions.filter(isClosableInstitution);
      expect(closable.length).toBeGreaterThan(0);
      expect(isClosableInstitution(s.settlement.institutions[0])).toBe(false); // the required granary
    }

    let campaign = {
      id: 'soak-closure',
      name: 'Bust Region',
      settlementIds: ids,
      worldState: { rngSeed: 'soak-closure-seed', tick: 0, stressors: [] },
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
    const everClosed = new Set(); // `${saveId}:${name}` for every lifecycle closure

    for (let i = 0; i < TICKS; i++) {
      const result = advanceCampaignWorld({
        campaign,
        saves,
        interval: 'one_month',
        now: `2026-06-01T00:00:${String(i).padStart(2, '0')}.000Z`,
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
        for (const inst of s.settlement.institutions || []) {
          if (inst._worldPulseEconomyClosed) everClosed.add(`${s.id}:${inst.name}`);
        }
      }
    }

    // Shared world bounds.
    expect(campaign.worldState.tick).toBe(TICKS);
    expect(totalAutoApplied).toBeGreaterThan(0);
    expect(maxStressors).toBeLessThanOrEqual(40);
    expect(maxConditionsAnySettlement).toBeLessThanOrEqual(30);
    expect(campaign.worldState.pulseHistory.length).toBeLessThanOrEqual(80);

    // Probative: at least one closure actually happened — without it the
    // damping assertions below are vacuous.
    expect(everClosed.size).toBeGreaterThan(0);

    // Plausible but UNCOMMON: across 5 towns × 40 distressed months the
    // closures stay a trickle, not a cascade.
    expect(everClosed.size).toBeLessThanOrEqual(10);

    for (const s of saves) {
      const insts = s.settlement.institutions || [];
      // The required granary survives every decline, in every settlement.
      const granary = insts.find(inst => inst.name === 'Town granary');
      expect(granary).toBeTruthy();
      expect(granary.status === 'remnant' || granary.status === 'removed').toBe(false);
      expect(granary._worldPulseEconomyClosed).toBeUndefined();
      // No hollow-out: something beyond the granary is still standing.
      const active = insts.filter(inst => inst.status !== 'removed' && !inst._worldPulseInactive);
      expect(active.length).toBeGreaterThanOrEqual(2);
      // Necessity ordering: any town that lost institutions lost the impaired
      // zero-contribution Bathhouse first — it is always the most vulnerable.
      const closedHere = [...everClosed].filter(key => key.startsWith(`${s.id}:`));
      if (closedHere.length) expect(closedHere).toContain(`${s.id}:Bathhouse`);
    }
  });
});
