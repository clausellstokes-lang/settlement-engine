/**
 * X3 — candidate seams, MEASURED (scratch wrappers only; the tree is never edited).
 *
 * Every seam is a way of running the SAME pipeline so that a saved RECORD's held facts come
 * back out unchanged. The control question is the no-edit one: with nothing edited, does the
 * seam reproduce the record byte for byte? A seam that cannot do that cannot be trusted to
 * compute an EDITED record either (X6 asks the edit question).
 *
 * usage: node --import ./hook2.mjs x3-seams.mjs [rows]
 */
import { instrumentedRoot, runHeadless, getStepOrder } from './instrument.mjs';
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';

const CH = ['npcs', 'relationships', 'factions', 'conflicts'];
const POP = 'generatePopulation';
const CORR = 'corruptionPass';
const PRE_ASSEMBLY = 'generateNarratives';
const order = getStepOrder();

// The ADDED path shapes X1.A measured, per key — the only inverse a record can support.
const ADDED = {
  npcs: new Set(['[].factionAffiliation', '[].structuralPosition', '[].activeConstraint', '[].settlementCondition', '[].structuralRank', '[].plotHooks[]', '[].secondaryAffiliation', '[].institution', '[].corruptionVector', '[].corruptTies']),
  factions: new Set(['[].members[].factionAffiliation', '[].members[].structuralPosition', '[].members[].activeConstraint', '[].members[].settlementCondition', '[].members[].structuralRank', '[].members[].secondaryAffiliation']),
  relationships: new Set(), conflicts: new Set(),
};
const collapse = (p) => p.replace(/\[\d+\]/g, '[]');
function strip(value, shapes, prefix = '') {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v, i) => strip(v, shapes, `${prefix}[${i}]`));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (shapes.has(collapse(p))) continue;
    out[k] = strip(v, shapes, p);
  }
  return out;
}

const restoreAfter = (rec, steps) => (name, ctx) => {
  if (!steps.includes(name)) return;
  for (const k of CH) ctx[k] = clone(rec[k]);
};

/** @type {Array<[string, string, (row:any, rec:any)=>{out:any, note?:string}]>} */
const SEAMS = [
  ['S0 post-step pins (control: not reachable from a record)', 'the value the STEP produced', (row, rec, post) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, { pins: clone(post) }).settlement,
  })],
  ['S1 record pins (EM-B2a as designed)', 'early pins, record values', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, { pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])) }).settlement,
  })],
  ['S2 (a) record pins DE-ENRICHED (added shapes stripped)', 'early pins, scratch inverse', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, { pins: Object.fromEntries(CH.map(k => [k, strip(clone(rec[k]), ADDED[k])])) }).settlement,
  })],
  ['S3 (b) LATE pins only: restore after the providing+mutating steps', 'no pins; restore', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, { onStep: restoreAfter(rec, [POP, CORR]) }).settlement,
  })],
  ['S4 (b\') LATE pins at assembly entry only', 'no pins; one restore', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, { onStep: restoreAfter(rec, [PRE_ASSEMBLY]) }).settlement,
  })],
  ['S5 (c) early pins + deep clone + restore after every providing/mutating step', 'pins final+isolated', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, {
      pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])),
      onStep: restoreAfter(rec, [POP, CORR]),
    }).settlement,
  })],
  ['S6 (c\') early pins + restore after EVERY step', 'maximum isolation', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, {
      pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])),
      onStep: restoreAfter(rec, order),
    }).settlement,
  })],
  ['S7 (d) early pins + corruptionPass undone (its output is already in the roster)', 'skip the drawing mutator', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, {
      pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])),
      onStep: restoreAfter(rec, [CORR]),
    }).settlement,
  })],
  ['S8 (new) early pins + the pin consulted INSIDE enrichNpcCoherence', 'enrichment behind the pin', (row, rec) => {
    globalThis.__FN_OVERRIDE__ = { enrichNpcCoherence: () => clone(rec.npcs) };
    try {
      return { out: runHeadless(row, instrumentedRoot(row._seed).root, { pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])) }).settlement };
    } finally { globalThis.__FN_OVERRIDE__ = null; }
  }],
  ['S9 (new) S8 + restore after corruptionPass', 'behind-the-pin + no re-mutation', (row, rec) => {
    globalThis.__FN_OVERRIDE__ = { enrichNpcCoherence: () => clone(rec.npcs) };
    try {
      return { out: runHeadless(row, instrumentedRoot(row._seed).root, {
        pins: Object.fromEntries(CH.map(k => [k, clone(rec[k])])),
        onStep: restoreAfter(rec, [CORR]),
      }).settlement };
    } finally { globalThis.__FN_OVERRIDE__ = null; }
  }],
  ['S10 PARTIAL pin: npcs only (the refusal bypassed via onStrictViolation)', 'root-half pin', (row, rec) => ({
    out: runHeadless(row, instrumentedRoot(row._seed).root, {
      pins: { npcs: clone(rec.npcs) },
      onStrictViolation: () => {},
    }).settlement,
  })],
];

const ROWS = process.argv[2] ? sample63().slice(0, Number(process.argv[2])) : sample63();
const results = SEAMS.map(([name, kind]) => ({ name, kind, ok: 0, n: 0, ms: 0, mutated: 0, keys: new Map(), threw: 0 }));

for (const row of ROWS) {
  let post = null;
  const base = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, c) => { if (name === POP) post = Object.fromEntries(CH.map(k => [k, clone(c[k])])); },
  });
  const rec = base.settlement;
  const target = h(rec);
  for (let i = 0; i < SEAMS.length; i += 1) {
    const r = results[i];
    const before = h(rec);
    const t0 = process.hrtime.bigint();
    let out;
    try { out = SEAMS[i][2](row, rec, post).out; } catch (e) { r.threw += 1; r.n += 1; r.keys.set(`THREW:${e.message.slice(0, 30)}`, (r.keys.get('THREW') || 0) + 1); continue; }
    r.ms += Number(process.hrtime.bigint() - t0) / 1e6;
    r.n += 1;
    if (h(rec) !== before) r.mutated += 1;
    if (h(out) === target) { r.ok += 1; continue; }
    for (const k of new Set([...Object.keys(rec), ...Object.keys(out)])) {
      if (h(rec[k]) !== h(out[k])) r.keys.set(k, (r.keys.get(k) || 0) + 1);
    }
  }
}

console.log(`=== X3 — seam comparison over ${ROWS.length} rows (the census recon's structured sample) ===\n`);
console.log('seam\treproduces\tcaller record mutated\tms/re-derivation\tkeys that still diverge (rows)');
for (const r of results) {
  const keys = [...r.keys.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}×${n}`).join(' ');
  console.log(`${r.name}\t${r.ok}/${r.n}\t${r.mutated}/${r.n}\t${(r.ms / Math.max(1, r.n)).toFixed(1)}\t${keys || '—'}`);
}

// A focused look at the residual divergence of the best seams on one failing row.
console.log('\n=== residual path-level divergence on one metropolis row, per seam ===');
const row = sample63().find(r => r.settType === 'metropolis');
{
  let post = null;
  const base = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, c) => { if (name === POP) post = Object.fromEntries(CH.map(k => [k, clone(c[k])])); },
  });
  const rec = base.settlement;
  for (const [name, , fn] of SEAMS) {
    let out; try { out = fn(row, rec, post).out; } catch (e) { console.log(`${name}: THREW ${e.message.slice(0, 60)}`); continue; }
    if (h(out) === h(rec)) { console.log(`${name}: IDENTICAL`); continue; }
    const parts = [];
    for (const k of new Set([...Object.keys(rec), ...Object.keys(out)])) {
      if (h(rec[k]) === h(out[k])) continue;
      const d = pathDiff(rec[k], out[k]);
      parts.push(`${k} ${d.added.length}+/${d.changed.length}~/${d.removed.length}- [${fmtTally([...d.added, ...d.changed, ...d.removed], 5)}]`);
    }
    console.log(`${name}:\n    ${parts.join('\n    ')}`);
  }
}
