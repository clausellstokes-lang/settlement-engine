#!/usr/bin/env node
/**
 * GFOLD probe — STRAY ANNOTATIONS: keys in `P.annotations` that no live drawn element claims.
 * `walkTotality` walks the DRAWN roster only, so a stray is structurally invisible to the census —
 * which is why the E9 gate case, whose plant deletes `the first plot.* key`, is the only instrument
 * in the estate that can trip over one. Reports the total, the first `plot.*` key and whether it is
 * claimed, plus the plots/plotFaces drift, at whatever tree this is run in.
 *
 * Usage: node harness/gfold/strayProbe.mjs [--leaf=a,b,c]   (default: the E9 fixture's leaf + corpus)
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const keys = arg('leaf', CORPUS.map((s) => s.key).join(',')).split(',');

function drawnKeys(P) {
  const arr = P.arrangement;
  const set = new Set();
  for (const f of liveFaces(arr)) {
    if (f.cls === 'PLOT') set.add(`plot.${f.piece}`);
    else if (f.cls === 'VOID') set.add(`void.${f.id}`);
    else if (f.cls === 'WAY') set.add((f.attrs && f.attrs.gate) ? `gate.${f.id}` : `way.${f.id}`);
    else if (f.cls === 'WALLBAND') set.add(`wallband.${f.id}`);
    else if (f.cls === 'WATER') set.add(`water.${f.id}`);
    else if (f.cls === 'LOSSREGION') set.add(`loss.${f.id}`);
  }
  for (const w of (P.wraps || [])) set.add(`wall.E${w.index}`);
  for (const [i] of (P.crossings || []).entries()) set.add(`crossing.${i}`);
  for (const p of arr.pieces) if (p.cls === 'WARD') set.add(`ward.${p.id}`);
  for (const e of (P.emissions || [])) set.add(`emit.${e.key}`);
  return set;
}

let totalStray = 0; let firstPlotUnclaimed = 0;
console.log('leaf         plots plotFaces drift  annots  strays  byPrefix                       firstPlotKey  claimed');
for (const key of keys) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const P = buildSettledPartition(partitionInputs(settlement, model, fabric));
  const drawn = drawnKeys(P);
  const stray = Object.keys(P.annotations).filter((k) => !drawn.has(k));
  const byPrefix = {};
  for (const k of stray) { const p = k.split('.')[0]; byPrefix[p] = (byPrefix[p] || 0) + 1; }
  const firstPlot = Object.keys(P.annotations).find((k) => k.startsWith('plot.'));
  const claimed = firstPlot ? drawn.has(firstPlot) : null;
  if (claimed === false) firstPlotUnclaimed++;
  totalStray += stray.length;
  const plotFaces = liveFaces(P.arrangement).filter((f) => f.cls === 'PLOT').length;
  console.log(`${key.padEnd(12)}${String(P.plots).padStart(6)}${String(plotFaces).padStart(10)}`
    + `${String(P.plots - plotFaces).padStart(7)}${String(Object.keys(P.annotations).length).padStart(8)}`
    + `${String(stray.length).padStart(8)}  ${JSON.stringify(byPrefix).padEnd(31)}${String(firstPlot).padStart(13)}  ${claimed}`);
}
console.log(`\nTOTAL strays over ${keys.length} leaf/leaves: ${totalStray}`);
console.log(`leaves whose FIRST plot.* annotation is UNCLAIMED (the E9 plant's target): ${firstPlotUnclaimed}`);
