/**
 * M1b — the MINT census instrument, with its own two controls.
 *
 * CONTROL 1 (the loader is inert): the settlement hash under the loader equals the hash
 *   recorded by the committed golden manifest for the same row. If the wrapper perturbed
 *   anything, this reds.
 * CONTROL 2 (EM-P0's own facts, re-measured on the census): generatePopulation's subtree
 *   draws > 67 unpinned and EXACTLY 0 under full pins.
 * Then: the fork-proxy's per-step count vs the census's per-step count, side by side —
 *   the difference is the entropy the step's own stream does not carry.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import {
  instrumentedRoot, runHeadless, createPRNG, getStepOrder, generateSettlementPipeline, TREE,
} from './instrument.mjs';

const census = globalThis.__PRNG_CENSUS__;
const ROW = {
  settType: 'town', culture: 'germanic', terrainOverride: 'riverside',
  tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'em-p0-pinned-mode',
};
const GOLDEN_ROW = {
  settType: 'town', culture: 'germanic', terrainOverride: 'plains',
  tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3',
};
const keyOf = (c) => [c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');

// ── CONTROL 1: the loader changes no output ─────────────────────────────────
const manifest = JSON.parse(readFileSync(`${TREE}/tests/fixtures/generator-golden-master.json`, 'utf-8'));
const { _seed, ...cfg } = GOLDEN_ROW;
const settlement = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
const hash = createHash('sha256').update(JSON.stringify(settlement)).digest('hex');
console.log('=== CONTROL 1 — the loader is inert over the committed golden ===');
console.log(`row      = ${keyOf(GOLDEN_ROW)}`);
console.log(`manifest = ${manifest[keyOf(GOLDEN_ROW)]}`);
console.log(`measured = ${hash}`);
console.log(`EQUAL    = ${manifest[keyOf(GOLDEN_ROW)] === hash}`);

// ── attribution helper ──────────────────────────────────────────────────────
const order = getStepOrder();
function attribute(rootSeed, mints) {
  const byStep = new Map(order.map(n => [n, { calls: 0, mints: 0, seeds: new Set(), methods: {} }]));
  const foreign = [];
  for (const m of mints) {
    if (m.seed === rootSeed) continue; // the root stream itself
    if (!m.seed.startsWith(`${rootSeed}::`)) { foreign.push(m); continue; }
    const rest = m.seed.slice(rootSeed.length + 2);
    const step = rest.split('::')[0];
    const bucket = byStep.get(step);
    if (!bucket) { foreign.push(m); continue; }
    bucket.calls += m.calls;
    bucket.mints += 1;
    bucket.seeds.add(m.seed);
    for (const [k, v] of Object.entries(m.methods)) bucket.methods[k] = (bucket.methods[k] || 0) + v;
  }
  return { byStep, foreign };
}

// ── CONTROL 2 + the side-by-side ────────────────────────────────────────────
census.reset();
const un = instrumentedRoot(ROW._seed);
const t0 = Date.now();
const ctx = runHeadless(ROW, un.root);
const t1 = Date.now();
const unAttr = attribute(ROW._seed, census.all());

census.reset();
const pins = { npcs: ctx.npcs, relationships: ctx.relationships, factions: ctx.factions, conflicts: ctx.conflicts };
const pin = instrumentedRoot(ROW._seed);
runHeadless(ROW, pin.root, { pins });
const pinAttr = attribute(ROW._seed, census.all());

console.log('\n=== CONTROL 2 — generatePopulation on the MINT census ===');
console.log(`unpinned subtree calls = ${unAttr.byStep.get('generatePopulation').calls} (> 67? ${unAttr.byStep.get('generatePopulation').calls > 67})`);
console.log(`fully pinned subtree calls = ${pinAttr.byStep.get('generatePopulation').calls} (=== 0? ${pinAttr.byStep.get('generatePopulation').calls === 0})`);

console.log('\n=== SIDE BY SIDE — fork-proxy count vs mint-census count, per step ===');
console.log('step\tproxyDraws\tcensusCalls\tDELTA(invisible to the proxy)\tmints\tdistinctSeeds');
let deltaTotal = 0;
for (const name of order) {
  const p = un.perStep.get(name).draws;
  const c = unAttr.byStep.get(name).calls;
  deltaTotal += (c - p);
  console.log(`${name}\t${p}\t${c}\t${c - p}\t${unAttr.byStep.get(name).mints}\t${unAttr.byStep.get(name).seeds.size}`);
}
console.log(`TOTAL invisible-to-proxy draws = ${deltaTotal}`);
console.log(`FOREIGN-prefix mints during the run = ${unAttr.foreign.length}`);
for (const f of unAttr.foreign.slice(0, 20)) console.log(`  foreign seed="${f.seed}" calls=${f.calls}`);
console.log(`one run wall clock (instrumented + census) = ${t1 - t0} ms`);

// Which seeds carry the generatePower subtree's entropy?
console.log('\n=== generatePower subtree, seed by seed ===');
for (const m of census.all()) {
  if (m.seed.startsWith(`${ROW._seed}::generatePower`) || m.seed.startsWith(`${ROW._seed}::powerEconomyReconcilePass`)) {
    console.log(`  seed="${m.seed}" calls=${m.calls} methods=${JSON.stringify(m.methods)} forks=[${m.forkLabels.join('|')}]`);
  }
}
