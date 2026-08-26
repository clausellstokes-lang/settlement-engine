#!/usr/bin/env node
/**
 * harness/laneDRESS1/dressPerf.mjs — ⭐⭐ **§686.6(i)'s PERF WATCH, AND THIS WAVE'S OWN COST.**
 *
 * GROW-FOLD took the metropolis constructor **470 → 853 ms** (34 % of the signed 2,500 ms budget,
 * up from 19 %) and made it a WATCH ROW on DRESS-1, *"which lands ink on top of this"*. So this
 * instrument times the three stages APART — constructor · page projection · DRESS — under
 * `partitionPerf`'s own pinned protocol (warm process, three samples, median), because a single
 * end-to-end number cannot say which stage moved.
 *
 * ⚠ THE PUBLICATION IS TIMED WITH THE DRESS, not with the constructor: `publishWallWorks` is part
 * of what this wave added, and hiding it inside the substrate's column would understate the ink.
 *
 * Usage: node harness/laneDRESS1/dressPerf.mjs [--leaves=a,b] [--samples=3]
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { partitionInputs, PERF_BUDGET, PERF_PROTOCOL } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import { dressPage } from '../../src/domain/townMap/fabric/partitionDress.js';
import { wallForm } from '../../src/domain/townMap/fabric/walls.js';
import { pubOpts } from '../laneSPINE3/pubOpts.mjs';
import { faceRing } from '../../src/domain/townMap/fabric/partitionArrangement.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = (arg('leaves', 'village,town,city,metropolis,fjord,highwater')).split(',');
const samples = Number(arg('samples', '3'));
const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

console.log(`PROTOCOL ${JSON.stringify(PERF_PROTOCOL)}`);
console.log(`BUDGET   ${JSON.stringify(PERF_BUDGET)}   (the constructor cap is the one that BINDS)`);
let over = 0;
for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const form = wallForm(settlement, fabric.meta.tier).form;
  const mk = (P) => ({
    // ⭐ SPINE-3 · ONE SPELLING — and note the perf figure now includes the SITE reads.
    walls: publishWallWorks(P, pubOpts(settlement, fabric, input)),
    ring: (fid) => (P.arrangement.faces[fid] && P.arrangement.faces[fid].alive
      ? faceRing(P.arrangement, fid) : null),
  });
  // WARM — untimed, discarded
  {
    const P = buildSettledPartition(input);
    const pg = projectPage(P, { roadWidth: input.roadWidth });
    const m = mk(P);
    dressPage(pg, { lens: 'parchment', roadWidth: input.roadWidth, walls: m.walls, ringOfFace: m.ring });
  }
  const b = []; const p = []; const d = [];
  let bytes = 0;
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now();
    const P = buildSettledPartition(input);
    const t1 = performance.now();
    const pg = projectPage(P, { roadWidth: input.roadWidth });
    const t2 = performance.now();
    const m = mk(P);
    const dr = dressPage(pg, { lens: 'parchment', roadWidth: input.roadWidth, walls: m.walls, ringOfFace: m.ring });
    const t3 = performance.now();
    b.push(t1 - t0); p.push(t2 - t1); d.push(t3 - t2);
    bytes = Buffer.byteLength(dr.svg, 'utf8');
  }
  const bm = median(b); const pm = median(p); const dm = median(d);
  const total = bm + pm + dm;
  const ok = bm <= PERF_BUDGET.constructorMsMetropolis
    && (pm + dm) <= PERF_BUDGET.pageBaselineMsCity * PERF_BUDGET.pageMultiple;
  if (!ok) over++;
  console.log(`${key.padEnd(12)} ${fabric.meta.tier.padEnd(11)}`
    + ` build ${bm.toFixed(1).padStart(7)} ms  page ${pm.toFixed(1).padStart(6)} ms`
    + `  DRESS ${dm.toFixed(1).padStart(6)} ms  total ${total.toFixed(1).padStart(7)} ms`
    + `  ink ${String(bytes).padStart(7)} B  ${ok ? 'WITHIN BUDGET' : '⛔ OVER BUDGET'}`
    + `   dress share ${(100 * dm / total).toFixed(1)} %`);
}
console.log(`OVER BUDGET: ${over} of ${leaves.length}`);
process.exitCode = over ? 1 : 0;
