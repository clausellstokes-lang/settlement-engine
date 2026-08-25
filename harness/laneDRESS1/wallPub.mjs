#!/usr/bin/env node
/**
 * harness/laneDRESS1/wallPub.mjs — DRESS-1 · the wall successor publication over the corpus,
 * and the derivation it feeds. Usage: node harness/laneDRESS1/wallPub.mjs [--leaves=a,b] [--json=]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks, rampartArgsFor } from '../../src/domain/townMap/fabric/wallPublication.js';
import { deriveRampartWorks } from '../../src/domain/townMap/fabric/rampartWorks.js';
import { wallForm } from '../../src/domain/townMap/fabric/walls.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/**
 * ⭐⭐ **PA.5's PRECONDITION, DISCHARGED: i6's DENOMINATOR GAINS ITS PARTITION EQUIVALENT.**
 * PA.5: *"i6's denominator gains its partition equivalent (a `--checkcircuit` against the
 * BAND-FACE RING) before its first partition record."*
 *
 * On the legacy substrate `regI1-i6corpus.mjs --checkcircuit` asks whether ARMING moves the ring
 * the intramural denominator is measured inside — because a denominator that changes with the arm
 * makes a delta a comparison of two different questions. The partition equivalent asks the same
 * question of the BAND FACE: does the wrap's own outer ring move between an unarmed build and one
 * built with every fabric arm this estate carries?
 *
 * ⛔ AND THE CONTROL IS PLANTED IN THE SAME PASS: a deliberately perturbed ring must be reported
 * as MOVED, because "0 moved" from a comparator that cannot see movement is the vacuous-mask class
 * PA.5 exists to pre-kill.
 */
function checkCircuit(keys) {
  const ARMS = {
    frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true,
    minFootprint: true, waterfrontExemption: true, quayRegister: true,
    riverProfile: true, deckLaw: true, fordRegister: true,
  };
  console.log('── CIRCUIT CONTROL · does ARMING move the BAND-FACE ring the i6 denominator sits inside?');
  let moved = 0; let walled = 0;
  for (const key of keys) {
    const spec = CORPUS.find((s) => s.key === key);
    const bare = buildOne(spec);
    const armed = buildOne(spec, ARMS);
    const A = buildSettledPartition(partitionInputs(bare.settlement, bare.model, bare.fabric));
    const B = buildSettledPartition(partitionInputs(armed.settlement, armed.model, armed.fabric));
    if (!A.wraps.length && !B.wraps.length) continue;
    walled++;
    const ra = A.wraps.map((w) => w.outer);
    const rb = B.wraps.map((w) => w.outer);
    let delta = 0;
    if (ra.length !== rb.length) delta = 1e9;
    else {
      for (let i = 0; i < ra.length; i++) {
        if (ra[i].length !== rb[i].length) { delta = 1e9; break; }
        for (let j = 0; j < ra[i].length; j++) {
          delta = Math.max(delta, Math.abs(ra[i][j][0] - rb[i][j][0]), Math.abs(ra[i][j][1] - rb[i][j][1]));
        }
      }
    }
    if (delta > 1e-9) moved++;
    console.log(`   ${key.padEnd(12)} wraps ${ra.length}→${rb.length}  verts`
      + ` ${ra.reduce((s, r) => s + r.length, 0)}→${rb.reduce((s, r) => s + r.length, 0)}`
      + `  max vertex Δ ${delta >= 1e9 ? 'STRUCTURE CHANGED' : delta.toFixed(12)}`
      + `  ${delta > 1e-9 ? '⛔ MOVED' : 'IDENTICAL'}`);
    // ⛔ THE PLANT, on this same leaf's ring — the comparator must call a perturbed ring MOVED
    if (walled === 1) {
      const p = ra.map((r) => r.map((q, j) => (j === 0 ? [q[0] + 0.5, q[1]] : q)));
      let pd = 0;
      for (let i = 0; i < ra.length; i++) {
        for (let j = 0; j < ra[i].length; j++) pd = Math.max(pd, Math.abs(ra[i][j][0] - p[i][j][0]));
      }
      console.log(`   ${'(plant)'.padEnd(12)} one vertex nudged 0.5 u → max Δ ${pd.toFixed(3)}`
        + `  ${pd > 1e-9 ? 'REPORTED AS MOVED (the comparator is LIVE)' : '⛔ COMPARATOR DEAD'}`);
    }
  }
  console.log(`CIRCUIT_CONTROL walled=${walled} moved=${moved}`
    + ` — ${moved ? '⛔ the band-face denominator is ARM-DEPENDENT' : 'the band-face ring is ARM-INDEPENDENT, so an i6 partition record has a fixed denominator'}`);
  return moved;
}

if (has('checkcircuit')) {
  const m = checkCircuit(leaves);
  process.exitCode = m ? 1 : 0;
  process.exit(process.exitCode);
}
const rows = [];
for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const form = wallForm(settlement, fabric.meta.tier).form;
  const pub = publishWallWorks(P, {
    form, frontage: input.roadWidth, seed: input.seed, year: fabric.meta.presentYear || null,
  });
  let joints = 0; let gatehouses = 0; let frags = 0; let towers = 0; let runs = 0;
  for (const c of pub.circuits) for (const f of c.fragments) {
    frags++; runs += f.runs.length; towers += f.towers.length;
    const W = deriveRampartWorks(rampartArgsFor(f, c, { seeding: { seed: input.seed } }));
    joints += W.joints.length; gatehouses += W.gatehouses.length;
  }
  rows.push({ key, tier: fabric.meta.tier, form, circuits: pub.circuits.length, frags, runs, towers, joints, gatehouses,
    counts: pub.counts, wear: pub.circuits.map((c) => c.wear.grade) });
  console.log(`${key.padEnd(12)} ${fabric.meta.tier.padEnd(11)} form ${form.padEnd(9)} circuits ${pub.circuits.length}`
    + ` frags ${frags} runs ${String(runs).padStart(3)} towers ${String(towers).padStart(3)}`
    + ` joints ${String(joints).padStart(3)} gatehouses ${gatehouses}`
    + `  [${Object.entries(pub.counts).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(' ')}]`);
}
const out = arg('json', ''); if (out) writeFileSync(out, JSON.stringify(rows, null, 1));
