// M-HP12 probe: can one famine at 'a' be served as spatial columns AND a flow_migration in one tick?
// Usage: node probe.mjs <arm> [ticks] [interval] [famineSeverity] [pop]
//   arm: override | <presetId>   (override = both lanes lit, proposals off)
const ROOT = new URL('./mcr/', import.meta.url);
const imp = (p) => import(new URL(p, ROOT).href);
const { simulateCampaignWorldPulse } = await imp('src/domain/worldPulse/index.js');
const { ensureRegionalGraph } = await imp('src/domain/region/index.js');
const { buildSpatialDigest } = await imp('src/domain/spatial/index.js');
const { migrationActive } = await imp('src/domain/spatial/migration.js');
const { SIMULATION_RULE_PRESETS, normalizeSimulationRules } = await imp('src/domain/worldPulse/simulationRules.js');
const { makeGridPack, placeSettlements } = await imp('tests/fixtures/spatialPackFixtures.js');

const [arm = 'override', ticksArg = '6', interval = 'one_month', sevArg = '0.9', popArg = '1600', spatialArg = '1'] = process.argv.slice(2);
const INTENSITY = process.env.INTENSITY || null; const EXTRA = (process.env.EXTRA || '').split(',').filter(Boolean);
const TICKS = Number(ticksArg); const SEV = Number(sevArg); const POP = Number(popArg); const SPATIAL = spatialArg === '1';
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['a', 'b', 'c', 'd'];

const RULES = arm === 'override'
  ? { populationDynamicsEnabled: true, migrationFlowsEnabled: true, propagationMode: 'first_order', majorChangesRequireProposal: false, politicalAutonomy: 'full' }
  : { ...SIMULATION_RULE_PRESETS[arm].rules };
if (INTENSITY) RULES.intensity = INTENSITY;

function digest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}
const settlement = (name, patch = {}) => ({
  name, tier: 'town', population: POP,
  config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
  institutions: [], economicState: { primaryExports: [], primaryImports: [] },
  powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [], conflicts: [] },
  npcs: [], activeConditions: [], ...patch,
});
const save = (id, name, patch) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
let saves = [
  save('a', 'Ashford', { activeConditions: [...(process.env.NOCOND ? [] : [{ archetype: 'famine', severity: SEV, status: 'worsening' }]), ...EXTRA.map((archetype) => ({ archetype, severity: SEV, status: 'worsening' }))] }),
  save('b', 'Briarwatch'), save('c', 'Crownhold'), save('d', 'Deepmoor'),
];
const mig = (to) => ({ id: `ch.a.${to}.mig`, type: 'migration_pressure', from: 'a', to, strength: 0.7, status: 'confirmed' });
let campaign = {
  id: 'm-hp12', name: 'M-HP12', settlementIds: [...IDS],
  worldState: {
    rngSeed: process.env.SEED || 'm-hp12', tick: 1, simulationRules: RULES,
    stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: SEV, affectedSettlementIds: ['a'], age: 3, lifecycleStage: 'active' }],
    ...(SPATIAL ? { spatialCanonVersion: 1, spatialDigest: digest() } : {}),
  },
  regionalGraph: ensureRegionalGraph({
    edges: [
      { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
      { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
      { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'trade_partner' },
      { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'trade_partner' },
    ],
    channels: [mig('b'), mig('c'), mig('d')],
  }),
  wizardNews: { currentTick: 1, entries: [] },
};
const nr = normalizeSimulationRules(RULES);
console.log(`ARM=${arm} intensity=${nr.intensity} extra=[${EXTRA}] interval=${interval} famineSev=${SEV} pop=${POP} spatial=${SPATIAL} migrationActive=${migrationActive(campaign.worldState)} ` +
  `rules{migrationFlowsEnabled=${nr.migrationFlowsEnabled} propagationMode=${nr.propagationMode} populationDynamicsEnabled=${nr.populationDynamicsEnabled} majorChangesRequireProposal=${nr.majorChangesRequireProposal} politicalAutonomy=${nr.politicalAutonomy} demographicsEnabled=${nr.demographicsEnabled}}`);

const popOf = (id) => saves.find((s) => s.id === id).settlement.population;
const total = () => saves.reduce((s, x) => s + x.settlement.population, 0);
const ledgerOf = (ws) => ws?.spatialLedgers?.migration || {};
const rows = [];
for (let t = 0; t < TICKS; t++) {
  const tick = campaign.worldState.tick;
  const before = Object.fromEntries(IDS.map((id) => [id, popOf(id)]));
  const totBefore = total();
  const priorLedger = ledgerOf(campaign.worldState);
  const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
  const cands = r.candidates || [];
  const flowDerived = cands.filter((c) => c.candidateType === 'flow_migration' && c.metadata?.from === 'a');
  const emigDerived = cands.filter((c) => c.candidateType === 'population_emigration' && String(c.targetSaveId) === 'a');
  const applied = r.autoApplied || [];
  const flowApplied = applied.filter((c) => c.candidateType === 'flow_migration' && c.metadata?.from === 'a');
  const emigApplied = applied.filter((c) => c.candidateType === 'population_emigration' && String(c.targetSaveId) === 'a');
  const proposals = (r.proposals || []).filter((p) => ['flow_migration', 'population_emigration'].includes(p.candidateType || p.outcome?.candidateType));
  const ledger = ledgerOf(r.worldState);
  const newCols = Object.entries(ledger).filter(([k, c]) => !(k in priorLedger) && c.originId === 'a' && !c.travelClass);
  const upd = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
  saves = saves.map((s) => (upd.has(s.id) ? { ...s, settlement: upd.get(s.id) } : s));
  campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
  const after = Object.fromEntries(IDS.map((id) => [id, popOf(id)]));
  const hist = (saves.find((s) => s.id === 'a').settlement.populationHistory || []).filter((h) => h.tick === tick);
  const row = {
    tick,
    flowDerived: flowDerived.length, flowDerivedPeople: flowDerived.reduce((s, c) => s + (c.metadata?.populationDelta || 0), 0),
    flowDerivedMode: [...new Set(flowDerived.map((c) => c.applyMode))].join('/'),
    flowApplied: flowApplied.length, flowAppliedPeople: flowApplied.reduce((s, c) => s + (c.metadata?.populationDelta || 0), 0),
    emigDerived: emigDerived.length, emigMode: emigDerived.map((c) => c.applyMode).join('/'),
    emigLoss: emigDerived.reduce((s, c) => s + (c.metadata?.spatialEmigration?.loss || 0), 0),
    emigTransferMode: emigDerived.map((c) => c.metadata?.transferMode).join('/'),
    emigApplied: emigApplied.length,
    cols: newCols.length, colPeople: newCols.reduce((s, [, c]) => s + c.arrivals, 0),
    proposals: proposals.length,
    dA: after.a - before.a, dB: after.b - before.b, dC: after.c - before.c, dD: after.d - before.d,
    dTotal: total() - totBefore,
    aHistory: hist.map((h) => `${h.delta}:${h.reason}${h.outcomeId ? `[${h.outcomeId}]` : ''}`),
  };
  rows.push(row);
  console.log(JSON.stringify(row));
}
const both = rows.filter((r) => r.flowApplied > 0 && r.cols > 0);
console.log(`SUMMARY ticksWithBothServed=${both.length} ticks=[${both.map((r) => r.tick).join(',')}]`);
