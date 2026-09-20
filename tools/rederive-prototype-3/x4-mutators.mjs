/**
 * X4 — the mutators.
 *
 * A: WRITE-THROUGH detection, by a frozen-clone control. After every step the LIVE object
 *    reference of every ctx key is held alongside a deep clone; after the NEXT step the held
 *    reference's CURRENT content is compared with that clone. A difference proves the step
 *    wrote through an object that already existed — i.e. through anything a caller aliases.
 *    Run over every ctx key, not just the 18 declared `mutates` rows, so an undeclared
 *    write-through would also show.
 * B: ALIASED vs DEEP-CLONED pin bags over the 63-row sample: does the caller's own record
 *    change? And does the clone remove EVERY caller-side mutation?
 * C: what the clone costs.
 *
 * usage: node --import ./hook.mjs x4-mutators.mjs
 */
import { instrumentedRoot, runHeadless, getStepOrder, getStepMeta } from './instrument.mjs';
import { h, clone, pathDiff, fmtTally, keyOf, sample63, rows9 } from './lib.mjs';

const CH = ['npcs', 'relationships', 'factions', 'conflicts'];
const order = getStepOrder();
const META = new Map(getStepMeta().map(m => [m.name, m]));
const DECLARED = new Set();
for (const m of getStepMeta()) for (const k of m.mutates) DECLARED.add(`${m.name}|${k}`);

// ── A: write-through census ─────────────────────────────────────────────────
console.log('=== X4.A — which steps WRITE THROUGH an object that already existed (frozen-clone control) ===');
const hits = new Map(); // `${step}|${key}` -> rows
const ROWS = sample63();
for (const row of ROWS) {
  /** @type {Map<string,{ref:any, snap:string}>} */
  let held = new Map();
  runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, ctx) => {
      // 1. did THIS step write through anything held from before it ran?
      for (const [k, { ref, snap }] of held) {
        if (ref === null || typeof ref !== 'object') continue;
        if (h(ref) !== snap) {
          const id = `${name}|${k}`;
          hits.set(id, (hits.get(id) || 0) + 1);
        }
      }
      // 2. re-hold for the next step
      held = new Map();
      for (const k of Object.keys(ctx)) {
        const v = ctx[k];
        if (v === null || typeof v !== 'object') continue;
        held.set(k, { ref: v, snap: h(v) });
      }
    },
  });
}
console.log(`rows=${ROWS.length}`);
console.log('step|key\trows written through\tdeclared in `mutates`?');
for (const [id, n] of [...hits.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${id}\t${n}/${ROWS.length}\t${DECLARED.has(id) ? 'yes' : '⛔ NO'}`);
}
const silent = [...DECLARED].filter(id => !hits.has(id));
console.log(`\ndeclared \`mutates\` rows that NEVER wrote through a pre-existing object in ${ROWS.length} rows (they replace, not mutate): ${silent.length}/${DECLARED.size}`);
console.log(`  ${silent.join('  ')}`);

// ── B: aliased vs cloned pin bags ───────────────────────────────────────────
console.log('\n=== X4.B — ALIASED vs DEEP-CLONED pin bags: is the caller\'s record corrupted? ===');
let aliasMut = 0; let cloneMut = 0; let n = 0; const mutShapes = new Map(); const mutKeys = new Map();
for (const row of ROWS) {
  n += 1;
  // aliased
  const recA = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  const beforeA = h(recA); const deepBeforeA = clone(recA);
  runHeadless(row, instrumentedRoot(row._seed).root, { pins: Object.fromEntries(CH.map(k => [k, recA[k]])) });
  if (h(recA) !== beforeA) {
    aliasMut += 1;
    for (const k of CH) if (h(recA[k]) !== h(deepBeforeA[k])) {
      mutKeys.set(k, (mutKeys.get(k) || 0) + 1);
      const d = pathDiff(deepBeforeA[k], recA[k]);
      for (const p of [...d.added, ...d.changed, ...d.removed]) {
        const c = p.replace(/\[\d+\]/g, '[]');
        mutShapes.set(`${k}${c}`, (mutShapes.get(`${k}${c}`) || 0) + 1);
      }
    }
  }
  // cloned
  const recB = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  const beforeB = h(recB);
  runHeadless(row, instrumentedRoot(row._seed).root, { pins: Object.fromEntries(CH.map(k => [k, clone(recB[k])])) });
  if (h(recB) !== beforeB) cloneMut += 1;
}
console.log(`rows=${n}`);
console.log(`ALIASED pin bag  → caller's record MUTATED in ${aliasMut}/${n} rows`);
console.log(`CLONED pin bag   → caller's record MUTATED in ${cloneMut}/${n} rows`);
console.log(`record keys corrupted: ${[...mutKeys.entries()].map(([k, c]) => `${k}×${c}`).join(' ')}`);
console.log(`path shapes corrupted: ${[...mutShapes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([p, c]) => `${p}×${c}`).join(' ')}`);

// ── C: what the clone costs ─────────────────────────────────────────────────
console.log('\n=== X4.C — the cost of deep-cloning the pin bag ===');
console.log('tier\tbag bytes\tJSON clone ms\tstructuredClone ms\tfull re-derivation ms\tclone as % of a re-derivation');
for (const row of rows9()) {
  const rec = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  const bag = Object.fromEntries(CH.map(k => [k, rec[k]]));
  const bytes = JSON.stringify(bag).length;
  let t0 = process.hrtime.bigint();
  for (let i = 0; i < 20; i += 1) JSON.parse(JSON.stringify(bag));
  const jsonMs = Number(process.hrtime.bigint() - t0) / 1e6 / 20;
  t0 = process.hrtime.bigint();
  for (let i = 0; i < 20; i += 1) structuredClone(bag);
  const scMs = Number(process.hrtime.bigint() - t0) / 1e6 / 20;
  t0 = process.hrtime.bigint();
  for (let i = 0; i < 5; i += 1) runHeadless(row, instrumentedRoot(row._seed).root, { pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])) });
  const runMs = Number(process.hrtime.bigint() - t0) / 1e6 / 5;
  console.log(`${row.settType}\t${bytes}\t${jsonMs.toFixed(2)}\t${scMs.toFixed(2)}\t${runMs.toFixed(1)}\t${((jsonMs / runMs) * 100).toFixed(1)}%`);
}
