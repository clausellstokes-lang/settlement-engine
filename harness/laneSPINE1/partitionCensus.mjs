#!/usr/bin/env node
/**
 * harness/laneSPINE1/partitionCensus.mjs — ⭐⭐⭐ SPINE-1 · **THE EXIT SHEET OVER THE CORPUS**, with
 * `--controls` for the planted-violation arms.
 *
 * The unit tests prove each census CONVICTS on a planted violation; this proves each one is GREEN
 * on every real leaf, which is the other half and the half a synthetic fixture cannot give. Both
 * numbers appear in the lane receipt.
 *
 * Usage: node harness/laneSPINE1/partitionCensus.mjs [--leaves=a,b,c] [--controls] [--json=<path>]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { censusPartition } from '../../src/domain/townMap/fabric/partitionCensus.js';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from './partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const has = (n) => process.argv.includes(`--${n}`);

const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
const rows = [];
let red = 0;
for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const c = censusPartition(P, { water: input.water });
  const page = projectPage(P, { roadWidth: input.roadWidth });
  const ok = c.ok && page.identity.ok;
  if (!ok) red++;
  const row = {
    key,
    tier: fabric.meta.tier,
    ok,
    plots: P.plots,
    runs: P.runCount,
    blocks: P.blocks.length,
    wraps: P.wraps.length,
    gates: P.gates.length,
    refusals: P.refusals.length,
    waterRefusals: P.waterRefusals,
    gateEconomyRefusals: P.gateEconomyRefusals,
    faces: P.faceCounts,
    edges: P.edgeCounts,
    e1: c.invariants.reason,
    e2: c.tangential.reason,
    e3: c.crossings.reason,
    e9: `${c.totality.annotated}/${c.totality.owed}`,
    identity: page.identity.reason,
    budget: page.budget,
    morphology: c.morphology,
  };
  rows.push(row);
  console.log(`${key.padEnd(12)} ${ok ? 'GREEN' : 'RED  '} plots ${String(P.plots).padStart(5)}`
    + ` masses ${String(page.masses.length).padStart(4)} shapes ${String(page.budget.shapes).padStart(5)}`
    + ` band ${page.budget.bandRatio.toFixed(2)} inBand ${(page.budget.inBandShare * 100).toFixed(0)}%`
    + ` gates ${P.gates.length} refus ${P.refusals.length}`);
  if (!ok) console.log(`             ${c.reason} | ${page.identity.reason}`);
}

if (has('controls')) {
  // ⛔ THE PLANTED CONTROLS, ON A REAL LEAF. Each must move its own count by exactly one and leave
  // the others alone — a control that moves two counts is measuring a collapse, not a plant.
  const spec = CORPUS.find((s) => s.key === 'town');
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const base = censusPartition(P, { water: input.water });
  console.log(`\nCONTROLS on 'town' — baseline ${base.ok ? 'GREEN' : 'RED'}`);
  const arr = P.arrangement;

  const keptType = arr.edges[7].type;
  arr.edges[7].type = 'PLANTED';
  const a = censusPartition(P, { water: input.water });
  console.log(`  untyped edge        → edge-totality ${a.invariants.arms.find((x) => x.arm === 'edge-totality').violations.length} (want 1)`);
  arr.edges[7].type = keptType;

  const plot = liveFaces(arr).find((f) => f.cls === 'PLOT');
  const keptPiece = plot.piece;
  plot.piece = -1;
  const b = censusPartition(P, { water: input.water });
  console.log(`  plot with no tenure → containment   ${b.invariants.arms.find((x) => x.arm === 'containment').violations.length} (want 1)`);
  plot.piece = keptPiece;

  const gate = liveFaces(arr).find((f) => f.cls === 'WAY' && f.attrs && f.attrs.gate);
  if (gate) {
    gate.attrs = { ...gate.attrs, gate: false };
    const d = censusPartition(P, { water: input.water });
    console.log(`  ungated crossing    → E3 ungated    ${d.crossings.ungated.length} (want 1)`);
    gate.attrs = { ...gate.attrs, gate: true };
  } else console.log('  ungated crossing    → SKIPPED: this leaf minted no gate');

  const key = Object.keys(P.annotations).find((k) => k.startsWith('plot.'));
  const mut = { ...P, annotations: { ...P.annotations } };
  delete mut.annotations[key];
  console.log(`  omitted annotation  → E9 orphans    ${censusPartition(mut, { water: input.water }).totality.orphans.length} (want 1)`);

  const f0 = liveFaces(arr)[0];
  const keptCls = f0.cls;
  f0.cls = 'WATER';
  console.log(`  reserved class      → reserved      ${censusPartition(P, { water: input.water }).reserved.faces.length} (want 1)`);
  f0.cls = keptCls;

  console.log(`  restored            → ${censusPartition(P, { water: input.water }).ok ? 'GREEN' : 'RED'} (want GREEN)`);
}

console.log(`\nRED leaves: ${red} of ${leaves.length}`);
const out = arg('json', '');
if (out) writeFileSync(out, JSON.stringify(rows, null, 1));
process.exitCode = red ? 1 : 0;
