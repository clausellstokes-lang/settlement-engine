/**
 * P5.b2 / P3.e — THE DECISIVE VARIANT. Ruling 1 says "final at EVERY writer"; the first recon's
 * X7 measured that "pin at the LAST producer" is the placement that reproduces. This compares
 * them WITH the trace partition of ruling 8 on top, and then asks the question that decides
 * between them: **does an institution edit still reach the economy under `last`?**
 *
 * usage: node --import ./hook3.mjs p5b-placement.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive } from './seam.mjs';

const SAMPLE = sample63();
const H2 = ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
  'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass'];
const BASE = { nameMode: 'consume', relink: true };

const VARIANTS = [
  ['W1 every writer (ruling 1 literal), no trace partition', { ...BASE }],
  ['W2 every writer + ruling 8 trace partition', { ...BASE, part: true }],
  ['W3 LAST writer only, no trace partition', { ...BASE, placement: 'last' }],
  ['W4 LAST writer only + ruling 8 trace partition', { ...BASE, placement: 'last', part: true }],
];

console.log('=== P5.b2 — placement × trace partition, no edit, 63 rows ===');
for (const [label, opts] of VARIANTS) {
  let ok = 0; let n = 0; const keys = new Map(); let threw = 0;
  for (const row of SAMPLE) {
    const rec = generate(row);
    const o = { ...opts };
    if (o.part) { o.tracePartition = rec; o.heldStepsForTrace = H2; }
    delete o.part;
    const rr = tryRederive(row, heldOf(rec), o);
    n += 1;
    if (rr.err) { threw += 1; continue; }
    if (h(rr.out) === h(rec)) { ok += 1; continue; }
    for (const k of new Set([...Object.keys(rec), ...Object.keys(rr.out)])) if (h(rec[k]) !== h(rr.out[k])) keys.set(k, (keys.get(k) || 0) + 1);
  }
  console.log(`${label}\n    reproduces ${ok}/${n}  threw=${threw}  diverging keys: ${[...keys.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join(' ') || '—'}`);
}

console.log('\n=== P5.b3 — DOES THE EDIT STILL REACH THE READINGS under placement=last? ===');
for (const t of ['village', 'town', 'city']) {
  const row = SAMPLE.find(r => r.settType === t);
  const rec = generate(row);
  console.log(`\n--- ${keyOf(row)} ---`);
  for (const [pl, label] of [['every', 'every writer (ruling 1 literal)'], ['last', 'LAST writer only']]) {
    const o = { ...BASE, placement: pl, tracePartition: rec, heldStepsForTrace: H2 };
    const ctrl = tryRederive(row, heldOf(rec), o);
    if (ctrl.err) { console.log(`  ${label}: control THREW ${ctrl.err.slice(0, 60)}`); continue; }
    const ctrlSame = h(ctrl.out) === h(rec);
    // ADD an institution
    const H = heldOf(rec);
    const add = { ...clone(H.institutions[0]), name: `${H.institutions[0].name} Annexe`, catalogId: 'dm_annexe', source: 'dm' };
    H.institutions.push(add);
    const rr = tryRederive(row, H, o);
    // REMOVE an institution
    const H2b = heldOf(rec); const removed = H2b.institutions.splice(1, 1)[0];
    const rr2 = tryRederive(row, H2b, o);
    const moved = (a, b) => {
      const out = [];
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (h(a[k]) === h(b[k])) continue;
        const d = pathDiff(a[k], b[k]);
        out.push([k, d.added.length + d.changed.length + d.removed.length]);
      }
      return out.sort((x, y) => y[1] - x[1]);
    };
    const survived = (out, name) => (out.institutions || []).some(i => i.name === name);
    console.log(`  ${label}:`);
    console.log(`     no-edit control reproduces the record: ${ctrlSame}`);
    console.log(`     ADD "${add.name}": present in the output=${rr.err ? 'THREW' : survived(rr.out, add.name)}  ·`
      + ` keys moved vs control: ${rr.err ? rr.err.slice(0, 40) : moved(ctrl.out, rr.out).map(([k, n]) => `${k}:${n}`).join(' ') || 'NONE'}`);
    console.log(`     REMOVE "${removed?.name}": absent from the output=${rr2.err ? 'THREW' : !survived(rr2.out, removed?.name)}  ·`
      + ` keys moved vs control: ${rr2.err ? rr2.err.slice(0, 40) : moved(ctrl.out, rr2.out).map(([k, n]) => `${k}:${n}`).join(' ') || 'NONE'}`);
  }
}
