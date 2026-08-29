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
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

// ── §6.4's source-scan machinery ─────────────────────────────────────────────
// The hook-closure half (HOOK_SRC + FORBIDDEN_IN_HOOK_CLOSURE + the sourceClosure /
// sourceStaticSpecifiers / resolveRelative walkers copied from mapTabShellLazy) was
// removed by TE-STRIP-1 with the hook it measured; see the C7 note below. Only the
// transport's own comment-stripping scan remains.
const ROOT = process.cwd();
const TRANSPORT_SRC = resolve(ROOT, 'src/lib/townScene/townCartographyBlock.js');

const stripComments = (code) => code
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

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
    // ⚠ MP-1 MOVED IT, and the move is declared rather than drift: `parcels[]` used
    // to emit nothing ("a parcel is a placement SLOT, not a drawn thing") and now
    // emits the PROPERTY LINE the owner's §494 directive asked to see. The producer
    // half of this proof did not change at all — the parcel ring has been in the
    // block since TC-3b; only the consumer stopped dropping it.
    expect(ops.length).toBe(
      block.wards.length
      + block.parcels.length
      + block.streets.arterials.length
      + block.streets.lanes.length
      + block.buildings.length,
    );
    // Anti-vacuity for the new term: this real block genuinely carries parcels, so
    // the term above is load-bearing rather than an addition of zero.
    expect(block.parcels.length).toBeGreaterThan(0);

    // Painter's algorithm, back to front: every ward op precedes every parcel op,
    // every parcel op precedes every street op, and every street op precedes every
    // building op.
    const kinds = ops.map((op) => op.op);
    expect(new Set(kinds)).toEqual(new Set(['ward', 'parcel', 'street', 'building']));
    expect(kinds.lastIndexOf('ward')).toBeLessThan(kinds.indexOf('parcel'));
    expect(kinds.lastIndexOf('parcel')).toBeLessThan(kinds.indexOf('street'));
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

// TC-5b-i C7 — THE PREVENTION GUARD: RETIRED BY TE-STRIP-1 (owner ruling, ODQ §725).
// The guard proved that src/components/townMap/useTownCartographyBlock.js reached the
// cartography compiler graph ONLY through a dynamic import — a first-paint contract
// about a HOOK that left with the legacy settlement map. With no consumer, the property
// has no subject; re-pointing it at the transport would assert something different.
// The transport's own contracts (everything above, over src/lib/townScene/ and
// src/domain/townScene|townCartography/) are untouched and still run.
