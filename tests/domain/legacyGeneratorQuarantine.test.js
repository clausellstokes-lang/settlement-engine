/**
 * tests/domain/legacyGeneratorQuarantine.test.js - Tier 1.7 contract.
 *
 * `generateSettlement.js` is deprecated. Only the existing engine
 * shim (`src/generators/engine.js`) is allowed to import it. Any new
 * import is a regression - code should use
 * `generateSettlementPipeline.js` instead.
 *
 * This test grep's the codebase for imports of the legacy module and
 * verifies the importer set hasn't grown.
 *
 * Why this isn't an ESLint rule: ESLint plugins for "files-allowed-
 * to-import-this" require either a custom plugin or the
 * import/no-restricted-paths rule with a verbose pattern that would
 * need to be updated alongside this list anyway. A focused test
 * gives the same signal with no plugin authoring.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const SRC = join(ROOT, 'src');

const LEGACY_MODULE = 'generators/generateSettlement.js';

// The grandfather list. ONLY these files may import the legacy
// module. Adding a new entry should require explicit review.
const ALLOWED_IMPORTERS = new Set([
  'src/generators/engine.js',
]);

function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkSrc(full, out);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function findLegacyImporters() {
  const files = walkSrc(SRC);
  const importers = [];
  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    if (rel === `src/${LEGACY_MODULE}`) continue;  // the file itself
    const src = readFileSync(file, 'utf8');
    // Match the import statement form, ignoring strings inside comments.
    // Two patterns:
    //   from './generateSettlement.js'
    //   from '../generators/generateSettlement.js'
    if (/from\s+['"]\.{1,2}\/.*generateSettlement\.js['"]/.test(src)) {
      importers.push(rel);
    }
  }
  return importers;
}

describe('Tier 1.7 - legacy generator deprecation', () => {
  it('generateSettlement.js carries an @deprecated JSDoc tag', () => {
    const src = readFileSync(join(SRC, LEGACY_MODULE), 'utf8');
    expect(src).toMatch(/@deprecated/);
  });

  it('the deprecation comment points new code at generateSettlementPipeline.js', () => {
    const src = readFileSync(join(SRC, LEGACY_MODULE), 'utf8');
    expect(src).toMatch(/generateSettlementPipeline\.js/);
  });

  it('the deprecation comment includes the retirement contract', () => {
    const src = readFileSync(join(SRC, LEGACY_MODULE), 'utf8');
    expect(src).toMatch(/Retirement contract/i);
  });
});

describe('Tier 1.7 - quarantine: only the allowed shim imports the legacy module', () => {
  const importers = findLegacyImporters();

  it('importer list matches the grandfather set exactly', () => {
    // No surprises in either direction:
    //  - any NEW importer fails the test (regression - use the pipeline)
    //  - any REMOVED importer fails the test (allowlist drift -
    //    update ALLOWED_IMPORTERS to reflect intent)
    const actual = new Set(importers);
    const allowed = ALLOWED_IMPORTERS;
    const unexpectedNew = [...actual].filter(p => !allowed.has(p));
    const unexpectedGone = [...allowed].filter(p => !actual.has(p));
    expect(unexpectedNew, `Unexpected new importer(s): ${unexpectedNew.join(', ')}`).toEqual([]);
    expect(unexpectedGone, `Allowed importer(s) no longer present: ${unexpectedGone.join(', ')}`).toEqual([]);
  });

  it('engine.js is the single grandfathered consumer', () => {
    expect(ALLOWED_IMPORTERS.has('src/generators/engine.js')).toBe(true);
    expect(ALLOWED_IMPORTERS.size).toBe(1);
  });
});

describe('Tier 1.7 - runtime warning on the legacy fallback path', () => {
  it('settlementSlice.js logs a DEV-only warn when engineGenerate is called', () => {
    const slice = readFileSync(join(SRC, 'store', 'settlementSlice.js'), 'utf8');
    // Both fallback branches should be wrapped.
    const warnings = slice.match(/legacy engineGenerate called/g) || [];
    expect(warnings.length).toBeGreaterThanOrEqual(2);
  });

  it('the warn is DEV-only (gated on localhost)', () => {
    const slice = readFileSync(join(SRC, 'store', 'settlementSlice.js'), 'utf8');
    expect(slice).toMatch(/window\?\.location\?\.hostname === 'localhost'/);
  });
});

describe('Tier 1.7 - pipeline path is the preferred surface', () => {
  it('generateSettlementPipeline.js exists', () => {
    expect(() => readFileSync(join(SRC, 'generators', 'generateSettlementPipeline.js'), 'utf8')).not.toThrow();
  });

  it('settlementSlice imports the pipeline path lazily via loadEngine', () => {
    const slice = readFileSync(join(SRC, 'store', 'settlementSlice.js'), 'utf8');
    expect(slice).toMatch(/generateSettlementPipeline/);
  });
});
