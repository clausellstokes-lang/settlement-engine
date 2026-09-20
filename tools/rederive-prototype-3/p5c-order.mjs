/**
 * P5.c2 — the run order, the institution CONSUMERS, and where the two placements put the pin;
 * plus the `history×3` residual of W4.
 *
 * usage: node --import ./hook3.mjs p5c-order.mjs
 */
import { getStepOrder, getStepMeta } from './instrument.mjs';
import { h, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive, WRITER_STEPS } from './seam.mjs';

const order = getStepOrder(); const META = getStepMeta();
console.log('=== P5.c2 — run order, with each step\'s relation to `institutions` ===');
order.forEach((s, i) => {
  const m = META.find(x => x.name === s);
  const tags = [];
  if ((m.provides || []).includes('institutions')) tags.push('PROVIDES institutions');
  if ((m.mutates || []).includes('institutions')) tags.push('MUTATES institutions');
  if ((m.reads || []).includes('institutions')) tags.push('reads institutions');
  console.log(`${String(i).padStart(2)}  ${s.padEnd(28)} ${tags.join(' · ') || ''}`);
});
console.log(`\nWRITER_STEPS.institutions = [${WRITER_STEPS.institutions.join(', ')}]`);
console.log(`placement=last pins at: ${WRITER_STEPS.institutions[WRITER_STEPS.institutions.length - 1]}`);
const lastIdx = order.indexOf(WRITER_STEPS.institutions[WRITER_STEPS.institutions.length - 1]);
const readersBefore = order.slice(0, lastIdx + 1).filter(s => (META.find(x => x.name === s)?.reads || []).includes('institutions'));
const readersAfter = order.slice(lastIdx + 1).filter(s => (META.find(x => x.name === s)?.reads || []).includes('institutions'));
console.log(`institution READERS BEFORE the last writer (they see the FRESH roster under placement=last): ${readersBefore.join(', ')}`);
console.log(`institution READERS AFTER  the last writer (they see the EDITED roster): ${readersAfter.join(', ')}`);

console.log('\n=== the same for the other held keys ===');
for (const k of Object.keys(WRITER_STEPS)) {
  const w = WRITER_STEPS[k]; const li = order.indexOf(w[w.length - 1]);
  const before = order.slice(0, li + 1).filter(s => (META.find(x => x.name === s)?.reads || []).includes(k));
  const after = order.slice(li + 1).filter(s => (META.find(x => x.name === s)?.reads || []).includes(k));
  console.log(`${k.padEnd(16)} last writer=${w[w.length - 1].padEnd(22)} readers before=[${before.join(',')}]  readers after=[${after.join(',')}]`);
}

// ── the W4 residual: which rows, which paths ────────────────────────────────
console.log('\n=== W4\'s residual: history×3 ===');
const H2 = ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
  'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass'];
for (const row of sample63()) {
  const rec = generate(row);
  const rr = tryRederive(row, heldOf(rec), { nameMode: 'consume', relink: true, placement: 'last', tracePartition: rec, heldStepsForTrace: H2 });
  if (rr.err) { console.log(`${keyOf(row)}: THREW ${rr.err.slice(0, 60)}`); continue; }
  if (h(rr.out) === h(rec)) continue;
  const parts = [];
  for (const k of new Set([...Object.keys(rec), ...Object.keys(rr.out)])) {
    if (h(rec[k]) === h(rr.out[k])) continue;
    const d = pathDiff(rec[k], rr.out[k]);
    parts.push(`${k} ${d.added.length}+/${d.changed.length}~/${d.removed.length}- [${fmtTally([...d.added, ...d.changed, ...d.removed], 6)}]`);
  }
  console.log(`${keyOf(row)}\n    ${parts.join('\n    ')}`);
}
