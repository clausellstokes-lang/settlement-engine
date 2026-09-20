/**
 * P7 — cost. Wall-clock per re-derivation with the whole seam on, by tier, against a plain
 * unpinned generation of the same row (uninstrumented reference), plus the clone's share.
 *
 * usage: node --import ./hook3.mjs p7-cost.mjs
 */
import { keyOf, sample63, clone } from './lib.mjs';
import { generate, heldOf, rederive } from './seam.mjs';

const H2 = ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
  'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass'];
const W4 = { nameMode: 'consume', relink: true, placement: 'last' };
const N = 12;
const ms = (fn) => { const t = process.hrtime.bigint(); fn(); return Number(process.hrtime.bigint() - t) / 1e6; };

console.log('=== P7 — cost per re-derivation, whole seam on (W4: last-writer placement + ruling 8 trace) ===');
console.log('tier         bag bytes   plain generation ms   re-derivation ms   structuredClone ms   clone %');
for (const t of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const row = sample63().find(r => r.settType === t);
  const rec = generate(row);
  const held = heldOf(rec);
  const bytes = JSON.stringify(held).length;
  let gen = 0; let red = 0; let cl = 0;
  for (let i = 0; i < N; i += 1) {
    gen += ms(() => generate(row));
    red += ms(() => rederive(row, held, { ...W4, tracePartition: rec, heldStepsForTrace: H2 }));
    cl += ms(() => structuredClone(held));
  }
  console.log(`${t.padEnd(12)} ${String(bytes).padStart(9)}   ${(gen / N).toFixed(1).padStart(18)}   ${(red / N).toFixed(1).padStart(16)}   ${(cl / N).toFixed(3).padStart(18)}   ${((cl / red) * 100).toFixed(2)}%`);
}

console.log('\n=== P7.b — the full 63-row sample, one pass ===');
const rows = sample63();
const recs = rows.map(r => generate(r));
const t0 = Date.now();
for (let i = 0; i < rows.length; i += 1) rederive(rows[i], heldOf(recs[i]), { ...W4, tracePartition: recs[i], heldStepsForTrace: H2 });
console.log(`63 re-derivations in ${Date.now() - t0} ms  (${((Date.now() - t0) / 63).toFixed(1)} ms each, instrumented)`);
