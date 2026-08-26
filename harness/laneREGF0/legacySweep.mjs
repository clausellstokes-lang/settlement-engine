#!/usr/bin/env node
/**
 * harness/laneREGF0/legacySweep.mjs — ⭐⭐⭐ REG-F0 · **THE LEGACY SWEEP (A14.1).**
 *
 * ⭐ THE SURFACE, STATED BEFORE THE ARMS (§714.1). There are TWO corpora and this sweep is the
 * INVENTORY OF THE GAP BETWEEN THEM:
 *   · LEGACY FOLIO      `exemplars.mjs` → `renderFolio` — the surface that STILL SHIPS.
 *   · PARTITION DRESS   `renderPage.mjs` → `dressLeaf`  — the surface under judgement until the port.
 * Both are rendered here FROM ONE BUILD per leaf (`dressLeaf` publishes its own `fabric`), so a
 * row can never compare two different worlds.
 *
 * ⭐ ARMS: the full-arm set (`wordsCensus.FABRIC_ARMS`), `--river` included, plus the folio's
 * `words` RENDER option. Both surfaces read the SAME armed fabric.
 *
 * ⚠ THIS IS A **DISCOVERY** ARM, NOT A REGRESSION ARM. It sets no pass bar; it enumerates and
 * attributes. The regression arm this lane lands is `tests/lint/legacyEmitters.walker.test.js`.
 *
 * ⛔ IT DELETES NOTHING AND EDITS NO PAINTER. "Retires" in this lane's manifest means RETIRES AT
 * THE CUTOVER, which is the owner's flag (§7) — the folio is the shipping surface today.
 *
 * Usage: node harness/laneREGF0/legacySweep.mjs [--json=<path>] [--leaves=a,b] [--dormant]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { renderFolio } from '../renderFolio.mjs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { FABRIC_ARMS, assertArm, ARM_ENV } from './armGuard.mjs';
import { scanGroups } from './svgGroups.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const has = (n) => process.argv.includes(`--${n}`);
const ARMED = !has('dormant');
const ARM_STATE = assertArm(ARMED);
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

/** ⚠ `dressLeaf` builds through `buildOne(spec)`, which reads `REG_FABRIC_OPTS` — so the ONE
 *  honest way to arm BOTH surfaces off one build is to set the env before it is called. Doing it
 *  here rather than at the shell keeps the arm INSIDE the artifact that reports it. */

const rows = [];
for (const key of leaves) {
  const r = dressLeaf(key, 'parchment');
  const folio = renderFolio(r.fabric, { lens: 'parchment', words: ARMED });
  const F = scanGroups(folio.svg);
  const D = scanGroups(r.svg);
  rows.push({
    key, tier: r.tier,
    folio: {
      bytes: Buffer.byteLength(folio.svg, 'utf8'),
      elements: folio.elementCount, primitives: folio.primitiveCount,
      scannedMarks: F.total, tags: F.tags,
      groups: F.groups
        .map((g) => ({ path: g.path, marks: g.marks, subpaths: g.subpaths, tags: g.tags })),
    },
    dress: {
      bytes: r.bytes, elements: r.ops, primitives: r.primitives,
      scannedMarks: D.total, tags: D.tags,
      groups: D.groups
        .map((g) => ({ path: g.path, marks: g.marks, subpaths: g.subpaths, tags: g.tags })),
    },
  });
  process.stdout.write(`${key.padEnd(12)} ${r.tier.padEnd(11)}`
    + ` folio els ${String(folio.elementCount).padStart(4)} prims ${String(folio.primitiveCount).padStart(6)}`
    + ` scanned ${String(F.total).padStart(4)} (${Object.keys(F.tags).length} tag kinds)`
    + `   dress els ${String(r.ops).padStart(4)} prims ${String(r.primitives).padStart(6)}`
    + ` scanned ${String(D.total).padStart(4)}\n`);
}

/* ── THE UNION INVENTORY (the census is the UNION of leaves, never one leaf) ───────────────── */
const folioG = new Map(), dressG = new Map();
for (const row of rows) {
  for (const g of row.folio.groups) {
    const e = folioG.get(g.path) || { path: g.path, leaves: 0, marks: 0, subpaths: 0, tags: {}, on: [] };
    e.leaves += 1; e.marks += g.marks; e.subpaths += g.subpaths; e.on.push(row.key);
    for (const [t, n] of Object.entries(g.tags)) e.tags[t] = (e.tags[t] || 0) + n;
    folioG.set(g.path, e);
  }
  for (const g of row.dress.groups) {
    const e = dressG.get(g.path) || { path: g.path, leaves: 0, marks: 0, subpaths: 0, tags: {}, on: [] };
    e.leaves += 1; e.marks += g.marks; e.subpaths += g.subpaths; e.on.push(row.key);
    for (const [t, n] of Object.entries(g.tags)) e.tags[t] = (e.tags[t] || 0) + n;
    dressG.set(g.path, e);
  }
}
const EMPTY = (e) => e.marks === 0 ? '  ⚠ PRESENT BUT EMPTY ON EVERY LEAF IT OPENS' : '';
const fmt = (e) => `${String(e.leaves).padStart(2)}/${leaves.length} leaves`
  + `  ${String(e.marks).padStart(5)} els  ${String(e.subpaths).padStart(6)} subpaths`
  + `  [${Object.entries(e.tags).map(([t, n]) => `${t}×${n}`).join(' ')}]`;

console.log(`\n══ LEGACY FOLIO — ${folioG.size} emitting group(s) over ${leaves.length} leaves ══`);
for (const e of [...folioG.values()].sort((a, b) => b.marks - a.marks)) console.log(`  ${e.path.padEnd(28)} ${fmt(e)}${EMPTY(e)}`);
console.log(`\n══ PARTITION DRESS — ${dressG.size} emitting group(s) over ${leaves.length} leaves ══`);
for (const e of [...dressG.values()].sort((a, b) => b.marks - a.marks)) console.log(`  ${e.path.padEnd(28)} ${fmt(e)}${EMPTY(e)}`);

const j = arg('json', '');
if (j) {
  writeFileSync(j, JSON.stringify({
    armed: ARMED, arms: ARMED ? FABRIC_ARMS : null, leaves, rows,
    folioGroups: [...folioG.values()], dressGroups: [...dressG.values()],
  }, null, 1));
  console.log(`\n-> ${j}`);
}
