/**
 * p2-sample.mjs — the packet's CENSUS CORPUS, executed under the in-vitest instrument.
 *   (A) the 63-row structured sample: full 22-perturbation classification, wall clock, and the
 *       75-row verdict table, to be DIFFED against the recon's published Tier-1 literal.
 *   (B) the off-corpus block (the wizard's random modes).
 *   (C) mint/hash census variance across rows — is 35/96 a constant or a row property?
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

globalThis.__EMP2_MINTS__ = null; // recorder OFF for the classification
globalThis.__EMP2_HASH__ = null;
globalThis.__EMP2_FNV__ = null;

const { TREE, getStepMeta, getStepOrder, instrumentedRoot, runHeadless } = await import('./harness.mjs');
const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);

const order = getStepOrder();
const meta = new Map(getStepMeta().map((m) => [m.name, m]));
const h = (v) => {
  let s; try { s = JSON.stringify(v); } catch { s = String(v); }
  if (s === undefined) s = ' undefined';
  return createHash('sha1').update(s).digest('hex').slice(0, 16);
};

/** THE SAMPLE, exactly as the recon's `structured-min`: every (tier x terrain) once + the 21-row tail. */
const ALL = goldenCorpus();
function structuredMin(all) {
  const tail = all.slice(504);
  const oneEach = []; const seen = new Set();
  for (const r of all.slice(0, 504)) {
    const k = `${r.settType}|${r.terrainOverride}`;
    if (seen.has(k)) continue;
    seen.add(k); oneEach.push(r);
  }
  return [...oneEach, ...tail];
}
const SAMPLE = structuredMin(ALL);
console.log(`=== (A) the sample: ${SAMPLE.length} rows (grid ${SAMPLE.length - 21} + tail 21) of ${ALL.length} ===`);

function capture(row, perturbStep) {
  const inst = instrumentedRoot(row._seed, { perturbStep });
  const seen = new Map();
  runHeadless(row, inst.root, {
    onStep: (name, ctx) => {
      const m = meta.get(name);
      const bag = {};
      for (const k of new Set([...m.provides, ...m.mutates])) bag[k] = k in ctx ? h(ctx[k]) : ' ABSENT';
      seen.set(name, bag);
    },
  });
  return { seen, perStep: inst.perStep };
}

const table = new Map();
for (const name of order) {
  const keys = new Map();
  const m = meta.get(name);
  for (const k of m.provides) keys.set(k, { via: m.mutates.includes(k) ? 'provides+mutates' : 'provides', moved: 0, run: 0 });
  for (const k of m.mutates) if (!keys.has(k)) keys.set(k, { via: 'mutates', moved: 0, run: 0 });
  table.set(name, keys);
}
const stepDrew = new Map(order.map((n) => [n, 0]));

const t0 = Date.now();
for (const row of SAMPLE) {
  const base = capture(row, null);
  for (const name of order) if ((base.perStep.get(name)?.draws || 0) > 0) stepDrew.set(name, stepDrew.get(name) + 1);
  for (const name of order) {
    const per = capture(row, name);
    for (const [k, rec] of table.get(name)) {
      rec.run += 1;
      if (base.seen.get(name)[k] !== per.seen.get(name)[k]) rec.moved += 1;
    }
  }
}
const wall = Date.now() - t0;
const dump = [];
for (const name of order) {
  for (const [k, rec] of table.get(name)) {
    dump.push({ step: name, key: k, via: rec.via, moved: rec.moved, run: rec.run, drewIn: stepDrew.get(name), rows: SAMPLE.length });
  }
}
const drawnRows = dump.filter((d) => d.moved > 0);
const drawingSteps = order.filter((n) => stepDrew.get(n) > 0);
console.log(`ROWS=${SAMPLE.length} wall=${wall} ms  per-row=${(wall / SAMPLE.length).toFixed(1)} ms`);
console.log(`pairs=${dump.length}  moved>0 = ${drawnRows.length}  moved=0 = ${dump.length - drawnRows.length}`);
console.log(`steps that draw = ${drawingSteps.length}: ${drawingSteps.join(', ')}`);
console.log('\n=== the classification, step / key / via / moved / stepDrewIn ===');
for (const d of dump) console.log(`${d.step}\t${d.key}\t${d.via}\t${d.moved}/${d.run}\t${d.drewIn}/${d.rows}`);
writeFileSync(new URL('./p2-sample-result.json', import.meta.url), JSON.stringify({ rows: SAMPLE.length, wall, dump }, null, 2));

// ── (B) the off-corpus block ────────────────────────────────────────────────
console.log('\n=== (B) OFF-CORPUS: the wizard’s random modes over resolveConfig ===');
const BASE = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
const PROBES = [
  ['IN-corpus control', {}],
  ["settType:'random'", { settType: 'random' }],
  ["culture:'random_culture'", { culture: 'random_culture' }],
  ['_randomizePriorities:true', { _randomizePriorities: true }],
];
const SEEDS = Array.from({ length: 24 }, (_, i) => `offcorpus-${i}`);
const STEP = 'resolveConfig';
for (const [label, patch] of PROBES) {
  const tally = new Map();
  for (const seed of SEEDS) {
    const row = { ...BASE, ...patch, _seed: seed };
    const snap = (perturb) => {
      let bag = null;
      runHeadless(row, instrumentedRoot(row._seed, { perturbStep: perturb }).root, {
        onStep: (name, ctx) => {
          if (name !== STEP) return;
          const m = meta.get(name);
          bag = {};
          for (const k of new Set([...m.provides, ...m.mutates])) bag[k] = k in ctx ? h(ctx[k]) : 'A';
        },
      });
      return bag;
    };
    const a = snap(null); const b = snap(STEP);
    for (const k of Object.keys(a)) if (a[k] !== b[k]) tally.set(k, (tally.get(k) || 0) + 1);
  }
  const shown = [...tally.entries()].sort((x, y) => y[1] - x[1]).map(([k, n]) => `${k}:${n}/${SEEDS.length}`);
  console.log(`${label}\tMOVED=[${shown.join(' , ')}]`);
}

// ── (C) mint / hash census variance across rows ─────────────────────────────
console.log('\n=== (C) MINT + HASH census per row (is 35/96 constant or a row property?) ===');
const PROBE_ROWS = [0, 60, 130, 220, 300, 400, 500, 510, 520].map((i) => ALL[i]).filter(Boolean);
console.log('row\tmints\tdirect\tviaFork\tpickVariant\tfnv1a32ext');
for (const row of PROBE_ROWS) {
  globalThis.__EMP2_MINTS__ = []; globalThis.__EMP2_HASH__ = []; globalThis.__EMP2_FNV__ = [];
  runHeadless(row, instrumentedRoot(row._seed).root);
  const m = globalThis.__EMP2_MINTS__;
  console.log(`${keyOf(row)}\t${m.length}\t${m.filter((x) => x.via === 'direct').length}\t${m.filter((x) => x.via === 'fork').length}\t${globalThis.__EMP2_HASH__.length}\t${globalThis.__EMP2_FNV__.length}`);
}
globalThis.__EMP2_MINTS__ = null; globalThis.__EMP2_HASH__ = null; globalThis.__EMP2_FNV__ = null;
