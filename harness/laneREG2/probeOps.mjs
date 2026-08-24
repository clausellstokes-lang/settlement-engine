/** probeOps.mjs — THE §217 TABLE. Every leaf × every lens, base vs armed, against the pinned
 *  ceiling. Also measures the true post-§15 tail, which is what RAMPART_TAIL_RESERVE is set from. */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { renderFolio, OP_CEILING_BY_TIER } from '../renderFolio.mjs';

const LENSES = ['parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible', 'illustrated'];
const rows = [];
let worstTail = 0, worstTailAt = '';
for (const spec of CORPUS) {
  const base = buildOne(spec, {});
  const armed = buildOne(spec, { rampart: true });
  const walled = armed.fabric.walls.length > 0;
  for (const lens of LENSES) {
    const b = renderFolio(base.fabric, { lens });
    const a = renderFolio(armed.fabric, { lens });
    const ceil = OP_CEILING_BY_TIER[armed.fabric.meta.tier];
    const tail = a.wallOps ? a.primitiveCount - a.wallOps.exit : 0;
    if (walled && tail > worstTail) { worstTail = tail; worstTailAt = `${spec.key}/${lens}`; }
    rows.push({
      leaf: spec.key, lens, tier: armed.fabric.meta.tier, walled, ceil,
      base: b.primitiveCount, armed: a.primitiveCount, delta: a.primitiveCount - b.primitiveCount,
      head: ceil - a.primitiveCount, over: a.primitiveCount > ceil,
      wallBase: b.wallOps ? b.wallOps.exit - b.wallOps.entry : 0,
      wallArmed: a.wallOps ? a.wallOps.exit - a.wallOps.entry : 0,
      bands: a.wallOps ? a.wallOps.spend.bands : 0,
      joints: a.wallOps ? a.wallOps.spend.joints : 0,
      gates: a.wallOps ? a.wallOps.spend.gates : 0,
      ticks: a.wallOps ? a.wallOps.spend.ticks : 0,
      pitch: a.wallOps ? a.wallOps.spend.tickPitch : 0,
      coarsen: a.wallOps ? a.wallOps.spend.tickRung : 0,
      tail,
    });
  }
}
const h = ['leaf', 'lens', 'tier', 'ceil', 'base', 'armed', 'delta', 'head', 'over', 'wallBase', 'wallArmed', 'bands', 'joints', 'gates', 'ticks', 'pitch', 'coarsen', 'tail'];
console.log(h.join('\t'));
for (const r of rows) if (r.walled) console.log(h.map((k) => r[k]).join('\t'));
const over = rows.filter((r) => r.over);
console.log(`\nRENDERS: ${rows.length} (${rows.filter((r) => r.walled).length} walled). OVER CEILING: ${over.length}` + (over.length ? ' → ' + over.map((r) => `${r.leaf}/${r.lens} ${r.armed}/${r.ceil}`).join(', ') : ''));
console.log(`TIGHTEST HEADROOM (walled): ` + rows.filter((r) => r.walled).sort((a, b) => a.head - b.head).slice(0, 4).map((r) => `${r.leaf}/${r.lens} ${r.head}`).join(' · '));
console.log(`MAX POST-§15 TAIL over walled renders: ${worstTail} at ${worstTailAt} (RAMPART_TAIL_RESERVE is 140)`);
const unw = rows.filter((r) => !r.walled && r.delta !== 0);
console.log(`UNWALLED LEAVES WITH A NONZERO DELTA: ${unw.length}` + (unw.length ? ' ⛔ ' + unw.map((r) => `${r.leaf}/${r.lens}`).join(',') : ' — none, as required'));
