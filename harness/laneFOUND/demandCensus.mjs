#!/usr/bin/env node
/**
 * CAR-FOUND census — ⭐⭐ **THE DEMAND AND THE DEFICIT, PER EPOCH, NOW THAT THEY ARE PUBLISHED.**
 * Names the leaves where they are NON-ZERO, which is the exit the brief asks for.
 * ⛔ It checks a DISTRIBUTION, never uniformity — a corpus where every leaf deadlocks identically
 *    would be as much a red as one where none does.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const rows = [];
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const P = buildSettledPartition(partitionInputs(settlement, model, fabric));
  const T = P.demandTotals;
  const worst = P.demand.reduce((w, d) => (w && w.deficit >= d.deficit ? w : d), null);
  rows.push({ key: spec.key, T, worst, n: P.demand.length });
}

console.log('leaf         epochs   asked    built  deficit  deadlockedEpochs  worst(ep/year/ask/deficit)');
for (const r of rows) {
  const w = r.worst;
  console.log(`${r.key.padEnd(12)} ${String(r.n).padStart(6)} ${String(r.T.asked).padStart(7)} `
    + `${String(r.T.built).padStart(8)} ${String(r.T.deficit).padStart(8)} ${String(r.T.deadlockedEpochs).padStart(17)}`
    + `  E${w.epoch}/y${w.year} ask ${w.demand} → deficit ${w.deficit}`);
}
const anyDeficit = rows.filter((r) => r.T.deficit > 0);
const noDeficit = rows.filter((r) => r.T.deficit === 0);
console.log(`\nleaves with a NON-ZERO deficit: ${anyDeficit.length} of ${rows.length} — ${anyDeficit.map((r) => r.key).join(', ') || 'NONE'}`);
console.log(`leaves that built everything they asked for: ${noDeficit.length} — ${noDeficit.map((r) => r.key).join(', ') || 'NONE'}`);
console.log(`⛔ DISTRIBUTION CHECK: a corpus where ALL or NONE deadlock would be the red. Here: ${anyDeficit.length}/${rows.length}.`);

console.log('\n── THE WORST-DEADLOCKED LEAF, EPOCH BY EPOCH ──');
const top = rows.reduce((a, b) => (a.T.deficit >= b.T.deficit ? a : b));
const { settlement, model, fabric } = buildOne(CORPUS.find((s) => s.key === top.key));
const P = buildSettledPartition(partitionInputs(settlement, model, fabric));
console.log(`leaf '${top.key}':`);
console.log('  ep  year  target   held  demand  built  deficit  met%   refusals');
for (const d of P.demand) {
  const rf = Object.entries(d.refused).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(' ') || '—';
  console.log(`  ${String(d.epoch).padStart(2)} ${String(d.year).padStart(5)} ${String(d.target).padStart(7)}`
    + ` ${String(d.held).padStart(6)} ${String(d.demand).padStart(7)} ${String(d.built).padStart(6)}`
    + ` ${String(d.deficit).padStart(8)} ${d.metShare == null ? '   n/a' : (d.metShare * 100).toFixed(1).padStart(6)}`
    + `   ${rf}`);
}
console.log(`\n  reason of the worst epoch: ${top.worst.reason}`);
