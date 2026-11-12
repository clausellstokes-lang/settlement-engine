// LAYER-MAP assemble.mjs — the state-prose corpus's 856 pools by layer, from corpus.json + perturb.json.
// Each pool is MEASURED (drawn in the perturbation sample: 1 + the highest stored layer it depends on by value),
// INFERRED (undrawn, its block drawn: the block's highest measured pool), STATIC (its block never drawn by the
// public-prose sites: the block title's declared fields, READ, table below), or W (it reads the campaign world).
// Stored layers by VALUE: as perturb.mjs, except defenseProfile = 2 (readiness.mjs: depends on economy, roster,
// config; 0/120 on the cast or the powers). Run: node assemble.mjs corpus.json perturb.json > layers.json
import { readFileSync } from 'node:fs';
const C = JSON.parse(readFileSync(process.argv[2], 'utf8')); const P = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const LAYER = { config: 0, 'size(tier+population)': 0, institutions: 0, 'crises(stress+stressors+activeConditions)': 0, culturalIdentity: 0, neighborRelationship: 0, spatialLayout: 1, availableServices: 1, isolationSupport: 1, culturalNotes: 1, 'powerStructure.criminalCaptureState': 4, npcs: 3, relationships: 3, history: 3, settlementReason: 3, resourceAnalysis: 3, economicViability: 3, conflicts: 4, defenseProfile: 2, arrivalScene: 4, pressureSentence: 4 };
const lay = (sub) => LAYER[sub] ?? (sub.startsWith('economicState.') ? 1 : sub.startsWith('powerStructure.') ? 2 : null);
const measured = {};
for (const p of P.pools) { let m = -1, by = null; for (const s of p.dependsOn) if (lay(s) > m) { m = lay(s); by = s; } measured[p.pool] = { layer: m + 1, by }; }
// STATIC: blocks the public-prose sites never draw — from each block title's declared fields (READ)
const STATIC = {
  'DS-ECO-3': [2, 'economicState trade dependency'], 'DS-ECO-4': [2, 'market prices over exports/imports'], 'DS-ECO-5': [2, 'economicState.activeChains'], 'DS-SUP-1': [2, 'activeChains'], 'DS-ECO-7': [2, 'reconciliation log (the economy)'],
  'DS-DEF-10': [3, 'defenseProfile (L2 by value)'], 'DS-GEN-1': [4, 'history.currentTensions (L3)'], 'DS-GEN-2': [5, 'settlement.conflicts (L4)'], 'DS-GEN-3': [4, 'defenseProfile + prosperity + economicViability (L3)'],
  'DS-GEN-5': [5, 'settlement.arrivalScene — a stored LINE (L4): a line over a line'], 'DS-GEN-6': [4, 'settlementReason (L3) + config'], 'DS-GEN-7': [2, 'structuralViolations, coherenceNotes (L1)'],
  'DS-REL-1': [4, 'neighbour network + relationships (L3)'], 'DS-REL-2': [5, 'prominentRelationship.phrasing — a stored LINE (L4)'], 'DS-GEN-9': [4, 'history (L3)'], 'DS-GEN-10': [null, 'no declared fields'], 'DS-HK-1': [null, 'hooks: no declared fields'],
  'DS-GEN-11': [4, 'economicViability (L3)'], 'DS-GEN-12': [1, 'config.terrainType'], 'DS-GEN-13': [2, 'config.tradeRouteAccess + economicState.isEntrepot'], 'DS-GEN-14': [4, 'history.founding (L3)'],
  'DS-GEN-15': [null, 'settlement.urbanFabric'], 'DS-GEN-16': [4, 'history.historicalEvents (L3)'], 'DS-GEN-17': [2, 'economicState.compound.inst'], 'DS-GEN-18': [4, 'activeChains + resourceAnalysis (L3)'], 'DS-POW-3': [4, 'the ladder: the cast\'s standing (L3)'],
};
const WORLD = /worldState|spatialLedgers|causalState|populationHistory|politicsLedgers|religionStates|settlementWarStatus|renderTreaties|liveWorld|faithPanelModel|no war beat/;
const blockMeasured = {}; for (const [id, m] of Object.entries(measured)) { const b = id.split('::')[0]; blockMeasured[b] = Math.max(blockMeasured[b] ?? -1, m.layer); }
const rows = {}; const tally = {}; const how = { measured: 0, inferred: 0, static: 0, world: 0, unknown: 0 };
for (const [id, v] of Object.entries(C.perPool)) {
  const b = id.split('::')[0]; let layer, src;
  if (measured[id]) { layer = measured[id].layer; src = 'measured'; }
  else if (blockMeasured[b] != null) { layer = blockMeasured[b]; src = 'inferred'; }
  else if (WORLD.test(v.titleFields.join(' '))) { layer = 'W'; src = 'world'; }
  else if (STATIC[b] && STATIC[b][0] != null) { layer = STATIC[b][0]; src = 'static'; }
  else { layer = '?'; src = 'unknown'; }
  how[src]++; rows[id] = { layer, src, variants: v.variants, undeclared: v.undeclared, declaring: v.declaring, colour: v.colour };
  const t = (tally[layer] ||= { pools: 0, variants: 0, undeclaredLines: 0, measured: 0, inferred: 0, static: 0, world: 0, unknown: 0 });
  t.pools++; t.variants += v.variants; t.undeclaredLines += v.undeclared || 0; t[src]++;
}
console.log(JSON.stringify({ how, tally, rows }, null, 1));
