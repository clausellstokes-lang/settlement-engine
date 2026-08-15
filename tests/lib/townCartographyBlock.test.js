/**
 * tests/lib/townCartographyBlock.test.js — TC-5b-i, the cartography manifest seam.
 *
 * C1 (main reachable behavior), C3 (the producer↔consumer proof), C5 (the CR-TC3A-1
 * injection is real), C7 (the prevention guard) and C8 (the privacy boundary) live
 * here. C2/C4/C6 are the hook's and live in tests/hooks/useTownCartographyBlock.test.jsx.
 *
 * ⚠ Every test in this file is registered STRAIGHT-LINE. A `test(`/`it(` registered
 * from inside a `for` loop is TEST_UNREGISTERED and parks the WHOLE file out of the
 * sovereignty-lighting evidence layer while still passing — that is what bit TC-5a's
 * townCartographyPaint.test.js (0 live titles against 34 real tests). Where a loop is
 * genuinely wanted, it lives INSIDE one `it`, never around one.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { compileTownCartographyBlock } from '../../src/lib/townScene/townCartographyBlock.js';
import { TOWN_CARTOGRAPHY_BLOCK_KEYS } from '../../src/domain/townScene/cartographyContract.js';
// TEST-ONLY imports. A PRODUCTION import of either of these from the transport or the
// hook is a STOP: TC-5a's paint leaf gains its first production importer at TC-5b-ii,
// and the compiler is what §6.4's guard keeps out of any caller's chunk.
import { buildCartographyDrawList } from '../../src/domain/townCartography/cartographyPaint.js';
import { compileTownSceneManifest } from '../../src/domain/townScene/compileTownSceneManifest.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

/** The largest lit corpus row — the worst case the B6 probe measured at 152 ms. */
const LIT_ROW = GOLDEN_CONFIGS.find(
  ({ spec }) => spec.tier === 'metropolis' && spec.terrain === 'plains',
);

const litWorld = () => ({ simulationRules: { townCartographyEnabled: true } });

// ── §6.4's static-closure machinery ──────────────────────────────────────────
// stripComments/resolveRelative/sourceClosure are COPIED from
// tests/build/mapTabShellLazy.test.js, not imported from it: that file is
// TC-5b-ii's reserved target and a cross-lane edit would be a landing collision.
// The ~30-line duplication is ACCEPTED FOR THIS WAVE at CR-TC5BI-4; extraction to
// a shared helper is its own slice once BOTH TC-5b halves have landed.
const ROOT = process.cwd();
const TRANSPORT_SRC = resolve(ROOT, 'src/lib/townScene/townCartographyBlock.js');
const HOOK_SRC = resolve(ROOT, 'src/components/townMap/useTownCartographyBlock.js');

/** Everything the hook must NOT be able to reach by ANY static path. */
const FORBIDDEN_IN_HOOK_CLOSURE = Object.freeze([
  'src/domain/townScene/compileTownSceneManifest.js',
  'src/domain/townScene/sceneCompileInput.js',
  'src/domain/townScene/sceneProjection.js',
  'src/data/namingData.js',
  'src/lib/townScene/townCartographyBlock.js',
  'src/domain/townCartography/cartographyPaint.js',
]);

const stripComments = (code) => code
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/** Every `from './x'` STATIC relative specifier in a source file. */
function sourceStaticSpecifiers(code) {
  const specs = new Set();
  for (const m of stripComments(code).matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)) specs.add(m[1]);
  return [...specs];
}

function resolveRelative(fromFile, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/**
 * The transitive STATIC import closure of a source file, repo-relative.
 * ⭐ The specifier regex requires `import` + whitespace + a quote, so it CANNOT
 * match `import(` — which is exactly why the dynamic edge is excluded and this
 * guard measures what it claims to.
 */
function sourceClosure(entryFile) {
  const seen = new Set([entryFile]);
  const queue = [entryFile];
  while (queue.length) {
    const file = queue.shift();
    const code = stripComments(readFileSync(file, 'utf-8'));
    const specs = new Set();
    for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.add(m[1]);
    for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.add(m[1]);
    for (const spec of specs) {
      const resolved = resolveRelative(file, spec);
      if (resolved && !seen.has(resolved)) { seen.add(resolved); queue.push(resolved); }
    }
  }
  return [...seen].map((p) => relative(ROOT, p).replace(/\\/g, '/'));
}

describe('TC-5b-i C1 — the transport produces a block when lit, and nothing when dark', () => {
  it('compiles a ready block with the exact contract key set and the plan extent', async () => {
    const result = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
      audience: 'dm',
    });

    expect(result.status).toBe('ready');
    expect(result.planExtent).toBe(1000);
    // Exact set equality in BOTH directions: a block missing a layer and a block
    // carrying a fifth key are equally invalid (the contract is all four, or none).
    expect(Object.keys(result.block).slice().sort())
      .toEqual([...TOWN_CARTOGRAPHY_BLOCK_KEYS].slice().sort());
  }, 120_000);

  it('returns unavailable when simulationRules is absent entirely', async () => {
    const result = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: {},
      audience: 'dm',
    });
    expect(result).toEqual({ status: 'unavailable', block: null, planExtent: null });
  }, 120_000);

  it('returns unavailable when worldState itself is absent', async () => {
    const result = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      audience: 'dm',
    });
    expect(result).toEqual({ status: 'unavailable', block: null, planExtent: null });
  }, 120_000);

  it('returns unavailable when the rule object is empty', async () => {
    const result = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: { simulationRules: {} },
      audience: 'dm',
    });
    expect(result).toEqual({ status: 'unavailable', block: null, planExtent: null });
  }, 120_000);

  it('returns unavailable when the rule is explicitly false', async () => {
    const result = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: { simulationRules: { townCartographyEnabled: false } },
      audience: 'dm',
    });
    expect(result).toEqual({ status: 'unavailable', block: null, planExtent: null });
  }, 120_000);
});

describe('TC-5b-i C3 — the producer and TC-5a\'s consumer provably meet', () => {
  it('feeds the real block to the real buildCartographyDrawList and satisfies the length identity', async () => {
    const { block } = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
      audience: 'dm',
    });

    const ops = buildCartographyDrawList(block);

    expect(ops.length).toBeGreaterThan(0);
    expect(Object.isFrozen(ops)).toBe(true);
    // TC-5a's LENGTH IDENTITY over the block's own record counts — not a band.
    // parcels[] emits no op: a parcel is a placement SLOT, not a drawn thing.
    expect(ops.length).toBe(
      block.wards.length
      + block.streets.arterials.length
      + block.streets.lanes.length
      + block.buildings.length,
    );

    // Painter's algorithm, back to front: every ward op precedes every street op,
    // and every street op precedes every building op.
    const kinds = ops.map((op) => op.op);
    expect(new Set(kinds)).toEqual(new Set(['ward', 'street', 'building']));
    expect(kinds.lastIndexOf('ward')).toBeLessThan(kinds.indexOf('street'));
    expect(kinds.lastIndexOf('street')).toBeLessThan(kinds.indexOf('building'));
  }, 120_000);

  it('NEGATIVE CONTROL — a layer replaced by a non-array throws the TC-3 premise', async () => {
    const { block } = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
      audience: 'dm',
    });

    // anchored: the same block, unmodified, is proven to build a non-empty list in
    // the test above and again on the line below — so this throw measures the
    // corrupted layer, not a block the producer never managed to compile.
    expect(buildCartographyDrawList(block).length).toBeGreaterThan(0);
    expect(() => buildCartographyDrawList({ ...block, wards: 'not-an-array' }))
      .toThrow(/townCartography TC-3 premise/);
  }, 120_000);
});

describe('TC-5b-i C5 — the CR-TC3A-1 naming-pool injection is real', () => {
  it('injects the pools, and the un-injected compile provably throws the same premise', async () => {
    const litInput = {
      settlement: LIT_ROW.settlement,
      mapEdits: null,
      worldState: litWorld(),
      regionalGraph: null,
      audience: 'dm',
    };

    // THE LIVENESS ANCHOR, in the same `it`: the identical lit compile WITHOUT the
    // pools throws the named TypeError. Without this the assertion below would be
    // green for a settlement that never lit cartography at all.
    expect(() => compileTownSceneManifest(litInput, {}))
      .toThrow(/namingPools was not injected/);

    await expect(compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
      audience: 'dm',
    })).resolves.toMatchObject({ status: 'ready' });
  }, 120_000);
});


describe('TC-5b-i C8 — the privacy boundary: the seam widens nothing', () => {
  it('an omitted audience lands on the NARROWEST projection, and dm provably differs', async () => {
    const omitted = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
    });
    const asPublic = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
      audience: 'public',
    });
    const asDm = await compileTownCartographyBlock({
      settlement: LIT_ROW.settlement,
      worldState: litWorld(),
      audience: 'dm',
    });

    // Omitting the audience is EXACTLY the public projection — the narrowest.
    expect(JSON.stringify(omitted.block)).toBe(JSON.stringify(asPublic.block));
    // THE LIVENESS ANCHOR: dm genuinely differs, so the equality above is a real
    // measurement of the projection rather than an audience nobody ever applied.
    expect(JSON.stringify(omitted.block)).not.toBe(JSON.stringify(asDm.block));
  }, 120_000);

  it('the compiled manifest records source.audience as public when none is supplied', async () => {
    const { NAMING_DATA } = await import('../../src/data/namingData.js');
    // The transport's exact compile input, with audience threaded through as
    // received. compileTownSceneManifest is the only thing that can answer what
    // the manifest RECORDED, and the seam deliberately never exposes a manifest.
    const compileAs = (audience) => compileTownSceneManifest(
      {
        settlement: LIT_ROW.settlement,
        mapEdits: null,
        worldState: litWorld(),
        regionalGraph: null,
        audience,
      },
      { namingPools: NAMING_DATA },
    );

    expect(compileAs(undefined).source.audience).toBe('public');
    // anchored: the same helper, one argument different, yields 'dm' — so the
    // assertion above cannot be green because source.audience stopped existing.
    expect(compileAs('dm').source.audience).toBe('dm');
  }, 120_000);

  it('the transport source declares no audience default and no audience branch', () => {
    const stripped = stripComments(readFileSync(TRANSPORT_SRC, 'utf-8'));

    // The anchor is the pass-through spelling itself: it proves this scan is
    // reading real, comment-stripped transport code and not an empty string.
    expectAbsentWithAnchor(
      stripped,
      'audience =',
      'audience: input.audience',
      'transport source — no audience default',
    );

    const audienceLines = stripped.split('\n').filter((line) => line.includes('audience'));
    expect(audienceLines.length).toBeGreaterThan(0);
    for (const line of audienceLines) {
      const why = `audience must be threaded, never branched on: ${line.trim()}`;
      // `audienceLines` is asserted NON-EMPTY immediately above, and the
      // expectAbsentWithAnchor call before that already proved this same `stripped`
      // source holds the live pass-through spelling.
      // anchored: a drifted or empty scan reds on the non-empty assertion above.
      expect(line, why).not.toMatch(/\?|\bif\b|&&|\|\|/);
    }
  });
});

describe('TC-5b-i C7 — THE PREVENTION GUARD: the compiler graph stays behind the dynamic edge', () => {
  it('the hook\'s transitive static closure excludes the compiler graph entirely', () => {
    const closure = sourceClosure(HOOK_SRC);

    // NON-VACUITY, the mapTabShellLazy idiom: a resolver that silently resolved
    // nothing would make every exclusion below trivially true.
    expect(closure.length).toBeGreaterThanOrEqual(2);
    // THE LIVENESS ANCHOR: the hook genuinely reaches the zero-import flag leaf.
    expect(closure).toContain('src/domain/townScene/cartographyContract.js');

    // The loop lives INSIDE this `it` on purpose. Registering one `it` per member
    // from a `for` loop is TEST_UNREGISTERED and parks the whole file.
    for (const forbidden of FORBIDDEN_IN_HOOK_CLOSURE) {
      expectAbsentWithAnchor(
        closure,
        forbidden,
        'src/domain/townScene/cartographyContract.js',
        'useTownCartographyBlock transitive static closure',
      );
    }
  });

  it('the hook reaches the transport ONLY through a dynamic import', () => {
    const stripped = stripComments(readFileSync(HOOK_SRC, 'utf-8'));

    // The dynamic edge is present…
    expect(stripped).toMatch(
      /import\(\s*['"]\.\.\/\.\.\/lib\/townScene\/townCartographyBlock\.js['"]\s*\)/,
    );
    // …and no STATIC edge to it exists. Anchored on the hook's one real static
    // relative import, which travels the same scan.
    const staticSpecs = sourceStaticSpecifiers(stripped);
    expectAbsentWithAnchor(
      staticSpecs,
      '../../lib/townScene/townCartographyBlock.js',
      '../../domain/townScene/cartographyContract.js',
      'useTownCartographyBlock static specifiers',
    );
  });
});
