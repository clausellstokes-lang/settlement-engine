#!/usr/bin/env node
/**
 * GFOLD probe — WHY a late emission act draws 8 plots when its souls imply 87.
 * Rebuilds the leaf to a given epochCap, then walks each gate's outward ray exactly as
 * `frontierHost` does and reports (a) the FIRST open FIELD face the walk returns and its area,
 * (b) the LARGEST open FIELD face the same ray passes through, and (c) the largest open FIELD face
 * anywhere outside the wrap. If (a) is a sliver while (b)/(c) are large, the first-face order is
 * the throttle.
 *
 * Usage: node harness/gfold/frontierProbe.mjs --leaf=metropolis --cap=34
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { faceArea, faceCentroid, liveFaces, locateFace } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const key = arg('leaf', 'metropolis');
const cap = Number(arg('cap', '34'));
const spec = CORPUS.find((s) => s.key === key);
const { settlement, model, fabric } = buildOne(spec);
const input = partitionInputs(settlement, model, fabric);
const P = buildSettledPartition({ ...input, epochCap: cap });
const arr = P.arrangement;
const wrap = P.wraps[P.wraps.length - 1];
const rw = input.roadWidth || 5;
const aMin = 0.9 * rw * rw;

function inRing(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const outsideOpen = liveFaces(arr)
  .filter((f) => f.cls === 'FIELD' && !(f.attrs && f.attrs.inBand) && !inRing(wrap.outer, faceCentroid(arr, f.id)))
  .map((f) => ({ id: f.id, a: faceArea(arr, f.id) }))
  .sort((x, y) => y.a - x.a);
console.log(`LEAF ${key} cap=${cap} · plots ${P.plots} · wraps ${P.wraps.length} · gates ${wrap.gates.length}`);
console.log(`open FIELD faces OUTSIDE the wrap: ${outsideOpen.length}`
  + ` · total area ${outsideOpen.reduce((s, o) => s + o.a, 0).toFixed(0)}`
  + ` · largest ${outsideOpen[0] ? outsideOpen[0].a.toFixed(0) : 0}`
  + ` · median ${outsideOpen.length ? outsideOpen[Math.floor(outsideOpen.length / 2)].a.toFixed(0) : 0}`);
console.log(`aMin=${aMin.toFixed(1)}; an 87-plot act wants area ${(87 * aMin * 1.75).toFixed(0)};`
  + ` a 2-plot act wants ${(2 * aMin * 1.75).toFixed(0)}`);

const reach = rw * 3.2;
console.log('\ngate  anchorAt                 firstFieldFace  firstArea   largestOnRay  largestArea');
for (const gid of wrap.gates) {
  const c = faceCentroid(arr, gid);
  const dx = c[0] - input.extent.cx; const dy = c[1] - input.extent.cy;
  const L0 = Math.hypot(dx, dy) || 1;
  const at = [c[0] + (dx / L0) * reach, c[1] + (dy / L0) * reach];
  const ux = (at[0] - input.extent.cx); const uy = (at[1] - input.extent.cy);
  const LL = Math.hypot(ux, uy) || 1;
  const nx = ux / LL; const ny = uy / LL;
  const walkReach = Math.max(0, input.extent.radius * 0.98 - LL);
  let first = -1; let firstA = 0; let big = -1; let bigA = 0;
  for (let s = 0; s <= walkReach; s += rw) {
    const p = [at[0] + nx * s, at[1] + ny * s];
    const f = locateFace(arr, p[0], p[1]);
    if (f < 0) continue;
    const face = arr.faces[f];
    if (face.cls !== 'FIELD') continue;
    if (face.attrs && face.attrs.inBand) continue;
    const a = faceArea(arr, f);
    if (first < 0) { first = f; firstA = a; }
    if (a > bigA) { bigA = a; big = f; }
  }
  console.log(`${String(gid).padStart(5)}  [${at[0].toFixed(1)},${at[1].toFixed(1)}]`.padEnd(32)
    + `${String(first).padStart(10)}${firstA.toFixed(0).padStart(12)}`
    + `${String(big).padStart(15)}${bigA.toFixed(0).padStart(13)}`);
}
