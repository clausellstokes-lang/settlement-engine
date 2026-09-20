/**
 * P6.b2 — `stress` HELD vs RE-DERIVED, swept. §14 lists STRESSORS among the WORLD FACTS, and
 * §22 ruling 1 puts "the world facts" in the held set — so `stress` is a held key by the design's
 * own text. The record deletes each entry's `summaryRoll` token once rendered, so a held entry's
 * summary can never be re-rendered. Measured over the 63-row sample, under a terrain edit and a
 * culture edit, with the NAME held (which is the §22 shape).
 *
 * usage: node --import ./hook3.mjs p6b-stress.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive } from './seam.mjs';

const H2 = ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
  'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass'];
const asArr = (v) => (Array.isArray(v) ? v : (v ? [v] : []));
const STRESS_PRODUCERS = ['resolveStress', 'isolationPass', 'stressConfirmPass'];

let rollCarried = 0; let rows = 0; let stressEntries = 0;
const diffTerrain = []; const diffCulture = [];
let stressMovedFree = 0;
for (const row of sample63()) {
  const rec = generate(row);
  rows += 1;
  const es = asArr(rec.stress);
  stressEntries += es.length;
  rollCarried += es.filter(e => e && Object.prototype.hasOwnProperty.call(e, 'summaryRoll')).length;
  const base = { nameMode: 'consume', relink: true, placement: 'last', tracePartition: rec, heldStepsForTrace: H2 };
  const holdStress = { ...base, onStepExtra: (n, c) => { if (STRESS_PRODUCERS.includes(n)) c.stress = clone(rec.stress); } };
  for (const [tag, row2, bucket] of [['terrain→desert', { ...row, terrainOverride: 'desert' }, diffTerrain],
    ['culture→norse', { ...row, culture: 'norse' }, diffCulture]]) {
    const free = tryRederive(row2, heldOf(rec), base);
    const held = tryRederive(row2, heldOf(rec), holdStress);
    if (free.err || held.err) { bucket.push([keyOf(row), 'THREW']); continue; }
    if (h(free.out.stress) !== h(rec.stress)) stressMovedFree += 1;
    if (h(free.out) !== h(held.out)) {
      const d = pathDiff(free.out, held.out);
      bucket.push([keyOf(row), `${d.added.length}+/${d.changed.length}~/${d.removed.length}-`, fmtTally([...d.added, ...d.changed, ...d.removed], 5)]);
    }
  }
}
console.log('=== P6.b2 — `stress` across the 63-row sample ===');
console.log(`rows=${rows}  stress entries on the records=${stressEntries}  entries carrying \`summaryRoll\`=${rollCarried}  (the token is deleted at assembly)`);
console.log(`rows where a FREE (re-derived) stress MOVES under an edit: ${stressMovedFree}/${rows * 2} trials`);
console.log(`\nterrain→desert: rows where HELD stress differs from RE-DERIVED stress: ${diffTerrain.length}/${rows}`);
for (const r of diffTerrain.slice(0, 10)) console.log(`   ${r.join('  ')}`);
console.log(`\nculture→norse: rows where HELD stress differs from RE-DERIVED stress: ${diffCulture.length}/${rows}`);
for (const r of diffCulture.slice(0, 10)) console.log(`   ${r.join('  ')}`);

// What does each arm SHOW a DM, on a row where the two differ?
const target = diffTerrain.find(r => r[1] !== 'THREW');
if (target) {
  const row = sample63().find(r => keyOf(r) === target[0]);
  const rec = generate(row);
  const base = { nameMode: 'consume', relink: true, placement: 'last', tracePartition: rec, heldStepsForTrace: H2 };
  const holdStress = { ...base, onStepExtra: (n, c) => { if (STRESS_PRODUCERS.includes(n)) c.stress = clone(rec.stress); } };
  const row2 = { ...row, terrainOverride: 'desert' };
  const free = tryRederive(row2, heldOf(rec), base);
  const held = tryRederive(row2, heldOf(rec), holdStress);
  console.log(`\n--- what each arm SHOWS, on ${target[0]} with terrain→desert ---`);
  console.log(`record        stress: ${asArr(rec.stress).map(e => `${e.type}: ${String(e.summary).slice(0, 70)}`).join(' | ')}`);
  console.log(`RE-DERIVED    stress: ${asArr(free.out.stress).map(e => `${e.type}: ${String(e.summary).slice(0, 70)}`).join(' | ')}`);
  console.log(`HELD          stress: ${asArr(held.out.stress).map(e => `${e.type}: ${String(e.summary).slice(0, 70)}`).join(' | ')}`);
}
