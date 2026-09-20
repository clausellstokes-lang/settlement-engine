/**
 * X7 — multi-producer keys: which production does the record hold, and which pin placement
 * reproduces it.
 *
 * ⛔ CONTEXT: `generatePopulation` is the ONLY step that consults `ctx.__pins`
 * (`git grep -n '__pins\|chooseOrPin' -- src`), so `options.pins` cannot hold any of these keys
 * today — a pin merely seeds ctx and the producing step overwrites it. The placements below are
 * therefore measured with an `onStep` RESTORE, which is the scratch stand-in for "this producer
 * consults the pin".
 *
 * usage: node --import ./hook.mjs x7-multiproducer.mjs
 */
import { instrumentedRoot, runHeadless, getStepOrder, getStepMeta } from './instrument.mjs';
import { h, clone, keyOf, sample63 } from './lib.mjs';

const order = getStepOrder();
const META = getStepMeta();
const KEYS = ['stress', 'stressTypes', 'generationRepairs', 'isolationSupport', 'economicState'];
const producers = Object.fromEntries(KEYS.map(k => [k,
  order.filter(s => { const m = META.find(x => x.name === s); return m.provides.includes(k) || m.mutates.includes(k); })]));
// where the key lands on the record
const RECORD_AT = {
  stress: (r) => r.stress,
  stressTypes: (r) => r.config?.stressTypes,
  generationRepairs: (r) => r.generationCoherenceReceipt?.repairs ?? undefined,
  isolationSupport: (r) => r.isolationSupport,
  economicState: (r) => r.economicState,
};

console.log('=== X7 — producers per key (run order) ===');
for (const k of KEYS) console.log(`  ${k}: ${producers[k].map(s => `${s}(${META.find(x => x.name === s).provides.includes(k) ? 'provides' : 'mutates'})`).join(' → ')}`);

const ROWS = sample63();

// ── A: which production equals the record's value? ──────────────────────────
console.log('\n=== X7.A — which production does the RECORD hold? (rows of 63 where the post-step value equals the record) ===');
console.log('key\t' + 'per-producer match (and the value AFTER the last step, i.e. the final ctx)');
const matches = new Map(KEYS.map(k => [k, new Map()]));
for (const row of ROWS) {
  const snaps = new Map();
  const ctx = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, c) => { for (const k of KEYS) if (producers[k].includes(name)) snaps.set(`${name}|${k}`, h(c[k])); },
  });
  const rec = ctx.settlement;
  for (const k of KEYS) {
    const target = h(RECORD_AT[k](rec));
    for (const s of producers[k]) {
      const id = `${s}|${k}`;
      if (snaps.get(id) === target) matches.get(k).set(s, (matches.get(k).get(s) || 0) + 1);
    }
    const fin = h(ctx[k]);
    if (fin === target) matches.get(k).set('FINAL ctx', (matches.get(k).get('FINAL ctx') || 0) + 1);
  }
}
for (const k of KEYS) {
  console.log(`${k}\t${[...matches.get(k).entries()].map(([s, n]) => `${s}:${n}/${ROWS.length}`).join('  ') || '(no producer\'s value ever equals the record\'s)'}`);
}

// ── B: pin placement — first / last / every producer ────────────────────────
console.log('\n=== X7.B — which RESTORE placement reproduces the whole record? (63 rows) ===');
console.log('key\tplacement\treproduces\tkeys that diverge');
for (const k of KEYS) {
  const places = [['first producer', [producers[k][0]]], ['last producer', [producers[k][producers[k].length - 1]]], ['every producer', producers[k]]];
  for (const [label, steps] of places) {
    let ok = 0; const bad = new Map();
    for (const row of ROWS) {
      const rec = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
      const target = h(rec);
      const held = clone(RECORD_AT[k](rec));
      let out;
      try {
        out = runHeadless(row, instrumentedRoot(row._seed).root, {
          onStep: (name, c) => { if (steps.includes(name)) c[k] = clone(held); },
        }).settlement;
      } catch (e) { bad.set(`THREW:${e.message.slice(0, 40)}`, (bad.get('THREW') || 0) + 1); continue; }
      if (h(out) === target) { ok += 1; continue; }
      for (const kk of new Set([...Object.keys(rec), ...Object.keys(out)])) if (h(rec[kk]) !== h(out[kk])) bad.set(kk, (bad.get(kk) || 0) + 1);
    }
    console.log(`${k}\t${label} [${steps.join(',')}]\t${ok}/${ROWS.length}\t${[...bad.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([x, n]) => `${x}×${n}`).join(' ') || '—'}`);
  }
}
