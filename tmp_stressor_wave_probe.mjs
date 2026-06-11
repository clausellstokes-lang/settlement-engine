// Stressor-wave balance probe — mirrors tmp_soak_probe.mjs's fixtures but
// instruments PER-TYPE birth/resolution distribution and lifetimes, so the
// organic-gate overhaul can be tuned on evidence (run before + after; the
// soak test pins the bounds, this prints the shape).
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

// Magic-dependent fixture: arcane institutions + high magic priority on a/c,
// a hard no-magic control on e — the deadzone gate must separate them.
function withMagicFlavor(sv, i) {
  const magicHeavy = ['a', 'c'].includes(sv.id);
  const noMagic = sv.id === 'e';
  return {
    ...sv,
    settlement: {
      ...sv.settlement,
      config: {
        ...sv.settlement.config,
        magicExists: !noMagic,
        priorityMagic: noMagic ? 0 : magicHeavy ? 70 : 25,
        magicLevel: noMagic ? 'none' : magicHeavy ? 'high' : 'low',
      },
      institutions: magicHeavy
        ? [
            { id: `college_${sv.id}`, name: 'Arcane College', category: 'Magic' },
            { id: `sanctum_${sv.id}`, name: 'Hidden Sanctum', category: 'Magic' },
            { id: `market_${sv.id}`, name: 'Market square' },
          ]
        : sv.settlement.institutions,
    },
  };
}

function runProbe({ label, seed, ticks, starve = false, magic = false }) {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  const starving = new Set(starve ? ['b', 'd'] : []);
  let saves = ids.map((id, i) => {
    let sv = save(id, `Town-${id.toUpperCase()}`, i + 1);
    if (starving.has(id)) sv = withFoodDeficit(sv);
    if (magic) sv = withMagicFlavor(sv, i);
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
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'allied' },
        { id: 'edge.a.e', from: 'a', to: 'e', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };

  let maxStressors = 0, maxActive = 0, maxEchoes = 0, maxConditions = 0;
  const birthsByType = new Map();      // type -> count (auto-applied births)
  const proposalsByType = new Map();   // type -> count (birth proposals offered)
  const resolvedByType = new Map();    // type -> count
  const bornAt = new Map();            // stressor id -> tick born (incl. seeded at 0)
  const lifetimes = new Map();         // type -> [ticks...]
  bornAt.set('world_stressor.siege.a', 0);

  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);

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

    for (const o of result.autoApplied || []) {
      const ct = String(o.candidateType || '');
      if (ct.startsWith('stressor_birth_')) {
        bump(birthsByType, ct.slice('stressor_birth_'.length));
        if (o.stressor?.id && !bornAt.has(o.stressor.id)) bornAt.set(o.stressor.id, i + 1);
      }
    }
    for (const p of campaign.worldState.proposals || []) {
      const ct = String(p.candidateType || p.outcome?.candidateType || '');
      if (p.tick === i + 1 && ct.startsWith('stressor_birth_')) bump(proposalsByType, ct.slice('stressor_birth_'.length));
    }
    for (const r of result.resolvedStressors || []) {
      bump(resolvedByType, r.type);
      const born = bornAt.get(r.id);
      if (born != null) {
        const arr = lifetimes.get(r.type) || [];
        arr.push(i + 1 - born);
        lifetimes.set(r.type, arr);
        bornAt.delete(r.id); // stable ids are reused on re-ignition — re-stamp
      }
    }

    const stressors = campaign.worldState.stressors || [];
    const echoes = stressors.filter(s => s.status === 'residual');
    const active = stressors.filter(s => !['residual', 'resolved', 'dormant'].includes(s.status));
    maxStressors = Math.max(maxStressors, stressors.length);
    maxEchoes = Math.max(maxEchoes, echoes.length);
    maxActive = Math.max(maxActive, active.length);
    for (const s of saves) {
      maxConditions = Math.max(maxConditions, deriveAllActiveConditions(s.settlement).length);
    }
  }

  const fmtMap = m => [...m.entries()].sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}=${v}`).join(' ') || 'none';
  const fmtLife = () => [...lifetimes.entries()].map(([t, arr]) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return `${t}:mean=${mean.toFixed(1)},max=${Math.max(...arr)}`;
  }).join(' ') || 'none';

  console.log(`\n=== ${label} (${ticks} ticks, seed=${seed}) ===`);
  console.log(`bounds: maxStressors=${maxStressors}/40 maxActive=${maxActive} maxEchoes=${maxEchoes} maxConditions=${maxConditions}/30`);
  console.log(`births (auto): ${fmtMap(birthsByType)}`);
  console.log(`birth proposals offered: ${fmtMap(proposalsByType)}`);
  console.log(`resolved: ${fmtMap(resolvedByType)}`);
  console.log(`lifetimes: ${fmtLife()}`);
}

runProbe({ label: 'baseline-40', seed: 'soak-seed', ticks: 40 });
runProbe({ label: 'famine-40', seed: 'soak-famine-seed', ticks: 40, starve: true });
runProbe({ label: 'baseline-120', seed: 'soak-seed', ticks: 120 });
runProbe({ label: 'famine-120', seed: 'soak-famine-seed', ticks: 120, starve: true });
runProbe({ label: 'magic-120', seed: 'soak-magic-seed', ticks: 120, magic: true });
