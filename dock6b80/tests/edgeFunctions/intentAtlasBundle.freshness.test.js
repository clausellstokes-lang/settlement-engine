/**
 * tests/edgeFunctions/intentAtlasBundle.freshness.test.js — the INTENT ATLAS bundle contract
 * (docs/DESIGN_AI_INTENT_ATLAS.md §3.3, Phase A).
 *
 * The Supabase Edge Functions cannot import src/, so the atlas reaches the walled Surveyor
 * surfaces as `supabase/functions/_shared/intentAtlasBundle.js` — an esbuild bundle of
 * `src/domain/intentAtlas.js` and the committed distillate it inlines. The bundle is
 * committed and this suite fails when it drifts from source.
 *
 * THE DISTILLATE IS AN INPUT, WHICH IS THE WHOLE POINT. Because esbuild inlines the JSON
 * into the bundle, a Phase B distillate regeneration that is not followed by
 * `npm run build:edge-shared` would leave the edge serving the OLD atlas while the client
 * tree showed the new one, silently, with no error anywhere. The recorded input list
 * includes the distillate, so that divergence reds here instead.
 *
 * Four layers, mirroring tests/edgeFunctions/aiGroundingBundle.freshness.test.js:
 *   1. EXISTENCE       — bundle and sidecar meta are both committed in tree.
 *   2. META INTEGRITY  — the meta names the right entry, and every input it lists exists.
 *   3. HASH AGREEMENT  — banner hash equals meta hash equals a live recomputation.
 *   4. EXPORT SURFACE  — the symbols an edge function will import are present, and the
 *                        bundle behaves like the source on a fixture.
 *
 * The Phase A inert contract is also re-proven ACROSS the bundle boundary: the edge copy
 * must return the empty string for every surface too, or "inert" would only be true on the
 * client side of a wall no user is on.
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
const BUNDLE = join(ROOT, 'supabase', 'functions', '_shared', 'intentAtlasBundle.js');
const META   = join(ROOT, 'supabase', 'functions', '_shared', 'intentAtlasBundle.meta.json');

describe('intentAtlas bundle exists', () => {
  it('the bundle file is committed in tree', () => {
    expect(existsSync(BUNDLE)).toBe(true);
  });

  it('the sidecar meta file is committed alongside', () => {
    expect(existsSync(META)).toBe(true);
  });
});

describe('intentAtlas bundle is fresh', () => {
  let bundleSrc;
  let meta;

  beforeAll(() => {
    bundleSrc = readFileSync(BUNDLE, 'utf8');
    meta = JSON.parse(readFileSync(META, 'utf8'));
  });

  it('the meta file records the entry path', () => {
    expect(meta.entry).toBe('src/domain/intentAtlas.js');
  });

  it('the meta records both the module and the distillate as inputs', () => {
    expect(Array.isArray(meta.inputs)).toBe(true);
    expect(meta.inputs).toContain('src/domain/intentAtlas.js');
    expect(
      meta.inputs,
      'the distillate must be a recorded input, or a regenerated atlas could ship stale to the edge',
    ).toContain('src/domain/data/intentAtlas.distillate.json');
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

describe('intentAtlas bundle exports the contract surface', () => {
  let bundleSrc;
  beforeAll(() => { bundleSrc = readFileSync(BUNDLE, 'utf8'); });

  const REQUIRED_EXPORTS = [
    'buildIntentAtlasSection',
    'intentAtlasCells',
    'intentAtlasVersion',
    'ATLAS_SURFACES',
    'ATLAS_CELL_KEYS',
    'ATLAS_K_FLOOR',
    'INTENT_ATLAS_FORMAT_VERSION',
    // Evidential-weighting amendment (owner, 2026-07-27): the edge bundle must not be able
    // to drift on the evidence floor without redding here.
    'EVIDENCE_FLOOR',
    'ATLAS_NUMERIC_CELL_KEYS',
    'buildIntentAtlasSectionFrom',
    'intentAtlasEvidence',
  ];

  for (const name of REQUIRED_EXPORTS) {
    it(`exports "${name}"`, () => {
      expect(bundleSrc).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`));
    });
  }

  it('does NOT contain any unresolved imports (would crash at runtime)', () => {
    // STRUCTURAL, not textual — see the note in aiCharterBundle.freshness.test.js: a bare
    // textual search for `from "..."` cannot tell an import statement from bundled prose.
    const bareImports = [...bundleSrc.matchAll(/^\s*(?:import|export)\b[^\n]*?\bfrom\s+['"]([^'"]+)['"]/gm)]
      .map((m) => m[1])
      .filter((spec) => !spec.startsWith('.') && !spec.startsWith('/'));
    expect(bareImports, `bundle references unbundled module(s): ${bareImports.join(', ')}`).toEqual([]);
  });

  it('the distillate is inlined rather than left as a runtime file read', () => {
    // Deno would have no src/ tree to read from. If esbuild ever stopped inlining the JSON
    // the bundle would throw at import time on the edge and nowhere else.
    expect(bundleSrc).not.toMatch(/readFileSync|import\s*\(\s*['"].*\.json/);
    expect(bundleSrc).toMatch(/atlasVersion/);
  });

  it('the banner warns against manual edits', () => {
    expect(bundleSrc).toMatch(/DO NOT EDIT BY HAND/);
  });
});

describe('runtime smoke: the intentAtlas bundle is loadable and behaves like the source', () => {
  it('importing the bundle in Node yields working exports', async () => {
    const bundle = await import(BUNDLE);
    expect(typeof bundle.buildIntentAtlasSection).toBe('function');
    expect(typeof bundle.intentAtlasCells).toBe('function');
    expect(Array.isArray(bundle.ATLAS_SURFACES)).toBe(true);
  });

  it('the bundle and the source agree on the surface roster, the cell keys, and the k floor', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/intentAtlas.js');
    expect([...bundle.ATLAS_SURFACES]).toEqual([...source.ATLAS_SURFACES]);
    expect([...bundle.ATLAS_CELL_KEYS]).toEqual([...source.ATLAS_CELL_KEYS]);
    expect(bundle.ATLAS_K_FLOOR).toBe(source.ATLAS_K_FLOOR);
    expect(bundle.INTENT_ATLAS_FORMAT_VERSION).toBe(source.INTENT_ATLAS_FORMAT_VERSION);
  });

  it('the bundle carries the same distillate version and the same cells as the source', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/intentAtlas.js');
    expect(bundle.intentAtlasVersion()).toBe(source.intentAtlasVersion());
    expect([...bundle.intentAtlasCells()]).toEqual([...source.intentAtlasCells()]);
  });

  it('buildIntentAtlasSection is BYTE-IDENTICAL across the boundary, every surface', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/intentAtlas.js');
    for (const surface of source.ATLAS_SURFACES) {
      expect(bundle.buildIntentAtlasSection(surface), `atlas drift on surface "${surface}"`)
        .toBe(source.buildIntentAtlasSection(surface));
    }
  });

  it('the INERT CONTRACT holds on the edge copy too, per surface', async () => {
    // ADJUSTED for wave L-8a (the soak prior, docs/DESIGN_AI_INTENT_ATLAS.md §8). This asserted
    // that EVERY surface yields the empty string, which was a statement about a distillate that
    // held no cells rather than about the contract. Regenerating the bundle over a non-empty
    // distillate would have red it permanently, and the fix would have looked like deleting an
    // inconvenient check. What the contract actually says is that a surface the atlas has
    // nothing to say about costs the prompt nothing, and that is derived here from the bundle's
    // OWN cells, so it keeps holding as the corpus fills. The non-empty half is covered by the
    // byte-identity test above, which is the stronger claim in any case.
    const bundle = await import(BUNDLE);
    // The floor comes from the SOURCE, not the bundle: this test must run against a bundle
    // generated before the evidential-weighting amendment as well as after it, and the two
    // agreeing on EVIDENCE_FLOOR is a claim the exports block above already makes.
    const { EVIDENCE_FLOOR } = await import('../../src/domain/intentAtlas.js');
    const cells = bundle.intentAtlasCells();
    for (const surface of bundle.ATLAS_SURFACES) {
      const clearing = cells.filter(
        (c) => c.surface === surface
          && Number(c.n) >= EVIDENCE_FLOOR.MIN_N
          && Number(c.weight) >= EVIDENCE_FLOOR.WEIGHT_FLOOR,
      );
      if (clearing.length > 0) continue;
      expect(bundle.buildIntentAtlasSection(surface), `surface "${surface}" is not inert`).toBe('');
    }
    expect(bundle.buildIntentAtlasSection('styleOverhaul')).toBe('');
    expect(bundle.buildIntentAtlasSection('not-a-surface')).toBe('');
  });
});
