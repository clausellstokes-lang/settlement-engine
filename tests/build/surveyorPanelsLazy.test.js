/**
 * tests/build/surveyorPanelsLazy.test.js — the Surveyor WRITE PANELS first-paint lazy contract.
 *
 * The four write-stage surfaces (SurveyorWorkshop + the four bodies) and their transport
 * (lib/surveyorWrite.js, which pulls supabase + the slicers) must stay OUT of the entry's
 * first-paint static closure. They are reached only through FloatingAffordances (App.jsx
 * lazy-loads that once), and the workshop's bodies + transport are themselves dynamic-imported.
 * Mirrors the interior / town-map / vendor-pdf lazy contracts exactly.
 *
 * Fingerprints are GUARANTEED-shipping runtime string literals (never tree-shaken): a rendered
 * host string proves the workshop chunk is off entry; the transport's return-literal proves the
 * transport graph is off entry. A BFS of the entry's transitive static closure must contain
 * neither. Runs only when dist/ exists (post-build); the VERIFY_DIST=1 re-run enforces it.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDistRead = process.env.VERIFY_DIST === '1';

// Rendered host string (SurveyorWorkshop) + transport return-literal (lib/surveyorWrite.js).
const HOST_FINGERPRINT = 'Surveyor write stage';
const TRANSPORT_FINGERPRINT = 'Sign in to use the Surveyor.';
const FINGERPRINTS = [HOST_FINGERPRINT, TRANSPORT_FINGERPRINT];

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

function allAssetChunks() {
  const { readdirSync } = require('node:fs');
  return readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
}

describe.runIf(distExists)('Surveyor write panels stay off first paint', () => {
  it('the workshop + transport fingerprints are ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    for (const fp of FINGERPRINTS) {
      const leaked = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(fp));
      expect(leaked, `a Surveyor write surface reached first paint via the static graph (fingerprint "${fp}", chunks: ${leaked.join(', ')}).`).toHaveLength(0);
    }
  });

  it.skipIf(!requireDistRead)('anti-vacuity: each fingerprint IS present in some lazy chunk (absence is not tree-shaking)', () => {
    const chunks = allAssetChunks();
    for (const fp of FINGERPRINTS) {
      const hosting = chunks.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(fp));
      expect(hosting.length, `fingerprint "${fp}" is absent from ALL chunks — it was tree-shaken, so the absence check is vacuous.`).toBeGreaterThan(0);
    }
  });
});

describe('Surveyor write panels — source-level eager-import guard', () => {
  const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');
  it('eager boot modules never statically import the Surveyor write surfaces or transport', () => {
    for (const p of ['src/main.jsx', 'src/App.jsx', 'src/AppViews.jsx', 'src/store/index.js']) {
      const code = read(p);
      expect(code, `${p} statically imports a Surveyor write component`).not.toMatch(/import[^;]*from\s*['"][^'"]*\/surveyor\//);
      expect(code, `${p} statically imports the Surveyor write transport`).not.toMatch(/import[^;]*from\s*['"][^'"]*surveyorWrite/);
    }
  });

  // RETARGET (C13, THE ONE DOOR): FloatingAffordances now hosts SurveyorDoor, which
  // statically hosts BOTH destinations (workshop + analyst). The pin's intent —
  // the write surfaces ride the FloatingAffordances lazy chunk, never their own eager
  // path — is preserved by pinning each static link of the membership chain.
  it('FloatingAffordances → SurveyorDoor → workshop/analyst (the intentional lazy-chunk membership chain)', () => {
    expect(read('src/components/FloatingAffordances.jsx')).toMatch(/SurveyorDoor/);
    const door = read('src/components/surveyor/SurveyorDoor.jsx');
    expect(door).toMatch(/SurveyorWorkshop/);
    expect(door).toMatch(/AiAnalystPanel/);
  });
});
