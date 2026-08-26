#!/usr/bin/env node
/**
 * harness/laneSPINE3/runSignal.mjs — SPINE-3 · **THE LOST RUN-TYPE SIGNAL, MEASURED ON BOTH
 * PRODUCERS OVER THE SAME CORPUS** (ODQ §692.6(ii); DRESS-1b §DEFER 3).
 *
 * The legacy producer is `wallRuns.deriveRuns`, reached through `traceWalls` on the fabric.
 * The successor producer is `wallPublication.classifyRuns`, reached through `publishWallWorks`
 * on the partition. Both classify the SAME closed set of nine. This instrument tallies both
 * over the corpus, per leaf and per type, and prints the difference.
 *
 * ⛔ IT CARRIES ITS OWN LIVENESS CONTROL: the legacy tally is re-read from a SECOND, independent
 * source (`walls[].runs[].type`) beside `walls[].runCounts`, and the two must agree — a tally
 * read from one field that happens to be empty is indistinguishable from a real zero.
 *
 * Usage: node harness/laneSPINE3/runSignal.mjs [--leaves=a,b] [--json=path] [--arms]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import { RUN_TYPES } from '../../src/domain/townMap/fabric/wallRuns.js';
import { pubOpts } from './pubOpts.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** Every fabric arm this estate carries — the legacy producer's richest input state. */
const ARMS = {
  frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true,
  minFootprint: true, waterfrontExemption: true, quayRegister: true,
  riverProfile: true, deckLaw: true, fordRegister: true,
};

const zero = () => { const o = {}; for (const t of RUN_TYPES) o[t] = 0; return o; };
const add = (a, b) => { for (const t of RUN_TYPES) a[t] += (b[t] || 0); return a; };

const rows = [];
const legacyTotal = zero();
const succTotal = zero();
let controlFails = 0;

for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const built = buildOne(spec, has('arms') ? ARMS : undefined);
  const { settlement, model, fabric } = built;

  // ── the LEGACY tally, read TWICE from two independent fields
  const legA = zero(); const legB = zero();
  for (const w of fabric.walls || []) {
    for (const t of Object.keys(w.runCounts || {})) legA[t] += w.runCounts[t];
    for (const r of (w.runs || [])) legB[r.type] += 1;
  }
  const agree = RUN_TYPES.every((t) => legA[t] === legB[t]);
  if (!agree) controlFails++;

  // ── the SUCCESSOR tally
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const pub = publishWallWorks(P, pubOpts(settlement, fabric, input, { site: !has('blind') }));

  add(legacyTotal, legA);
  add(succTotal, pub.counts);
  rows.push({
    key, tier: fabric.meta.tier, terrain: spec.terrain || null,
    legacyCircuits: (fabric.walls || []).length, succCircuits: pub.circuits.length,
    legacy: legA, successor: { ...pub.counts }, tallyAgrees: agree,
    ungrounded: Object.keys(pub.ungrounded), wetVerts: pub.wrapVerticesInWater,
    wear: pub.circuits.map((c) => `${c.wear.grade}/${c.wear.age}`),
  });
  const fmt = (o) => RUN_TYPES.filter((t) => o[t]).map((t) => `${t}:${o[t]}`).join(' ') || '—';
  if (pub.wrapVerticesInWater) console.log(`   ⛔ ${key}: ${pub.wrapVerticesInWater} wrap vertex/vertices INSIDE a water face`);
  console.log(`${key.padEnd(12)} ${String(fabric.meta.tier).padEnd(11)}`
    + ` legacy[${(fabric.walls || []).length}c] ${fmt(legA).padEnd(58)}`
    + ` successor[${pub.circuits.length}c] ${fmt(pub.counts)}`
    + (agree ? '' : '  ⛔ TALLY CONTROL DISAGREES'));
}

console.log('\n── CORPUS TOTALS BY TYPE ──────────────────────────────────────────────────');
console.log(`${'type'.padEnd(20)} ${'legacy'.padStart(7)} ${'successor'.padStart(10)}  verdict`);
let lostTotal = 0;
for (const t of RUN_TYPES) {
  const L = legacyTotal[t]; const S = succTotal[t];
  const lost = L > 0 && S === 0;
  if (lost) lostTotal += L;
  console.log(`${t.padEnd(20)} ${String(L).padStart(7)} ${String(S).padStart(10)}  `
    + (lost ? '⛔ LOST — the legacy finds it and the successor never mints one' : (L || S ? 'carried' : 'neither')));
}
console.log(`\nLOST_SIGNAL total=${lostTotal} runs on types the successor mints ZERO of`);
console.log(`TALLY_CONTROL leaves=${rows.length} disagreements=${controlFails}`
  + (controlFails ? ' ⛔ the two legacy reads disagree — this instrument cannot be trusted'
    : ' — both independent legacy reads agree, so the tally is live'));

const out = arg('json', '');
if (out) writeFileSync(out, JSON.stringify({ rows, legacyTotal, succTotal, lostTotal }, null, 1));
