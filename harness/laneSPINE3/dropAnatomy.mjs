#!/usr/bin/env node
/**
 * harness/laneSPINE3/dropAnatomy.mjs — ⭐⭐ **WHERE THE 281 UNITS GO.** WALL-CURTAIN, ODQ §699.3.
 *
 * The over-drop column says a wrap leaves 7 facets of dry ring undrawn. It does not say WHICH
 * rule dropped them, and three different rules in `sliceAtWater` could each be the whole cause:
 *
 *   1. **THE WET SEGMENTS THEMSELVES** — lawful. The wall may not stand there.
 *   2. **THE DRY NEIGHBOURS OF A WET SEGMENT** — a vertex is dropped when it is *incident to* a
 *      wet segment, so the entire facet on the far side of that vertex goes with it, however dry.
 *   3. **THE SHORT-SPAN RULE** — a surviving dry span of fewer than three vertices is discarded
 *      whole, however long its facets are.
 *
 * This instrument re-spells that predicate over each wrap ring and attributes every dropped unit to
 * exactly one of the three. **It exists because "the cure over-drops" is a finding and "rule 2
 * costs 4.0 of the 7.1 facets, and rule 1 is itself two-thirds dry" is an instruction**, and
 * because the lawfulness question the brief poses — *might only whole dry facets be publishable?* —
 * is answerable only against the decomposition, never against the total.
 *
 * ⚠⚠ **IT MEASURES THE SUPERSEDED RULE ON PURPOSE, AND ITS OUTPUT DOES NOT MOVE WITH THE CURE.**
 * Since WALL-CURTAIN, `wallPublication` no longer drops by vertex incidence at all — it clips at
 * the bank. This file keeps the OLD predicate because its job is to attribute the drop the old
 * predicate CAUSED; a reader who expects these columns to fall to zero at the tip has misread what
 * is being measured. **The cure's own reading is `wallWater.mjs`'s published-length column**, which
 * goes 8.65× → 1.00× and is the number to quote. ⭐ Stated here because an instrument whose figures
 * look stale but are correct is exactly the shape a successor "fixes" into uselessness.
 *
 * Usage: node harness/laneSPINE3/dropAnatomy.mjs [--leaves=a,b]
 */
import { CORPUS } from '../exemplars.mjs';
import { buildLeaf } from './wallWater.mjs';
import { pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);

const STEP = 1.0;
function segWet(a, b, rings) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.ceil(L / STEP));
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = a[0] + (b[0] - a[0]) * t; const y = a[1] + (b[1] - a[1]) * t;
    for (const w of rings) if (pointInPolygon(x, y, w)) return true;
  }
  // and a proper crossing of the boundary, for a reach narrower than the step
  for (const w of rings) {
    for (let j = 0; j < w.length; j++) {
      if (properCross(a, b, w[j], w[(j + 1) % w.length])) return true;
    }
  }
  return false;
}
function side(a, b, p) { return Math.sign((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])); }
function properCross(a, b, c, d) {
  const s1 = side(a, b, c); const s2 = side(a, b, d); const s3 = side(c, d, a); const s4 = side(c, d, b);
  return s1 !== 0 && s2 !== 0 && s3 !== 0 && s4 !== 0 && s1 !== s2 && s3 !== s4;
}
/** The arc length of this segment that is genuinely over water, by the same 1-unit sampling. */
function wetPart(a, b, rings) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.ceil(L / STEP));
  let wet = 0;
  for (let k = 0; k < n; k++) {
    const t = (k + 0.5) / n;
    const x = a[0] + (b[0] - a[0]) * t; const y = a[1] + (b[1] - a[1]) * t;
    if (rings.some((w) => pointInPolygon(x, y, w))) wet += L / n;
  }
  return wet;
}

console.log(`${'leaf'.padEnd(12)} ${'wrap'.padEnd(4)} ${'RING'.padEnd(9)}`
  + ` ${'(1) WET SEGMENTS'.padEnd(24)} ${'(2) DRY NEIGHBOURS'.padEnd(26)} ${'(3) SHORT SPANS'.padEnd(22)} verdict`);
let anyShort = 0;
for (const key of leaves) {
  const L = buildLeaf(key);
  if (!L.waterRings.length) continue;
  for (const w of L.P.wraps) {
    const ring = w.outer.map((p) => [p[0], p[1]]);
    const n = ring.length;
    const wetSeg = [];
    let ringLen = 0; let wetLen = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const l = Math.hypot(ring[j][0] - ring[i][0], ring[j][1] - ring[i][1]);
      ringLen += l;
      wetSeg[i] = segWet(ring[i], ring[j], L.waterRings);
      wetLen += wetPart(ring[i], ring[j], L.waterRings);
    }
    if (!wetSeg.some(Boolean)) continue;
    // the publication's own predicate, re-spelled here so the attribution is exact
    const wetAt = ring.map((p) => L.waterRings.some((r) => pointInPolygon(p[0], p[1], r)));
    for (let i = 0; i < n; i++) if (wetSeg[i]) { wetAt[i] = true; wetAt[(i + 1) % n] = true; }
    // a segment survives only if BOTH its ends survive
    let keptLen = 0; let droppedWetSegLen = 0; let droppedDryNeighbourLen = 0;
    const segKept = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const l = Math.hypot(ring[j][0] - ring[i][0], ring[j][1] - ring[i][1]);
      const kept = !wetAt[i] && !wetAt[j];
      segKept[i] = kept;
      if (kept) { keptLen += l; continue; }
      if (wetSeg[i]) droppedWetSegLen += l; else droppedDryNeighbourLen += l;
    }
    // rule 3: spans of fewer than three surviving vertices are discarded whole
    const spans = [];
    let start = 0;
    while (start < n && !(wetAt[start] === false && wetAt[(start - 1 + n) % n] === true)) start++;
    if (start < n) {
      let cur = null;
      for (let s = 0; s < n; s++) {
        const i = (start + s) % n;
        if (wetAt[i]) { if (cur) { spans.push(cur); cur = null; } continue; }
        if (!cur) cur = [];
        cur.push(i);
      }
      if (cur) spans.push(cur);
    }
    let shortLen = 0; let shortCount = 0;
    for (const at of spans) {
      if (at.length >= 3) continue;
      shortCount++;
      for (let k = 0; k + 1 < at.length; k++) {
        const a = ring[at[k]]; const b = ring[at[k + 1]];
        shortLen += Math.hypot(b[0] - a[0], b[1] - a[1]);
      }
    }
    anyShort += shortCount;
    const facet = ringLen / n;
    const total = droppedWetSegLen + droppedDryNeighbourLen + shortLen;
    console.log(`${key.padEnd(12)} E${String(w.index).padEnd(3)} ${`${ringLen.toFixed(0)}u/${n}f`.padEnd(9)}`
      + ` ${`${droppedWetSegLen.toFixed(1)}u (${(droppedWetSegLen / facet).toFixed(1)}f)`.padEnd(24)}`
      + ` ${`${droppedDryNeighbourLen.toFixed(1)}u (${(droppedDryNeighbourLen / facet).toFixed(1)}f)`.padEnd(26)}`
      + ` ${`${shortLen.toFixed(1)}u × ${shortCount} span(s)`.padEnd(22)}`
      + ` total ${total.toFixed(1)}u vs genuinely wet ${wetLen.toFixed(1)}u`);
  }
}
console.log(`\nSHORT-SPAN RULE fired on ${anyShort} span(s) corpus-wide`
  + ` — ${anyShort ? 'it is a live cause' : 'it is DEAD on this corpus, so it is not the over-drop and must not be blamed for it'}`);
console.log('COLUMN (1) is the LAWFUL drop ONLY where it is genuinely wet — a facet that dips into');
console.log('  the water for 8 units is dropped for all 35, so most of column (1) is dry too.');
console.log('COLUMN (2) is over-drop entire: DRY facets discarded for touching a vertex the water reached.');

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * ⛔⛔ **THE LAWFULNESS TEST — DOES THE ESTATE'S OWN SHIPPED WALL END AT THE BANK?**
 *
 * The brief poses it plainly and it must be answered before any cure: *if the over-drop turns out
 * to be lawful — for instance if only whole dry fragments may lawfully publish — then prove that
 * and say so.* The hypothesis is not settled by reading the successor's own code, which is the
 * thing under suspicion. It is settled by the LEGACY: `walls.js` has shipped a bankside wall for
 * this estate's whole life, and §161m.3's *"the water is the fourth wall"* is ITS sentence.
 *
 * `walls.js:399` filters the traced ring by `distToPolyline(x, y, water.line) > water.width * 1.1`
 * — a vertex filter, like the successor's. **So the precedent for dropping vertices exists.** The
 * question the number answers is how much wall that costs, and there are two ways it can be small:
 * a STATED STANDOFF (1.1 channel widths is a deliberate margin, and a channel is 10–19 units) and
 * a FINE RING (a dropped vertex on a densely traced ring costs a few units, not a facet).
 *
 * If the legacy ends within a few units of the bank, ending 25–96 units short is a DEFECT.
 * If the legacy ends 60 units short too, the over-drop is the house style and this lane should
 * say so and stop. Run with `--legacy`.
 * ════════════════════════════════════════════════════════════════════════════════════════ */
if (process.argv.includes('--legacy')) {
  const { distToPolyline } = await import('../../src/domain/townMap/fabric/fabricGeometry.js');
  console.log('\n── ⛔ THE LAWFULNESS TEST: WHERE DOES THE LEGACY WALL END? ─────────────────');
  console.log(`${'leaf'.padEnd(12)} ${'circuit'.padEnd(9)} ${'ring'.padEnd(16)} ${'facet'.padEnd(8)}`
    + ` ${'end → BANK'.padEnd(20)} ${'end → CHANNEL LINE'.padEnd(22)} standoff law`);
  for (const key of leaves) {
    const L = buildLeaf(key);
    if (!L.waterRings.length && !L.channel) continue;
    for (const c of (L.fabric.walls || [])) {
      const poly = c.polygon || [];
      if (poly.length < 3) continue;
      let per = 0;
      const lastSeg = c.halfRing ? poly.length - 1 : poly.length;
      for (let i = 0; i < lastSeg; i++) {
        const a = poly[i]; const b = poly[(i + 1) % poly.length];
        per += Math.hypot(b[0] - a[0], b[1] - a[1]);
      }
      const facet = per / Math.max(1, lastSeg);
      const ends = c.halfRing ? [poly[0], poly[poly.length - 1]] : [];
      const toBank = ends.map((p) => (L.waterRings.length
        ? Math.min(...L.waterRings.map((w) => distToPolyline(p[0], p[1], w.concat([w[0]]))))
        : Infinity));
      const toLine = ends.map((p) => (L.channel ? distToPolyline(p[0], p[1], L.channel) : Infinity));
      const w = L.input.water;
      console.log(`${key.padEnd(12)} ${`E${c.epoch}${c.halfRing ? ' HALF' : ' closed'}`.padEnd(9)}`
        + ` ${`${per.toFixed(0)}u / ${poly.length}v`.padEnd(16)} ${`${facet.toFixed(1)}u`.padEnd(8)}`
        + ` ${(ends.length ? toBank.map((d) => d.toFixed(1)).join(' · ') : '—').padEnd(20)}`
        + ` ${(ends.length ? toLine.map((d) => d.toFixed(1)).join(' · ') : '—').padEnd(22)}`
        + ` ${w ? `${w.mode} w=${w.width != null ? w.width.toFixed(1) : '—'} ⇒ 1.1w = ${w.width != null ? (w.width * 1.1).toFixed(1) : '—'}` : 'no water input'}`);
    }
  }
  console.log('⭐ READ IT AS: the legacy\'s END → CHANNEL LINE against its own stated law, 1.1 × width.');
}
