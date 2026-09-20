/**
 * P5 — THE TRACE. (a) Do `simulationTrace` entries carry their producing step, or enough to
 * attribute them? (b) Prototype ruling 8 — a HELD step re-emits nothing and its recorded entries
 * are carried; a DERIVING step's entries are re-derived — and measure whether the no-edit trace
 * then reproduces, and what an edit does to it.
 *
 * usage: node --import ./hook3.mjs p5-trace.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive, rederive } from './seam.mjs';

const OPTS = { nameMode: 'consume', relink: true };
const SAMPLE = sample63();

// ── (a) the trace's own shape ───────────────────────────────────────────────
{
  const rec = generate(SAMPLE.find(r => r.settType === 'town'));
  const tr = rec.simulationTrace || [];
  const fields = new Map();
  for (const e of tr) for (const k of Object.keys(e)) fields.set(k, (fields.get(k) || 0) + 1);
  console.log('=== P5.a — the trace entry\'s shape (town row) ===');
  console.log(`entries=${tr.length}`);
  console.log(`fields: ${[...fields.entries()].map(([k, n]) => `${k}×${n}`).join(' ')}`);
  const withStep = tr.filter(e => typeof e.step === 'string').length;
  console.log(`entries carrying a \`step\`: ${withStep}/${tr.length}  (${withStep === tr.length ? 'TOTAL' : '⛔ PARTIAL'})`);
  const byStep = new Map();
  for (const e of tr) byStep.set(e.step, (byStep.get(e.step) || 0) + 1);
  console.log(`by step: ${[...byStep.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s}=${n}`).join(' ')}`);
  console.log(`sample entry: ${JSON.stringify(tr[0]).slice(0, 300)}`);
}

// ── (b) which STEPS' entries diverge under the seam, with no edit, over the sample ──
console.log('\n=== P5.b — with the whole seam and NO edit: which steps\' trace entries diverge? ===');
const stepDiverge = new Map(); const stepCountDelta = new Map(); let rows = 0; let traceSame = 0;
for (const row of SAMPLE) {
  const rec = generate(row);
  const rr = tryRederive(row, heldOf(rec), OPTS);
  if (rr.err) continue;
  rows += 1;
  const a = rec.simulationTrace || []; const b = rr.out.simulationTrace || [];
  if (h(a) === h(b)) { traceSame += 1; continue; }
  const steps = new Set([...a.map(e => e.step), ...b.map(e => e.step)]);
  for (const s of steps) {
    const ea = a.filter(e => e.step === s); const eb = b.filter(e => e.step === s);
    if (h(ea) !== h(eb)) stepDiverge.set(s, (stepDiverge.get(s) || 0) + 1);
    if (ea.length !== eb.length) stepCountDelta.set(s, (stepCountDelta.get(s) || 0) + 1);
  }
}
console.log(`rows=${rows}  trace identical with no edit: ${traceSame}/${rows}`);
console.log('step                          rows whose entries diverge   rows whose entry COUNT differs');
for (const [s, n] of [...stepDiverge.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${s.padEnd(30)} ${String(n).padStart(4)}/${rows}${' '.repeat(18)}${stepCountDelta.get(s) || 0}/${rows}`);
}

// ── (c) ruling 8 prototyped: carry the HELD steps' entries ───────────────────
const HELD_STEP_SETS = [
  ['H1 the four roster+power+institution producers',
    ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions']],
  ['H2 H1 + every institution MUTATOR (the whole held-institutions chain)',
    ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
      'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass']],
  ['H3 H2 + powerEconomyReconcilePass + neighbourFactions + assembleSettlement',
    ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
      'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass',
      'powerEconomyReconcilePass', 'neighbourFactions', 'assembleSettlement']],
];
console.log('\n=== P5.c — ruling 8 prototyped: a HELD step\'s recorded entries are CARRIED ===');
for (const [label, heldSteps] of HELD_STEP_SETS) {
  let ok = 0; let full = 0; let n = 0; const resid = new Map();
  for (const row of SAMPLE) {
    const rec = generate(row);
    const rr = tryRederive(row, heldOf(rec), { ...OPTS, tracePartition: rec, heldStepsForTrace: heldSteps });
    if (rr.err) continue;
    n += 1;
    if (h(rec.simulationTrace) === h(rr.out.simulationTrace)) ok += 1;
    if (h(rec) === h(rr.out)) full += 1;
    else for (const k of new Set([...Object.keys(rec), ...Object.keys(rr.out)])) if (h(rec[k]) !== h(rr.out[k])) resid.set(k, (resid.get(k) || 0) + 1);
  }
  console.log(`${label}\n    trace reproduces ${ok}/${n} · WHOLE RECORD reproduces ${full}/${n} · residual keys: ${[...resid.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join(' ') || '—'}`);
}

// ── (d) what an EDIT does to the partitioned trace ──────────────────────────
console.log('\n=== P5.d — what one edit does to the trace, with ruling 8 on (H2) ===');
const H2 = HELD_STEP_SETS[1][1];
for (const t of ['village', 'town', 'city']) {
  const row = SAMPLE.find(r => r.settType === t);
  const rec = generate(row);
  const ctrl = tryRederive(row, heldOf(rec), { ...OPTS, tracePartition: rec, heldStepsForTrace: H2 });
  if (ctrl.err) { console.log(`${t}: control threw`); continue; }
  for (const [label, mk] of [
    ['add an institution', () => { const H = heldOf(rec); H.institutions.push({ ...clone(H.institutions[0]), name: `${H.institutions[0].name} Annexe`, catalogId: 'dm_annexe', source: 'dm' }); return [row, H]; }],
    ['change an NPC role', () => { const H = heldOf(rec); H.npcs[0].role = 'Harbourmaster'; return [row, H]; }],
    ['terrain → desert', () => [{ ...row, terrainOverride: 'desert' }, heldOf(rec)]],
  ]) {
    const [r2, H] = mk();
    const rr = tryRederive(r2, H, { ...OPTS, tracePartition: rec, heldStepsForTrace: H2 });
    if (rr.err) { console.log(`  ${t} / ${label}: THREW ${rr.err.slice(0, 60)}`); continue; }
    const d = pathDiff(ctrl.out.simulationTrace, rr.out.simulationTrace);
    const n = d.added.length + d.changed.length + d.removed.length;
    const steps = new Set();
    const a = ctrl.out.simulationTrace || []; const b = rr.out.simulationTrace || [];
    for (const s of new Set([...a.map(e => e.step), ...b.map(e => e.step)])) {
      if (h(a.filter(e => e.step === s)) !== h(b.filter(e => e.step === s))) steps.add(s);
    }
    console.log(`  ${t.padEnd(10)} / ${label.padEnd(20)} trace leaf paths moved=${String(n).padStart(4)}  entries ${a.length}→${b.length}  steps whose entries moved: ${[...steps].join(',') || 'none'}`);
  }
}
