#!/usr/bin/env node
/**
 * harness/laneREGF0/leafAgreement.mjs — ⭐⭐ REG-F0 · **A MATCHING LEAF COUNT IS NOT A MATCHING
 * LEAF SET**, and this is the instrument that caught it.
 *
 * ⛔ THE DEFECT CLASS, MEASURED IN THIS LANE'S OWN FIRST DRAFT OF THE MANIFEST. The bridges row
 * read *"dress-decks on 8/18 — the same 8 leaves"* because both sides emit on **8**. They are not
 * the same eight: the FOLIO draws a deck on `year-018` that the dress does not, and the DRESS
 * draws one on `town-2` that the folio does not. Overlap 7, union 9. A count-only comparison would
 * have graded that family fully ported.
 *
 * ⭐ §710.6 APPLIED TO A CENSUS RATHER THAN TO A MARK: assert PLACEMENT, not existence — and a
 * leaf identity IS a placement claim. Two families that agree on a total and disagree on which
 * worlds carry them are two different drawings.
 *
 * ⚠ DISCOVERY ARM. It sets no bar; it reports set differences. The folio side comes from the
 * traced twin (stage attribution), the dress side from a group scan of the same build.
 *
 * Usage: REG_FABRIC_OPTS='<arms>' node harness/laneREGF0/leafAgreement.mjs
 */
import { CORPUS } from '../exemplars.mjs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { scanGroups } from './svgGroups.mjs';
import { assertArm } from './armGuard.mjs';
import { readFileSync } from 'node:fs';
import { buildTrace } from './makeTrace.mjs';

buildTrace();
const { renderFolio: traced, __T, __resetTrace } = await import('./folioTrace.mjs');
assertArm(true);

/**
 * The families where BOTH sides emit on a proper subset of the corpus — the only ones where a leaf
 * set can disagree. A family live on 18/18 on both sides has nothing to compare.
 * `folioLines` are the `── N ·` stage heading lines a family's marks bin into; several families
 * span two bins (water is split between the body pass and the adaptive bank keep).
 */
export const PAIRS = Object.freeze([
  { id: 'F0-08', family: 'water body + shore', folioLines: [1021, 1080], dress: ['dress-water', 'dress-shore'] },
  { id: 'F0-22', family: 'quay furniture / V-QUAY', folioLines: [2108], dress: ['dress-quays', 'dress-vquay'] },
  { id: 'F0-25', family: 'bridges — decks', folioLines: [2191], dress: ['dress-decks'] },
  { id: 'F0-26', family: 'fords', folioLines: [2226], dress: ['dress-ford'] },
  { id: 'F0-27', family: 'the rampart', folioLines: [2301, 2785], dress: ['dress-band', 'dress-coursing', 'dress-comb', 'dress-gates', 'dress-towers'] },
  { id: 'F0-28', family: 'relict circuit', folioLines: [2893], dress: ['dress-relict'] },
  { id: 'F0-29', family: '§10 state expressions', folioLines: [2927], dress: ['dress-camp', 'dress-barred', 'dress-emptystall', 'dress-watchfire', 'dress-trampled'] },
]);

const INTERNAL = new Set();
for (let n = 456; n <= 474; n++) INTERNAL.add(n);
for (let n = 671; n <= 676; n++) INTERNAL.add(n);
const callerOf = (hits) => { for (const h of hits) if (!INTERNAL.has(h)) return h; return hits[hits.length - 1] || -1; };

/**
 * ⛔⛔ THE INSTRUMENT BUG THIS FILE WAS BORN WITH, KEPT IN THE HEADER BECAUSE IT IS THE WHOLE
 * LESSON AGAIN ONE LEVEL UP. The first cut binned traced lines against the SPARSE set of stage
 * lines named in `PAIRS`. A line anywhere between two of them fell into the earlier one — so the
 * street web (line 1163) was billed to the water pass (bin 1080) and water came back **18/18**
 * against the stage attribution's **12**. Quays read 18 and §10 state read 18 for the same reason.
 * ⭐ IT WAS CAUGHT BY DISAGREEMENT WITH A SECOND INSTRUMENT, not by inspection: `stageAttribution`
 * already had the true per-stage leaf counts and they did not match. **Bins must come from the
 * FILE'S OWN COMPLETE stage table**, exactly as `stageAttribution.mjs` builds it; a sparse bin
 * table is not a coarser measurement, it is a wrong one.
 */
const SRC = readFileSync(new URL('../renderFolio.mjs', import.meta.url), 'utf8').split('\n');
const ALL_BINS = [];
SRC.forEach((L, i) => { if (/^\s*(?:\/\/|\/\*+)\s*──\s*/.test(L)) ALL_BINS.push(i + 1); });
const binOf = (line) => { let best = null; for (const b of ALL_BINS) { if (b <= line) best = b; else break; } return best; };
for (const p of PAIRS) {
  for (const l of p.folioLines) {
    if (!ALL_BINS.includes(l)) throw new Error(`PAIRS names line ${l}, which is not a stage heading in renderFolio.mjs`);
  }
}

/** @type {Map<number, Set<string>>} */ const folioOn = new Map();
/** @type {Map<string, Set<string>>} */ const dressOn = new Map();
for (const spec of CORPUS) {
  const r = dressLeaf(spec.key, 'parchment');
  __resetTrace();
  traced(r.fabric, { lens: 'parchment', words: true });
  /** ⚠ a bin only counts when a mark landed IN it, not when the pass merely ran */
  const seenBins = new Set();
  for (const ev of __T) {
    const b = binOf(callerOf(ev.line));
    if (b !== null) seenBins.add(b);
  }
  for (const b of seenBins) { if (!folioOn.has(b)) folioOn.set(b, new Set()); folioOn.get(b).add(spec.key); }
  for (const g of scanGroups(r.svg).groups) {
    if (g.marks > 0 && g.path.startsWith('dress-')) {
      if (!dressOn.has(g.path)) dressOn.set(g.path, new Set());
      dressOn.get(g.path).add(spec.key);
    }
  }
  process.stdout.write('.');
}
process.stdout.write('\n');

const U = (sets) => { const o = new Set(); for (const s of sets) for (const v of (s || [])) o.add(v); return o; };
console.log(`\n══ LEAF AGREEMENT — folio family vs partition family, over ${CORPUS.length} leaves ══`);
let disagreements = 0;
for (const p of PAIRS) {
  const F = U(p.folioLines.map((l) => folioOn.get(l)));
  const D = U(p.dress.map((g) => dressOn.get(g)));
  const both = [...F].filter((x) => D.has(x)).sort();
  const fOnly = [...F].filter((x) => !D.has(x)).sort();
  const dOnly = [...D].filter((x) => !F.has(x)).sort();
  const sameCount = F.size === D.size;
  const sameSet = fOnly.length === 0 && dOnly.length === 0;
  if (!sameSet) disagreements++;
  console.log(`\n  ${p.id}  ${p.family}`);
  console.log(`     folio ${String(F.size).padStart(2)}  dress ${String(D.size).padStart(2)}`
    + `  overlap ${String(both.length).padStart(2)}  union ${U([F, D]).size}`
    + `   ${sameSet ? '✓ SAME LEAVES' : (sameCount ? '⛔ SAME COUNT, DIFFERENT LEAVES' : '⚠ differs')}`);
  if (fOnly.length) console.log(`     folio only: ${fOnly.join(' ')}`);
  if (dOnly.length) console.log(`     dress only: ${dOnly.join(' ')}`);
}
console.log(`\n  ${PAIRS.length - disagreements}/${PAIRS.length} families agree on the exact leaf set.`);
