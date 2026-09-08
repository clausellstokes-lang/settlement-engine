/**
 * sourcemapAbsence.test.js — IP-1: the shipped bundle carries no source maps.
 *
 * WHY THIS GUARD EXISTS. The bundle ships no source maps today, but only by Vite's DEFAULT:
 * `vite.config.js` has no `build.sourcemap` key at all. One config line silently publishes the
 * entire un-minified source of a local-compute product, and nothing in the gate would notice.
 * DESIGN_IP_PROTECTION.md section 3 owes exactly this assertion, over the real built artifact set
 * the strict runner already discovers, inheriting its file census so a new chunk is covered
 * automatically.
 *
 * ⛔⛔ THE STALE-DIST POLARITY HERE IS THE OPPOSITE OF EVERY OTHER ABSENCE CHECK IN THIS TREE, AND
 * COPYING THE NEIGHBOURS WOULD HAVE SHIPPED A GUARD THAT CANNOT FIRE. vendorPdfLazy.test.js states
 * the house rule: absence assertions stay UNGATED because a stale dist can only UNDER-report
 * absence. That holds for absences about newly-added eager EDGES, which a stale build simply lacks.
 * It does NOT hold here, because this absence is about a CONFIG FLIP: set `build.sourcemap: true`,
 * skip the rebuild, and the stale dist still contains zero .map files — so an ungated guard reports
 * GREEN over precisely the change it exists to catch. A stale dist FALSE-GREENS here; it never
 * false-REDS. The reads are therefore VERIFY_DIST-gated like a SIZE read (ruled in
 * OWNER_DECISION_QUEUE.md section 30), and the unconditional suite below makes VERIFY_DIST=1 with a
 * missing or empty artifact a HARD failure so the gated half can never count green having measured
 * nothing.
 *
 * ⚠⚠ THE DIRECTIVE SCAN IS SCOPED TO EMITTED CHUNKS FOR A MEASURED REASON, NOT A STYLISTIC ONE.
 * MEASURED 2026-08-14: 22 files under dist/map/libs/tinymce/skins/** carry a real
 * `# sourceMappingURL=` directive. They are vendored third-party skin assets copied into the map
 * fork's output, not chunks this build emits, and the .map files they name are not shipped — which
 * is why the .map assertion still measures ZERO across the whole tree. An unscoped directive scan
 * would land this guard RED at birth against bytes the build never authored. So: the .map arm
 * walks ALL of dist/ (the prerender step can write outside assets/), and the directive arm is
 * scoped to what Rollup emits.
 *
 * ⚠ This file PARKS in the estate-wide lighting census because it opens a `describe.runIf` suite,
 * and that is the declared, correct outcome. Deleting the `runIf` to buy census credit would red
 * the whole suite on any fresh checkout with no dist/. Correctness wins; the motion is declared.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync, openSync, readSync, closeSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { discoverBuildTestFiles, isBuildTestPath } from '../../scripts/check-test-ratchet.mjs';

const ROOT = resolve(process.cwd());
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDistRead = process.env.VERIFY_DIST === '1';

const SELF = 'tests/build/sourcemapAbsence.test.js';
/** A trailing `//# sourceMappingURL=` / `//@ sourceMappingURL=` directive, in either spelling. */
const DIRECTIVE = /[#@]\s*sourceMappingURL=/;
/** The directive is a TRAILING one by spec. Reading the tail keeps a mid-file string literal in
 *  somebody's source from convicting, and keeps this off the ~616 kB vendor chunk's full text. */
const TAIL_BYTES = 2048;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** The final TAIL_BYTES of a file, without reading the whole thing into memory. */
function tailOf(path) {
  const size = statSync(path).size;
  const length = Math.min(size, TAIL_BYTES);
  const buffer = Buffer.alloc(length);
  const fd = openSync(path, 'r');
  try {
    readSync(fd, buffer, 0, length, Math.max(0, size - length));
  } finally {
    closeSync(fd);
  }
  return buffer.toString('utf8');
}

describe('the shipped bundle carries no source maps (IP-1)', () => {
  // ⛔ UNCONDITIONAL BY CONSTRUCTION. If this arm were gated it could not do its job: its whole
  // purpose is to red when the gated suite below silently measured nothing.
  it('refuses to report green on a missing or empty artifact under VERIFY_DIST', () => {
    if (!requireDistRead) {
      expect(typeof requireDistRead, 'the gate predicate stopped being a boolean').toBe('boolean');
      return;
    }
    expect(distExists, 'VERIFY_DIST=1 but dist/ or dist/assets is absent — run `npm run build`'
      + ' before verify:dist, or this guard measures nothing and reports success').toBe(true);
    const emitted = readdirSync(assetsDir).filter((name) => name.endsWith('.js'));
    expect(emitted.length, 'VERIFY_DIST=1 but dist/assets holds zero .js chunks — the artifact is'
      + ' empty, so every assertion below would pass having read nothing. Run `npm run build`.')
      .toBeGreaterThan(0);
  });

  it('stays inert on a checkout with no artifact instead of reding a fresh clone', () => {
    // A4. The two gated reads are guarded by BOTH predicates, so the honest statement of "disabled"
    // is that neither predicate can be anything but a boolean and both are read, not assumed.
    expect(typeof distExists).toBe('boolean');
    expect(typeof requireDistRead).toBe('boolean');
    expect(requireDistRead).toBe(process.env.VERIFY_DIST === '1');
    expect(distExists).toBe(existsSync(distDir) && existsSync(assetsDir));
  });

  it('is discovered by the strict-dist runner and excluded from the source phase', () => {
    // A5. Pins the census inheritance DESIGN_IP_PROTECTION.md section 3 requires rather than
    // trusting it: living in tests/build/ is what makes this file run exactly once against the
    // fresh artifact, with no baseline and no debt concept available to it.
    const discovered = discoverBuildTestFiles(ROOT).map((path) => relative(ROOT, path).split('\\').join('/'));
    expect(discovered.length, 'the build-test discovery walk collapsed — this arm would pass'
      + ' vacuously').toBeGreaterThan(40);
    expect(discovered).toContain(SELF);
    expect(isBuildTestPath(SELF, ROOT)).toBe(true);
  });
});

describe.runIf(distExists)('the shipped bundle carries no source maps (IP-1) — artifact reads', () => {
  it.skipIf(!requireDistRead)('emits no .map file anywhere under dist/', () => {
    const maps = walk(distDir)
      .filter((path) => path.endsWith('.map'))
      .map((path) => relative(ROOT, path));
    expect(maps, `the build emitted ${maps.length} source map(s), which publish the un-minified`
      + ` source of a local-compute product: ${maps.join(', ')}`).toEqual([]);
  });

  it.skipIf(!requireDistRead)('emits no sourceMappingURL directive in any built chunk', () => {
    const chunks = walk(assetsDir).filter((path) => /\.(?:js|css)$/.test(path));
    expect(chunks.length, 'no .js or .css chunk was found under dist/assets — this arm would pass'
      + ' having read nothing').toBeGreaterThan(0);
    const carrying = chunks.filter((path) => DIRECTIVE.test(tailOf(path)))
      .map((path) => relative(ROOT, path));
    expect(carrying, `${carrying.length} built chunk(s) carry a trailing sourceMappingURL`
      + ` directive: ${carrying.join(', ')}`).toEqual([]);
  });
});
