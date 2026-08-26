#!/usr/bin/env node
/**
 * harness/laneDRESS1/squint.mjs — ⭐⭐ **EXIT 2's SECOND HALF: "SQUINT AT 320 px KEEPS THE
 * HIERARCHY."**
 *
 * The value ladder in `partitionDress.valueCensus` is a claim about TONES. This is the claim about
 * PIXELS at the review's own squint scale: I3's conviction was stated at exactly 320 px (*"the
 * 320 px squint inverts to a dense crescent around a pale void; hf378's density ladder inverts —
 * core emptier than periphery"*), so the instrument has to ask that question, in that geometry.
 *
 * ⛔⛔ **THE FIRST SPELLING WAS A DEAD INSTRUMENT AND ITS OWN OUTPUT SAID SO.** It shot the page
 * with `--window-size=320,320`; Chrome rendered the SVG at its intrinsic 1,000 px and the shot
 * captured the top-left 320 px of blank margin. Every leaf came back
 * `core median L 0.7351 · rim 0.7351 · ratio 1.0000` — SIX leaves agreeing to four decimals, which
 * is the signature of a measurement of nothing (0.7351 is the paper's own luminance). The estate's
 * own standing law: *proving a zero delta is harder than proving a positive one, because identical
 * readings are exactly what a dead instrument returns.* The page is now DOWNSCALED, not cropped.
 *
 * ⭐ **AND THE WINDOW IS THE SETTLEMENT'S, NOT THE FRAME'S.** Frame-to-extent puts the built area
 * wherever the partition's extent puts it, so a fixed middle-third window measures whatever
 * happens to be there. The centre is taken from the INK ITSELF — the centroid of the darkest
 * decile — and the radius from the ink's own spread, so the core/ring comparison is about the
 * settlement on every leaf.
 *
 * ⛔ THREE PLANTS, and each must move the verdict, or a green here means nothing.
 *
 * Usage: node harness/laneDRESS1/squint.mjs [--leaves=a,b] [--px=320] [--src=<pngDir>]
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { luminance } from '../../src/domain/townMap/fabric/folioLenses.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const SP = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad';
const src = arg('src', join(SP, 'dress1-png'));
const px = Number(arg('px', '320'));
const only = arg('leaves', '') ? arg('leaves', '').split(',') : null;

const sharp = (await import('sharp')).default;
const hex = (r, g, b) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const med = (a) => (a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : null);

/** Downscale the finished page to the squint scale and return its luminance grid. */
async function squintGrid(file, n) {
  const { data, info } = await sharp(file).resize(n, n, { fit: 'inside' })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const g = [];
  for (let y = 0; y < info.height; y++) {
    const row = [];
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      row.push(luminance(hex(data[i], data[i + 1], data[i + 2])));
    }
    g.push(row);
  }
  return { g, w: info.width, h: info.height };
}

/**
 * The verdict: is the settlement's CORE darker than the ring around it?
 * @returns {{core:number, ring:number, ratio:number, holds:boolean, inkPx:number}}
 */
export function hierarchyOf(g, w, h) {
  const all = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) all.push(g[y][x]);
  const sorted = all.slice().sort((a, b) => a - b);
  const darkBar = sorted[Math.floor(sorted.length * 0.10)];
  let sx = 0; let sy = 0; let n = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) if (g[y][x] <= darkBar) { sx += x; sy += y; n++; }
  }
  if (!n) return { core: null, ring: null, ratio: null, holds: false, inkPx: 0 };
  const cx = sx / n; const cy = sy / n;
  const d = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) if (g[y][x] <= darkBar) d.push(Math.hypot(x - cx, y - cy));
  }
  d.sort((a, b) => a - b);
  const R = d[Math.floor(d.length * 0.80)] || 1;
  const core = []; const ring = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = Math.hypot(x - cx, y - cy);
      if (r <= R * 0.5) core.push(g[y][x]);
      else if (r <= R * 1.6) ring.push(g[y][x]);
    }
  }
  const mc = med(core); const mr = med(ring);
  if (mc == null || mr == null) return { core: mc, ring: mr, ratio: null, holds: false, tied: false, inkPx: n };
  const ratio = mc > mr ? (mc + 0.05) / (mr + 0.05) : (mr + 0.05) / (mc + 0.05);
  /**
   * ⛔⛔ **DRESS-1b · A TIE IS NOT AN INVERSION, AND THE OLD PREDICATE `holds: mc < mr` SCORED IT
   * AS ONE.** DRESS-1 reported `village` and `mountain` as INDETERMINATE while this function
   * printed them "⛔ INVERTED — this is review I3". The receipt was right and the instrument was
   * wrong, and the mechanism is exact: both medians land on **`T.field` = `#989c74`,
   * L = 0.3171** — the FIELD FILL (⚠ not the grain, which is L 0.1572; DRESS-1's own note names
   * the wrong tone). `0.3171 < 0.3171` is false, so equality fell through to INVERTED.
   *
   * ⛔ **THE CONTROL THAT MAKES THIS UNARGUABLE IS THE `town` LEAF ITSELF.** Swept across
   * resolutions on the same plate set:
   * ```
   *            320 px      480 px      640 px      1000 px
   *   village  1.0000 ⛔   1.0118 ok   1.0092 ok   1.0000 ⛔
   *   mountain 1.0000 ⛔   1.0118 ok   1.0000 ⛔   1.0000 ⛔
   *   town     1.0126 ok   1.0125 ok   1.0125 ok   1.0000 ⛔   ← convicts a leaf nobody doubts
   * ```
   * The verdict is NOT MONOTONIC in resolution and at 1000 px it convicts the `town`, whose value
   * census passes 5/5 pairs on 6 of 6 lenses. Every "inversion" is the identical `ratio 1.0000` —
   * the signature this file's own header already names as *"a measurement of nothing"*, one
   * spelling later.
   *
   * ⚠⚠ **AND THIS CHANGE MOVES A VERDICT IN THE INK'S FAVOUR, WHICH IS DECLARED RATHER THAN
   * QUIETLY TAKEN.** `TIED` is a kinder reading than `INVERTED`. It is made anyway, and the reason
   * is independent of who it favours: the predicate demonstrably convicts a correct drawing. A tie
   * is `UNRESOLVED` — it is neither a pass nor a fail, and it is reported as neither.
   */
  const tied = Math.abs(mc - mr) < 1e-9;
  return { core: mc, ring: mr, ratio, holds: !tied && mc < mr, tied, inkPx: n };
}

/**
 * ⭐⭐ **THE TRUTH-CENTRED ARM, AND IT EXISTS BECAUSE THE INK-CENTRED ONE READ 1.0000 ON TWO
 * LEAVES.** `village` and `mountain` came back `core 0.3171 · ring 0.3171 · ratio 1.0000` — the
 * same tone on both sides to four decimals, which is the field's grain tone, not the fabric's. At
 * village tier the built area is a small patch on a large field disc, so the DARKEST DECILE is
 * dominated by furrow lines and the centroid lands in the countryside: the instrument was
 * measuring the country against the country.
 *
 * ⛔ THE HONEST FIX IS NOT TO WIDEN THE BAR — it is to take the WHERE from truth, exactly as the
 * gestalt key does. This arm centres the window on the page's own MASS CENTROID and asks the same
 * question there. Both readings print, because which one moves is the finding.
 */
async function truthCentre(key) {
  const { dressLeaf } = await import('./renderPage.mjs');
  const r = dressLeaf(key, 'parchment');
  const F = r.dress.frame;
  // ⛔ WAS A HARD-CODED 20 AND IT IS NOW 0 (DRESS-FRAME). This number had to equal the pad
  //    `renderPage.mjs` puts round the frame, and it never did — the harness's pad is
  //    `roadWidth × 4` (20.3 on the town, 32.8 on the thorp), so this constant was right on no
  //    leaf and merely close on one. DRESS-FRAME removes the pad from the page altogether, so the
  //    correct value is zero and the world→pixel map is now exact rather than nearly exact.
  const pad = 0;
  let sx = 0; let sy = 0; let n = 0;
  for (const m of r.page.masses) {
    for (const p of m.ring) { sx += p[0]; sy += p[1]; n++; }
  }
  if (!n) return null;
  return {
    cx: sx / n, cy: sy / n, F, pad, spread: Math.sqrt(r.page.masses.length) || 1,
  };
}

function hierarchyAt(g, w, h, cx, cy, R) {
  const core = []; const ring = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = Math.hypot(x - cx, y - cy);
      if (r <= R * 0.5) core.push(g[y][x]);
      else if (r <= R * 1.6) ring.push(g[y][x]);
    }
  }
  const mc = med(core); const mr = med(ring);
  if (mc == null || mr == null) return { core: mc, ring: mr, ratio: null, holds: false };
  const ratio = mc > mr ? (mc + 0.05) / (mr + 0.05) : (mr + 0.05) / (mc + 0.05);
  return { core: mc, ring: mr, ratio, holds: mc < mr };
}

const files = readdirSync(src).filter((f) => f.endsWith('.png'))
  .filter((f) => !only || only.some((k) => f.startsWith(`${k}-`)));
let red = 0;
let tied = 0;
const seen = new Set();
for (const f of files) {
  const { g, w, h } = await squintGrid(join(src, f), px);
  const v = hierarchyOf(g, w, h);
  if (!v.holds) {
    // the truth-centred second reading, taken ONLY where the ink-centred one failed
    const key = f.replace(/-[a-z]+-parchment\.png$/, '');
    try {
      const t = await truthCentre(key);
      if (t) {
        const pw = t.F.w + t.pad * 2; const ph = t.F.h + t.pad * 2;
        const ix = ((t.cx - (t.F.x - t.pad)) / pw) * w;
        const iy = ((t.cy - (t.F.y - t.pad)) / ph) * h;
        const R = Math.max(8, (w * 0.10));
        const t2 = hierarchyAt(g, w, h, ix, iy, R);
        console.log(`${''.padEnd(26)}   truth-centred at (${ix.toFixed(0)},${iy.toFixed(0)}):`
          + ` core ${t2.core == null ? 'n/a' : t2.core.toFixed(4)} ring ${t2.ring == null ? 'n/a' : t2.ring.toFixed(4)}`
          + ` ratio ${t2.ratio == null ? 'n/a' : t2.ratio.toFixed(4)}`
          + `  ${t2.holds ? '⭐ HOLDS at the settlement — the ink-centred arm was reading the FIELD' : '⛔ INVERTED at the settlement too'}`);
      }
    } catch (e) { console.log(`${''.padEnd(26)}   truth-centred arm unavailable: ${e.message}`); }
  }
  seen.add(`${v.core}|${v.ring}`);
  if (v.tied) tied++; else if (!v.holds) red++;
  console.log(`${f.replace(/-parchment\.png$/, '').padEnd(26)} ${w}×${h}`
    + `  core ${v.core == null ? 'n/a' : v.core.toFixed(4)}  ring ${v.ring == null ? 'n/a' : v.ring.toFixed(4)}`
    + `  ratio ${v.ratio == null ? 'n/a' : v.ratio.toFixed(4)}  ink ${String(v.inkPx).padStart(5)} px`
    + `  ${v.holds ? 'HOLDS (core darker)' : (v.tied ? '⚠ TIED — UNRESOLVED, both medians on T.field; neither a pass nor a fail' : '⛔ INVERTED — this is review I3')}`);
}

// ⛔ THE LIVENESS ARM. Six leaves agreeing to four decimals is what the DEAD first spelling
//    returned; a live instrument reads DIFFERENT settlements differently.
console.log(`\nLIVENESS · distinct (core,ring) readings across ${files.length} leaves: ${seen.size}`
  + `  ${seen.size > 1 ? '— the instrument DISCRIMINATES' : '⛔ EVERY LEAF READ THE SAME — DEAD INSTRUMENT'}`);

// ⛔ THREE PLANTS on a synthetic grid, each of which must flip or hold the verdict as named.
{
  const N = 64;
  const mk = (fn) => { const g = []; for (let y = 0; y < N; y++) { const r = []; for (let x = 0; x < N; x++) r.push(fn(x, y)); g.push(r); } return g; };
  const R = 18;
  const dark = 0.15; const pale = 0.80;
  const dist = (x, y) => Math.hypot(x - N / 2, y - N / 2);
  const good = mk((x, y) => (dist(x, y) < R ? dark : pale));                    // dense core
  const bad = mk((x, y) => (dist(x, y) < R * 0.5 ? pale : dist(x, y) < R ? dark : pale)); // I3's crescent
  const flat = mk(() => pale);                                                  // no ink at all
  console.log(`  PLANT · a dense dark core       → ${hierarchyOf(good, N, N).holds ? 'HOLDS (want HOLDS)' : '⛔ INVERTED'}`);
  console.log(`  PLANT · I3's crescent-round-void→ ${hierarchyOf(bad, N, N).holds ? '⛔ HOLDS (dead)' : 'INVERTED (convicts)'}`);
  console.log(`  PLANT · a flat page, no ink     → ${hierarchyOf(flat, N, N).holds ? '⛔ HOLDS (dead)' : 'INVERTED/n-a (convicts)'}`);
}

console.log(`\nSQUINT ${red ? `⛔ ${red} of ${files.length} leaf/leaves INVERTED` : `0 of ${files.length} INVERTED`}`
  + `${tied ? ` · ⚠ ${tied} TIED (UNRESOLVED — both medians on T.field; a tie is not an inversion)` : ''}`
  + `${!red && !tied ? ` — the hierarchy holds on all ${files.length}` : ''}`);
process.exitCode = red ? 1 : 0;
