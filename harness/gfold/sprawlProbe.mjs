#!/usr/bin/env node
/**
 * GFOLD probe — WHICH extramural PLOT faces the SPRAWL arm counts that no typed act paid for.
 * Rebuilds the leaf at two consecutive epochCaps and reports, for the faces that are PLOT and
 * outside the wrap's OUTER ring at the later cap but were not at the earlier one, their attrs and
 * their annotation key — so a reclaimed ruin, a wrap-split half and a genuinely untyped lot are
 * told apart by evidence rather than by hypothesis.
 *
 * Usage: node harness/gfold/sprawlProbe.mjs --leaf=city --a=8 --b=9
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { faceCentroid, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const key = arg('leaf', 'city');
const A = Number(arg('a', '8')); const B = Number(arg('b', '9'));
const spec = CORPUS.find((s) => s.key === key);
const { settlement, model, fabric } = buildOne(spec);
const input = partitionInputs(settlement, model, fabric);

function inRing(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function extraSet(P) {
  const arr = P.arrangement;
  const wrap = P.wraps[P.wraps.length - 1];
  const s = new Map();
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'PLOT') continue;
    if (wrap && inRing(wrap.outer, faceCentroid(arr, f.id))) continue;
    s.set(f.id, f);
  }
  return s;
}
const Pa = buildSettledPartition({ ...input, epochCap: A });
const Pb = buildSettledPartition({ ...input, epochCap: B });
const sa = extraSet(Pa); const sb = extraSet(Pb);
const typedA = Pa.emissions.reduce((s, e) => s + e.plots, 0);
const typedB = Pb.emissions.reduce((s, e) => s + e.plots, 0);
console.log(`LEAF ${key} · cap ${A} → ${B}`);
console.log(`extramural PLOT faces ${sa.size} → ${sb.size} (+${sb.size - sa.size});`
  + ` typed ${typedA} → ${typedB} (+${typedB - typedA});`
  + ` state.plots ${Pa.plots} → ${Pb.plots}`);
console.log(`emission acts drawn ${Pa.emissions.length} → ${Pb.emissions.length}`);
const added = [...sb.keys()].filter((id) => !sa.has(id));
console.log(`\nfaces present-and-extramural at ${B} but not at ${A}: ${added.length}`);
const tally = {};
for (const id of added) {
  const f = sb.get(id);
  const at = f.attrs || {};
  const ann = Pb.annotations[`plot.${id}`] || Pb.annotations[`void.${id}`] || null;
  const sig = `reclaimed=${!!at.reclaimed} lossState=${at.lossState || '-'} run=${at.run || '-'}`
    + ` piece=${at.piece === undefined ? '-' : at.piece} annotated=${!!ann}`;
  tally[sig] = (tally[sig] || 0) + 1;
}
for (const [sig, n] of Object.entries(tally).sort((x, y) => y[1] - x[1])) console.log(`  ${String(n).padStart(4)}  ${sig}`);
// faces that were extramural at A and are NOT at B (destroyed / re-classed)
const gone = [...sa.keys()].filter((id) => !sb.has(id));
console.log(`faces extramural at ${A} but not at ${B}: ${gone.length}`);
