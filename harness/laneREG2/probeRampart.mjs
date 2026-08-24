/** probeRampart.mjs — the armed rampart's own figures, per walled leaf. */
import { CORPUS, buildOne } from '../exemplars.mjs';

const rows = [];
for (const spec of CORPUS) {
  const { fabric } = buildOne(spec, { rampart: true });
  if (!fabric.walls.length) continue;
  const reg = fabric.meta.bandRegime;
  for (const ring of fabric.walls) {
    const r = ring.rampart;
    if (!r) { rows.push({ leaf: spec.key, epoch: ring.epoch, ERR: 'no rampart key' }); continue; }
    rows.push({
      leaf: spec.key, tier: fabric.meta.tier, epoch: ring.epoch, kind: ring.kind,
      regime: r.regime, mil: reg.military, peace: reg.peace, rung: r.rung, form: ring.form,
      turnCut: r.turnCut, joints: r.joints.length, gh: r.gatehouses.length,
      stations: r.stats.stations, cand: r.stats.candidates, rej: r.stats.rejected,
      byCls: r.stats.byClass.join('/'), sites: `${r.stats.sites.turn}/${r.stats.sites.terminus}/${r.stats.sites.gate}`,
      exc: `${r.stats.exceptions.turn}/${r.stats.exceptions.terminus}/${r.stats.exceptions.gate}`,
      laneDrop: r.laneDropped,
      kinds: Object.entries(r.stats.byKind).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(' '),
    });
  }
}
const h = ['leaf', 'tier', 'epoch', 'kind', 'regime', 'mil', 'peace', 'rung', 'form', 'turnCut', 'joints', 'gh', 'stations', 'cand', 'rej', 'byCls', 'sites', 'exc', 'laneDrop', 'kinds'];
console.log(h.join('\t'));
for (const r of rows) console.log(h.map((k) => (r[k] === undefined ? '-' : r[k])).join('\t'));
const totalExc = rows.reduce((n, r) => n + (r.exc ? r.exc.split('/').reduce((a, b) => a + Number(b), 0) : 0), 0);
console.log(`\nTOTAL UNCOVERED SITES (turn+terminus+gate) over ${rows.length} rings: ${totalExc}`);
