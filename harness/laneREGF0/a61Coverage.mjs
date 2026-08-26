#!/usr/bin/env node
/**
 * harness/laneREGF0/a61Coverage.mjs — ⭐⭐ REG-F0 · **WHERE THE A6.1 DATA ACTUALLY IS.**
 *
 * The charter's disposition rule turns on the phrase *"gains A6.1 data"*, so the manifest owes a
 * measurement of what that data IS and where it lives. This is that measurement.
 *
 * ⭐ THE ANSWER, AND IT DECIDES THE WHOLE MANIFEST: **A6.1 is a PARTITION channel.** The table is
 * `P.annotations`, written by `partitionConstruct.js`; `growthAnnotation.js` has exactly five
 * consumers (itself, `growthLedger`, `partitionConstruct`, `partitionCensus`, `stageManifest`) and
 * `harness/renderFolio.mjs` is not one of them. A legacy folio emitter therefore cannot "gain A6.1
 * data" where it stands — it gains it by being redrawn from a partition face that already has it.
 *
 * ⚠ TWO ROSTERS, NOT ONE, and conflating them is how a totality walker scores 100 % over the wrong
 * denominator. `OWING_CLASSES` is over the FABRIC LEAF's body families (parcel, mass, hut,
 * institution, wallRing…); `P.annotations` is keyed by the PARTITION's face classes (plot, way,
 * void, wallband, water, loss, gate, crossing, ward, wall, emit). The manifest cites the first for
 * disposition and the second for coverage, and says which each time.
 *
 * Usage: REG_FABRIC_OPTS='<arms>' node harness/laneREGF0/a61Coverage.mjs
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import {
  annotationObligation, OWING_CLASSES, TIMELESS_DRESS, DEFERRED_CLASSES,
} from '../../src/domain/townMap/fabric/growthAnnotation.js';

const armed = !!process.env.REG_FABRIC_OPTS;
console.log(`ARM: ${armed ? 'FULL' : 'dormant'}`);
const ob = annotationObligation();
console.log('\n══ A6.1 · THE OBLIGATION AS growthAnnotation.js DECLARES IT ══');
console.log(`  fields    : ${ob.fields.join(', ')}`);
console.log(`  provenance: ${ob.provenance.join(', ')}`);
console.log(`  OWING  (${OWING_CLASSES.length}): ${OWING_CLASSES.join(', ')}`);
console.log(`  TIMELESS DRESS — EXEMPT BY NAME (${TIMELESS_DRESS.length}): ${TIMELESS_DRESS.join(', ')}`);
console.log(`  DEFERRED: ${DEFERRED_CLASSES.map((d) => `${d.klass}→${d.owedBy}`).join(', ')}`);

console.log('\n══ WHAT THE PARTITION CARRIES TODAY (P.annotations, per leaf) ══');
console.log('  leaf          faces   alive  annotations  by key prefix');
let tot = 0, totFaces = 0;
const prefixTotals = {};
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const P = buildSettledPartition(partitionInputs(settlement, model, fabric));
  const keys = Object.keys(P.annotations || {});
  const byPre = {};
  for (const k of keys) { const p = k.split('.')[0]; byPre[p] = (byPre[p] || 0) + 1; prefixTotals[p] = (prefixTotals[p] || 0) + 1; }
  const alive = P.arrangement.faces.filter((f) => f && f.alive).length;
  tot += keys.length; totFaces += alive;
  console.log(`  ${spec.key.padEnd(12)} ${String(P.arrangement.faces.length).padStart(6)}`
    + ` ${String(alive).padStart(6)} ${String(keys.length).padStart(11)}   `
    + Object.entries(byPre).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}:${n}`).join(' '));
}
console.log(`  TOTAL over ${CORPUS.length} leaves: ${tot} annotations against ${totFaces} live faces`);
console.log(`  by prefix: ${Object.entries(prefixTotals).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}:${n}`).join(' ')}`);

/** ⛔ THE CONTROL. The claim that matters is a COMPARATIVE one — the partition has the data and the
 *  folio does not — so the folio side is measured rather than asserted. */
const folioSrc = await import('node:fs').then((fs) => fs.readFileSync(new URL('../renderFolio.mjs', import.meta.url), 'utf8'));
const folioReadsA61 = /growthAnnotation|appearanceEpoch|withinEpochOrder|beatEvents/.test(folioSrc);
console.log(`\n  FOLIO SIDE: harness/renderFolio.mjs references the A6.1 schema? ${folioReadsA61 ? '⛔ YES — re-derive this row' : 'NO'}`);
console.log(`  → "gains A6.1 data" is not available to a folio emitter in place; it is available`
  + ` only by PORTING onto a partition face that already carries it.`);
