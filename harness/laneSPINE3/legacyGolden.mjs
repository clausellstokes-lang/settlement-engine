#!/usr/bin/env node
/**
 * harness/laneSPINE3/legacyGolden.mjs — SPINE-3 · **THE LEGACY RUN CHAIN, CAPTURED WHOLE.**
 *
 * The SPINE-3 repair makes `wallRuns.js` the SINGLE WRITER of the run-classification ladder so
 * the successor publication can call it instead of carrying a second spelling. That refactor is
 * only admissible if the LEGACY path comes back byte-identical, so this captures the legacy
 * chain — every run's type, key, index list, length, tower positions and tower kinds, on every
 * walled leaf of the corpus — as one JSON blob to diff across the change.
 *
 * ⛔ THE CONTROL IS THE DIFF ITSELF: a golden that cannot detect a change proves nothing, so the
 * `--plant` arm perturbs one run's type before writing and the diff must convict it.
 *
 * Usage: node harness/laneSPINE3/legacyGolden.mjs --out=path [--plant] [--arms]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);

const ARMS = {
  frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true,
  minFootprint: true, waterfrontExemption: true, quayRegister: true,
  riverProfile: true, deckLaw: true, fordRegister: true,
};

const r6 = (v) => Math.round(v * 1e6) / 1e6;
const out = {};
let runTotal = 0; let towerTotal = 0;

for (const spec of CORPUS) {
  const { fabric } = buildOne(spec, has('arms') ? ARMS : undefined);
  const leaf = [];
  for (const w of fabric.walls || []) {
    leaf.push({
      kind: w.kind, epoch: w.epoch, form: w.form, halfRing: !!w.halfRing,
      verts: w.polygon.length,
      runCounts: w.runCounts,
      runReason: w.runReason,
      runOfVertex: w.runOfVertex,
      towerTypes: w.towerTypes,
      towers: (w.towers || []).map((t) => [r6(t[0]), r6(t[1])]),
      runs: (w.runs || []).map((r) => ({
        key: r.key, type: r.type, idx: r.idx, length: r6(r.length),
        towerPolicy: r.towerPolicy, thickness: r.thickness, ditch: r.ditch, lane: r.lane,
        laneWidth: r.laneWidth, straight: r.straight, corner: r.corner, cause: r.cause,
        towers: (r.towers || []).map((t) => ({ x: r6(t.x), y: r6(t.y), at: r6(t.at), kind: t.kind })),
      })),
    });
    runTotal += (w.runs || []).length;
    towerTotal += (w.towers || []).length;
  }
  out[spec.key] = leaf;
  console.log(`${spec.key.padEnd(12)} circuits ${leaf.length}`
    + ` runs ${leaf.reduce((s, c) => s + c.runs.length, 0)}`
    + ` towers ${leaf.reduce((s, c) => s + c.towers.length, 0)}`);
}

/**
 * ⛔⛔ THE PLANT — one run's type moved, so the diff has something it MUST convict.
 *
 * ⛔ **MY FIRST SPELLING OF THIS PLANT WAS DEAD, AND ONLY RUNNING IT FOUND THAT OUT.** It broke
 * out of the OUTER loop after the first key — and the first corpus key is `thorp`, which raises
 * **no circuit at all**, so the inner body never executed, nothing was planted, and the arm
 * printed nothing while exiting 0. ⭐ THE CLASS, and it is this lane's own charter turned on
 * itself: **a control that silently does nothing is indistinguishable from a control that found
 * nothing.** The cure is to walk until a leaf with runs is found and to FAIL LOUDLY if none is.
 */
if (has('plant')) {
  let planted = null;
  for (const k of Object.keys(out)) {
    for (const c of out[k]) {
      if (!c.runs.length) continue;
      c.runs[0].type = 'PLANTED-NOT-A-TYPE';
      planted = `${k}/E${c.epoch}`;
      break;
    }
    if (planted) break;
  }
  if (!planted) {
    console.error('⛔ PLANT COULD NOT BE APPLIED — no leaf carried a run. This control is DEAD.');
    process.exit(2);
  }
  console.log(`PLANT applied to ${planted} — the golden MUST now differ from an unplanted one`);
}

console.log(`GOLDEN leaves=${Object.keys(out).length} runs=${runTotal} towers=${towerTotal}`);
const dest = arg('out', '');
if (dest) { writeFileSync(dest, JSON.stringify(out, null, 1)); console.log(`written ${dest}`); }
