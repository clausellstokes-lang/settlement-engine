/**
 * dataPurity.test.js — A+ Track H (data-schema.2).
 *
 * src/data/** must be PURE DATA: no runtime imports of the generators, store, or
 * lib layers. Those layers hold behavior (RNG draws, IO, mutable state); a data
 * file that imports them re-introduces non-determinism / side effects into the
 * tables. Executable closures were extracted to the generators layer
 * (stressNarrative.js, narrativeText.js) by data-schema.3; this test (plus the
 * eslint no-restricted-imports override) keeps the data layer pure going forward.
 *
 * This is the source-regex guard: it survives even if ESLint is skipped, and it
 * is deliberately dependency-light — it only reads files from disk and scans the
 * text for forbidden import statements.
 *
 * @enforced-by this test + eslint.config.js (src/data/** no-restricted-imports)
 */

import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const DATA_DIR = resolve(process.cwd(), 'src', 'data');

/** Recursively collect every .js / .jsx file under src/data. */
function dataFiles(dir = DATA_DIR) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...dataFiles(full));
    } else if (/\.(js|jsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Match `import … from '<path>'` (static and side-effect imports) plus dynamic
 * `import('<path>')` and `require('<path>')`, then test the module specifier
 * against the forbidden layers. Restricting to import/require specifiers (not any
 * occurrence of the substring) avoids false positives from data strings like
 * "Sage/library" or comments mentioning src/lib.
 */
const IMPORT_SPECIFIER =
  /(?:import\b[^;'"]*?from\s*|import\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;

const FORBIDDEN = /(^|\/)(generators|store|lib)(\/|$)/;

describe('src/data purity (no runtime imports of generators/store/lib)', () => {
  const files = dataFiles();

  test('there is at least one data file to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test('no src/data file imports from the generators, store, or lib layers', () => {
    const offenders = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf-8');
      let m;
      IMPORT_SPECIFIER.lastIndex = 0;
      while ((m = IMPORT_SPECIFIER.exec(src)) !== null) {
        const spec = m[1];
        if (FORBIDDEN.test(spec)) {
          offenders.push(`${file.replace(process.cwd() + '/', '')} → import '${spec}'`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test('no src/data file captures rngContext.random (no RNG capture in data)', () => {
    const offenders = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf-8');
      // Match an import statement specifier ending in rngContext (the only way a
      // data file could draw seeded randomness). A bare mention in a comment is
      // not an import, so this stays specific.
      if (/import\b[^;]*?from\s*['"][^'"]*rngContext[^'"]*['"]/.test(src)) {
        offenders.push(file.replace(process.cwd() + '/', ''));
      }
    }
    expect(offenders).toEqual([]);
  });

  // ── scripts-build-ci-1 residual: the prng ambient-entropy seam ───────────────
  // The RNG seam moved generators→kernel (prng.js/rngContext.js, commit 4dc2a0ac).
  // The FORBIDDEN-layer scan above bans generators/store/lib but deliberately NOT
  // kernel — src/data legitimately imports kernel/slugify.js (a pure, deterministic
  // helper), so a blanket kernel ban would be wrong. The rngContext guard above
  // fences the seeded-draw carrier; this fences its sibling, prng.js, whose
  // generateSeed() (Date.now() + Math.random(), prng.js) is the ONE ambient-entropy
  // vector in the kernel. createPRNG is deterministic (seed passed in), but a data
  // file has no legitimate use for prng.js at all — it holds behavior, and
  // generateSeed() reintroduces non-determinism. The original finding claimed the
  // rngContext hole itself was unfenced (REFUTED — the guard above is path-agnostic
  // and catches it); this narrow, currently-offender-free prng gap is the surviving
  // half, fenced preventively so a future data file cannot import the seam quietly.
  // @enforced-by this test + eslint.config.js (src/data/** kernel/prng no-restricted-imports)
  test('no src/data file imports the prng ambient-entropy seam (kernel/prng.js)', () => {
    const offenders = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf-8');
      // Match an import specifier ending in prng (…/kernel/prng.js) — the ambient
      // generateSeed() carrier. A bare mention in a data string/comment is not an
      // import, so anchoring to the import form keeps this specific.
      if (/(?:import\b[^;]*?from|import\s*\(\s*|require\s*\(\s*)\s*['"][^'"]*\/prng(?:\.js)?['"]/.test(src)) {
        offenders.push(file.replace(process.cwd() + '/', ''));
      }
    }
    expect(offenders).toEqual([]);
  });
});
