// Instrumented soak probe — mirrors tests/domain/worldPulseSoak.test.js but
// prints per-tick stressor population breakdown, echo counts, and runs longer.
import { advanceCampaignWorld } from './src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from './src/domain/region/index.js';
import { deriveAllActiveConditions } from './src/domain/activeConditions.js';

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

function runSoak({ label, seed, ticks, starve = false, underworld = false }) {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  const starving = new Set(starve ? ['b', 'd'] : []);
  let saves = ids.map((id, i) => {
    let sv = save(id, `Town-${id.toUpperCase()}`, i + 1);
    if (starving.has(id)) sv = withFoodDeficit(sv);
    if (underworld) {
      sv = {
        ...sv,
        settlement: {
          ...sv.settlement,
          institutions: [
            { id: `guild_${sv.id}`, name: "Thieves' Guild", category: 'criminal' },
            { id: `watch_${sv.id}`, name: 'Town Watch' },
            { id: `market_${sv.id}`, name: 'Market square' },
          ],
          npcs: sv.settlement.npcs.map(n => ({ ...n, flaw: 'greedy', factionAffiliation: 'Town Watch' })),
        },
      };
    }
    return sv;
  });

  let campaign = {
    id: label,
    name: label,
    settlementIds: ids,
    worldState: { rngSeed: seed, tick: 0, stressors: [
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

  let maxStressors = 0, maxEchoes = 0, maxActive = 0, maxConditions = 0;
  let totalResolved = 0, totalGraduated = 0;
  const rebirths = new Map(); // type:origin -> birth count
  let siegeAlive = 0, faminePresent = 0, famineBlockedTicks = 0;
  const tail = [];

  for (let i = 0; i < ticks; i++) {
    const result = advanceCampaignWorld({
      campaign, saves, interval: 'one_month',
      now: `2026-03-01T00:${String(Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}.000Z`,
    });
    campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
    saves = saves.map(s => {
      const update = result.settlementUpdates.find(u => String(u.saveId) === String(s.id));
      return update ? { ...s, settlement: update.settlement } : s;
    });

    const stressors = result.worldState.stressors || [];
    const echoes = stressors.filter(s => s.status === 'residual');
    const active = stressors.filter(s => !['residual', 'resolved', 'dormant'].includes(s.status));
    maxStressors = Math.max(maxStressors, stressors.length);
    maxEchoes = Math.max(maxEchoes, echoes.length);
    maxActive = Math.max(maxActive, active.length);
    totalResolved += result.resolvedStressors.length;
    totalGraduated += (result.worldState.pulseHistory?.at(-1)?.graduatedStressors || []).length;
    for (const o of result.autoApplied) {
      if (String(o.candidateType || '').startsWith('stressor_birth_')) {
        const k = `${o.stressor?.type}:${o.targetSaveId}`;
        rebirths.set(k, (rebirths.get(k) || 0) + 1);
      }
    }
    const siege = stressors.find(s => s.type === 'siege' && !['residual','resolved','dormant'].includes(s.status));
    if (siege) siegeAlive++;
    const famine = stressors.find(s => s.type === 'famine' && !['residual','resolved','dormant'].includes(s.status));
    if (famine) {
      faminePresent++;
      if (famine.synergy?.blocksResolution) famineBlockedTicks++;
    }
    for (const s of saves) {
      maxConditions = Math.max(maxConditions, deriveAllActiveConditions(s.settlement).length);
    }
    if (i >= ticks - 5 || i % 10 === 0) {
      tail.push({ tick: i + 1, total: stressors.length, active: active.length, echoes: echoes.length,
        siege: siege ? +siege.severity.toFixed(2) : null,
        famine: famine ? +famine.severity.toFixed(2) : null,
        famineBlocked: famine?.synergy?.blocksResolution || false });
    }
  }

  // corruption summary
  const npcStates = campaign.worldState.npcStates || {};
  const corrupt = Object.values(npcStates).filter(s => s.corruption).length;
  const totalNpc = Object.keys(npcStates).length;
  const allNpcs = saves.flatMap(s => s.settlement.npcs || []);
  const corruptOnSettlement = allNpcs.filter(n => n.corrupt === true).length;
  const impairCounts = saves.map(s => ({
    id: s.id,
    impairments: (s.settlement.institutions || []).reduce((a, inst) => a + (inst.impairments || []).length, 0),
    corruptionImps: (s.settlement.institutions || []).reduce((a, inst) => a + (inst.impairments || []).filter(im => im.type === 'corruption').length, 0),
  }));
  const histCounts = saves.map(s => ({
    id: s.id,
    campaignEvents: (s.settlement.history?.historicalEvents || []).filter(e => e.campaignEra).length,
  }));

  console.log(`\n=== ${label} (${ticks} ticks, seed=${seed}) ===`);
  console.log(`maxStressors=${maxStressors} (soak bound 40) | maxActive=${maxActive} maxEchoes=${maxEchoes}`);
  console.log(`maxConditionsAnySettlement=${maxConditions} (bound 30)`);
  console.log(`totalResolved=${totalResolved} totalGraduated=${totalGraduated}`);
  console.log(`siege active ticks=${siegeAlive}/${ticks} | famine present=${faminePresent} blockedBySiege=${famineBlockedTicks}`);
  const reb = [...rebirths.entries()].filter(([, v]) => v > 1);
  console.log(`re-ignitions (same type:origin born >1x):`, reb.length ? reb : 'none');
  console.log(`corrupt npcStates=${corrupt}/${totalNpc} | settlement npc corrupt flags=${corruptOnSettlement}/${allNpcs.length}`);
  console.log(`institution impairments:`, JSON.stringify(impairCounts));
  console.log(`campaign history events:`, JSON.stringify(histCounts));
  console.log('trajectory:', JSON.stringify(tail));
}

runSoak({ label: 'baseline-40', seed: 'soak-seed', ticks: 40 });
runSoak({ label: 'famine-40', seed: 'soak-famine-seed', ticks: 40, starve: true });
runSoak({ label: 'baseline-120', seed: 'soak-seed', ticks: 120 });
runSoak({ label: 'famine-120', seed: 'soak-famine-seed', ticks: 120, starve: true });
runSoak({ label: 'underworld-120', seed: 'soak-underworld-seed', ticks: 120, underworld: true });
