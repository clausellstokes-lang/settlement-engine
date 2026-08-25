#!/usr/bin/env node
/**
 * GFOLD probe — per-epoch attribution for ONE leaf, by the epochCap walk (the differential's own
 * method): plots at the close of each epoch, the emission acts drawn by then and the plots they
 * drew, plus the open intramural FIELD area the next epoch's infill would have to spend into.
 * Run the SAME file in the base worktree and the cured worktree and diff.
 *
 * Usage: node harness/gfold/epochPlots.mjs --leaf=metropolis
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { faceArea, faceCentroid, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const key = arg('leaf', 'metropolis');
const spec = CORPUS.find((s) => s.key === key);
const { settlement, model, fabric } = buildOne(spec);
const input = partitionInputs(settlement, model, fabric);
const eps = input.ledger.epochs;

function inRing(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1])
      && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

console.log(`LEAF ${key} · ${eps.length} epochs`);
console.log('  k year      pop  target  plots  dPlots  wraps acts drawn emitPlots  openFieldIn  openIn# maxOpenIn  frontierField');
let prev = 0;
for (let k = 1; k <= eps.length; k++) {
  const P = buildSettledPartition({ ...input, epochCap: k });
  const arr = P.arrangement;
  const wrap = P.wraps.length ? P.wraps[P.wraps.length - 1] : null;
  let openIn = 0; let openInN = 0; let maxOpenIn = 0; let frontier = 0;
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'FIELD') continue;
    if (f.attrs && f.attrs.inBand) continue;
    const a = faceArea(arr, f.id);
    const c = faceCentroid(arr, f.id);
    if (wrap && inRing(wrap.inner, c)) { openIn += a; openInN++; if (a > maxOpenIn) maxOpenIn = a; }
    else frontier += a;
  }
  const acts = eps.slice(0, k).reduce((s, e) => s + (e.emissions || []).length, 0);
  const finalPop = Math.max(1, eps[eps.length - 1].population);
  const target = Math.round((input.bodyTarget || 0) * (eps[k - 1].population / finalPop));
  const emitPlots = P.emissions.reduce((s, e) => s + e.plots, 0);
  const raise = (eps[k - 1].circuitEvents || []).length ? ' ← RAISE' : '';
  console.log(`${String(k).padStart(3)}${String(eps[k - 1].year).padStart(5)}${String(eps[k - 1].population).padStart(9)}`
    + `${String(target).padStart(8)}${String(P.plots).padStart(7)}${String(P.plots - prev).padStart(8)}`
    + `${String(P.wraps.length).padStart(7)}${String(acts).padStart(5)}${String(P.emissions.length).padStart(6)}`
    + `${String(emitPlots).padStart(10)}${openIn.toFixed(0).padStart(13)}${String(openInN).padStart(9)}`
    + `${maxOpenIn.toFixed(0).padStart(10)}${frontier.toFixed(0).padStart(15)}${raise}`);
  prev = P.plots;
}
