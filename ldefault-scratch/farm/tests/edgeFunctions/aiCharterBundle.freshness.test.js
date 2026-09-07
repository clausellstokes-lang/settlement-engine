/**
 * tests/edgeFunctions/aiCharterBundle.freshness.test.js — the AI CHARTER bundle contract
 * (wave L-2a of docs/DESIGN_AI_CAPABILITY_LADDER.md §3, piece 2).
 *
 * The Supabase Edge Functions cannot import src/, so the charter reaches the five static
 * prompt prefixes as `supabase/functions/_shared/aiCharterBundle.js` — an esbuild bundle of
 * `src/domain/aiCharter.js` plus every transitive vocabulary module it renders from. The
 * bundle is committed (so `supabase functions deploy` needs no build step) and this suite
 * fails when it drifts from source.
 *
 * Freshness matters more here than for an ordinary bundle. The charter's whole economic
 * argument is that a BYTE-IDENTICAL static prefix is priced once by provider caching
 * (wave L-4). A stale bundle does not merely teach yesterday's vocabulary: it teaches a
 * vocabulary the schema walls now reject, so the model is grounded on words that fail
 * validation, and the failure looks like a bad model rather than a stale artifact.
 *
 * Four layers, mirroring tests/edgeFunctions/aiGroundingBundle.freshness.test.js:
 *   1. EXISTENCE       — bundle and sidecar meta are both committed in tree.
 *   2. META INTEGRITY  — the meta names the right entry and every input it lists still exists.
 *   3. HASH AGREEMENT  — banner hash equals meta hash equals a live recomputation over the
 *                        source tree. This is the stale detector.
 *   4. EXPORT SURFACE  — the symbols an edge function will import are actually present, and
 *                        the bundle behaves like the source on a fixture.
 *
 * E-A MANIFEST ENTRY: landed in-tree 2026-07-27 by owner order (kind "rationale" in
 * scripts/mutation-coverage-manifest.json — the untracked-target amendment forbids
 * kind "mutation" while this file is untracked). FOLD COUPLING SURVIVES: that manifest
 * hunk must ride the SAME fold commit as this file. Committed without it, the entry keys
 * a path that does not exist at HEAD and reds tests/lint/mutationCoverageManifest.test.js
 * as a stale entry; committed the other way round, TOTALITY reds instead.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const BUNDLE = join(ROOT, 'supabase', 'functions', '_shared', 'aiCharterBundle.js');
const META   = join(ROOT, 'supabase', 'functions', '_shared', 'aiCharterBundle.meta.json');

describe('aiCharter bundle exists', () => {
  it('the bundle file is committed in tree', () => {
    expect(existsSync(BUNDLE)).toBe(true);
  });

  it('the sidecar meta file is committed alongside', () => {
    expect(existsSync(META)).toBe(true);
  });
});

describe('aiCharter bundle is fresh', () => {
  let bundleSrc;
  let meta;

  beforeAll(() => {
    bundleSrc = readFileSync(BUNDLE, 'utf8');
    meta = JSON.parse(readFileSync(META, 'utf8'));
  });

  it('the meta file records the entry path', () => {
    expect(meta.entry).toBe('src/domain/aiCharter.js');
  });

  it('the meta lists many input modules (the charter renders the whole vocabulary graph)', () => {
    // The charter pulls the content manifest, the construct config vocabulary, the op
    // vocabulary, the signal registry, the acceleration ops, and the town-map style wall,
    // each with its own transitive deps. A collapse to a handful of inputs would mean a
    // vocabulary stopped being rendered and started being hard-coded.
    expect(Array.isArray(meta.inputs)).toBe(true);
    expect(meta.inputs.length).toBeGreaterThanOrEqual(20);
  });

  it('the entry module is itself among the recorded inputs', () => {
    expect(meta.inputs).toContain('src/domain/aiCharter.js');
  });

  it('every input path in the meta still exists on disk', () => {
    for (const p of meta.inputs) {
      expect(existsSync(join(ROOT, p)), `${p} missing — bundle is referencing a deleted file`).toBe(true);
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

describe('aiCharter bundle exports the contract surface', () => {
  let bundleSrc;
  beforeAll(() => { bundleSrc = readFileSync(BUNDLE, 'utf8'); });

  const REQUIRED_EXPORTS = [
    'buildSurfaceCharter',
    'estimateCharterTokens',
    'CHARTER_SURFACES',
    'CHARTER_VERSION',
  ];

  for (const name of REQUIRED_EXPORTS) {
    it(`exports "${name}"`, () => {
      expect(bundleSrc).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`));
    });
  }

  it('does NOT contain any unresolved imports (would crash at runtime)', () => {
    // STRUCTURAL, not textual. The sibling aiGroundingBundle suite spells this as a bare
    // `/from\s+['"][a-z].../` search over the whole file, which cannot tell an import
    // statement from prose: this bundle renders the op vocabulary, and one narration
    // template contains the literal text `from "chief"`, which that form flags as an
    // unresolved module. Anchor to a real top-level import/export-from with a BARE
    // specifier instead (a relative one would start with "." or "/").
    const bareImports = [...bundleSrc.matchAll(/^\s*(?:import|export)\b[^\n]*?\bfrom\s+['"]([^'"]+)['"]/gm)]
      .map((m) => m[1])
      .filter((spec) => !spec.startsWith('.') && !spec.startsWith('/'));
    expect(bareImports, `bundle references unbundled module(s): ${bareImports.join(', ')}`).toEqual([]);
  });

  it('the banner warns against manual edits', () => {
    expect(bundleSrc).toMatch(/DO NOT EDIT BY HAND/);
  });
});

describe('runtime smoke: the aiCharter bundle is loadable and behaves like the source', () => {
  it('importing the bundle in Node yields working exports', async () => {
    const bundle = await import(BUNDLE);
    expect(typeof bundle.buildSurfaceCharter).toBe('function');
    expect(typeof bundle.estimateCharterTokens).toBe('function');
    expect(Array.isArray(bundle.CHARTER_SURFACES)).toBe(true);
  });

  it('the bundle and the source agree on the surface roster and the version', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiCharter.js');
    expect([...bundle.CHARTER_SURFACES]).toEqual([...source.CHARTER_SURFACES]);
    expect(bundle.CHARTER_VERSION).toBe(source.CHARTER_VERSION);
  });

  it('buildSurfaceCharter from the bundle is BYTE-IDENTICAL to the source, every surface', async () => {
    // Byte equality, not shape equality: the caching argument in the module header is a
    // claim about bytes, and this is the assertion that makes it true across the src/edge
    // boundary. A bundle that rendered the same content in a different order would still
    // be a cache miss on every request.
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiCharter.js');
    for (const surface of source.CHARTER_SURFACES) {
      expect(bundle.buildSurfaceCharter(surface), `charter drift on surface "${surface}"`)
        .toBe(source.buildSurfaceCharter(surface));
    }
  });

  it('estimateCharterTokens from the bundle agrees with the source, every surface', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiCharter.js');
    for (const surface of source.CHARTER_SURFACES) {
      expect(bundle.estimateCharterTokens(surface)).toBe(source.estimateCharterTokens(surface));
    }
  });

  it('the bundle throws on an unknown surface, exactly as the source does', async () => {
    // The fail-loud contract has to survive bundling. A bundle that degraded to an empty
    // string would ground a model on nothing while every caller looked healthy.
    const bundle = await import(BUNDLE);
    expect(() => bundle.buildSurfaceCharter('not-a-surface')).toThrow(/unknown charter surface/);
  });
});
