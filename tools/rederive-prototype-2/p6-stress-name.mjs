/**
 * P6 — `stress` and the settlement's NAME; plus the attribution of W4's `history×3` residual.
 *
 * (a) Attribute the history residual: drop one held key at a time on the three rows.
 * (b) With the NAME HELD, does a culture change leave any prose speaking a different name?
 *     Walk every string leaf of the output and look for the OTHER name.
 * (c) Is `stress` better HELD or RE-DERIVED under §22? Measure both; report what each shows.
 *
 * usage: node --import ./hook3.mjs p6-stress-name.mjs
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { generate, heldOf, tryRederive, HELD_KEYS } from './seam.mjs';

const H2 = ['generatePopulation', 'generatePower', 'corruptionPass', 'assembleInstitutions',
  'subsumptionPass', 'cascadePass', 'isolationPass', 'factionCorrelationPass', 'coherenceRepairPass'];
const W4 = { nameMode: 'consume', relink: true, placement: 'last' };
const SAMPLE = sample63();

// ── (a) attribute the history residual ──────────────────────────────────────
console.log('=== P6.a — attributing W4\'s `history` residual (3 town rows) ===');
const BAD = ['town|germanic|coastal|port|civilized|golden-master-v3',
  'town|germanic|plains|none|civilized|golden-master-v3',
  'town|germanic|plains|road|frontier|golden-master-v3'];
for (const row of SAMPLE.filter(r => BAD.includes(keyOf(r)))) {
  const rec = generate(row);
  const base = { ...W4, tracePartition: rec, heldStepsForTrace: H2 };
  const out = [];
  for (const drop of [null, ...HELD_KEYS]) {
    const H = heldOf(rec);
    if (drop) delete H[drop];
    const rr = tryRederive(row, H, base);
    out.push(`${(drop || 'ALL HELD').padEnd(15)} ${rr.err ? `THREW` : (h(rr.out.history) === h(rec.history) ? 'history OK' : 'history ⛔')}`);
  }
  console.log(`${keyOf(row)}\n    ${out.join('\n    ')}`);
}

// ── (b) the name under a culture change ─────────────────────────────────────
console.log('\n=== P6.b — the NAME held, culture → norse: does any prose speak a different name? ===');
function stringLeaves(v, path = '', out = []) {
  if (typeof v === 'string') { out.push([path, v]); return out; }
  if (!v || typeof v !== 'object') return out;
  if (Array.isArray(v)) { v.forEach((x, i) => stringLeaves(x, `${path}[${i}]`, out)); return out; }
  for (const [k, x] of Object.entries(v)) stringLeaves(x, path ? `${path}.${k}` : k, out);
  return out;
}
for (const t of ['village', 'town', 'city']) {
  const row = SAMPLE.find(r => r.settType === t);
  const rec = generate(row);
  const freeName = generate({ ...row, culture: 'norse' });   // what the culture change WOULD mint
  const held = heldOf(rec);
  const base = { ...W4, tracePartition: rec, heldStepsForTrace: H2 };
  const rr = tryRederive({ ...row, culture: 'norse' }, held, base);
  if (rr.err) { console.log(`${t}: THREW ${rr.err.slice(0, 70)}`); continue; }
  const out = rr.out;
  const other = freeName.name;
  const leaks = stringLeaves(out).filter(([p, s]) => other && s.includes(other) && !p.startsWith('simulationTrace'));
  const staleOld = stringLeaves(out).filter(([p, s]) => s.includes(rec.name) && p !== 'name');
  console.log(`${keyOf(row)}`);
  console.log(`    record name="${rec.name}"  ·  a FREE culture→norse generation would mint "${other}"  ·  held re-derivation name="${out.name}" ${out.name === rec.name ? '(KEPT)' : '⛔'}`);
  console.log(`    leaves speaking the OTHER name "${other}": ${leaks.length}${leaks.length ? ` — ${leaks.slice(0, 5).map(([p]) => p).join(', ')}` : ''}`);
  console.log(`    leaves speaking the HELD name (expected — this is the town's own name): ${staleOld.length} [${[...new Set(staleOld.map(([p]) => p.replace(/\[\d+\]/g, '[]')))].slice(0, 8).join(', ')}]`);
}

// ── (c) stress HELD vs RE-DERIVED ───────────────────────────────────────────
console.log('\n=== P6.c — `stress` HELD vs RE-DERIVED under §22 ===');
console.log('(stress is NOT in §22 ruling 1\'s held set; both arms are measured because the');
console.log(' record no longer carries the `summaryRoll` token its summary was rendered from.)');
for (const t of ['village', 'town', 'city']) {
  const row = SAMPLE.find(r => r.settType === t);
  const rec = generate(row);
  const base = { ...W4, tracePartition: rec, heldStepsForTrace: H2 };
  const asArr = (v) => (Array.isArray(v) ? v : (v ? [v] : []));
  const carriesRoll = asArr(rec.stress).filter(e => e && Object.prototype.hasOwnProperty.call(e, 'summaryRoll')).length;
  console.log(`\n${keyOf(row)}  record.stress entries=${asArr(rec.stress).length}  carrying summaryRoll=${carriesRoll}`);
  // (i) stress RE-DERIVED (the default — stress is not held)
  const reD = tryRederive({ ...row, culture: 'norse' }, heldOf(rec), base);
  // (ii) stress HELD: restore the record's stress after each of its producers
  const heldStress = tryRederive({ ...row, culture: 'norse' }, heldOf(rec), {
    ...base,
    onStepExtra: (name, c) => { if (['resolveStress', 'isolationPass', 'stressConfirmPass'].includes(name)) c.stress = clone(rec.stress); },
  });
  const fmt = (r) => (r.err ? `THREW ${r.err.slice(0, 50)}` : `name="${r.out.name}" summary[0]=${JSON.stringify(asArr(r.out.stress)[0]?.summary || '').slice(0, 90)}`);
  console.log(`  record             summary[0]=${JSON.stringify(asArr(rec.stress)[0]?.summary || '').slice(0, 90)}`);
  console.log(`  culture→norse, stress RE-DERIVED : ${fmt(reD)}`);
  console.log(`  culture→norse, stress HELD       : ${fmt(heldStress)}`);
  if (!reD.err && !heldStress.err) {
    const d = pathDiff(reD.out, heldStress.out);
    console.log(`  RE-DERIVED vs HELD, whole record: ${d.added.length}+/${d.changed.length}~/${d.removed.length}- [${fmtTally([...d.added, ...d.changed, ...d.removed], 6)}]`);
  }
  // and the no-edit arm: does holding stress break the no-edit reproduction?
  const noEditHeld = tryRederive(row, heldOf(rec), { ...base, onStepExtra: (name, c) => { if (['resolveStress', 'isolationPass', 'stressConfirmPass'].includes(name)) c.stress = clone(rec.stress); } });
  const noEditFree = tryRederive(row, heldOf(rec), base);
  console.log(`  NO EDIT: stress re-derived reproduces=${!noEditFree.err && h(noEditFree.out) === h(rec)} · stress held reproduces=${!noEditHeld.err && h(noEditHeld.out) === h(rec)}`);
}
