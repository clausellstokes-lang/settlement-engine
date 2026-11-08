#!/usr/bin/env node
/**
 * scripts/audit/stage-chain.mjs — ROWS MOVED BETWEEN TWO MEASURED STAGES, EVERY SURFACE (GOLDEN-REHEARSAL 2026-11-07 §2).
 *
 * `landing-stage.sh measure <stage> <out> <prev>` calls this after measuring: per surface it counts the keys moved,
 * added and removed between the previous stage's scratch dir and this one's. It reads scratch files only and writes
 * nothing. The rehearsal ran it as a scratch `chain.cjs`; this is that instrument on the tree.
 *
 *   node scripts/audit/stage-chain.mjs <prev-scratch-dir> <scratch-dir>
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [prev, cur] = process.argv.slice(2);
if (!prev || !cur) { console.error('usage: stage-chain.mjs <prev-scratch-dir> <scratch-dir>'); process.exit(2); }

const keyed = {
  'gm.json': (t) => JSON.parse(t),
  'herald.json': (t) => JSON.parse(t),
  'prose-rows.json': (t) => JSON.parse(t),
  'witness.json': (t) => { const w = JSON.parse(t); return Object.fromEntries(Object.entries(w.rows ?? {}).map(([k, v]) => [k, v])); },
  'fence.tsv': (t) => Object.fromEntries(t.trim().split('\n').filter(Boolean).map((row) => { const c = row.split('\t'); return [c[2], c[3]]; })),
  'pdf.snap': (t) => Object.fromEntries(t.split('\n').map((line, i) => [String(i), line])),
};

for (const [file, parse] of Object.entries(keyed)) {
  const a = join(prev, file); const b = join(cur, file);
  if (!existsSync(a) || !existsSync(b)) { console.log(JSON.stringify({ surface: file, missing: !existsSync(a) ? a : b })); continue; }
  const x = parse(readFileSync(a, 'utf8')); const y = parse(readFileSync(b, 'utf8'));
  let moved = 0; let added = 0;
  for (const k of Object.keys(y)) { if (!(k in x)) added += 1; else if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) moved += 1; }
  const removed = Object.keys(x).filter((k) => !(k in y)).length;
  console.log(JSON.stringify({ surface: file, rows: Object.keys(y).length, moved, added, removed }));
}
