/**
 * scripts/generate-k0-spike.mjs -- K-0 ARCHITECTURE SPIKE exhibit generator.
 *
 * Emits the K-0 proof artifacts (kernel doc docs/THE_ARCHITECTURE_KERNEL_3D.md) from the pure,
 * dormant arch/ spike (src/domain/townMap/arch/*, imported by NOTHING shipped):
 *   1. k0-cathedral.plate.png       -- THE CEILING PLATE: the max-fidelity deterministic CPU
 *      raster (per-pixel Lambert + rounded-relief tracery + AO + soft shadow + procedural stone).
 *   2. k0-cathedral.engraving.svg   -- the engraving VECTOR line-art (cubic paths, never arc `A`);
 *      the print/plotter comparison, NOT a fidelity candidate (the No-Compromise ruling).
 *   3. index.html                   -- a self-contained exhibit the manager assembles for the
 *      owner (both plates + the metrics + the LOD finding), referencing the PNG.
 *
 * DETERMINISM: renderSpike is a pure function of its options -- this script reads no clock, forks
 * no rng, touches no Math.random. It self-checks by rendering TWICE and asserting byte-identity
 * before writing, and `--check` re-renders and diffs the committed files (exit 1 if stale).
 *
 * Usage:
 *   node scripts/generate-k0-spike.mjs           # emit the exhibit
 *   node scripts/generate-k0-spike.mjs --check    # verify only (exit 1 if stale / non-deterministic)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSpike } from '../src/domain/townMap/arch/spike.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps', 'k0-exhibit');
const PNG = 'k0-cathedral.plate.png';
const SVG = 'k0-cathedral.engraving.svg';
const HTML = 'index.html';
const OP_CEILING = 2200; // the illustrated-town op budget (tests/design/townMapOpBudget.test.js)

/** bytes-equal. @param {Uint8Array} a @param {Uint8Array} b @returns {boolean} */
function bytesEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** The self-contained exhibit HTML (deterministic -- built from metrics only). @param {object} m */
function exhibitHtml(m) {
  const windowOps = m.commandCount - m.faces - 3; // rough split for the note (info only)
  const perCathedral = 14 * 20 + 14 * 11 + 120; // ~14 windows + ~14 bays + massing/misc
  const townShare = Math.round((perCathedral / OP_CEILING) * 100);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>K-0 Architecture Spike -- the deterministic gothic ceiling</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; font: 15px/1.5 -apple-system, system-ui, sans-serif; background: #f3efe6; color: #201c17; }
  @media (prefers-color-scheme: dark) { body { background: #17140f; color: #e9e2d4; } }
  main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 64px; }
  h1 { font-size: 22px; margin: 0 0 4px; } .sub { opacity: .7; margin: 0 0 24px; }
  .plates { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 760px) { .plates { grid-template-columns: 1fr; } }
  figure { margin: 0; } figure img, figure svg { width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 14px rgba(0,0,0,.22); background:#fff; display:block; }
  figcaption { font-size: 13px; opacity: .78; margin-top: 8px; }
  table { border-collapse: collapse; margin: 24px 0; font-size: 13px; } td, th { border: 1px solid rgba(128,128,128,.35); padding: 5px 12px; text-align: left; }
  .note { border-left: 3px solid #b98a3e; padding: 8px 0 8px 16px; margin: 20px 0; }
  code { background: rgba(128,128,128,.16); padding: 1px 5px; border-radius: 4px; }
</style></head><body><main>
<h1>K-0 Architecture Spike &mdash; the PROMISE-keeping gothic ceiling</h1>
<p class="sub">One traceried gothic window + one flying-buttress bay. Pure rational JS, zero GPU, zero trig, byte-deterministic.</p>
<div class="plates">
  <figure><img src="${PNG}" alt="deterministic CPU raster plate"><figcaption><b>The ceiling plate</b> &mdash; deterministic CPU raster: per-pixel Lambert from the one NW light, rounded-relief tracery, ambient occlusion, soft cast shadow, procedural ashlar stone. Tone-mapped through a pinned LUT. This is the actual ceiling of the byte-deterministic path.</figcaption></figure>
  <figure><img src="${SVG}" alt="engraving vector line-art"><figcaption><b>The engraving</b> &mdash; vector line-art (cubic Bezier paths, never the arc <code>A</code> command). The print / plotter comparison; per the No-Compromise ruling it is NOT a fidelity candidate.</figcaption></figure>
</div>
<table>
  <tr><th>metric</th><th>value</th></tr>
  <tr><td>plate resolution</td><td>${m.width} x ${m.height} px (${m.ss}x supersampled)</td></tr>
  <tr><td>vector draw-ops (fragment)</td><td>${m.opCount}</td></tr>
  <tr><td>&nbsp;&nbsp;of which tracery/window</td><td>~${windowOps}</td></tr>
  <tr><td>3D faces / bars / glass</td><td>${m.faces} / ${m.bars} / ${m.glass}</td></tr>
  <tr><td>engraving SVG bytes</td><td>${m.engravingBytes}</td></tr>
  <tr><td>PNG plate bytes (stored DEFLATE)</td><td>${m.pngBytes}</td></tr>
</table>
<div class="note"><b>Tracery without trig.</b> The pointed arches, trefoils and the enclosing gable are constructible &mdash; they live entirely in the <code>{sqrt2, sqrt3}</code> closure. The oculus is a deliberate <b>septfoil</b> (7 lobes): 7 is not a Fermat prime, so its ring is NOT constructible and is placed from a pinned literal <code>HEPTA_DIRS</code> table. The engine never calls Math.cos/sin/pow.</div>
<div class="note"><b>The LOD finding.</b> This fragment is ~${m.opCount} vector ops. Extrapolated, ONE fully-traceried cathedral is on the order of ~${perCathedral} ops &mdash; about ${townShare}% of the whole-town op budget (${OP_CEILING}) on its own. A town cannot render every building at cathedral LOD: a per-building LOD ladder (full tracery for signature institutions, massing silhouettes for commons, flat glyphs for distant fill) is mandatory, exactly as the massing substrate already anticipates.</div>
<div class="note"><b>Determinism.</b> Rendering twice produces byte-identical PNG + SVG (verified by <code>--check</code> and by <code>cmp</code>). All lighting/material math is <code>{+,-,*,/,sqrt}</code> or a pinned rational table, so the plate is reproducible cross-machine &mdash; THE PROMISE stays literal.</div>
</main></body></html>
`;
}

function main() {
  const checkOnly = process.argv.includes('--check');

  // Self-check: the render must be deterministic before anything is written.
  const a = renderSpike();
  const b = renderSpike();
  if (!bytesEqual(a.pngBytes, b.pngBytes) || a.engravingSvg !== b.engravingSvg) {
    console.error('[k0-spike] NON-DETERMINISTIC: a double render diverged. Aborting.');
    process.exit(1);
  }
  const html = exhibitHtml(a.metrics);

  /** @type {Array<{ file: string, data: string | Uint8Array }>} */
  const emissions = [
    { file: PNG, data: a.pngBytes },
    { file: SVG, data: a.engravingSvg },
    { file: HTML, data: html },
  ];

  if (checkOnly) {
    let stale = 0;
    for (const em of emissions) {
      const path = join(OUT_DIR, em.file);
      if (!existsSync(path)) { console.error(`[k0-spike] MISSING: ${path}`); stale++; continue; }
      if (typeof em.data === 'string') {
        if (readFileSync(path, 'utf8') !== em.data) { console.error(`[k0-spike] STALE: ${path}`); stale++; }
      } else if (!bytesEqual(readFileSync(path), em.data)) {
        console.error(`[k0-spike] STALE: ${path}`); stale++;
      }
    }
    if (stale > 0) process.exit(1);
    console.log('[k0-spike] check OK -- committed exhibit matches a fresh deterministic render.');
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const em of emissions) {
    const path = join(OUT_DIR, em.file);
    writeFileSync(path, em.data);
    const n = typeof em.data === 'string' ? Buffer.byteLength(em.data) : em.data.length;
    console.log(`[k0-spike] emitted -> ${path} (${n} bytes)`);
  }
  console.log(JSON.stringify(a.metrics));
}

main();
