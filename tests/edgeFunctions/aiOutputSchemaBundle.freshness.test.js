/**
 * tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js — the AI OUTPUT-SCHEMA bundle
 * contract (wave L-WIRE of docs/DESIGN_AI_CAPABILITY_LADDER.md §4c.1, closing the substrate
 * wave L-9a landed).
 *
 * The Supabase Edge Functions cannot import src/, so the per-surface output schemas reach the
 * six compile shells as `supabase/functions/_shared/aiOutputSchemaBundle.js` — an esbuild
 * bundle of `src/domain/aiOutputSchema.js` plus every transitive vocabulary module it renders
 * from. The bundle is committed (so `supabase functions deploy` needs no build step) and this
 * suite fails when it drifts from source.
 *
 * FRESHNESS BITES HARDER HERE THAN FOR THE CHARTER, and in a way that is worth stating. A
 * stale CHARTER teaches yesterday's vocabulary, and the wall then rejects what the model
 * emitted: the damage is a wasted call. A stale SCHEMA is handed to the provider as a tool
 * `input_schema` with a forced `tool_choice`, so it does not merely mis-teach, it CONSTRAINS.
 * A bucket added to a registry but absent from a stale bundle is a bucket the model is
 * structurally unable to emit, however clearly the request asked for it, and nothing in the
 * response looks wrong. The failure presents as a model that will not do a thing it was never
 * offered.
 *
 * Four layers, mirroring tests/edgeFunctions/aiCharterBundle.freshness.test.js:
 *   1. EXISTENCE       — bundle and sidecar meta are both committed in tree.
 *   2. META INTEGRITY  — the meta names the right entry and every input it lists still exists.
 *   3. HASH AGREEMENT  — banner hash equals meta hash equals a live recomputation over the
 *                        source tree. This is the stale detector.
 *   4. EXPORT SURFACE  — the symbols an edge function will import are actually present, and
 *                        the bundle behaves like the source on a fixture.
 *
 * The structural import check is the LINE-ANCHORED form (see the aiCharter sibling's note):
 * a bare `from '...'` text search cannot tell an import statement from prose, and these
 * bundles carry rendered vocabulary strings that contain the word "from".
 *
 * E-A MANIFEST ENTRY: landed in-tree beside this file (kind "rationale" in
 * scripts/mutation-coverage-manifest.json — the untracked-target amendment forbids kind
 * "mutation" while every mutation target is untracked). FOLD COUPLING SURVIVES: that manifest
 * hunk must ride the SAME fold commit as this file. Committed without it, the entry keys a
 * path that does not exist at HEAD and reds tests/lint/mutationCoverageManifest.test.js as a
 * stale entry; committed the other way round, TOTALITY reds instead.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const BUNDLE = join(ROOT, 'supabase', 'functions', '_shared', 'aiOutputSchemaBundle.js');
const META   = join(ROOT, 'supabase', 'functions', '_shared', 'aiOutputSchemaBundle.meta.json');

describe('aiOutputSchema bundle exists', () => {
  it('the bundle file is committed in tree', () => {
    expect(existsSync(BUNDLE)).toBe(true);
  });

  it('the sidecar meta file is committed alongside', () => {
    expect(existsSync(META)).toBe(true);
  });
});

describe('aiOutputSchema bundle is fresh', () => {
  let bundleSrc;
  let meta;

  beforeAll(() => {
    bundleSrc = readFileSync(BUNDLE, 'utf8');
    meta = JSON.parse(readFileSync(META, 'utf8'));
  });

  it('the meta file records the entry path', () => {
    expect(meta.entry).toBe('src/domain/aiOutputSchema.js');
  });

  it('the meta lists many input modules (the schema renders the whole vocabulary graph)', () => {
    // The schema pulls the content manifest, the construct config vocabulary, the op
    // vocabulary, the party-impact kinds, the signal registry, the acceleration ops and the
    // town-map style wall, each with its own transitive deps. A collapse to a handful of
    // inputs would mean a vocabulary stopped being rendered and started being hard-coded,
    // which is the one failure this module's whole design exists to prevent.
    expect(Array.isArray(meta.inputs)).toBe(true);
    expect(meta.inputs.length).toBeGreaterThanOrEqual(20);
  });

  it('the entry module is itself among the recorded inputs', () => {
    expect(meta.inputs).toContain('src/domain/aiOutputSchema.js');
  });

  it('the CLIENT STYLE WALL is a recorded input (the schema mirrors its vocabulary)', () => {
    // Named rather than merely counted: styleOverhaul's whole field set and every glyph-set
    // and season id come from buildStyleVocabulary. A wall edit that skipped a rebuild would
    // otherwise ship a tool schema forbidding a value the wall now accepts, and finding F-C
    // is the record of how expensive that particular asymmetry is to notice.
    expect(meta.inputs).toContain('src/design/townMapStyleWall.js');
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

describe('aiOutputSchema bundle exports the contract surface', () => {
  let bundleSrc;
  beforeAll(() => { bundleSrc = readFileSync(BUNDLE, 'utf8'); });

  const REQUIRED_EXPORTS = [
    'buildSurfaceOutputSchema',
    'estimateSchemaTokens',
    'SCHEMA_SURFACES',
    'SCHEMA_VERSION',
  ];

  for (const name of REQUIRED_EXPORTS) {
    it(`exports "${name}"`, () => {
      expect(bundleSrc).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`));
    });
  }

  it('does NOT contain any unresolved imports (would crash at runtime)', () => {
    // STRUCTURAL, not textual — the line-anchored form the aiCharter sibling settled on. A
    // bare `/from\s+['"][a-z].../` search over the whole file cannot tell an import statement
    // from prose, and this bundle renders vocabulary text that contains the word "from".
    // Anchor to a real top-level import/export-from with a BARE specifier instead (a relative
    // one would start with "." or "/").
    const bareImports = [...bundleSrc.matchAll(/^\s*(?:import|export)\b[^\n]*?\bfrom\s+['"]([^'"]+)['"]/gm)]
      .map((m) => m[1])
      .filter((spec) => !spec.startsWith('.') && !spec.startsWith('/'));
    expect(bareImports, `bundle references unbundled module(s): ${bareImports.join(', ')}`).toEqual([]);
  });

  it('the structural import check would CATCH a real unresolved import (negative control)', () => {
    // Guard-the-guard, in both directions: the anchored pattern must fire on a genuine
    // top-level bare import and must stay silent on the word "from" inside prose, which is
    // exactly the case that made the unanchored form a false alarm on a live bundle.
    const RE = /^\s*(?:import|export)\b[^\n]*?\bfrom\s+['"]([^'"]+)['"]/gm;
    const bad = "import { x } from 'some-npm-package';\n";
    expect([...bad.matchAll(RE)].map((m) => m[1])).toEqual(['some-npm-package']);
    const prose = 'const line = `a caravan arriving from "chief" with grain`;\n';
    expect([...prose.matchAll(RE)]).toEqual([]);
  });

  it('the banner warns against manual edits', () => {
    expect(bundleSrc).toMatch(/DO NOT EDIT BY HAND/);
  });
});

describe('runtime smoke: the aiOutputSchema bundle is loadable and behaves like the source', () => {
  it('importing the bundle in Node yields working exports', async () => {
    const bundle = await import(BUNDLE);
    expect(typeof bundle.buildSurfaceOutputSchema).toBe('function');
    expect(typeof bundle.estimateSchemaTokens).toBe('function');
    expect(Array.isArray(bundle.SCHEMA_SURFACES)).toBe(true);
  });

  it('the bundle and the source agree on the surface roster and the version', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiOutputSchema.js');
    expect([...bundle.SCHEMA_SURFACES]).toEqual([...source.SCHEMA_SURFACES]);
    expect(bundle.SCHEMA_VERSION).toBe(source.SCHEMA_VERSION);
  });

  it('buildSurfaceOutputSchema from the bundle is BYTE-IDENTICAL to the source, every surface', async () => {
    // Byte equality of the SERIALIZED schema, not shape equality. The schema is sent as a
    // tool input_schema inside the cached request prefix, so a bundle that rendered the same
    // constraints with different key ordering would validate identically and miss the cache
    // on every single request, which is the failure mode nobody notices.
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiOutputSchema.js');
    for (const surface of source.SCHEMA_SURFACES) {
      expect(
        JSON.stringify(bundle.buildSurfaceOutputSchema(surface)),
        `schema drift on surface "${surface}"`,
      ).toBe(JSON.stringify(source.buildSurfaceOutputSchema(surface)));
    }
  });

  it('the schema is byte-stable across repeated calls in one process', async () => {
    // The caching argument is a claim about bytes across REQUESTS, and a builder that read a
    // clock, an rng or any ambient state would break it while every assertion above still
    // passed. Two calls, compared serialized.
    const bundle = await import(BUNDLE);
    for (const surface of bundle.SCHEMA_SURFACES) {
      expect(JSON.stringify(bundle.buildSurfaceOutputSchema(surface)))
        .toBe(JSON.stringify(bundle.buildSurfaceOutputSchema(surface)));
    }
  });

  it('estimateSchemaTokens from the bundle agrees with the source, every surface', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/domain/aiOutputSchema.js');
    for (const surface of source.SCHEMA_SURFACES) {
      expect(bundle.estimateSchemaTokens(surface)).toBe(source.estimateSchemaTokens(surface));
    }
  });

  it('the bundle throws on an unknown surface, exactly as the source does', async () => {
    // The fail-loud contract has to survive bundling. A bundle that degraded to an open
    // object would constrain nothing while every caller looked healthy, which is precisely
    // the failure the module header names as the reason this throws at all.
    const bundle = await import(BUNDLE);
    expect(() => bundle.buildSurfaceOutputSchema('not-a-surface')).toThrow(/unknown schema surface/);
  });

  it('every schema the bundle serves is a CLOSED object (the constraint actually ships)', async () => {
    // Non-vacuity for the whole suite: an edge shell hands these straight to a provider as an
    // input_schema, so the one property that must survive bundling is that the root is a
    // closed object with a required list. A bundle that shipped an open bag would pass every
    // hash check above and constrain nothing.
    const bundle = await import(BUNDLE);
    for (const surface of bundle.SCHEMA_SURFACES) {
      const schema = bundle.buildSurfaceOutputSchema(surface);
      expect(schema.type, surface).toBe('object');
      expect(schema.additionalProperties, surface).toBe(false);
      expect(Array.isArray(schema.required), surface).toBe(true);
      expect(typeof schema.description, surface).toBe('string');
    }
  });
});
