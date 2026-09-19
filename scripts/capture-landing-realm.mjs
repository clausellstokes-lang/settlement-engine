/**
 * scripts/capture-landing-realm.mjs — CUT THE LANDING'S REALM PHOTOGRAPH, AND
 * ENCODE ITS TWINS.
 *
 * Owner order ODQ §934.30 item 5: the landing's realm map must be "a screenshot
 * of Cnocby in a drawn out map made in the realm with other generated
 * settlements … with the realm clock advance time box over that".
 *
 * The capture itself lives in e2e/landing-realm-capture.spec.js, because the
 * realm's geography is FMG inside an iframe and the marker overlay is the parent
 * document's SVG: the only honest render is the running app in a real browser,
 * and Playwright is what boots that. This file is the deliberate DOOR — it sets
 * the flag the spec is skipped without, runs that one spec under Chromium, and
 * then does everything a photograph needs after the shutter:
 *
 *   1. QUANTIZE the PNG. Chromium writes 24-bit (906 kB measured) for what is a
 *      nearly FLAT illustration — parchment, a coastline, five markers, some
 *      lines. A palette PNG is the right encoding for that image and costs it
 *      almost nothing visually. This is NOT "re-cutting it worse", which would
 *      mean a smaller or blurrier photograph.
 *   2. EMIT THE WEBP TWIN (ODQ §934.32 addendum, the chair's ruling on the
 *      478 kB PNG: "keep the PNG as the fallback and add a WebP twin"). The pair
 *      is consumed exactly as public/backgrounds' twins are — ONE format per
 *      engine, chosen by the cached canvas probe in src/config/pageBackgrounds.js
 *      — so no visitor ever fetches both.
 *   3. THE PIXEL GUARD. Every check in the spec is about the DOM, and a
 *      screenshot is about pixels: one run PASSED and wrote a three-quarters
 *      BLACK picture, because the overlay's textContent carries the settlement
 *      names whether or not a pixel of them was painted. This reads the bytes
 *      that were actually written and refuses a frame that is mostly dark.
 *   4. THE SIZE REPORT, both files, loudly, and never as a silent pass.
 *
 * ⛔ EVERY SHARP CALL IN THIS ACT LIVES HERE, ON PURPOSE. They were in the spec
 * first. tests/build/aiMediaProvenance.test.js keeps a ROSTER of the scripts
 * permitted to use sharp and demands `.keepMetadata()` of each — and it scans
 * `scripts/`, so a pipeline in e2e/ is undeclared by ACCIDENT rather than by
 * decision, which is the shape that roster exists to prevent. This script is
 * declared there (mode `reencode`).
 *
 * ⛔ AND IT IS NOT PART OF THE ORDINARY e2e SWEEP. The spec writes into public/,
 * and a suite that rewrites a committed asset on every run turns a clean
 * worktree into a lie about what was reviewed. `CAPTURE_LANDING_REALM=1` is the
 * whole gate; without it the spec skips and the sweep is untouched.
 *
 * Usage:
 *   node scripts/capture-landing-realm.mjs          # cut it
 *   node scripts/capture-landing-realm.mjs --check  # report the committed cut
 *
 * `--check` does NOT re-photograph. A screenshot of a live browser is not
 * byte-reproducible (font rasterisation, the FMG canvas's own compositing), so a
 * byte-equality check would be a flake generator — the honest instrument is the
 * sidecar, which records the seed, the tip and the settlements that were in
 * frame, and --check reads it back so a reviewer can see what the picture is of.
 */
import sharp from 'sharp';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = 'e2e/landing-realm-capture.spec.js';
const MAPS_DIR = join(ROOT, 'public', 'landing-maps');
const OUT_PNG = join(MAPS_DIR, 'realm-cnocby.png');
const OUT_WEBP = join(MAPS_DIR, 'realm-cnocby.webp');
const OUT_PROVENANCE = join(MAPS_DIR, 'realm-cnocby.provenance.json');

/** The chair's targets. Neither is a hard failure; both are said out loud. */
const PNG_TARGET_BYTES = 400_000;
const WEBP_TARGET_BYTES = 200_000;

/** WebP quality ~80, per the ruling. The source is already palette-quantized. */
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 6;

/**
 * A realm map is parchment and sea. A frame this dark is an UNPAINTED CANVAS —
 * the FMG iframe had not finished rendering, or the viewport was never framed.
 */
const MIN_MEAN_LUMA = 60;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

/** Mean brightness of an image file, 0–255. */
async function meanLuma(file) {
  const { channels } = await sharp(readFileSync(file)).stats();
  return (channels[0].mean + channels[1].mean + channels[2].mean) / 3;
}

/**
 * Quantize the captured PNG in place and emit its WebP twin.
 * `.keepMetadata()` is load-bearing on both: the roster in
 * tests/build/aiMediaProvenance.test.js requires it of every declared reencode
 * pipeline, because sharp drops EXIF/XMP/IPTC/C2PA by default and that is how an
 * AI-provenance marking gets silently destroyed. A screenshot of our own product
 * carries no such marking, and the call costs nothing — but the rule is about
 * the PIPELINE, not about what happens to be passing through it today.
 */
async function encodeTwins() {
  const captured = statSync(OUT_PNG).size;
  const quantized = await sharp(readFileSync(OUT_PNG))
    .keepMetadata()
    .png({ palette: true, quality: 90, effort: 9 })
    .toBuffer();
  if (quantized.length < captured) writeFileSync(OUT_PNG, quantized);

  const webp = await sharp(readFileSync(OUT_PNG))
    .keepMetadata()
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toBuffer();
  writeFileSync(OUT_WEBP, webp);

  return { captured, png: statSync(OUT_PNG).size, webp: statSync(OUT_WEBP).size };
}

/** Fold the encoded sizes into the sidecar the spec wrote. */
function recordTwins(sizes) {
  const sidecar = JSON.parse(readFileSync(OUT_PROVENANCE, 'utf8'));
  sidecar.files = {
    webp: { path: 'public/landing-maps/realm-cnocby.webp', bytes: sizes.webp, served: 'first — the engine picks ONE format (src/config/pageBackgrounds.js probe)' },
    png: { path: 'public/landing-maps/realm-cnocby.png', bytes: sizes.png, served: 'the fallback, for engines that cannot decode WebP' },
  };
  sidecar.encoding = {
    capturedBytes: sizes.captured,
    quantized: 'sharp png palette q90 effort 9',
    webp: `sharp webp q${WEBP_QUALITY} effort ${WEBP_EFFORT}`,
    by: 'scripts/capture-landing-realm.mjs (declared in SHARP_SCRIPTS)',
  };
  delete sidecar.bytes;
  writeFileSync(OUT_PROVENANCE, `${JSON.stringify(sidecar, null, 2)}\n`);
  return sidecar;
}

function report() {
  const missing = [
    ['PNG', OUT_PNG], ['WebP', OUT_WEBP], ['sidecar', OUT_PROVENANCE],
  ].filter(([, file]) => !existsSync(file));
  if (missing.length) {
    for (const [what, file] of missing) {
      console.error(`[capture-landing-realm] MISSING ${what}: ${relative(ROOT, file)}`);
    }
    console.error('[capture-landing-realm]   node scripts/capture-landing-realm.mjs');
    return 1;
  }

  const png = statSync(OUT_PNG).size;
  const webp = statSync(OUT_WEBP).size;
  const sidecar = JSON.parse(readFileSync(OUT_PROVENANCE, 'utf8'));

  console.log(`[capture-landing-realm] realm-cnocby.webp  ${kb(webp)}   (served first)`);
  console.log(`[capture-landing-realm] realm-cnocby.png   ${kb(png)}   (the fallback)`);
  console.log(`[capture-landing-realm]   seed ${sidecar.seed} · ${sidecar.weeks} weeks · ${sidecar.pixelWidth}x${sidecar.pixelHeight} · tip ${String(sidecar.tip).slice(0, 9)}`);
  console.log(`[capture-landing-realm]   in frame: ${(sidecar.settlements || []).map((s) => s.name).join(', ')}`);

  // ⛔ A TWIN THAT IS BIGGER THAN ITS FALLBACK IS A REGRESSION, NOT AN OPTIMISATION
  // — shipping more bytes to modern engines is precisely what optimize-backgrounds
  // recorded learning the hard way. This one IS a hard failure.
  if (webp >= png) {
    console.error(`[capture-landing-realm] THE WEBP TWIN (${kb(webp)}) IS NOT SMALLER THAN THE PNG (${kb(png)}).`);
    console.error('[capture-landing-realm] Serving it first would send MORE bytes to the engines that can decode it.');
    return 1;
  }

  // The two targets: said out loud every run, never a silent pass, never a
  // hard fail — the honest answer to a heavy frame is a better encoding, and
  // that is a decision, not an assertion.
  if (webp > WEBP_TARGET_BYTES) {
    console.warn(`[capture-landing-realm] ⚠ the WebP twin is OVER the ${kb(WEBP_TARGET_BYTES)} target by ${kb(webp - WEBP_TARGET_BYTES)}.`);
  } else {
    console.log(`[capture-landing-realm]   WebP is inside the ${kb(WEBP_TARGET_BYTES)} target (${kb(WEBP_TARGET_BYTES - webp)} to spare).`);
  }
  if (png > PNG_TARGET_BYTES) {
    console.warn(`[capture-landing-realm] ⚠ the PNG fallback is OVER the ${kb(PNG_TARGET_BYTES)} target by ${kb(png - PNG_TARGET_BYTES)}.`);
    console.warn('[capture-landing-realm]   It is the FALLBACK, so only engines that cannot decode WebP pay it.');
  }
  return 0;
}

if (process.argv.includes('--check')) {
  process.exit(report());
}

const run = spawnSync(
  'npx',
  ['playwright', 'test', SPEC, '--project=chromium', '--reporter=list'],
  { cwd: ROOT, stdio: 'inherit', env: { ...process.env, CAPTURE_LANDING_REALM: '1' } },
);
if (run.status !== 0) {
  console.error('[capture-landing-realm] the capture run failed — nothing was written.');
  process.exit(run.status || 1);
}

const luma = await meanLuma(OUT_PNG);
if (luma <= MIN_MEAN_LUMA) {
  console.error(`[capture-landing-realm] THE CAPTURE IS ${Math.round(luma)}/255 MEAN BRIGHTNESS.`);
  console.error('[capture-landing-realm] A realm map that dark is an UNPAINTED CANVAS, not a photograph:');
  console.error('[capture-landing-realm] the FMG iframe had not finished rendering, or the viewport was never framed.');
  console.error('[capture-landing-realm] Do not relax this number to get green.');
  process.exit(1);
}

const sizes = await encodeTwins();
recordTwins(sizes);
console.log(`[capture-landing-realm] captured ${kb(sizes.captured)} → png ${kb(sizes.png)} + webp ${kb(sizes.webp)}`);
process.exit(report());
