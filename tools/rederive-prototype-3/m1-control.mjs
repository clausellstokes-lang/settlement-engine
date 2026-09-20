/**
 * M1 — the instrument, with its own control.
 *
 * (a) dump getStepMeta: steps, provides, mutates (re-measure the chair's 22/57)
 * (b) the AMBIENT proof: an ambient `random()` taken while a step's stream is active
 *     increments THAT step's count
 * (c) EM-P0's own control: `generatePopulation` draws > 67 unpinned and EXACTLY 0 under
 *     full pins (npcs, relationships, factions, conflicts from the run's own record)
 * (d) wall clock for one run
 */
import {
  instrumentedRoot, runHeadless, createPRNG, getStepMeta, getStepOrder, rngContext,
} from './instrument.mjs';

const ROW = {
  settType: 'town', culture: 'germanic', terrainOverride: 'riverside',
  tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'em-p0-pinned-mode',
};
const POPULATION_STEP = 'generatePopulation';
const CHOOSER_KEYS = ['npcs', 'relationships', 'factions', 'conflicts'];

const meta = getStepMeta();
const order = getStepOrder();
let providesTotal = 0; let mutatesTotal = 0;
const pairs = [];
for (const m of meta) {
  providesTotal += m.provides.length;
  mutatesTotal += m.mutates.length;
  for (const k of m.provides) pairs.push(`${m.name}\tprovides\t${k}`);
  for (const k of m.mutates) pairs.push(`${m.name}\tmutates\t${k}`);
}
console.log(`=== (a) STEP META ===`);
console.log(`steps=${meta.length} providesKeys=${providesTotal} mutatesKeys=${mutatesTotal} pairs=${pairs.length}`);
console.log(`stepOrder=${order.join(',')}`);
for (const m of meta) {
  console.log(`  ${m.name}\tphase=${m.phase}\tprovides=[${m.provides.join('|')}]\tmutates=[${m.mutates.join('|')}]\tscratch=[${m.scratch.join('|')}]`);
}

// ── (b) the ambient proof ────────────────────────────────────────────────────
console.log(`\n=== (b) AMBIENT PROOF (an ambient rngContext.random() during a step lands in THAT step's count) ===`);
{
  const probe = instrumentedRoot(ROW._seed);
  const before = new Map();
  runHeadless(ROW, probe.root, {
    onStep: (name) => {
      // onStep runs INSIDE the runner's try, before clearActiveRng — the step's stream is
      // still the ACTIVE rng, so this ambient draw must land in that step's record.
      const rec = probe.perStep.get(name);
      before.set(name, rec.random);
      rngContext.random();
    },
  });
  const deltas = [...before.keys()].map(n => probe.perStep.get(n).random - before.get(n));
  const bad = [...before.keys()].filter(n => probe.perStep.get(n).random - before.get(n) !== 1);
  console.log(`steps probed=${before.size} each delta=1? ${bad.length === 0} (deltas: ${[...new Set(deltas)].join(',')})`);
  if (bad.length) console.log(`  OFFENDERS: ${bad.join(',')}`);
}

// ── (c) EM-P0's control ──────────────────────────────────────────────────────
console.log(`\n=== (c) CONTROL — generatePopulation unpinned vs fully pinned ===`);
const t0 = Date.now();
const un = instrumentedRoot(ROW._seed);
const ctx = runHeadless(ROW, un.root);
const t1 = Date.now();
const popUn = un.perStep.get(POPULATION_STEP);
console.log(`unpinned ${POPULATION_STEP}: draws=${popUn.draws} random=${popUn.random} other=${popUn.other} innerForks=${popUn.forkLabels.length} methods=${JSON.stringify(popUn.methods)}`);
console.log(`  > DERIVE_HALF_DRAWS(67)? ${popUn.draws > 67}`);

const pins = Object.fromEntries(CHOOSER_KEYS.map(k => [k, ctx[k]]));
const pin = instrumentedRoot(ROW._seed);
const ctx2 = runHeadless(ROW, pin.root, { pins });
const popPin = pin.perStep.get(POPULATION_STEP);
console.log(`fully pinned ${POPULATION_STEP}: draws=${popPin.draws} random=${popPin.random} other=${popPin.other}`);
console.log(`  === 0? ${popPin.draws === 0}`);
console.log(`pinned run reproduces the record? ${JSON.stringify(ctx2.settlement) === JSON.stringify(ctx.settlement)}`);

// ── (d) per-step totals and cost ─────────────────────────────────────────────
console.log(`\n=== (d) PER-STEP DRAWS, one row, and cost ===`);
for (const name of order) {
  const r = un.perStep.get(name);
  console.log(`  ${name}\tdraws=${r.draws}\trandom=${r.random}\tother=${r.other}\tsubforks=${r.forkLabels.length}\tmaxDepth=${r.maxDepth}\tlabels=[${[...new Set(r.forkLabels)].slice(0, 12).join('|')}]`);
}
const totalDraws = [...un.perStep.values()].reduce((s, r) => s + r.draws, 0);
console.log(`TOTAL draws across steps = ${totalDraws}; root-level draws = ${un.rootRec.draws}`);
console.log(`one instrumented run wall clock = ${t1 - t0} ms`);
