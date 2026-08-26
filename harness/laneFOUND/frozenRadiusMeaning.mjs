#!/usr/bin/env node
/**
 * CAR-FOUND · ⛔⛔ **THE CHAIR'S ADDENDUM, ANSWERED BY MEASUREMENT.**
 *
 * `frozenRadius` has FOUR consumers and (the chair's claim) TWO meanings. Two candidate diagnoses
 * for the 1.0204 raise-epoch saturation:
 *   (a) THE THRESHOLD/EXCLUSION — the 0.98 factor is the whole of it;
 *   (b) THE DENOMINATOR — capacity divides by a centroid-filter radius while believing it is the
 *       circuit's radius, so 1.0204 is a unit artifact.
 *
 * THE DISCRIMINATOR, and it needs no geometry at all:
 *   · capacity's use of `frozenRadius` is the ROUND-TRIP of the producer's own map —
 *     `populationForRadius` inverts `radiusAt`, and `radiusAt` is what MINTED the field. If the
 *     round-trip is the identity, capacity cannot carry a unit error against its own producer.
 *   · and the residual would then be a CONSTANT equal to 1/(1 − SQUARE_CAPACITY_EXCLUSION), where
 *     a unit error would be leaf-varying and driven by hull geometry.
 *
 * ARM 2 measures the chair's (b) as its OWN defect, at the consumers where it really lives:
 * the DRAWN wrap ring against the `frozenRadius` the ledger named.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import {
  populationForRadius, SQUARE_CAPACITY_EXCLUSION, buildGrowthLedger,
} from '../../src/domain/townMap/fabric/growthLedger.js';
import { tierScale, tierForPopulation } from '../../src/domain/townMap/fabric/tierGrammar.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

// ── ARM 1 · THE ROUND-TRIP IDENTITY (DISCOVERY) ────────────────────────────────────────────
console.log('── ARM 1 · IS capacity A ROUND-TRIP OF ITS OWN PRODUCER? ──');
console.log('    P → radiusAt(P,P) → populationForRadius(r) → P\' ; and P/(0.98·P\')');
const { settlement: base } = buildOne(CORPUS.find((s) => s.key === 'town'));
let exact = 0; let n = 0;
for (const P of [200, 500, 900, 1500, 3000, 6000, 9000, 12000, 18000, 24000]) {
  const probe = { ...base, population: P, tier: tierForPopulation(P) };
  delete probe.populationHistory; delete probe.calamityHistory;
  const r = tierScale(probe).builtRadius;
  const back = populationForRadius(probe, r, Math.max(P * 4, 1000));
  const excl = Math.round(back * (1 - SQUARE_CAPACITY_EXCLUSION));
  n++; if (back === P) exact++;
  console.log(`  P=${String(P).padStart(6)}  r=${r.toFixed(3).padStart(9)}  P'=${String(back).padStart(6)}`
    + `  ${back === P ? 'IDENTITY' : 'differs  '}   P/(0.98·P')=${(P / excl).toFixed(6)}`);
}
console.log(`round-trip exact on ${exact} of ${n} probes · 1/(1-${SQUARE_CAPACITY_EXCLUSION}) = ${(1 / (1 - SQUARE_CAPACITY_EXCLUSION)).toFixed(6)}`);

// ── ARM 2 · THE DRAWN RING vs THE FIELD (DISCOVERY, and this is the CHAIR'S (b)) ───────────
console.log('\n── ARM 2 · THE DRAWN WRAP RING AGAINST THE frozenRadius THE LEDGER NAMED ──');
console.log('leaf         wrap  frozenR   ringMeanR   ringMaxR   max/frozen   areaRatio(ring/disc)');
let overs = 0; let wraps = 0;
const ratios = [];
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const cx = input.extent.cx; const cy = input.extent.cy;
  for (const w of P.wraps) {
    const ring = w.outer || w.inner;
    if (!Array.isArray(ring) || ring.length < 3) continue;
    wraps++;
    const rs = ring.map(([x, y]) => Math.hypot(x - cx, y - cy));
    const mean = rs.reduce((a, b) => a + b, 0) / rs.length;
    const max = Math.max(...rs);
    // shoelace area of the drawn ring vs the disc of radius frozenRadius
    let A = 0;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]; const b = ring[(i + 1) % ring.length];
      A += a[0] * b[1] - b[0] * a[1];
    }
    A = Math.abs(A) / 2;
    const disc = Math.PI * w.frozenRadius * w.frozenRadius;
    const areaRatio = disc > 0 ? A / disc : 0;
    ratios.push(areaRatio);
    if (max > w.frozenRadius) overs++;
    console.log(`${spec.key.padEnd(12)} ${String(w.index ?? '?').padStart(4)} ${w.frozenRadius.toFixed(2).padStart(8)}`
      + ` ${mean.toFixed(2).padStart(11)} ${max.toFixed(2).padStart(10)} ${(max / w.frozenRadius).toFixed(4).padStart(12)}`
      + ` ${areaRatio.toFixed(4).padStart(22)}`);
  }
}
console.log(`\nwraps whose DRAWN ring reaches BEYOND the frozenRadius the ledger named: ${overs} of ${wraps}`);
if (ratios.length) {
  const s = ratios.slice().sort((a, b) => a - b);
  console.log(`drawn-ring area ÷ disc(frozenRadius): min ${s[0].toFixed(4)} · median ${s[Math.floor(s.length / 2)].toFixed(4)} · max ${s[s.length - 1].toFixed(4)}`);
  console.log('  (>1 ⇒ the DRAWN circuit encloses more ground than the ledger\'s capacity accounting prices)');
}
void buildGrowthLedger;
