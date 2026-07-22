/**
 * tests/build/loadingJourneyLazy.test.js — Slice C2L first-paint lazy contract.
 *
 * THE LOADING JOURNEYS conductor (components/loadingJourney/**) must stay OUT of
 * the entry's first-paint static closure — it is reached only through the lazy
 * loading surfaces (PipelineReveal is React.lazy in GenerateWizard; the realm film
 * is React.lazy). This is engineering law #2 (ZERO EAGER JS): the film rides the
 * lazy chunks, eager closure delta = 0 B. Mirrors interiorLazy / townMapLazy /
 * engineChunkLazy exactly.
 *
 * The load-bearing fingerprint is the unique string the film layer mints
 * (JOURNEY_FILM_FINGERPRINT = '::loading-journey:v1:', rendered as a data-attr so
 * it survives minification): a BFS of the entry's transitive static closure must
 * never contain it. Runs only when dist/ exists (post-build); the VERIFY_DIST=1
 * post-build re-run enforces it against the fresh dist.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDist = process.env.VERIFY_DIST === '1';

// Kept in sync with the source fingerprints (hardcoded here the way interiorLazy
// hardcodes '::interior:v1:' — each string must survive minification):
//   journeyManifest.js       JOURNEY_FILM_FINGERPRINT   (generation film)
//   RealmUnfurlLoading.jsx    REALM_UNFURL_FINGERPRINT   (realm/FMG loading)
//   WelcomeJourneyBackdrop.jsx WELCOME_JOURNEY_FINGERPRINT (Slice C2 Welcome film)
//   ProgressJourneyOverlay.jsx PROGRESS_JOURNEY_FINGERPRINT (progress-scrubbed video)
// The Welcome film rides the lazy below-fold chunk (HomeLanding is React.lazy in
// AppViews; LandingBelowFold is React.lazy in HomeLanding) — Slice C2 law #2,
// ZERO EAGER JS: the scroll conductor never reaches first paint.
const JOURNEY_FINGERPRINTS = Object.freeze([
  '::loading-journey:v1:', '::realm-unfurl:v1:', '::welcome-journey:v1:',
  '::progress-journey:v1:',
]);

function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  return m[1];
}

function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return { entry, files: [...seen] };
}

describe.runIf(requireDist)('C2L lazy dist verification is not vacuously skipped', () => {
  it('dist/ + dist/assets exist when VERIFY_DIST=1 (a skipped post-build contract is green-on-nothing)', () => {
    expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first').toBe(true);
  });
});

describe.runIf(distExists)('C2L — the loading journeys stay off first paint', () => {
  const { files } = distExists ? entryStaticClosure() : { files: [] };
  for (const fingerprint of JOURNEY_FINGERPRINTS) {
    it(`fingerprint ${fingerprint} is ABSENT from the entry transitive static closure`, () => {
      const leaked = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(fingerprint));
      expect(
        leaked,
        `a loading-journey conductor reached first paint via the static graph (chunks: ${leaked.join(', ')}).`,
      ).toHaveLength(0);
    });
  }
});
