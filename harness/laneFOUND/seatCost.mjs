#!/usr/bin/env node
/**
 * CAR-FOUND · ⭐ **WHAT WOULD PER-EPOCH SEATING COST?** — the brief's own question, answered with
 * a number instead of an opinion.
 *
 * Today `seatPartition` runs ONCE, post-fold, on finished ground. Moving it into the fold means
 * running it once per epoch, each time over the faces that exist at that epoch. The cost is
 * therefore NOT `36 × the final pass` — early epochs have few faces — so this measures the real
 * shape: the seating pass timed at every `epochCap` prefix, summed.
 *
 * PROTOCOL: `partitionPerf.mjs`'s own — one untimed warm-up, three timed samples, median.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { seatPartition } from '../../src/domain/townMap/fabric/partitionSeating.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
const key = (process.argv.find((a) => a.startsWith('--leaf=')) || '--leaf=metropolis').slice(7);

const spec = CORPUS.find((s) => s.key === key);
const { settlement, model, fabric } = buildOne(spec);
const input = partitionInputs(settlement, model, fabric);
const facts = { prosperity: (settlement.economicState && settlement.economicState.prosperity) || null, tier: fabric.meta.tier };
const nEp = input.ledger.epochs.length;

// the FINAL pass, as shipped
const P = buildSettledPartition(input);
const page = projectPage(P, { roadWidth: input.roadWidth });
seatPartition(P, page, settlement, facts);                        // warm-up, discarded
const fin = [];
for (let i = 0; i < 3; i++) {
  const t = performance.now();
  seatPartition(P, page, settlement, facts);
  fin.push(performance.now() - t);
}
const finalMs = median(fin);

// the PER-EPOCH cost: the same pass at every prefix of the fold
let sum = 0;
const rows = [];
for (let k = 1; k <= nEp; k++) {
  const Pk = buildSettledPartition({ ...input, epochCap: k });
  const pk = projectPage(Pk, { roadWidth: input.roadWidth });
  seatPartition(Pk, pk, settlement, facts);                       // warm-up
  const s = [];
  for (let i = 0; i < 3; i++) {
    const t = performance.now();
    seatPartition(Pk, pk, settlement, facts);
    s.push(performance.now() - t);
  }
  const m = median(s);
  sum += m;
  rows.push({ k, ms: Math.round(m * 100) / 100 });
}

console.log(`leaf '${key}' · ${nEp} epoch(s)`);
console.log(`  seating ONCE, post-fold (as shipped):        ${finalMs.toFixed(1)} ms`);
console.log(`  seating at EVERY epoch, summed:              ${sum.toFixed(1)} ms   (${(sum / finalMs).toFixed(1)}× the single pass)`);
console.log(`  per-epoch profile (ms): ${rows.map((r) => r.ms).join(' ')}`);
console.log('\n⚠ THIS IS THE FLOOR, NOT THE BILL. It prices only the seating pass itself. Moving');
console.log('   seating into the fold ALSO requires a `projectPage` per epoch (the reader needs');
console.log('   the page\'s bound, gates, voids and water), which is the dominant extra cost.');
let pageSum = 0;
for (let k = 1; k <= nEp; k++) {
  const Pk = buildSettledPartition({ ...input, epochCap: k });
  projectPage(Pk, { roadWidth: input.roadWidth });                 // warm-up
  const s = [];
  for (let i = 0; i < 3; i++) {
    const t = performance.now();
    projectPage(Pk, { roadWidth: input.roadWidth });
    s.push(performance.now() - t);
  }
  pageSum += median(s);
}
console.log(`  projectPage at EVERY epoch, summed:          ${pageSum.toFixed(1)} ms`);
console.log(`  ⇒ per-epoch seating adds AT LEAST            ${(sum - finalMs + pageSum).toFixed(1)} ms to the constructor`);
