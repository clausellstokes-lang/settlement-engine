/**
 * probeColumns.mjs — WHY a drawn body refuses to columnise, counted by cause.
 * A break with no reason is what frontageFusion.js exists to refuse; this is the audit of the
 * one break whose cause is not a law but a SHAPE.
 * Run from the tree root: node harness/laneREG1/probeColumns.mjs [key ...]
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { columnise } from '../../src/domain/townMap/fabric/frontageFusion.js';

const EPS = 1e-6;
const want = process.argv.slice(2).filter((a) => !a.startsWith('--'));

for (const spec of CORPUS) {
  if (want.length && want.indexOf(spec.key) < 0) continue;
  const { fabric } = buildOne(spec, { frontageFusion: true });
  /** @type {Map<string, any>} */ const frames = new Map();
  // the frames are internal to the pack; re-read them off the fusion's own masses is not
  // possible, so rebuild the map the way the fuser does — via a second armed build's packed
  // frames is not exposed either. Instead: use the parcels' own runKey and recover the frame
  // from the fusion module's published masses where one exists, and from the parcel's grain
  // otherwise. The grain is enough: ux = cos(grainAngle) is what the cut used.
  const byRun = new Map();
  for (const p of fabric.parcels) {
    if (!p.fuse) continue;
    if (!byRun.has(p.fuse.runKey)) byRun.set(p.fuse.runKey, []);
    byRun.get(p.fuse.runKey).push(p);
  }
  const merged = fabric.lod.mergedKeys;
  const tally = { total: 0, ok: 0, tooFewPoints: 0, nonRectilinear: 0, multiInterval: 0 };
  const byFlag = { plain: [0, 0], gable: [0, 0], wing: [0, 0], derelict: [0, 0] };
  for (const [runKey, list] of byRun) {
    // Recover the frame from the run's own plot lines: plotLine runs along v from the street
    // line into the block, so its direction IS the v axis and its perpendicular is u.
    const seed = list.find((p) => p.plotLine && p.plotLine.length === 2);
    if (!seed) continue;
    const [[x0, y0], [x1, y1]] = seed.plotLine;
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 1e-9) continue;
    const vx = (x1 - x0) / L, vy = (y1 - y0) / L;
    const fr = { ax: x0, ay: y0, ux: vy, uy: -vx, dir: 1, frontV: 0 };
    for (const p of list) {
      if (merged.has(p.key)) continue;
      tally.total++;
      const flag = p.gable ? 'gable' : (p.wing ? 'wing' : 'plain');
      const got = columnise(fr, p.polygon);
      byFlag[flag][got ? 0 : 1]++;
      if (p.derelict) byFlag.derelict[got ? 0 : 1]++;
      if (got) { tally.ok++; continue; }
      // Re-run the three refusals separately to attribute the cause.
      const P = p.polygon.map(([x, y]) => [
        (x - fr.ax) * fr.ux + (y - fr.ay) * fr.uy, (x - fr.ax) * -fr.uy + (y - fr.ay) * fr.ux]);
      if (P.length < 4) { tally.tooFewPoints++; continue; }
      let rect = true;
      for (let i = 0; i < P.length; i++) {
        const a = P[i], b = P[(i + 1) % P.length];
        if (Math.abs(a[0] - b[0]) > EPS && Math.abs(a[1] - b[1]) > EPS) { rect = false; break; }
      }
      if (!rect) tally.nonRectilinear++; else tally.multiInterval++;
      void runKey;
    }
  }
  process.stdout.write(`${spec.key.padEnd(12)} total=${tally.total} ok=${tally.ok} `
    + `(${Math.round((1000 * tally.ok) / Math.max(1, tally.total)) / 10}%)  `
    + `tooFewPoints=${tally.tooFewPoints} nonRectilinear=${tally.nonRectilinear} multiInterval=${tally.multiInterval}\n`);
  process.stdout.write(`${' '.repeat(12)} by shape [ok,refused] plain=${byFlag.plain} gable=${byFlag.gable} wing=${byFlag.wing} derelict=${byFlag.derelict}\n`);
}
process.stdout.write('PROBE_COLUMNS_DONE\n');
