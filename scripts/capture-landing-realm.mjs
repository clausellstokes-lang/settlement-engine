/**
 * scripts/capture-landing-realm.mjs — CUT THE LANDING'S REALM PHOTOGRAPH.
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
 * prints where the bytes landed.
 *
 * ⛔ IT IS NOT PART OF THE ORDINARY e2e SWEEP, ON PURPOSE. The spec writes into
 * public/, and a suite that rewrites a committed asset on every run turns a
 * clean worktree into a lie about what was reviewed. `CAPTURE_LANDING_REALM=1`
 * is the whole gate; without it the spec skips and the sweep is untouched.
 *
 * Usage:
 *   node scripts/capture-landing-realm.mjs          # cut it
 *   node scripts/capture-landing-realm.mjs --check  # report the committed cut
 *
 * `--check` does NOT re-photograph. A screenshot of a live browser is not
 * byte-reproducible (font rasterisation, the FMG canvas's own compositing), so
 * a byte-equality check would be a flake generator — the honest instrument is
 * the sidecar, which records the seed, the tip and the settlements that were in
 * frame, and --check reads it back so a reviewer can see what the picture is of.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = 'e2e/landing-realm-capture.spec.js';
const OUT_PNG = join(ROOT, 'public', 'landing-maps', 'realm-cnocby.png');
const OUT_PROVENANCE = join(ROOT, 'public', 'landing-maps', 'realm-cnocby.provenance.json');

function report() {
  if (!existsSync(OUT_PNG)) {
    console.error(`[capture-landing-realm] MISSING: ${relative(ROOT, OUT_PNG)} has not been cut.`);
    console.error('[capture-landing-realm]   node scripts/capture-landing-realm.mjs');
    return 1;
  }
  const bytes = statSync(OUT_PNG).size;
  console.log(`[capture-landing-realm] ${relative(ROOT, OUT_PNG)} · ${bytes} bytes`);
  if (!existsSync(OUT_PROVENANCE)) {
    console.error(`[capture-landing-realm] MISSING SIDECAR: ${relative(ROOT, OUT_PROVENANCE)}.`);
    console.error('[capture-landing-realm] A photograph of the product with no record of what it is of is an unsourced image.');
    return 1;
  }
  const sidecar = JSON.parse(readFileSync(OUT_PROVENANCE, 'utf8'));
  console.log(`[capture-landing-realm]   seed ${sidecar.seed} · ${sidecar.weeks} weeks · ${sidecar.pixelWidth}x${sidecar.pixelHeight} · tip ${String(sidecar.tip).slice(0, 9)}`);
  console.log(`[capture-landing-realm]   in frame: ${(sidecar.settlements || []).map((s) => s.name).join(', ')}`);
  if (bytes > 400_000) {
    console.warn(`[capture-landing-realm] OVER THE 400 kB TARGET by ${bytes - 400_000} bytes.`);
    console.warn('[capture-landing-realm] Reduce it through the DECLARED sharp pipeline and register the output — never by re-cutting worse.');
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
process.exit(report());
