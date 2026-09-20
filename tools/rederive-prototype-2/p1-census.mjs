/**
 * P1 — THE WRITER CENSUS. For every HELD key of §22 ruling 1, every function that WRITES it
 * during `generateSettlementPipeline`.
 *
 * Three instruments, so a writer that hides from one is caught by another:
 *   A. DECLARED — `getStepMeta()`'s provides/mutates.
 *   B. MEASURED VALUE CHANGE — after every step, hash each held key; a step whose hash differs
 *      from the previous step's WROTE it (this catches undeclared writers).
 *   C. MEASURED WRITE-THROUGH — hold the LIVE object reference of each held key after a step
 *      alongside a deep clone; after the next step compare the held reference's CURRENT content
 *      with that clone. A difference means the next step wrote THROUGH the caller's object
 *      (the frozen-clone control; the first recon's X4 method).
 *   D. FUNCTION-LEVEL — the loader's in-memory wrappers inside `assembleSettlement`: which
 *      wrapped symbol changed which held key, by in-place delta (arg0 before vs after) and by
 *      returned-patch delta.
 *   E. ASSERTS — every assertion that compares a held fact with a fresh derivation, with the
 *      call site and whether it fired in this run.
 *
 * usage: node --import ./hook3.mjs p1-census.mjs [rows]
 */
import { instrumentedRoot, runHeadless, getStepOrder, getStepMeta } from './instrument.mjs';
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';

const HELD = ['institutions', 'npcs', 'factions', 'relationships', 'conflicts', 'powerStructure', 'name', 'config'];
// `name` and `config` live only on the RECORD, not on ctx; their ctx analogues:
const CTX_HELD = ['institutions', 'npcs', 'factions', 'relationships', 'conflicts', 'powerStructure', 'effectiveConfig', 'culture'];
const order = getStepOrder();
const META = getStepMeta();
const ROWS = sample63().slice(0, Number(process.argv[2] || 63));

console.log(`=== P1.A — DECLARED writers (getStepMeta), ${order.length} steps ===`);
for (const k of CTX_HELD) {
  const prov = META.filter(m => (m.provides || []).includes(k)).map(m => m.name);
  const mut = META.filter(m => (m.mutates || []).includes(k)).map(m => m.name);
  console.log(`${k.padEnd(16)} provides=[${prov.join(', ')}]  mutates=[${mut.join(', ')}]`);
}

// ── B + C over the sample ────────────────────────────────────────────────────
const changed = new Map();   // `${step}|${key}` -> rows
const through = new Map();   // `${step}|${key}` -> rows
const drawsAt = new Map();   // step -> total draws (for the skip-vs-consume question)

for (const row of ROWS) {
  const { root, perStep } = instrumentedRoot(row._seed);
  let prevHash = new Map();
  let live = new Map();      // key -> { ref, clone }
  runHeadless(row, root, {
    onStep: (name, ctx) => {
      // C: did THIS step write through an object a previous step handed forward?
      for (const [k, rec] of live) {
        if (ctx[k] !== rec.ref) continue;              // replaced, not mutated — B catches it
        if (h(rec.ref) !== rec.hash) {
          through.set(`${name}|${k}`, (through.get(`${name}|${k}`) || 0) + 1);
        }
      }
      // B: value change since the previous step
      for (const k of CTX_HELD) {
        const now = h(ctx[k]);
        if (prevHash.has(k) ? prevHash.get(k) !== now : ctx[k] !== undefined) {
          changed.set(`${name}|${k}`, (changed.get(`${name}|${k}`) || 0) + 1);
        }
        prevHash.set(k, now);
      }
      live = new Map(CTX_HELD.filter(k => ctx[k] && typeof ctx[k] === 'object')
        .map(k => [k, { ref: ctx[k], hash: h(ctx[k]) }]));
    },
  });
  for (const [step, rec] of perStep) drawsAt.set(step, (drawsAt.get(step) || 0) + rec.draws);
}

console.log(`\n=== P1.B — MEASURED value change, per (step, held key), over ${ROWS.length} rows ===`);
console.log('step|key\trows\tdeclared?\tstep draws (total over sample)');
const declaredFor = (step, key) => {
  const m = META.find(x => x.name === step);
  if (!m) return '—';
  if ((m.provides || []).includes(key)) return 'provides';
  if ((m.mutates || []).includes(key)) return 'mutates';
  return '⛔ UNDECLARED';
};
for (const [kk, n] of [...changed.entries()].sort((a, b) => b[1] - a[1])) {
  const [step, key] = kk.split('|');
  console.log(`${kk}\t${n}/${ROWS.length}\t${declaredFor(step, key)}\t${drawsAt.get(step) || 0}`);
}

console.log(`\n=== P1.C — MEASURED WRITE-THROUGH (the caller's object mutated), per (step, held key) ===`);
for (const [kk, n] of [...through.entries()].sort((a, b) => b[1] - a[1])) {
  const [step, key] = kk.split('|');
  console.log(`${kk}\t${n}/${ROWS.length}\t${declaredFor(step, key)}`);
}

// ── D: function-level, inside assembleSettlement ─────────────────────────────
console.log('\n=== P1.D — FUNCTION-LEVEL writers inside assembleSettlement (loader wrappers) ===');
const EC = globalThis.__ENRICH_CENSUS__;
const DROWS = [
  sample63().find(r => r.settType === 'thorp'),
  sample63().find(r => r.settType === 'village'),
  sample63().find(r => r.settType === 'town'),
  sample63().find(r => r.settType === 'city'),
  sample63().find(r => r.settType === 'metropolis'),
];
for (const row of DROWS) {
  EC.reset(); EC.on = false;
  runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name) => { if (name === 'structuralValidationPass') EC.on = true; },
  });
  EC.on = false;
  console.log(`\n--- ${keyOf(row)} ---`);
  console.log('call#  symbol                          inPlaceDelta(arg0)            returnDelta / shape');
  EC.calls.forEach((c, i) => {
    const ip = pathDiff(c.before, c.after);
    const ipn = ip.added.length + ip.changed.length + ip.removed.length;
    let retNote;
    if (c.retIsArg0) retNote = 'ret===arg0';
    else if (c.ret && typeof c.ret === 'object' && !Array.isArray(c.ret)) {
      const keys = Object.keys(c.ret);
      const heldTouched = keys.filter(k => HELD.includes(k) || CTX_HELD.includes(k));
      retNote = `ret keys: {${keys.slice(0, 8).join(',')}${keys.length > 8 ? ',…' : ''}}${heldTouched.length ? `  ⛔ HELD: ${heldTouched.join(',')}` : ''}`;
    } else if (Array.isArray(c.ret)) retNote = `ret array len=${c.ret.length}`;
    else retNote = `ret ${JSON.stringify(c.ret)?.slice(0, 40)}`;
    console.log(`${String(i).padStart(4)}   ${c.fn.padEnd(30)} ${String(ipn).padStart(4)} ${ipn ? `[${fmtTally([...ip.added, ...ip.changed, ...ip.removed], 3)}]`.padEnd(24) : ''.padEnd(24)}  ${retNote}`);
  });
}
