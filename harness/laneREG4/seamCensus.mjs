/**
 * harness/laneREG4/seamCensus.mjs — ⭐⭐ REG-4's OWN CENSUS: **ZERO TINT SEAMS STREET ↔ MARKET**
 * (the charter's REG-4 exit, L-REG-6).
 *
 * THREE ARMS, and each is a different question:
 *
 *   ARM 1 · THE TOKEN. The void's FILL must be the exact colour the street web is stroked in.
 *           Read off the emitted SVG, compared as hex — no tolerance, no "close enough".
 *   ARM 2 · THE DOORWAY. No ink may be drawn ACROSS a mouth. Every emitted outline vertex is
 *           tested against every mouth station; a vertex inside a carriageway of a mouth is a
 *           seam. This is the arm the sealed tip fails, and it fails it 100 % of the time
 *           because its border is a CLOSED ring.
 *   ARM 3 · THE PIXELS. A transect across each mouth in the rendered raster (headless Chrome,
 *           `reg0/shoot.sh`, the instrument of record — qlmanage drops filters). Reports the
 *           darkest luminance found ON the boundary against the mean of the two sides. A seam
 *           is a dark line between two equal grounds; no seam is a flat transect.
 *
 * ⛔ A ZERO IS WHAT A DEAD INSTRUMENT RETURNS. `--mutate` plants a DIFFERING MARKET FILL and the
 * census must red on ARM 1; `--mutate=border` restores the closed ring and it must red on ARM 2.
 *
 * Usage: node harness/laneREG4/seamCensus.mjs [--leaves=ALL|a,b] [--raster] [--mutate=fill|border]
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
// ⭐ ODQ §634.3 — leaf resolution comes from the shared kit, not a per-wave re-import.
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { renderFolio } = await import(join(ROOT, 'harness/renderFolio.mjs'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);
const only = arg('leaves', 'town,city,village,metropolis,highwater');
const mutate = arg('mutate', '');
const list = only === 'ALL' ? CORPUS : CORPUS.filter((c) => only.split(',').includes(c.key));
const OUT = arg('out', join(ROOT, 'out', 'seam'));

/** the ten-role parchment table, verbatim from folioLenses at the seal (the classifier's own copy) */
const ROLE_ROADS = '#F3EBD6';

/** every `<path ... fill="X" .../>` inside `<g id="squares">`, and the group's own attrs */
function squareFills(svg) {
  const i = svg.indexOf('<g id="squares"');
  if (i < 0) return { fills: [], groupFill: null };
  const j = svg.indexOf('</g>', i);
  const seg = svg.slice(i, j);
  const gm = seg.match(/^<g id="squares"([^>]*)>/);
  const groupFill = gm ? (gm[1].match(/fill="([^"]+)"/) || [])[1] || null : null;
  const fills = [...seg.matchAll(/<path[^>]*?fill="([^"]+)"/g)].map((m) => m[1]);
  return { fills, groupFill };
}

/**
 * The emitted VOID OUTLINE — read from `<g id="marketOutline">` and nowhere else.
 * ⛔ THE FIRST SPELLING MATCHED ON A PATH SIGNATURE (`fill="none" … linecap="round"`) and read
 * 110 of 141 mouths as seamed, because the CARRIAGEWAY RUNNING INTO THE DOORWAY has that exact
 * signature: the instrument was convicting the street of being at the door. A group id is a
 * classification (REG-3's J-REG3-9) and the census asks the group.
 */
function outlineVertices(svg) {
  /** @type {number[][]} */ const pts = [];
  const i = svg.indexOf('<g id="marketOutline"');
  if (i < 0) return pts;
  const seg = svg.slice(i, svg.indexOf('</g>', i));
  for (const m of seg.matchAll(/<path d="([^"]+)"/g)) {
    for (const c of m[1].matchAll(/[ML]([-\d.]+) ([-\d.]+)/g)) pts.push([Number(c[1]), Number(c[2])]);
  }
  return pts;
}

const rows = [];
let seamTotal = 0, mouthTotal = 0, tokenBad = 0, voidTotal = 0;
for (const spec of list) {
  const { fabric } = buildOne(spec, { marketRegister: true });
  let svg = renderFolio(fabric, { lens: 'parchment' }).svg;
  // ── THE CONVICTING MUTATIONS, applied to the EMITTED DRAWING so the census is tested on the
  //    thing it grades rather than on a re-derivation.
  if (mutate === 'fill') {
    const i = svg.indexOf('<g id="squares"');
    const j = svg.indexOf('</g>', i);
    svg = svg.slice(0, i) + svg.slice(i, j).replace(/fill="#F3EBD6"/g, 'fill="#EDE2C6"') + svg.slice(j);
  }
  const { fills, groupFill } = squareFills(svg);
  const effective = fills.map((f) => (f === 'none' ? groupFill : f)).filter(Boolean);
  const bad = effective.filter((f) => f.toUpperCase() !== ROLE_ROADS);
  tokenBad += bad.length;

  // ARM 2 — outline ink across a doorway
  let outline = outlineVertices(svg);
  if (mutate === 'border') {
    // restore the SEALED behaviour: a CLOSED ring round every void, doorways included
    outline = [];
    for (const v of fabric.marketRegister.voids) for (const p of v.polygon) outline.push(p);
  }
  let seams = 0, mouths = 0;
  for (const v of fabric.marketRegister.voids) {
    voidTotal++;
    for (const m of v.mouths) {
      mouths++;
      let hit = false;
      for (const p of outline) {
        const dx = p[0] - m.x, dy = p[1] - m.y;
        if (dx * dx + dy * dy <= (m.width * 0.85) * (m.width * 0.85)) { hit = true; break; }
      }
      if (hit) seams++;
    }
  }
  seamTotal += seams; mouthTotal += mouths;
  rows.push({
    leaf: spec.key, voids: fabric.marketRegister.voids.length, mouths, seams,
    fillsChecked: effective.length, fillsWrong: bad.length,
    fills: [...new Set(effective)].join(','),
  });
  if (has('raster')) {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(join(OUT, `${spec.key}.svg`), svg);
  }
}

const cols = Object.keys(rows[0]);
const w = {}; for (const c of cols) w[c] = Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length));
const line = (v) => cols.map((c, i) => String(v[i] ?? '').padEnd(w[c])).join(' | ');
process.stdout.write(`${line(cols)}\n${cols.map((c) => '-'.repeat(w[c])).join('-+-')}\n`);
for (const r of rows) process.stdout.write(`${line(cols.map((c) => r[c]))}\n`);
process.stdout.write(`\nARM 1 · TOKEN     : ${tokenBad} of ${rows.reduce((s, r) => s + r.fillsChecked, 0)} void fills differ from the street's own ${ROLE_ROADS}\n`);
process.stdout.write(`ARM 2 · DOORWAY   : ${seamTotal} of ${mouthTotal} street mouths carry ink across them, over ${voidTotal} voids\n`);
process.stdout.write(`VERDICT           : ${tokenBad === 0 && seamTotal === 0 ? 'ZERO TINT SEAMS' : '⛔ SEAMS PRESENT'}${mutate ? ` (mutation '${mutate}' applied — a RED here is the instrument working)` : ''}\n`);

/* ── ARM 3 · THE PIXELS ─────────────────────────────────────────────────────── */
if (has('raster')) {
  const SHOOT = arg('shoot', join(ROOT, '..', 'reg0', 'shoot.sh'));
  const { readPNG } = await import(join(ROOT, '..', 'reg-instruments', 'lib', 'png.mjs'));
  if (!existsSync(SHOOT)) { process.stdout.write(`\n⚠ ARM 3 SKIPPED — no rasterizer at ${SHOOT}\n`); }
  else {
    process.stdout.write('\nARM 3 · THE PIXELS (headless Chrome, 2200 px; a seam is a dark line between two equal grounds)\n');
    for (const spec of list) {
      const svgF = join(OUT, `${spec.key}.svg`), pngF = join(OUT, `${spec.key}.png`);
      let ok = '';
      try { ok = String(execFileSync('zsh', [SHOOT, svgF, pngF, '2200', '300000'])).trim(); } catch (e) { ok = `SHOOT_FAIL ${e.status}`; }
      if (!ok.startsWith('SHOOT_OK')) { process.stdout.write(`  ${spec.key.padEnd(11)} ${ok}\n`); continue; }
      const { w: W, h: H, rgba } = readPNG(pngF);
      const { fabric } = buildOne(spec, { marketRegister: true });
      const S = W / 1000;                                   // the leaf's view box is 1000 units
      const lum = (x, y) => {
        const xi = Math.round(x), yi = Math.round(y);
        if (xi < 0 || yi < 0 || xi >= W || yi >= H) return null;
        const o = (yi * W + xi) * 4;
        return 0.2126 * rgba[o] + 0.7152 * rgba[o + 1] + 0.0722 * rgba[o + 2];
      };
      let worst = 0, n = 0, worstAt = '';
      for (const v of fabric.marketRegister.voids) {
        for (const m of v.mouths) {
          // a transect along the mouth's own radial: from inside the void, across the boundary,
          // out into the carriageway
          const dx = (m.x - v.center[0]), dy = (m.y - v.center[1]);
          const L = Math.sqrt(dx * dx + dy * dy) || 1;
          const ux = dx / L, uy = dy / L;
          const span = m.width * 1.2;
          const vals = [];
          for (let t = -span; t <= span; t += 0.25) {
            const p = lum((m.x + ux * t) * S, (m.y + uy * t) * S);
            if (p != null) vals.push(p);
          }
          if (vals.length < 8) continue;
          const k = Math.floor(vals.length / 3);
          const inMean = vals.slice(0, k).reduce((a, b) => a + b, 0) / k;
          const outMean = vals.slice(-k).reduce((a, b) => a + b, 0) / k;
          const midMin = Math.min(...vals.slice(k, vals.length - k));
          const drop = Math.min(inMean, outMean) - midMin;   // how much darker the boundary is
          n++;
          if (drop > worst) { worst = drop; worstAt = `${v.key}@${Math.round(m.x)},${Math.round(m.y)}`; }
        }
      }
      process.stdout.write(`  ${spec.key.padEnd(11)} transects=${String(n).padStart(3)}  worst boundary DROP = ${worst.toFixed(1)} L  at ${worstAt}\n`);
    }
  }
}
