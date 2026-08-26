#!/usr/bin/env node
/**
 * CAR-FOUND probe — the saturation figures, RE-MEASURED at this lane's own base.
 *
 * Two questions, both from the brief and both inherited (so both are re-taken here):
 *   (a) at a circuit's OWN raise epoch, what does `saturationShare` measure, and does an
 *       extramural emission fire in the wall's own raise year?
 *   (b) at the tier radius ceiling, what does a large ring measure?
 *
 * Runs over the real corpus AND over two synthetic probes (pop 6000, pop 30000) so the answer is
 * not a property of one leaf.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import {
  buildGrowthLedger, populationForRadius, SATURATION, SQUARE_CAPACITY_EXCLUSION,
} from '../../src/domain/townMap/fabric/growthLedger.js';

const rows = [];
let raiseEpochEmissions = 0;
let raiseEpochs = 0;

for (const spec of CORPUS) {
  const { settlement, model } = buildOne(spec);
  const led = buildGrowthLedger(settlement, model, {});
  for (const e of led.epochs) {
    if (!(e.circuitEvents || []).length) continue;
    raiseEpochs++;
    const emitted = (e.emissions || []).reduce((n, a) => n + a.souls, 0);
    if (emitted > 0) raiseEpochEmissions++;
    rows.push({
      key: spec.key, epoch: e.index, year: e.year, pop: e.population,
      capacity: e.capacity, sat: e.saturation, emitted,
      frozenR: e.circuitEvents[0].frozenRadius,
    });
  }
}

console.log('── (a) EVERY CORPUS CIRCUIT AT ITS OWN RAISE EPOCH ──');
console.log('leaf         ep  year   pop  capacity  saturation  emittedSouls');
for (const r of rows) {
  console.log(`${r.key.padEnd(12)} ${String(r.epoch).padStart(2)} ${String(r.year).padStart(5)} `
    + `${String(r.pop).padStart(5)} ${String(r.capacity).padStart(9)} `
    + `${r.sat == null ? '   null' : r.sat.toFixed(4).padStart(10)} ${String(r.emitted).padStart(13)}`);
}
console.log(`raise epochs: ${raiseEpochs} · with a NON-ZERO extramural emission in the raise year: ${raiseEpochEmissions}`);
const sats = rows.map((r) => r.sat).filter((v) => v != null);
if (sats.length) {
  console.log(`raise-epoch saturation: min ${Math.min(...sats).toFixed(4)} · max ${Math.max(...sats).toFixed(4)}`);
}

// ── (b) THE SYNTHETIC RINGS. The identity under test: capacity is populationForRadius(frozenR),
//    and at the raise epoch the frozen radius IS this population's own built radius, so a correct
//    saturation is 1.0000 exactly.
console.log('\n── (b) SYNTHETIC RINGS — capacity of the ring a population itself raised ──');
const { settlement: base } = buildOne(CORPUS.find((s) => s.key === 'town'));
const { tierScale, tierForPopulation } = await import('../../src/domain/townMap/fabric/tierGrammar.js');
for (const pop of [900, 3000, 6000, 12000, 30000, 60000]) {
  const probe = { ...base, population: pop, tier: tierForPopulation(pop) };
  delete probe.populationHistory; delete probe.calamityHistory;
  const r = tierScale(probe).builtRadius;
  const hi = Math.max(pop * 4, 1000);
  const invRaw = populationForRadius(probe, r, hi);
  const capacity = Math.round(invRaw * (1 - SQUARE_CAPACITY_EXCLUSION));
  const sat = capacity > 0 ? pop / capacity : 0;
  const ceilingHit = invRaw >= Math.max(2, Math.trunc(hi));
  console.log(`pop ${String(pop).padStart(6)}  r=${r.toFixed(2).padStart(9)}  inverse=${String(invRaw).padStart(7)}`
    + `  capacity=${String(capacity).padStart(7)}  saturation=${sat.toFixed(4)}`
    + `  ${sat > SATURATION ? 'EMITS' : '     '}  ${ceilingHit ? '⚠ SEARCH-CEILING ARTIFACT' : ''}`);
}
console.log(`\nSATURATION=${SATURATION} · SQUARE_CAPACITY_EXCLUSION=${SQUARE_CAPACITY_EXCLUSION}`);
