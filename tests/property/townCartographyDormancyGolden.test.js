/**
 * townCartographyDormancyGolden.test.js — TC-1 DORMANCY PROOF
 * (docs/DESIGN_TOWN_CARTOGRAPHY.md §8 SHIPPING SHAPE, THE GOLDEN LAW).
 *
 * THE CONSTITUTIONAL DORMANCY LAW for the town-cartography program: the four new
 * manifest layers sit behind the virtual `townCartographyEnabled` flag, and dark
 * they must be a pure no-op — the SAME manifest object, byte for byte, digest for
 * digest, that the compiler produced before the cartography stage existed.
 *
 * WHY THE FENCE IS CAPTURED HERE AND NOW, stated plainly because a golden that
 * overclaims is worse than none. This file was written and its manifest recorded
 * BEFORE compileTownSceneManifest.js gained its cartography stage — the J1 fence
 * discipline, and the only honest moment to build such a fence. Every digest below
 * is therefore a reading of the PRE-CARTOGRAPHY compiler. From the wiring commit
 * onward, any leak of a cartography byte into the dark path reds against a baseline
 * that predates the code which could have leaked it.
 *
 * WHAT IT COVERS: the frozen 18-config town-map golden corpus (tier x terrain x
 * walls x water) crossed with all three audiences, so 54 compiled manifests. The
 * projection hashes the WHOLE manifest through its own canonical serializer, not a
 * chosen slice: a new top-level key, a reordered array, a changed integer, or a
 * widened record all move the hash.
 *
 * THE TEETH THAT BITE TODAY are the gate arms in the second describe: the same
 * authorized input driven through the real compiler dark and lit. Dark remains the
 * pre-cartography bytes; lit gains exactly the additive TC-2 block. Stripping that
 * one block from the lit manifest must recover the dark manifest exactly, so the
 * flag cannot move any pre-existing scene fact while synthesis is active.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/townCartographyDormancyGolden.test.js
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  compileTownSceneManifest,
  prepareTownSceneCompileInput,
  sceneDigest,
  stableSceneStringify,
  validateTownSceneManifest,
} from '../../src/domain/townScene/index.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'town-cartography-dormancy-golden.json');
const AUDIENCES = Object.freeze(['dm', 'player', 'public']);

/** One corpus row per golden config per audience. */
function corpus() {
  const rows = [];
  for (let index = 0; index < GOLDEN_CONFIGS.length; index++) {
    for (const audience of AUDIENCES) rows.push({ index, audience });
  }
  return rows;
}

const keyOf = (row) => `${row.index}|${row.audience}`;

/** Compile one corpus row through the ordinary domain entry point. */
function compileRow(row, simulationRules) {
  return compileTownSceneManifest({
    settlement: GOLDEN_CONFIGS[row.index].settlement,
    mapEdits: null,
    audience: row.audience,
    ...(simulationRules ? { worldState: { simulationRules } } : {}),
  });
}

/**
 * The projection: the manifest's own canonical bytes plus its digest and byte
 * length. Hashing the serialized form rather than a hand-picked subset is what
 * makes an ADDED top-level layer key move this number.
 */
function projectionHash(manifest) {
  const bytes = stableSceneStringify(manifest);
  return createHash('sha256')
    .update(JSON.stringify({ bytes, digest: sceneDigest(manifest), length: bytes.length }))
    .digest('hex');
}

const dormantHashFor = (row) => projectionHash(compileRow(row, null));

describe('town cartography — dormancy golden (the fence TC-2..TC-5 are measured against)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the town-cartography dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const row of rows) out[keyOf(row)] = dormantHashFor(row);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, `${JSON.stringify(out, Object.keys(out).sort(), 2)}\n`);
      expect(Object.keys(out).length).toBe(rows.length);
    }, 180_000);
    return;
  }

  it('the dormancy manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full dormant corpus (no keys added or removed without a manifest update)', () => {
    expect(rows.length).toBe(GOLDEN_CONFIGS.length * AUDIENCES.length);
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dormant config reproduces the golden projection (any drift means dormancy broke)', () => {
    const drift = [];
    for (const row of rows) if (manifest[keyOf(row)] !== dormantHashFor(row)) drift.push(keyOf(row));
    expect(drift).toEqual([]);
  }, 180_000);

  it('a dark compile carries NO cartography key, and still validates as a manifest', () => {
    const compiled = compileRow({ index: 6, audience: 'dm' }, null);
    // The anchor is `districts`, a sibling top-level layer compiled by the same pass:
    // a manifest that lost its key set reds on the anchor rather than passing here.
    expectAbsentWithAnchor(Object.keys(compiled), 'cartography', 'districts', 'dark manifest');
    expect(compiled.kind).toBe('TownSceneManifest');
    expect(Array.isArray(compiled.districts) && compiled.districts.length > 0).toBe(true);
    expect(validateTownSceneManifest(compiled)).toMatchObject({ ok: true, errors: [] });
  });

  it('an EXPLICIT dark rules blob is byte-identical to no rules blob at all', () => {
    const row = { index: 10, audience: 'player' };
    const noRules = stableSceneStringify(compileRow(row, null));
    const explicitlyDark = stableSceneStringify(compileRow(row, { townCartographyEnabled: false }));
    const absentKey = stableSceneStringify(compileRow(row, { warLayerEnabled: true }));
    expect(explicitlyDark).toBe(noRules);
    expect(absentKey).toBe(noRules);
  });
});

describe('town cartography — the gate arms (the teeth that bite at TC-1)', () => {
  const settlement = GOLDEN_CONFIGS[8].settlement;

  it('the FLAG is the only thing the transport envelope learns, and dark it learns nothing', () => {
    const dark = prepareTownSceneCompileInput({ settlement, mapEdits: null, audience: 'dm' });
    const lit = prepareTownSceneCompileInput({
      settlement,
      mapEdits: null,
      audience: 'dm',
      worldState: { simulationRules: { townCartographyEnabled: true } },
    });
    // The anchor is `atmosphere`, the sibling key the same authorization wall builds:
    // an envelope that stopped being built at all reds on the anchor, not here.
    expectAbsentWithAnchor(Object.keys(dark), 'cartography', 'atmosphere', 'dark envelope');
    expect(Object.keys(lit)).toContain('cartography');
    expect(lit.cartography).toEqual({ enabled: true });
    // Everything else about the two envelopes is identical, so the key is the whole delta.
    const strip = (envelope) => {
      const { cartography: _dropped, inputDigest: _digest, ...rest } = envelope;
      return stableSceneStringify(rest);
    };
    expect(strip(lit)).toBe(strip(dark));
    // And the DARK envelope's digest is untouched by the existence of the key.
    expect(dark.inputDigest).toBe(sceneDigest({
      kind: dark.kind,
      schemaVersion: dark.schemaVersion,
      audience: dark.audience,
      settlement: dark.settlement,
      mapEdits: dark.mapEdits,
      atmosphere: dark.atmosphere,
    }));
  });

  it('TC-2 lights exactly one additive, valid block while every pre-existing scene byte stays fixed', () => {
    const dark = compileTownSceneManifest({ settlement, mapEdits: null, audience: 'dm' });
    const lit = compileTownSceneManifest({
      settlement,
      mapEdits: null,
      audience: 'dm',
      worldState: { simulationRules: { townCartographyEnabled: true } },
    });
    expect(Object.prototype.hasOwnProperty.call(dark, 'cartography')).toBe(false);
    expect(validateTownSceneManifest(lit)).toEqual({ ok: true, errors: [] });
    expect(lit.cartography.streets.arterials.length).toBeGreaterThan(0);
    expect(lit.cartography.streets.lanes.length).toBeGreaterThan(0);
    expect(lit.cartography.wards).toEqual([]);
    expect(lit.cartography.parcels).toEqual([]);
    expect(lit.cartography.buildings).toEqual([]);

    // ONE infrastructure truth: the block references the manifest's records and
    // never copies wall, gate or bridge geometry under a second key.
    const gateIds = new Set(lit.gates.map((row) => row.id));
    const bridgeIds = new Set(lit.bridges.map((row) => row.id));
    expect(lit.cartography.streets.gateRefs.length).toBeGreaterThan(0);
    expect(lit.cartography.streets.bridgeRefs.length).toBeGreaterThan(0);
    for (const id of lit.cartography.streets.gateRefs) expect(gateIds.has(id)).toBe(true);
    for (const id of lit.cartography.streets.bridgeRefs) expect(bridgeIds.has(id)).toBe(true);
    // The candidate geometry selects a nearby canonical subset; blindly copying
    // every base id would make the synthesis result irrelevant to the manifest.
    expect(lit.cartography.streets.gateRefs.length).toBeLessThan(lit.gates.length);
    expect(lit.cartography.streets.bridgeRefs.length).toBeLessThan(lit.bridges.length);
    expectAbsentWithAnchor(
      Object.keys(lit.cartography),
      'walls',
      'streets',
      'lit cartography block',
    );
    expect(Object.keys(lit.cartography)).not.toContain('gates');
    expect(Object.keys(lit.cartography)).not.toContain('bridges');

    const { cartography: _cartography, ...litBase } = lit;
    expect(stableSceneStringify(litBase)).toBe(stableSceneStringify(dark));
    expect(sceneDigest(lit)).not.toBe(sceneDigest(dark));
  });
});
