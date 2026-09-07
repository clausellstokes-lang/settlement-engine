/**
 * tests/build/versionDiffLazy.test.js — the queue-#18 comparison-view lazy-leaf
 * contract.
 *
 * VersionDiffView is the only heavy thing the Versions tab can reach: it pulls
 * the whole settlement-comparison derivation stack (deriveRegenerationDelta ->
 * deriveSystemState / deriveCausalState / deriveAllCapacities / deriveDailyLife
 * / entityCatalog). Two separations must hold, and only one of them is the
 * usual first-paint claim:
 *
 *   1. NOT ON FIRST PAINT. The view must never appear in the entry's transitive
 *      static closure. (VersionsTab is already lazy, so this would only break
 *      if something eager started importing the diff directly.)
 *   2. NOT IN THE VersionsTab CHUNK. This is the claim that pays: a reader who
 *      opens Versions to look at the timeline, or to revert, must not download
 *      the comparison derivations. Only picking two snapshots should fetch it.
 *      A static `import VersionDiffView from './VersionDiffView.jsx'` inside
 *      VersionsTab would satisfy (1) and quietly break (2).
 *
 * Fingerprint idiom mirrors tests/build/pendingEditProseLazy.test.js: a string
 * literal minted in exactly one module survives minification, so its presence
 * in a chunk is that module's presence in the chunk.
 *
 * Runs only when dist/ exists (post-build); the VERIFY_DIST=1 post-build re-run
 * enforces it against the fresh dist.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

// JSX text minted only in src/components/settlement/VersionDiffView.jsx. It
// compiles to a plain string child, so it survives the production minifier.
const DIFF_FINGERPRINT = 'Comparing two snapshots';
// JSX text minted only in VersionsTab.jsx's paid branch, used to LOCATE the
// VersionsTab chunk by content rather than by its hashed filename.
const TAB_FINGERPRINT = 'No history yet. Save or canonize to start the timeline.';

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

const jsChunks = () => (distExists ? readdirSync(assetsDir).filter((f) => f.endsWith('.js')) : []);
const chunksContaining = (literal) =>
  jsChunks().filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(literal));

describe.runIf(distExists)('queue #18 — the snapshot comparison view is a lazy leaf', () => {
  it('the comparison view is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const leaked = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(DIFF_FINGERPRINT));
    expect(
      leaked,
      `VersionDiffView reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
      + 'It is reached only through the React.lazy seam in VersionsTab.jsx; restore that seam. '
      + `Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('the comparison view does NOT ride the VersionsTab chunk', () => {
    // Anti-vacuity for the locator: the tab itself must be findable, or the
    // "not in it" claim below would pass by finding nothing.
    const tabChunks = chunksContaining(TAB_FINGERPRINT);
    expect(
      tabChunks.length,
      `Could not locate the VersionsTab chunk by its "${TAB_FINGERPRINT}" fingerprint. `
      + 'If that copy changed, update TAB_FINGERPRINT here.',
    ).toBeGreaterThan(0);

    const both = tabChunks.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(DIFF_FINGERPRINT));
    expect(
      both,
      `The comparison view was bundled into the VersionsTab chunk (${both.join(', ')}), so every `
      + 'reader who opens the tab now downloads the whole comparison derivation stack. '
      + 'VersionsTab must reach it through React.lazy, never a static import.',
    ).toHaveLength(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('anti-vacuity — the comparison view DOES exist in a lazy chunk', () => {
    // VERIFY_DIST-gated: under plain `npm run test` the dist on disk may PREDATE
    // the current tree, so only the fresh-build run can assert PRESENCE.
    expect(
      chunksContaining(DIFF_FINGERPRINT).length,
      `VersionDiffView fingerprint "${DIFF_FINGERPRINT}" not found in ANY dist chunk — `
      + 'did the copy move, or did the build drop the lazy seam?',
    ).toBeGreaterThan(0);
  });
});
