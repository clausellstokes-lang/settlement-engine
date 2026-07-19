/**
 * tests/build/customRegistryLazy.test.js — the DE-EAGER LANE's structural guard
 * (2026-07-19).
 *
 * The custom-content registry (lib/customRegistry.js + lib/dependencyEngine.js
 * + data/stressTypesMeta.js) and the schema (domain/customContentSchema.js)
 * left the first-paint static closure: the store wires the registry through the
 * tiny eager seam (lib/customContentSource.js) and reaches schema/registry code
 * only via dynamic import at the validation chokepoints. This file pins that
 * architecture the same way the affordance-manifest/guidance guards do:
 *
 *   1. CHUNK ABSENCE — no custom-registry-* / custom-schema-* chunk is in the
 *      entry's transitive static closure (dist-read, ungated per the
 *      STALE-DIST POLICY: absence can only under-report on a stale dist).
 *   2. FINGERPRINT ABSENCE — no closure chunk carries a LIVE registry/schema
 *      string ('servicesProducedBy', a customDeps method name the minifier
 *      keeps; 'motifElement must be one of', validateTradition's error prose).
 *      Catches the code migrating into a differently-named eager chunk.
 *   3. NON-VACUITY (VERIFY_DIST-gated) — the fingerprints exist in SOME
 *      emitted chunk, so the absence checks can never pass by tree-shaking.
 *   4. SOURCE CONTRACTS (no dist needed) — the store reaches these modules
 *      only through the seam + dynamic import(); a re-added static import
 *      fails here with the culprit named, before any build runs.
 *
 * NOTE deliberately NOT a fingerprint: stressTypesMeta's strings — they are
 * duplicated verbatim in the (legitimately eager) data/stressTypes.js table,
 * so no string distinguishes the two. Its laziness is covered by (1)+(2): the
 * only importer of stressTypesMeta is customRegistry itself.
 * @see tests/build/vendorPdfLazy.test.js for the closure/byte-budget law.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDistRead = process.env.VERIFY_DIST === '1';

// ── The entry's transitive static closure (vendorPdfLazy's BFS, verbatim) ────
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

// LIVE fingerprints (minification-proof): a retained method NAME on the
// exported customDeps object, and validator error PROSE the schema emits.
const REGISTRY_FINGERPRINT = 'servicesProducedBy';
const SCHEMA_FINGERPRINT = 'motifElement must be one of';

describe.runIf(distExists)('de-eager — the custom-content registry/schema stay OUT of first paint', () => {
  it('no custom-registry / custom-schema chunk is in the entry static closure', () => {
    const { files } = entryStaticClosure();
    const offenders = files.filter(f => /^custom-(registry|schema)-/.test(f));
    expect(
      offenders,
      `the custom-content registry/schema reached first paint via the static graph (${offenders.join(', ')}). ` +
      'An eager module re-imported customRegistry/dependencyEngine/customContentSchema statically — ' +
      'route it through lib/customContentSource.js (the seam) or a dynamic import. Closure:\n  ' +
      files.join('\n  '),
    ).toHaveLength(0);
  });

  it('no closure chunk carries the registry/schema fingerprints (migration guard)', () => {
    const { files } = entryStaticClosure();
    const carriers = files.filter(f => {
      const code = readFileSync(join(assetsDir, f), 'utf-8');
      return code.includes(REGISTRY_FINGERPRINT) || code.includes(SCHEMA_FINGERPRINT);
    });
    expect(
      carriers,
      `registry/schema code reached first paint inside ${carriers.join(', ')} — even without the named ` +
      'chunk, the code migrated into an eager chunk. Find the new static edge and cut it.',
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the registry fingerprint is PRESENT in some lazy chunk (non-vacuity)', () => {
    const carriers = readdirSync(assetsDir)
      .filter(f => f.endsWith('.js'))
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(REGISTRY_FINGERPRINT));
    expect(
      carriers.length,
      'the customDeps registry surface was tree-shaken out of every chunk — the absence guards above would be vacuous.',
    ).toBeGreaterThan(0);
  });

  it.skipIf(!requireDistRead)('the schema fingerprint is PRESENT in some lazy chunk (non-vacuity)', () => {
    const carriers = readdirSync(assetsDir)
      .filter(f => f.endsWith('.js'))
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(SCHEMA_FINGERPRINT));
    expect(
      carriers.length,
      'validateTradition was tree-shaken out of every chunk — the absence guards above would be vacuous.',
    ).toBeGreaterThan(0);
  });
});

// ── Source-level contracts (run without dist/) ──────────────────────────────
describe('de-eager — store source reaches the registry/schema only lazily', () => {
  const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');
  // Strip comments so prose mentioning the module names can't false-positive.
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  it('customContentSlice: NO static schema/dependencyEngine import; dynamic schema at the chokepoint; seam invalidate', () => {
    const src = strip(read('src/store/customContentSlice.js'));
    expect(src).not.toMatch(/^import\s[^;]*customContentSchema\.js/m);
    expect(src).not.toMatch(/^import\s[^;]*dependencyEngine\.js/m);
    expect(src).toMatch(/import\(['"]\.\.\/domain\/customContentSchema\.js['"]\)/);
    expect(src).toMatch(/invalidateCustomDepsIfLoaded/);
  });

  it('settlementSlice: NO static schema/deity-helpers import; dynamic imports at the actions', () => {
    const src = strip(read('src/store/settlementSlice.js'));
    expect(src).not.toMatch(/^import\s[^;]*customContentSchema\.js/m);
    expect(src).not.toMatch(/^import\s[^;]*settlementDeityHelpers\.js/m);
    expect(src).toMatch(/import\(['"]\.\/settlementDeityHelpers\.js['"]\)/);
    expect(src).toMatch(/import\(['"]\.\.\/domain\/customContentSchema\.js['"]\)/);
  });

  it('store/index wires the source through the SEAM, never dependencyEngine', () => {
    const src = strip(read('src/store/index.js'));
    expect(src).toMatch(/from\s+['"]\.\.\/lib\/customContentSource\.js['"]/);
    expect(src).not.toMatch(/^import\s[^;]*dependencyEngine\.js/m);
  });

  it('the seam is a zero-import leaf (anything it pulls in becomes first-paint bytes)', () => {
    const src = strip(read('src/lib/customContentSource.js'));
    expect(src).not.toMatch(/^\s*import\s/m);
  });
});
