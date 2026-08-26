#!/usr/bin/env node
/**
 * harness/laneREGF0/stageAttribution.mjs — ⭐⭐⭐ REG-F0 · **WHICH LEGACY STAGE EMITTED WHICH MARK.**
 *
 * ⭐ THE QUESTION THIS ANSWERS AND NO SOURCE CENSUS CAN. Most of the folio's elements sit in NO
 * GROUP AT ALL, and a retirement manifest that cannot name the stage behind an ungrouped
 * `<path>` is a list of guesses. Every row below is a RUNTIME stack frame in `renderFolio.mjs`,
 * binned by the file's own `── N ·` stage headings, with group membership computed off the raw
 * draw list rather than re-parsed out of the concatenated string.
 *
 * ⛔ `prims.n` IS INCREMENTED AT ~140 SITES, of which the batcher's `add` is ONE. An earlier cut
 * of this instrument traced `add` alone and reported 3,624 primitives against a true 82,405 —
 * a 4.4 % reading that would have made every stage's share meaningless. The Proxy on `prims`
 * catches every write with its own stack; the total is asserted against `primitiveCount` below,
 * so an under-count cannot pass silently again.
 *
 * ⚠ DISCOVERY ARM. It sets no bar. Gated on `traceControl.mjs` (18/18 byte-identical + a planted
 * control), because attributing the wrong drawing is exactly the §714.1 failure.
 *
 * Usage: node harness/laneREGF0/stageAttribution.mjs [--json=<path>] [--dormant]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CORPUS } from '../exemplars.mjs';
import { buildTrace } from './makeTrace.mjs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { FABRIC_ARMS, assertArm, ARM_ENV } from './armGuard.mjs';

/** ⭐ the twin is REGENERATED, never read from disk stale — see makeTrace.mjs. */
buildTrace();
const { renderFolio: traced, __T, __resetTrace } = await import('./folioTrace.mjs');

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const armed = !process.argv.includes('--dormant');

const ARM_STATE = assertArm(armed);

/* ── THE STAGE TABLE, READ OUT OF THE FILE'S OWN HEADINGS ─────────────────────────────────── */
const SRC = readFileSync(join(HERE, '..', 'renderFolio.mjs'), 'utf8').split('\n');
const stages = [];
SRC.forEach((L, i) => {
  const m = L.match(/^\s*(?:\/\/|\/\*+)\s*──\s*(.*)$/);
  if (!m) return;
  const title = m[1].replace(/[⭐⛔⚠*]/g, '').replace(/\s+/g, ' ').trim();
  stages.push({ line: i + 1, title: title.slice(0, 88) });
});
/** ⚠ The batcher and the push/prims closures are INTERNAL frames — a trace that stopped there
 *  would attribute every batched mark to the batcher rather than to the stage that called it. */
const INTERNAL = new Set();
for (let n = 456; n <= 474; n++) INTERNAL.add(n);
for (let n = 671; n <= 676; n++) INTERNAL.add(n);
const stageOf = (line) => {
  let best = null;
  for (const s of stages) { if (s.line <= line) best = s; else break; }
  return best || { line: 0, title: '(module preamble)' };
};
const callerOf = (hits) => {
  for (const h of hits) if (!INTERNAL.has(h)) return h;
  return hits[hits.length - 1] || -1;
};

/** Walk the raw draw list once; return, per index, the group path in force AT that entry. */
function groupPaths(out) {
  const at = new Array(out.length);
  const stack = [];
  for (let i = 0; i < out.length; i++) {
    const s = out[i];
    at[i] = stack.length ? stack.join('/') : '(root)';
    if (/^<g[\s>]/.test(s)) {
      const m = s.match(/\bid="([^"]*)"/);
      if (!/\/>\s*$/.test(s) && !/<\/g>/.test(s)) stack.push(m ? m[1] : '(anon)');
    } else if (/^<\/g>/.test(s)) { stack.pop(); at[i] = stack.length ? stack.join('/') : '(root)'; }
  }
  return at;
}

/* ── THE RUN ──────────────────────────────────────────────────────────────────────────────── */
const byStage = new Map();
const ent = (line) => {
  const s = stageOf(line);
  let e = byStage.get(s.line);
  if (!e) {
    e = { line: s.line, title: s.title, elsRoot: 0, elsGrouped: 0, prims: 0, groups: new Set(), leaves: new Set() };
    byStage.set(s.line, e);
  }
  return e;
};
let primTotal = 0, declaredTotal = 0, elsTotal = 0, declaredEls = 0;
for (const spec of CORPUS) {
  const r = dressLeaf(spec.key, 'parchment');
  __resetTrace();
  const f = traced(r.fabric, { lens: 'parchment', words: armed });
  const at = groupPaths(f.__out);
  declaredTotal += f.primitiveCount; declaredEls += f.elementCount;
  for (const ev of __T) {
    const line = callerOf(ev.line);
    const e = ent(line); e.leaves.add(spec.key);
    if (ev.k === 'prim') { e.prims += ev.d; primTotal += ev.d; }
    else if (ev.k === 'push') {
      elsTotal += 1;
      const gp = at[ev.idx] || '(root)';
      if (gp === '(root)') e.elsRoot += 1; else { e.elsGrouped += 1; e.groups.add(gp); }
    } else if (ev.k === 'flush' && ev.id) e.groups.add(ev.id);
  }
  process.stdout.write('.');
}
process.stdout.write('\n');

const rows = [...byStage.values()].sort((a, b) => a.line - b.line);
console.log(`\n══ LEGACY FOLIO · MARKS BY EMITTING STAGE — 18 leaves, arm: ${armed ? 'FULL' : 'dormant'} ══`);
console.log('  line  root  in-g    prims  leaves  group(s)             stage');
let tR = 0, tG = 0, tP = 0;
for (const r of rows) {
  tR += r.elsRoot; tG += r.elsGrouped; tP += r.prims;
  console.log(`  ${String(r.line).padStart(4)} ${String(r.elsRoot).padStart(5)} ${String(r.elsGrouped).padStart(5)}`
    + ` ${String(r.prims).padStart(8)}  ${String(r.leaves.size).padStart(2)}/18  ${[...r.groups].join(',').padEnd(20)} ${r.title}`);
}
console.log(`  TOTAL ${String(tR).padStart(4)} ${String(tG).padStart(5)} ${String(tP).padStart(8)}`);

/* ── ⛔ THE ACCOUNTING ASSERTION — the reason the first cut of this instrument was caught. ─── */
const okP = primTotal === declaredTotal, okE = elsTotal === declaredEls;
console.log(`\nACCOUNTING · primitives traced ${primTotal} vs declared ${declaredTotal} — ${okP ? 'RECONCILED' : '⛔ SHORT BY ' + (declaredTotal - primTotal)}`);
console.log(`ACCOUNTING · elements   traced ${elsTotal} vs declared ${declaredEls} — ${okE ? 'RECONCILED' : '⚠ off by ' + (declaredEls - elsTotal)}`);

const j = arg('json', '');
if (j) {
  writeFileSync(j, JSON.stringify({
    armed, reconciled: { primTotal, declaredTotal, elsTotal, declaredEls },
    rows: rows.map((r) => ({ ...r, groups: [...r.groups], leaves: [...r.leaves] })),
  }, null, 1));
  console.log(`-> ${j}`);
}
