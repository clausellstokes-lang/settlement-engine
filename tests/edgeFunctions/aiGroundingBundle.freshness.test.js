/**
 * tests/edgeFunctions/aiGroundingBundle.freshness.test.js - Tier 6.8.
 *
 * The Supabase Edge Function imports from
 * `supabase/functions/_shared/aiGroundingBundle.js` - an esbuild-
 * bundled copy of `src/domain/aiGrounding.js` + every transitive
 * domain dep. The bundle is committed (so deploy stays simple), and
 * this test fails when it's out of date.
 *
 * Stale detection: we hash every input the last successful bundle
 * touched (recorded in `aiGroundingBundle.meta.json`) and compare to
 * the hash embedded in the bundle's banner. If they diverge, the
 * developer must run `npm run build:edge-shared` and re-commit.
 *
 * The test ALSO verifies the bundle exports the symbols the edge
 * function imports - catches accidental tree-shaking + renames.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const BUNDLE = join(ROOT, 'supabase', 'functions', '_shared', 'aiGroundingBundle.js');
const META   = join(ROOT, 'supabase', 'functions', '_shared', 'aiGroundingBundle.meta.json');

describe('Tier 6.8 - aiGrounding bundle exists', () => {
  it('the bundle file is committed in tree', () => {
    expect(existsSync(BUNDLE)).toBe(true);
  });

  it('the sidecar meta file is committed alongside', () => {
    expect(existsSync(META)).toBe(true);
  });
});

describe('Tier 6.8 - aiGrounding bundle is fresh', () => {
  let bundleSrc;
  let meta;

  beforeAll(() => {
    bundleSrc = readFileSync(BUNDLE, 'utf8');
    meta = JSON.parse(readFileSync(META, 'utf8'));
  });

  it('the meta file records the entry path', () => {
    expect(meta.entry).toBe('src/domain/aiGrounding.js');
  });

  it('the meta file lists at least 10 input modules (aiGrounding has many transitive deps)', () => {
    expect(Array.isArray(meta.inputs)).toBe(true);
    expect(meta.inputs.length).toBeGreaterThanOrEqual(10);
  });

  it('every input path in the meta still exists on disk', () => {
    for (const p of meta.inputs) {
      expect(existsSync(join(ROOT, p)), `${p} missing - bundle is referencing a deleted file`).toBe(true);
    }
  });

  it('the bundle banner records a sourceHash matching the meta', () => {
    const headerMatch = bundleSrc.match(/Source hash:\s*([0-9a-f]+)/);
    expect(headerMatch, 'bundle banner has no Source hash line').toBeTruthy();
    expect(headerMatch[1]).toBe(meta.sourceHash);
  });

  it('the current source tree matches the recorded hash (regenerate via npm run build:edge-shared)', () => {
    const live = meta.inputs.map(p => `${p}:${readFileSync(join(ROOT, p), 'utf8')}`).join('\n');
    const liveHash = createHash('sha256').update(live).digest('hex').slice(0, 16);
    expect(
      liveHash,
      `Bundle is stale. One of these inputs changed since the last bundle:\n  ${meta.inputs.join('\n  ')}\nRun: npm run build:edge-shared`,
    ).toBe(meta.sourceHash);
  });
});

describe('Tier 6.8 - aiGrounding bundle exports the contract surface', () => {
  let bundleSrc;
  beforeAll(() => { bundleSrc = readFileSync(BUNDLE, 'utf8'); });

  // Each entry asserts the export is present in the bundle's export
  // statement at the bottom of the file. esbuild emits a single
  // `export { a, b, c };` block per module.
  const REQUIRED_EXPORTS = [
    'buildAiGroundingPayload',
    'assemblePromptSections',
    'forbiddenChanges',
    'staticForbiddenRules',
    'defaultGroundingOptions',
    'summarizeGroundingPayload',
  ];

  for (const name of REQUIRED_EXPORTS) {
    it(`exports "${name}"`, () => {
      // Two valid forms:
      //   1. export { name as renamed, ... };
      //   2. export { name };
      expect(bundleSrc).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`));
    });
  }

  it('does NOT contain any unresolved imports (would crash at runtime)', () => {
    // esbuild leaves marker strings like `external: "..."` only when
    // bundling with externals. We bundle everything, so the bundle
    // should not reference any non-relative module specifier.
    expect(bundleSrc).not.toMatch(/from\s+['"][a-z][^'"]*['"]/i);
  });

  it('the banner warns against manual edits', () => {
    expect(bundleSrc).toMatch(/DO NOT EDIT BY HAND/);
  });
});

describe('Tier 6.8 - runtime smoke: the bundle is loadable and behaves like the source', () => {
  it('importing the bundle in Node yields working exports', async () => {
    const bundle = await import(BUNDLE);
    expect(typeof bundle.buildAiGroundingPayload).toBe('function');
    expect(typeof bundle.forbiddenChanges).toBe('function');
    expect(typeof bundle.assemblePromptSections).toBe('function');
  });

  it('buildAiGroundingPayload from the bundle agrees with the source for a fixture', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiGrounding.js');
    const fixture = {
      id: 'sett.bundle',
      name: 'Bundleburg',
      tier: 'town',
      population: 1200,
      _seed: 'fixed',
    };
    const fromBundle = bundle.buildAiGroundingPayload(fixture);
    const fromSource = source.buildAiGroundingPayload(fixture);
    // Compare by JSON to skip object-identity differences across modules.
    expect(JSON.stringify(fromBundle)).toBe(JSON.stringify(fromSource));
  });

  it('forbiddenChanges from the bundle agrees with the source for the same fixture', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiGrounding.js');
    const fixture = {
      id: 'sett.bundle',
      name: 'Bundleburg',
      tier: 'town',
      population: 1200,
    };
    expect(bundle.forbiddenChanges(fixture)).toEqual(source.forbiddenChanges(fixture));
  });

  it('staticForbiddenRules returns the same list from bundle and source', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiGrounding.js');
    expect(bundle.staticForbiddenRules()).toEqual(source.staticForbiddenRules());
  });
});
