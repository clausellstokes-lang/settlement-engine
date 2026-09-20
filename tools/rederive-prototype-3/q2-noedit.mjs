/**
 * Q2 — with NO edit, merge(record, R0, R0) must equal the record. 63 rows.
 * usage: node --import ./hook3.mjs q2-noedit.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive } from './seam.mjs';
import { merge } from './merge.mjs';

const atPath = (root, p) => {
  let cur = root;
  for (const seg of String(p).split('.')) {
    if (cur === undefined || cur === null) return undefined;
    const m = seg.match(/^([^[]*)((\[\d+\])*)$/);
    if (!m) return undefined;
    if (m[1]) cur = cur[m[1]];
    for (const idx of (m[2] || '').matchAll(/\[(\d+)\]/g)) { if (cur === undefined || cur === null) return undefined; cur = cur[Number(idx[1])]; }
  }
  return cur;
};
const OPT = { nameMode: 'consume', relink: true, pinAwareAsserts: true, holdPower: true }; // placement = 'every' (the §22.1 seam)
const rows = sample63();
const t0 = Date.now();

const ARMS = [
  ['A  LITERAL leaf-by-leaf (no subtree short-circuit)', { heldFrom: 'edited', subtree: false }],
  ['B  subtree short-circuit, held from the EDITED record', { heldFrom: 'edited', subtree: true }],
  ['C  subtree short-circuit, held from R1', { heldFrom: 'R1', subtree: true }],
  ['D  subtree short-circuit, held keys MERGED too', { heldFrom: 'merge', subtree: true }],
];
for (const [label, MOPT] of ARMS) {
  const heldFrom = MOPT.heldFrom;
  let eq = 0; let threw = 0; const diverge = new Map(); let recMoved = 0;
  const settledTotal = []; let keptTotal = 0; let takenTotal = 0;
  const unkeyed = new Map(); const keyed = new Map(); let receiptMoved = 0;
  for (const row of rows) {
    const rec = generate(row);
    const held = heldOf(rec);
    const before = h(rec);
    const rr = tryRederive(row, held, OPT);
    if (rr.err) { threw += 1; continue; }
    const R0 = rr.out;
    const { out, stats } = merge(rec, R0, clone(R0), MOPT);
    if (h(rec) !== before) recMoved += 1;
    keptTotal += stats.keptRecord; takenTotal += stats.takenR1.length; settledTotal.push(...stats.settled);
    for (const [k, v] of stats.unkeyed) unkeyed.set(k, (unkeyed.get(k) || 0) + v);
    for (const [k, v] of stats.keyed) keyed.set(k, v);
    if (stats.receipt?.moved) receiptMoved += 1;
    if (h(out) === h(rec)) { eq += 1; continue; }
    for (const k of new Set([...Object.keys(rec), ...Object.keys(out)])) {
      if (h(rec[k]) === h(out[k])) continue;
      const d = pathDiff(rec[k], out[k]);
      const e = diverge.get(k) || { rows: 0, paths: [] };
      e.rows += 1; e.paths.push(...d.added, ...d.changed, ...d.removed);
      if (!e.sample) { const p0 = [...d.changed, ...d.added, ...d.removed][0]; e.sample = `${k}.${p0}  record=${JSON.stringify(atPath(rec[k], p0))?.slice(0,60)}  merged=${JSON.stringify(atPath(out[k], p0))?.slice(0,60)}`; }
      diverge.set(k, e);
    }
  }
  console.log(`\n=== Q2 arm ${label} — merge(record, R0, R0) === record ? ===`);
  console.log(`  rows=${rows.length}  EQUAL=${eq}/${rows.length}  threw=${threw}  caller record mutated=${recMoved}/${rows.length}`);
  console.log(`  leaves: kept-from-record=${keptTotal}  taken-from-R1=${takenTotal}  (R1===R0 so taken must be 0)`);
  console.log(`  settling CANCELLED by the merge (leaves where R0===R1 but the record differs): ${settledTotal.length}`);
  console.log(`  power fingerprint recomputed and MOVED: ${receiptMoved}/${rows.length}`);
  if (diverge.size) {
    for (const [k, e] of [...diverge.entries()].sort((a, b) => b[1].paths.length - a[1].paths.length)) {
      console.log(`    ⛔ ${k.padEnd(28)} rows=${e.rows} paths=${e.paths.length}  ${fmtTally(e.paths, 6)}`);
      if (e.sample) console.log(`        e.g. ${e.sample}`);
    }
  }
  if (label.startsWith('A')) {
    console.log(`  collections merged BY KEY (${keyed.size}):`);
    for (const [p, k] of [...keyed.entries()].sort()) console.log(`     ${p.padEnd(52)} key=${k}`);
    console.log(`  ⛔ object collections with NO key (merged POSITIONALLY), by path:`);
    for (const [p, n] of [...unkeyed.entries()].sort((a, b) => b[1] - a[1])) console.log(`     ${p.padEnd(52)} seen=${n}`);
  }
}
console.log(`\nwall=${Date.now() - t0} ms`);
