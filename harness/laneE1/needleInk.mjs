#!/usr/bin/env node
/**
 * harness/laneE1/needleInk.mjs — ⭐⭐⭐ REG-E1 · **IS THE NEEDLE ON THE JUDGED PAGE, AND AS WHAT?**
 *
 * ⛔ §710.6's law, applied to this lane: a census that asks whether a ring EXISTS has not asked
 * whether it is INKED. `partitionDress` gives an inner circuit one of two dispositions —
 *   · `dress-band`   a FILLED band with coursing, comb, ditch, stairs, towers and gates: the mark
 *                    that says **A WALL STANDS HERE**;
 *   · `dress-relict` a dashed BOUND line: the mark that says a wall STOOD here and was robbed.
 * and it picks the second only for a ring that is BOTH not-outermost AND `wear.grade === 'crumbling'`.
 * So the same needle is a standing fortification on one leaf and a property boundary on another,
 * decided by an age arithmetic that has nothing to do with the ring's geometry. This says which.
 *
 * ⚠ SURFACE: the JUDGED DRESS PAGE (`harness/laneDRESS1/renderPage.mjs` → `dressLeaf`), never the
 * legacy folio. ⚠ ARM IT in the SHELL (REG-F0 J-F0-3).
 */
import { CORPUS } from '../exemplars.mjs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { measureRing } from '../laneDRESS1B/ringSanity.mjs';
import { assertArm } from '../laneREGF0/armGuard.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
const wantArm = !process.argv.includes('--dormant');
const state = assertArm(wantArm);
console.log(`ARM GUARD · armed=${state.armed} marketRegister=${state.marketRegister} parcels=${state.parcels} tier=${state.tier}\n`);

const f2 = (v) => (Number.isFinite(v) ? v.toFixed(2) : '—');
console.log(`${'leaf'.padEnd(12)}${'circuit'.padEnd(8)}${'year'.padStart(6)}${'age'.padStart(6)}`
  + `${'wear'.padStart(11)}${'score'.padStart(7)}${'frags'.padStart(6)}${'closed'.padStart(7)}`
  + `${'minRect'.padStart(10)}${'obbAsp'.padStart(7)}${'stone'.padStart(7)}${'bandW'.padStart(7)}`
  + `${'towers'.padStart(7)}${'gates'.padStart(6)}  DISPOSITION ON THE JUDGED PAGE`);
for (const key of leaves) {
  let r;
  try { r = dressLeaf(key); } catch (e) { console.log(`${key.padEnd(12)}⛔ THREW: ${e.message}`); continue; }
  const cs = r.walls && r.walls.circuits ? r.walls.circuits : [];
  if (!cs.length) { console.log(`${key.padEnd(12)}${'—'.padEnd(8)}  NO CIRCUITS`); continue; }
  for (const c of cs) {
    const outermost = c.index === cs[cs.length - 1].index;
    const crumbling = c.wear && c.wear.grade === 'crumbling';
    const disposition = (!outermost && crumbling) ? 'dress-relict (a dashed BOUND — robbed)'
      : 'dress-band (A FILLED WALL BAND — a standing fortification)';
    const m = measureRing(c.ring.map((p) => [p[0], p[1]]));
    const nT = c.fragments.reduce((s, f) => s + f.towers.length, 0);
    const nG = c.fragments.reduce((s, f) => s + f.gates.length, 0);
    const closed = c.fragments.filter((f) => f.closed).length;
    console.log(`${key.padEnd(12)}${`E${c.index}${outermost ? '*' : ''}`.padEnd(8)}${String(c.vintage).padStart(6)}`
      + `${String(c.wear && c.wear.age != null ? c.wear.age : '—').padStart(6)}`
      + `${String(c.wear ? c.wear.grade : '—').padStart(11)}${f2(c.wear && c.wear.score).padStart(7)}`
      + `${String(c.fragments.length).padStart(6)}${String(closed).padStart(7)}`
      + `${`${Math.round(m.obb.w)}x${Math.round(m.obb.h)}`.padStart(10)}${f2(m.obb.aspect).padStart(7)}`
      + `${f2(c.band.stone).padStart(7)}${f2(c.band.width).padStart(7)}`
      + `${String(nT).padStart(7)}${String(nG).padStart(6)}  ${disposition}`);
  }
  const ce = r.dress.census;
  console.log(`${''.padEnd(12)}└─ dress census: bandFaces ${ce.bandFaces} · relictDressed ${ce.relictDressed}`
    + ` · relictSuppressed ${ce.relictSuppressed} · towers ${ce.towers} · gatehouses ${ce.gatehouses}`
    + ` · coursing ${ce.coursing}`);
}
